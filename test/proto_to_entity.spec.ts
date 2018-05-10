import {DiscoveryApi, JsonSchema, JsonSchemaFormat} from 'google3/javascript/typescript/contrib/apiclient/generator/discovery_api';
import {ProtoToEntityConverter} from 'java/com/google/corp/bizapps/om/omweb/shared/dynamicform/proto_to_entity_converter';

import {NameValueLookupSource, NameValueLookupValue} from '../repositories';

describe('protoToEntityConversion', () => {
  const protoToEntity =
      (api: DiscoveryApi, lookupSrc: NameValueLookupSource) => {
        const converter = new ProtoToEntityConverter();
        return converter.protoToEntity(api, lookupSrc);
      };

  it('basicStringTest', () => {
    const api: DiscoveryApi = {
      schemas: {
        test: {
          type: 'object',
          properties: {
            'prop1': {
              description: 'first property',
              type: 'string',
            }
          }
        }
      },
      name: 'test',
      version: 'v1',
    };

    const lookupSrc = new NameValueLookupSource();
    const entities = protoToEntity(api, lookupSrc);
    expect(entities.length).toEqual(1);
    const entity = entities[0];
    const prop = entity.props[0];
    expect(entity.name).toEqual('test');
    expect(prop.name).toEqual('prop1');
    expect(prop.type).toEqual('text');
    expect(prop.controlType).toEqual('text');
    expect(prop.dataType).toEqual('STRING');
  });

  it('basicNumberTest', () => {
    const api: DiscoveryApi = {
      schemas: {
        test: {
          type: 'object',
          properties: {
            'prop1': {
              description: 'first property',
              type: 'number',
              minimum: '3',
              maximum: '5',
            },
            'prop2': {
              description: 'first property',
              type: 'integer',
              minimum: '-10',
              maximum: '-5',
            }
          }
        }
      },
      name: 'test',
      version: 'v1',
    };

    const lookupSrc = new NameValueLookupSource();
    const entities = protoToEntity(api, lookupSrc);
    const entity = entities[0];
    const prop1 = entity.props[0];
    const prop2 = entity.props[1];

    expect(prop1.type).toEqual('text');
    expect(prop1.controlType).toEqual('number');
    expect(prop1.dataType).toEqual('NUMBER');
    expect(prop1.min).toBe(3);
    expect(prop1.max).toBe(5);

    expect(prop2.type).toEqual('text');
    expect(prop2.controlType).toEqual('number');
    expect(prop2.dataType).toEqual('NUMBER');
    expect(prop2.min).toBe(-10);
    expect(prop2.max).toBe(-5);
  });

  it('unsignedNumberTest', () => {
    const api: DiscoveryApi = {
      schemas: {
        test: {
          type: 'object',
          properties: {
            'prop1': {
              description: 'first property',
              type: 'number',
              format: 'uint32',
            },
          }
        }
      },
      name: 'test',
      version: 'v1',
    };

    const lookupSrc = new NameValueLookupSource();
    const entities = protoToEntity(api, lookupSrc);
    const entity = entities[0];
    const prop1 = entity.props[0];

    expect(prop1.type).toEqual('text');
    expect(prop1.controlType).toEqual('number');
    expect(prop1.dataType).toEqual('NUMBER');
    expect(prop1.min).toBe(0);
  });

  it('basicBooleanTest', () => {
    const api: DiscoveryApi = {
      schemas: {
        test: {
          type: 'object',
          properties: {
            'prop1': {
              description: 'first property',
              type: 'boolean',
            },
          }
        }
      },
      name: 'test',
      version: 'v1',
    };

    const lookupSrc = new NameValueLookupSource();
    const entities = protoToEntity(api, lookupSrc);
    const entity = entities[0];
    const prop1 = entity.props[0];

    expect(prop1.type).toEqual('checkbox');
    expect(prop1.dataType).toEqual('BOOLEAN');
  });

  it('basicDateTest', () => {
    const api: DiscoveryApi = {
      schemas: {
        test: {
          type: 'object',
          properties: {
            'prop1': {
              description: 'first property',
              type: 'string',
              format: 'date',
            },
          }
        }
      },
      name: 'test',
      version: 'v1',
    };

    const lookupSrc = new NameValueLookupSource();
    const entities = protoToEntity(api, lookupSrc);
    const entity = entities[0];
    const prop1 = entity.props[0];

    expect(prop1.type).toEqual('text');
    expect(prop1.controlType).toEqual('date');
    expect(prop1.dataType).toEqual('DATE');
  });

  it('basicDateTimeTest', () => {
    const api: DiscoveryApi = {
      schemas: {
        test: {
          type: 'object',
          properties: {
            'prop1': {
              description: 'first property',
              type: 'string',
              format: 'datetime',
            },
          }
        }
      },
      name: 'test',
      version: 'v1',
    };

    const lookupSrc = new NameValueLookupSource();
    const entities = protoToEntity(api, lookupSrc);
    const entity = entities[0];
    const prop1 = entity.props[0];

    expect(prop1.type).toEqual('text');
    expect(prop1.controlType).toEqual('datetime-local');
    expect(prop1.dataType).toEqual('DATETIME');
  });

  it('requiredConstraintTest', () => {
    const api: DiscoveryApi = {
      schemas: {
        test: {
          type: 'object',
          properties: {
            'prop1': {
              description: 'first property',
              type: 'string',
              required: true,
            },
            'prop2': {
              description: 'first property',
              type: 'string',
            },
          }
        }
      },
      name: 'test',
      version: 'v1',
    };

    const lookupSrc = new NameValueLookupSource();
    const entities = protoToEntity(api, lookupSrc);
    const entity = entities[0];
    const prop1 = entity.props[0];
    const prop2 = entity.props[1];

    expect(prop1.isRequired).toBeTruthy();
    expect(prop2.isRequired).toBeFalsy();
  });

  it('patternConstraintTest', () => {
    const api: DiscoveryApi = {
      schemas: {
        test: {
          type: 'object',
          properties: {
            'prop1': {
              description: 'first property',
              type: 'string',
              pattern: '^[a-z]+$',
            },
            'prop2': {
              description: 'first property',
              type: 'string',
            },
          }
        }
      },
      name: 'test',
      version: 'v1',
    };

    const lookupSrc = new NameValueLookupSource();
    const entities = protoToEntity(api, lookupSrc);
    const entity = entities[0];
    const prop1 = entity.props[0];
    const prop2 = entity.props[1];

    expect(prop1.regExp).toEqual('^[a-z]+$');
    expect(prop2.regExp).toBeUndefined();
  });

  it('defaultTest', () => {
    const api: DiscoveryApi = {
      schemas: {
        test: {
          type: 'object',
          properties: {
            'prop1': {
              description: 'first property',
              type: 'number',
              default: '3',
            },
            'prop2': {
              description: 'first property',
              type: 'string',
            },
          }
        }
      },
      name: 'test',
      version: 'v1',
    };

    const lookupSrc = new NameValueLookupSource();
    const entities = protoToEntity(api, lookupSrc);
    const entity = entities[0];
    const prop1 = entity.props[0];
    const prop2 = entity.props[1];

    expect(prop1.defaultValue).toEqual('3');
    expect(prop2.defaultValue).toBeUndefined();
  });

  it('enumTest', () => {
    const api: DiscoveryApi = {
      schemas: {
        test: {
          type: 'object',
          properties: {
            'prop1': {
              description: 'first property',
              type: 'string',
              enum: ['US', 'UK'],
              enumDescription: ['United States', 'United Kingdom'],
            },
          }
        }
      },
      name: 'test',
      version: 'v1',
    };

    const lookupSrc = new NameValueLookupSource();
    const entities = protoToEntity(api, lookupSrc);
    const entity = entities[0];
    const prop1 = entity.props[0];

    expect(prop1.type).toEqual('select');
    expect(prop1.lookupSrc).toBe('test');
    expect(prop1.lookupName).toBe('test_prop1');

    expect(lookupSrc.lookups.size).toBe(1);
    expect(lookupSrc.name).toBe('test');

    const countries =
        lookupSrc.getLookupValues('test_prop1') as NameValueLookupValue[];
    expect(countries.length).toBe(2);
    expect(countries[0].value).toBe('US');
    expect(countries[0].description).toBe('United States');
    expect(countries[1].value).toBe('UK');
    expect(countries[1].description).toBe('United Kingdom');
  });
});
