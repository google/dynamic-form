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

import {AnyType, BaseLookupValue, NULL_VALUE} from '../src/lib/src/meta_datamodel';
import {assert} from '../src/lib/src/repositories';
import {LookupSource} from '../src/lib/src/repositories';

export class ExampleLookupValue extends BaseLookupValue {
  code: string;
}

/**
 * A lookup source for test purpose
 */
export class ExampleLookupSrc implements LookupSource {
  static readonly NAME = 'example';

  private readonly currencies = new Array<ExampleLookupValue>();
  private readonly countries = new Array<ExampleLookupValue>();

  constructor() {
    this.currencies.push({code: 'USD', description: 'US Dollar'});
    this.currencies.push({code: 'CAD', description: 'CANDIAN Dollar'});
    this.currencies.push({code: 'CNY', description: 'Chinese Yuan'});

    this.countries.push({code: 'US', description: 'United States'});
    this.countries.push({code: 'CA', description: 'Canada'});
    this.countries.push({code: 'CN', description: 'China'});
  }


  lookupValueToPropValue(lookupValue: ExampleLookupValue): AnyType {
    if (!lookupValue) {
      return null;
    }
    return lookupValue.code;
  }


  propValueToLookupValue(lookupCode: string, value: AnyType):
      ExampleLookupValue {
    if (lookupCode === 'currencies') {
      return assert(this.currencies.find(v => v.code === value));
    } else {
      return assert(this.countries.find(v => v.code === value));
    }
  }

  lookupValueToString(lookupValue: ExampleLookupValue): string {
    if (!lookupValue) {
      return NULL_VALUE;
    }
    return lookupValue.code;
  }

  getLookupValues(lookupCode: string): ExampleLookupValue[] {
    if (lookupCode === 'currencies') {
      return this.currencies;
    } else {
      return this.countries;
    }
  }
}
