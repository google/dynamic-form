/**
 * @license
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {AfterContentInit, ContentChildren, Directive, Input, OnDestroy, OnInit, QueryList} from '@angular/core';
import {Subscription} from 'rxjs';

import {ContextProcessors, DefaultValueConverter, PropValueSetterGetters} from './inst_service';
import {AnyType, Entity, Prop} from './meta_datamodel';
import {DynamicFieldPropertyComponent} from './prop_component';
import {EntityMetaDataRepository, LookupSources} from './repositories';


/**
 * Establishes a context for editing.
 *
 * It does
 *
 * 1. controlInst: Map property name to property's FormControl's value
 * 2. Process All Entity.Contexts and set up actions accordingly
 */
@Directive({
  selector: '[gdfEntityCtx]',
  exportAs: 'entityContextDirective',
})
export class EntityContextDirective implements OnInit, AfterContentInit,
                                               OnDestroy {
  /**
   * Entity Name or Entity;
   */
  @Input('gdfEntityCtx') name: string|Entity;
  /**
   * The inst to be edited
   */
  @Input('inst') inst: {};

  /**
   * Convenient way for other components to access entity
   */
  entity: Entity;

  /**
   * key: property Name.
   * value: property value From FormControl
   */
  controlInst: {[index: string]: AnyType} = {};

  /**
   * All the control components
   */
  @ContentChildren(DynamicFieldPropertyComponent, {descendants: true})
  propComps: QueryList<DynamicFieldPropertyComponent>;

  private subscription = new Subscription();

  constructor(
      private readonly contextProcessors: ContextProcessors,
      private readonly entityMetaDataRepository: EntityMetaDataRepository,
      private readonly setterGetters: PropValueSetterGetters) {}

  ngOnInit() {
    if (typeof this.name === 'string') {
      this.entity = this.entityMetaDataRepository.getEntity(this.name);
    } else {
      this.entity = this.name;
    }
  }
  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

  ngAfterContentInit() {
    this.setupProxiesToControl();
    this.setupDynamicContextProcessors();
  }

  reset() {
    this.subscription.unsubscribe();
    this.subscription = new Subscription();
    this.ngAfterContentInit();
  }

  /**
   * Sets up controlInst through which other component can access
   * FormControl.value
   */
  protected setupProxiesToControl() {
    for (const dfComp of this.propComps.toArray()) {
      if (dfComp.inst !== this.inst) {
        continue;
      }
      Object.defineProperty(this.controlInst, dfComp.prop.name, {
        enumerable: true,
        configurable: false,
        get: () => {
          return dfComp.control.value;
        },
        set: (newValue) => {
          dfComp.control.setValue(newValue);
        },
      });
    }
  }

  /**
   * Loops entity.contexts and set up Contextual action.
   */
  protected setupDynamicContextProcessors() {
    const comps = this.propComps.filter(dfComp => dfComp.inst === this.inst);

    for (const ctx of this.entity.contexts) {
      const processor = this.contextProcessors.processors.get(ctx.type);
      if (processor) {
        const subscription = processor.processContext(
            ctx, this.inst, this.entity,
            this.setterGetters.getSetterGetter(this.entity), comps);
        if (subscription) {
          this.subscription.add(subscription);
        }
      }
    }
  }
}

/**
 * Converts prop from string name to Prop Object
 */
@Directive({
  selector: '[gdfPropCtx]',
  exportAs: 'propContextDirective',
})
export class PropContextDirective implements OnInit {
  @Input('gdfPropCtx') name: string;
  @Input('entity') entity: Entity;
  @Input('entityName') entityName: string;

  prop: Prop;
  constructor(private readonly entityMetaDataRepository:
                  EntityMetaDataRepository) {}
  ngOnInit() {
    if (this.entityName) {
      this.entity = this.entityMetaDataRepository.getEntity(this.entityName);
    }
    this.prop = this.entity.findProp(this.name);
  }
}
