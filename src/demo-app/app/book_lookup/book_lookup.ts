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
