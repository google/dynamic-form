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

import {ChangeDetectorRef, Component, ElementRef, Injector, Input, OnInit,} from '@angular/core';
import * as moment_ from 'moment';

import {PropValueSetterGetters} from './inst_service';
import {AnyType, BaseLookupValue, Entity, Prop} from './meta_datamodel';
import {LookupSources} from './repositories';
import {AutoCompleteLookupService, EntityMetaDataRepository} from './repositories';

const moment = moment_;
/**
 * Viewer component for property
 *
 * Example:
 * <gdf-prop-viewer [prop]="prop" [inst]="inst"></gdf-prop-viewer>
 * + prop: target {@link Prop} to view
 * + inst: instance object from which property's value can be retrieved
 */
@Component({
  preserveWhitespaces: true,
  selector: 'gdf-prop-viewer',
  templateUrl: 'prop_viewer.ng.html',
})
export class DynamicFieldPropertyViewerComponent implements OnInit {
  @Input() prop: Prop;
  @Input() inst: {};
  @Input() showLabel = true;

  /**
   * Developer has two approaches to specifiy prop
   * 1. use [prop]
   * 2. use [propName] and [entityName]
   * The second approach is convenient for some simple use case
   */
  @Input() propName: string;
  @Input() entityName: string;


  /**
   * css classes
   */
  propClasses = ['prop'];


  /**
   * Value for autocomplete property
   */
  _autoValue: BaseLookupValue|undefined;

  private autoCompleteService: AutoCompleteLookupService;

  format: string;
  private internalShow = true;

  constructor(
      private readonly entityMetaDataRepository: EntityMetaDataRepository,
      private readonly elRef: ElementRef,
      private readonly lookupSources: LookupSources,
      private readonly propValueSetterGetters: PropValueSetterGetters,
      private readonly injector: Injector,
      private cd: ChangeDetectorRef,
  ) {}

  get entity(): Entity {
    return this.prop.entity;
  }

  get show() {
    return this.internalShow;
  }
  set show(value: boolean) {
    if (value === this.internalShow) {
      return;
    }
    this.internalShow = value;
    if (value) {
      this.elRef.nativeElement.classList.remove('hide');
    } else {
      this.elRef.nativeElement.classList.add('hide');
    }
  }

  ngOnInit() {
    if (this.propName && this.entityName) {
      this.prop = this.entityMetaDataRepository.getEntity(this.entityName)
                      .findProp(this.propName);
    } else {
      this.propName = this.prop.name;
      this.entityName = this.prop.entity.name;
    }
    this.propClasses.push(this.prop.name);
    if (this.prop.controlType) {
      this.propClasses.push(this.prop.controlType);
    }
    if (this.prop.fieldWidth > 1) {
      this.propClasses.push(`field-width-${this.prop.fieldWidth}`);
    }
    if (this.prop.controlType === 'date') {
      this.format = this.prop.format || 'mediumDate';
    }
    if (this.prop.controlType === 'datetime-local') {
      this.format = this.prop.format || 'medium';
    }
    if (this.prop.controlType === 'number') {
      this.format = this.prop.format || '1.0-3';
    }
    if (this.prop.type === 'autocomplete') {
      // run before buildControl. buildControl uses this.
      this.setupAutocomplete();
    }
  }

  get value() {
    // value from inst
    let value =
        this.propValueSetterGetters.getSetterGetterForProp(this.prop).get(
            this.inst, this.prop);
    if (this.prop.type === 'select' && this.prop.lookupSrc &&
        this.prop.lookupName && value) {
      value = this.lookupSources.getLookupSource(this.prop.lookupSrc)
                  .propValueToLookupValue(this.prop.lookupName, value);
    }
    if (this.prop.type === 'autocomplete' && value &&
        this.autoCompleteService) {
      // set value at a later time. Need to go server to resolve value
      this.autoCompleteService.resolvePropValue(value).then(lookupValue => {
        if ((this._autoValue && lookupValue &&
             this._autoValue.description !== lookupValue.description) ||
            (!this._autoValue && lookupValue) ||
            (this._autoValue && !lookupValue)) {
          // retrieve new value;
          this._autoValue = lookupValue;
          this.cd.detectChanges();
        }
      });
      // return old value first;
      return this._autoValue;
    }

    value = this.toTypedValue(value);
    return value;
  }

  // a typed value is needed for UI to be used by format
  private toTypedValue(value: AnyType) {
    if (typeof value !== 'string') {
      return value;
    }
    if (value === '') {
      return null;
    }
    if (this.prop.controlType === 'number') {
      return Number(value);
    }
    /*
     * Why we use moment here
     * possible value type:
     * 1. ISOString
     * 2. Date Object
     * 3. String from input[type=date]
     * Date object can't handle the third type properly
     * moment can handle all of them
     */
    if (this.prop.controlType === 'date') {
      const m = moment(value);
      return m.isValid() ? m.toDate() : null;
    }
    if (this.prop.controlType === 'datetime' ||
        this.prop.controlType === 'datetime-local') {
      const m = moment(value);
      return m.isValid() ? m.toDate() : null;
    }
    return value;
  }

  //-----------------------autocomplete support
  setupAutocomplete() {
    let serviceName = this.prop.autoCompleteService;
    if (!serviceName) {
      serviceName = `${this.prop.entity.name}_${this.prop.name}`;
    }
    this.autoCompleteService =
        // TODO(jjzhang) figure out how to workaround deprecation later
        // tslint:disable-next-line:deprecation later
        this.injector.get(serviceName) as AutoCompleteLookupService;
  }
}
