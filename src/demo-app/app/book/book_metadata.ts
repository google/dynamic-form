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

/**
 * Definition for Book entity.
 */
import {Injectable} from '@angular/core';

import {SimpleValueSetterGetter} from '../../../lib/src/inst_service';
import {AnyType, Entity, Prop, ShowHideContext} from '../../../lib/src/meta_datamodel';

import {Book} from './book_sample';

export const BOOK_ENTITY_NAME = 'book';

export const BOOK_ENTITY = {
  name: 'book',
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
      type: 'text',
      dataType: 'STRING',
      label: 'Price Currency',
      minLength: 3,
      isRequired: true,
      editable: true,
      viewable: true,
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
      target: 'price',
      show: true,
      type: ShowHideContext.TYPE,
      skipFirstTime: false,
    },
  ],
};

/**
 * Getter and setter for a Book instance.
 */
@Injectable()
export class BookValueSetterGetter extends SimpleValueSetterGetter<Book> {
  /**
   * Indicates whether can handle the passed entity or not.
   */
  canHandle(entity: Entity): boolean {
    return entity.name === BOOK_ENTITY_NAME;
  }

  /**
   * Gets the value from Book instance by Property.
   * This is just a simple implementation to get value from instance.
   * In real production, the scenario and implementation can be complex.
   */
  get(inst: Book, prop: Prop): AnyType {
    switch (prop.name) {
      // Handles property 'amount' and 'currency' differently, since they do not
      // match the structure of instance.
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
  set(inst: Book, prop: Prop, value: AnyType): void {
    if (!value) {
      return;
    }

    switch (prop.name) {
      case 'amount':
        const amount = Number(value);
        if (isNaN(amount)) {
          throw new Error('The price amount input is not valid!');
        }
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
