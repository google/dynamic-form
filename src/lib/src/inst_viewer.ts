/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
 */

import {Component, Input, OnInit} from '@angular/core';
import {Entity, Prop} from './meta_datamodel';
import {EntityMetaDataRepository} from './repositories';

/**
 * Viewer component for an instance of an Entity
 */
@Component({
  preserveWhitespaces: true,
  selector: 'inst-viewer',
  templateUrl: 'inst_viewer.ng.html',
})
export class InstViewerComponent implements OnInit {
  /**
   * The name of the entity to be editted.
   */
  @Input() entityName: string;

  /**
   * Instance of Entity to be editted
   */
  @Input() inst: {};

  /**
   * A list of properties to be edited. It is optional.
   *
   * If no value is supplied, all edittabled propperties will be edited.
   */
  @Input() propNames: string[];


  /**
   * Show label for properties
   */
  @Input() showLabel = true;

  /**
   * Calculated Entity
   */
  entity: Entity;

  /**
   * Calculated Properties to be edited
   */
  props: Prop[];

  constructor(private readonly entityMetaDataRepository:
                  EntityMetaDataRepository) {}

  ngOnInit() {
    this.entity = this.entityMetaDataRepository.getEntity(this.entityName);

    this.props = [];
    if (this.propNames && this.propNames.length > 0) {
      for (const propName of this.propNames) {
        this.props.push(this.entity.findProp(propName));
      }
    } else {
      for (const prop of this.entity.props) {
        if (prop.showInViewer) {
          this.props.push(prop);
        }
      }
    }
  }
}
