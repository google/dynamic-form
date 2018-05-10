import {Component, Input, OnInit, QueryList, ViewChild, ViewChildren} from '@angular/core';

import {EntityContextDirective} from './entity_directives';
import {DefaultInstPopulater} from './inst_service';
import {Entity, Prop} from './meta_datamodel';
import {DynamicFieldPropertyComponent} from './prop_component';
import {EntityMetaDataRepository} from './repositories';

/**
 * Editor component for an instance of an Entity
 *
 *
 */
@Component({
  preserveWhitespaces: true,
  selector: 'inst-editor',
  templateUrl: 'inst_editor.ng.html',
})
export class InstEditorComponent implements OnInit {
  /**
   * The name of the entity to be editted.
   */
  @Input() entityName: string;

  /**
   * Instance of Entity to be editted
   */
  private internalInst: {};

  /**
   * A list of properties to be edited. It is optional.
   *
   * If no value is supplied, all edittabled propperties will be edited.
   */
  @Input() propNames: string[];

  @ViewChildren(DynamicFieldPropertyComponent)
  propComps: QueryList<DynamicFieldPropertyComponent>;

  @ViewChild(EntityContextDirective)
  entityContextDirective: EntityContextDirective;

  /**
   * Calculated Entity
   */
  entity: Entity;

  /**
   * Calculated Properties to be edited
   */
  props: Prop[];

  constructor(
      private readonly entityMetaDataRepository: EntityMetaDataRepository,
      private readonly defaultInstPopulater: DefaultInstPopulater) {}

  ngOnInit() {
    this.entity = this.entityMetaDataRepository.getEntity(this.entityName);

    if (!this.internalInst) {
      this.internalInst =
          this.defaultInstPopulater.populateInstance({}, this.entity);
    }

    this.props = [];
    if (this.propNames && this.propNames.length > 0) {
      for (const propName of this.propNames) {
        this.props.push(this.entity.findProp(propName));
      }
    } else {
      for (const prop of this.entity.props) {
        if (prop.showInEditor) {
          this.props.push(prop);
        }
      }
    }
  }

  /**
   * Instance of Entity to be editted
   */
  @Input()
  get inst() {
    return this.internalInst;
  }
  set inst(newInst: {}) {
    this.internalInst = newInst;
    this.reset();
  }

  /**
   * Collect values from UI and push it to Instance
   */
  pushValueToInstance() {
    for (const dfComp of this.propComps.toArray()) {
      dfComp.pushValueToInstance();
    }
  }

  /**
   * Reset UI values
   */
  reset() {
    setTimeout(() => {
      for (const dfComp of this.propComps.toArray()) {
        dfComp.resetValue();
      }

      /*
      Some context is enforced only at the very beginning of inst binding.
      We need to call the directive to enforce the value again.
      */
      this.entityContextDirective.reset();
    });
  }
}
