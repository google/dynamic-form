import {AnyType, BaseLookupValue, NULL_VALUE} from '../meta_datamodel';
import {assert} from '../repositories';
import {LookupSource} from '../repositories';

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
