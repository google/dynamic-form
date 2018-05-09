/**
 * Definition for Book entity.
 */
import {Injectable} from '@angular/core';

import {SimpleValueSetterGetter} from '../../../inst_service';
import {AnyType, BaseLookupValue, Entity, NULL_VALUE, Prop, ShowHideContext} from '../../../meta_datamodel';
import {assert} from '../../../repositories';
import {NameValueLookupSource, NameValueLookupValue} from '../../../repositories';

import {BookLookup} from './book_lookup_sample';

export const BOOK_LOOKUP_ENTITY_NAME = 'book1';
// Lookup source name for Book entity.
export const BOOK_LOOKUP_SRC = 'book';

export const BOOK_LOOKUP_ENTITY = {
  name: 'book1',
  props: [
    new Prop({
      name: 'name',
      type: 'text',
      dataType: 'STRING',
      label: 'Book Name',
      minLength: 2,
      isRequired: true,
      editable: true,
      viewable: true,
    }),
    new Prop({
      name: 'description',
      type: 'text',
      dataType: 'STRING',
      label: 'Description',
      minLength: 2,
      isRequired: true,
      editable: true,
      viewable: true,
      fieldWidth: 2,
    }),
    new Prop({
      name: 'author',
      type: 'text',
      dataType: 'STRING',
      label: 'Author',
      minLength: 2,
      isRequired: true,
      editable: true,
      viewable: true,
    }),
    new Prop({
      name: 'amount',
      type: 'text',
      dataType: 'NUMBER',
      label: 'Price Amount',
      min: 0.00,
      isRequired: true,
      editable: true,
      viewable: true,
    }),
    new Prop({
      name: 'currency',
      // Modified the type from 'text' to 'select'.
      type: 'select',
      dataType: 'STRING',
      label: 'Price Currency',
      isRequired: true,
      editable: true,
      viewable: true,
      // Use 'lookupName' and 'lookupSrc' to find the correct lookup.
      lookupName: 'currency',
      lookupSrc: BOOK_LOOKUP_SRC,
    }),
    // Added new property 'country' to demonstrate Lookup usage.
    new Prop({
      name: 'country',
      type: 'select',
      dataType: 'STRING',
      label: 'Country',
      isRequired: false,
      editable: true,
      viewable: true,
      lookupName: 'country',
      lookupSrc: BOOK_LOOKUP_SRC,
    }),
    new Prop({
      name: 'isAvailable',
      type: 'checkbox',
      dataType: 'BOOLEAN',
      label: 'Available',
    }),
  ],
  contexts: [
    {
      srcProp: 'isAvailable',
      srcValue: 'true',
      target: 'amount',
      show: true,
      type: ShowHideContext.TYPE,
      skipFirstTime: false,
    },
  ],
};

/**
 * Getter and setter for a BookLookup instance.
 * The same as Book example.
 */
@Injectable()
export class BookLookupValueSetterGetter extends
    SimpleValueSetterGetter<BookLookup> {
  /**
   * Indicates whether can handle the passed entity or not.
   */
  canHandle(entity: Entity): boolean {
    return entity.name === BOOK_LOOKUP_ENTITY_NAME;
  }

  /**
   * Gets the value from Book instance by Property.
   * This is just a simple implementation to get value from instance.
   * In real production, the scenario and implementation can be complex.
   */
  get(inst: BookLookup, prop: Prop): AnyType {
    switch (prop.name) {
        // Handles property 'amount' and 'currency' differently, since they do
        // not match the structure of instance.
      case 'amount':
        return inst.price.amount;
      case 'currency':
        return inst.price.currency;
      default:
        // Uses the default getter for the rest properties.
        return super.get(inst, prop);
    }
  }

  /**
   * Sets value to instance.
   */
  set(inst: BookLookup, prop: Prop, value: AnyType): void {
    if (!value) {
      return;
    }

    switch (prop.name) {
      case 'amount':
        const amount = Number(value);
        // No need to validate the type since UI would give a proper value.
        inst.price.amount = amount;
        break;
      case 'currency':
        inst.price.currency = value!.toString();
        break;
      default:
        super.set(inst, prop, value);
        break;
    }
  }
}
