import {Component, OnInit, QueryList, ViewChildren} from '@angular/core';

import {DefaultInstPopulater} from '../../../inst_service';
import {Entity} from '../../../meta_datamodel';
import {DynamicFieldPropertyComponent} from '../../../prop_component';
import {EntityMetaDataRepository} from '../../../repositories';

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
