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

import {Observable} from 'rxjs';

import {AnyType, BaseLookupValue, Entity} from './meta_datamodel';

/**
 * An assert function to remove undefined|null from type
 *
 * Don't use javascript/typescript/contrib:assert which uses closure
 * module 'goog.asserts'. Closure module can't be used easily by nodejs
 */
export function assert<T>(condition: T|undefined|null): T {
  // tslint:disable-next-line:triple-equals check both null and undefined
  if (condition == undefined) {
    throw new Error('undefined found in assert ');
  }
  return condition;
}
/**
 * A repository containing all meta data for entity
 */
export class EntityMetaDataRepository {
  entities = new Map<string, Entity>();
  registerMetaData(entity: Entity) {
    this.entities.set(entity.name, entity);
  }
  getEntity(name: string): Entity {
    return assert(this.entities.get(name));
  }
  hasEntity(name: string): boolean {
    return this.entities.has(name);
  }
}

/**
 * A Lookup Source has many lookup. A lookup is used by drop down.
 * Example lookup: country. It has many Lookup values: US, CANADA, etc.
 */
export interface LookupSource {
  /**
   * Convert the selected Lookup Value Object to a value that can be set to
   * instance.
   * When a drop down is selected, the selected value will be Lookup Value
   * object. Instance property may not use that object directly. The method
   * transform Lookup Value object to a value suitable as property value.
   */
  lookupValueToPropValue(lookupValue: BaseLookupValue): AnyType;

  /**
   * Convert the property value to a lookup value Object.
   * FormControl for dropdown/select will always use Lookup Value object as
   * value. The returned value is set to control's value
   *
   * Why 'undefined' is one returned value here?
   * Some system passes a JS object as value representing an empty value.
   * In this case, undefined should be returned since there is no lookup
   * corresponding to empty value.
   */
  propValueToLookupValue(lookupName: string, value: AnyType): BaseLookupValue
      |undefined;

  /**
   * A stringified value.
   */
  lookupValueToString(lookupValue: BaseLookupValue): string;

  /**
   * Return a list of lookup values for a Lookup
   */
  getLookupValues(lookupName: string): BaseLookupValue[];
}

/**
 * Service to fetch a list lookup values for an autocomplete field.
 */
export interface AutoCompleteLookupService {
  /**
   * A list of lookup values for a autocomplete field.
   */
  getLookups(): Observable<BaseLookupValue[]>;

  /**
   * The value user types to autocomplete field.
   */
  setFilter(filter: AnyType): void;

  /**
   * Resolves a property value to a Lookup Value
   * Promise is used here since this service could go to server to
   * search the value.
   */
  resolvePropValue(value: AnyType): Promise<BaseLookupValue|undefined>;
  /**
   * Converts a Lookup Value to property value which can be saved to instance
   * Runtime type for lookupValue
   * 1. undefined: user didn't type anything
   * 2. string: user typed some string, but doesn't select anything
   * 3. a Lookup Value Object user selected
   */
  lookupValueToPropValue(lookupValue: BaseLookupValue|undefined|
                         string): AnyType;
}

/**
 * A repository for all Lookup Sources
 */
export class LookupSources {
  private strategies = new Map<string, LookupSource>();

  registerLookupSource(lookupSrc: string, strategy: LookupSource) {
    this.strategies.set(lookupSrc, strategy);
  }
  getLookupSource(lookupSrc: string): LookupSource {
    return assert(this.strategies.get(lookupSrc));
  }
}


export class NameValueLookupValue extends BaseLookupValue {
  value: string;
  constructor(description: string, value?: string) {
    super();
    this.description = description;
    if (value) {
      this.value = value;
    } else {
      this.value = description;
    }
  }
}


export class ObjectLookupValue extends BaseLookupValue {
  value: {};
  constructor(description: string, value?: {}) {
    super();
    this.description = description;
    if (value) {
      this.value = value;
    } else {
      this.value = description;
    }
  }
}

export class NameValueLookupSource implements LookupSource {
  name: string;
  readonly lookups = new Map<string, NameValueLookupValue[]>();
  lookupValueToPropValue(lookupValue: NameValueLookupValue): AnyType {
    if (!lookupValue) {
      return null;
    }
    return lookupValue.value;
  }


  propValueToLookupValue(lookupName: string, value: AnyType): BaseLookupValue {
    const values = assert(this.lookups.get(lookupName));
    return assert(values.find(lookupValue => lookupValue.value === value));
  }


  lookupValueToString(lookupValue: NameValueLookupValue): string {
    return lookupValue.value;
  }

  getLookupValues(lookupName: string): BaseLookupValue[] {
    return assert(this.lookups.get(lookupName));
  }
}


export class ObjectLookupSource implements LookupSource {
  name: string;
  readonly lookups = new Map<string, ObjectLookupValue[]>();
  lookupValueToPropValue(lookupValue: ObjectLookupValue): AnyType {
    if (!lookupValue) {
      return null;
    }
    return lookupValue.value;
  }


  propValueToLookupValue(lookupName: string, value: AnyType): BaseLookupValue {
    const values = assert(this.lookups.get(lookupName));
    return assert(values.find(lookupValue => lookupValue.value === value));
  }


  lookupValueToString(lookupValue: ObjectLookupValue): string {
    throw new Error('not Supported');
  }

  getLookupValues(lookupName: string): BaseLookupValue[] {
    return assert(this.lookups.get(lookupName));
  }
}
