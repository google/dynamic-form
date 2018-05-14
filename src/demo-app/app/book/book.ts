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
import {DynamicFieldPropertyComponent} from '../../../lib/src/prop_component';
import {EntityMetaDataRepository} from '../../../lib/src/repositories';

import {BOOK_ENTITY_NAME} from './book_metadata';
import {Book} from './book_sample';

/**
 * This is the Book example component.
 * Contains logic to display and update a Book instance.
 */
@Component({
  selector: 'book',
  templateUrl: './book.ng.html',
})
export class BookComponent {
  @ViewChildren(DynamicFieldPropertyComponent)
  bookPropComps: QueryList<DynamicFieldPropertyComponent>;

  /** Book instance to be edited. */
  inst: Book;

  /**
   * Book entity properties.
   * These need to match the entity definition (in ./book_metadata.ts).
   */
  props =
      ['name', 'description', 'author', 'amount', 'currency', 'isAvailable'];

  constructor(
      private readonly entityMetaDataRepository: EntityMetaDataRepository,
      private readonly defaultInstPopulater: DefaultInstPopulater) {}

  ngOnInit(): void {
    // Gets the registered Book entity from entity repository.
    const bookEntity =
        this.entityMetaDataRepository.getEntity(BOOK_ENTITY_NAME);
    // Creates a default Book instance.
    this.inst = this.createDefaultBook(bookEntity);
  }

  /**
   * Uses default instance populater to create a default Book instance.
   */
  private createDefaultBook(entity: Entity) {
    const book = new Book();
    this.defaultInstPopulater.populateInstance(book, entity);
    return book;
  }

  /**
   * Submits form control values and saves to instance.
   * User would see the value updated on the template.
   */
  submit() {
    for (const component of this.bookPropComps.toArray()) {
      component.pushValueToInstance();
    }
    alert('Instance value updated!');
  }
}
