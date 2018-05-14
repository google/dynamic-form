/**
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

import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';
import {DefaultInstPopulater} from '../../../lib/src/inst_service';
import {Entity} from '../../../lib/src/meta_datamodel';
import {EntityMetaDataRepository} from '../../../lib/src/repositories';

import {BOOK_LOOKUP_ENTITY_NAME} from './book_lookup_metadata';
import {BookLookup} from './book_lookup_sample';

/**
 * This is the Book example component.
 * Contains logic to display and update a Book instance.
 */
@Component({
  selector: 'book_lookup',
  templateUrl: './book_lookup.ng.html',
  styleUrls: ['./book_lookup.css']
})
export class BookLookupComponent {
  /** BookLookup instance to be edited. */
  inst: BookLookup;

  /**
   * BookLookup entity properties.
   * These need to match each property name defined in the entity definition
   * (./book_lookup_metadata.ts).
   */
  props = [
    'name', 'description', 'author', 'amount', 'currency', 'isAvailable',
    'country'
  ];

  insts: BookLookup[] = [];
  constructor(
      private readonly entityMetaDataRepository: EntityMetaDataRepository,
      private readonly defaultInstPopulater: DefaultInstPopulater) {
    for (let i = 0; i < 5; i++) {
      //  name?: string, description?: string, author?: string, price?: Price,
      // isAvailabe?: boolean, country?: string
      this.insts.push(new BookLookup(
          'name' + i,
          i + 'here are some long description. Very long description, Very long description ',
          'James Bond', {amount: 30, currency: 'USD'},
          i % 2 === 0 ? true : false, 'US'));
    }
    this.inst = this.insts[0];
  }
}
