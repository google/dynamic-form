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

import {Component, Injectable, ViewChild} from '@angular/core';
import {async as testasync, ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {Observable, Subject} from 'rxjs';
import {debounceTime, distinctUntilChanged, map} from 'rxjs/operators';

import {DynamicFormModule} from '../src/lib/src/dynamic_form_module';
import {InstEditorComponent} from '../src/lib/src/inst_editor';
import {AnyType, BaseLookupValue, Entity, Prop} from '../src/lib/src/meta_datamodel';
import {AutoCompleteLookupService, EntityMetaDataRepository} from '../src/lib/src/repositories';

export class Product extends BaseLookupValue {
  uri: {resourcePath: string, serviceName: string};
}

/**
 * Example AutoCompleteService
 */
@Injectable()
export class TestAutoCompleteService implements AutoCompleteLookupService {
  /*
   * Use Object instead of simple string for autocomplete
   */
  readonly staticValues: Product[] = [
    {
      description: 'first product',
      uri: {
        resourcePath: 'products/1',
        serviceName: 'productService',
      }
    },
    {
      description: 'fir product',
      uri: {
        resourcePath: 'products/4',
        serviceName: 'productService',
      }
    },
    {
      description: 'second product',
      uri: {
        resourcePath: 'products/2',
        serviceName: 'productService',
      }
    },
    {
      description: 'third product',
      uri: {
        resourcePath: 'products/3',
        serviceName: 'productService',
      }
    },
  ];
  readonly _lookupValues: Observable<BaseLookupValue[]>;
  readonly filtersStream = new Subject<string>();
  constructor() {
    this._lookupValues = this.filtersStream.pipe(
        distinctUntilChanged(),
        debounceTime(100),
        map((filter: string) => {
          if (filter) {
            const values: Product[] = [];
            for (const value of this.staticValues) {
              if (value.description && value.description.startsWith(filter)) {
                /*
                Clone value. This simulates a server call. For a unique
                resource, each server call returns a different JS object
                instance
                */
                values.push(Object.assign({}, value));
              }
            }
            return values;
          } else {
            // empty strng, don't loading any thing from server at very
            // beginning;
            return [];
          }
        }),
    );
  }

  getLookups() {
    return this._lookupValues;
  }
  /**
   * Input type
   * 1. undefined: very beginning
   * 2. Product: user selected one option
   * 3. empty string: input is focused
   */
  setFilter(filter: string|Product|undefined) {
    let filterStr = '';
    if (filter) {
      if (typeof filter !== 'string') {
        filterStr = filter.description || '';
      } else {
        filterStr = filter.toString();
      }
    }
    // use timeout to simulate a server XHR action
    setTimeout(() => {
      this.filtersStream.next(filterStr);
    });
  }

  // convert user selected value to property value;
  lookupValueToPropValue(lookupValue: Product|undefined|string): AnyType {
    if (!lookupValue || typeof lookupValue === 'string') {
      return undefined;
    }
    return lookupValue.uri;
  }

  // simulate the action: go to server to find the lookup
  resolvePropValue(value: {resourcePath: string}):
      Promise<BaseLookupValue|undefined> {
    if (!value) {
      return Promise.resolve(undefined);
    }
    return Promise.resolve(
        this.staticValues.find(u => value.resourcePath === u.uri.resourcePath));
  }
}

/**
 * Host component to test prop_component.ts
 */
@Component({
  template: `
  <form>
    <inst-editor entityName="test" [inst]="inst" #instEditor></inst-editor>
    <button (click)="instEditor.pushValueToInstance()" id="save">save</button>
    <button (click)="instEditor.reset()" id="reset">reset</button>
  </form>
  <inst-viewer entityName="test" [inst]="inst"></inst-viewer>
  `,
  providers: [
    /**
     * Component level provider
     * so each component could have its own provider
     */
    {provide: 'product', useClass: TestAutoCompleteService},
  ]
})
export class TestHostComponent {
  props: Prop[];
  // tslint:disable-next-line:no-any property value can be anything
  inst: {[index: string]: any};

  @ViewChild(InstEditorComponent) instEditor: InstEditorComponent;
}

describe('AutoCompleteTest', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  const entity = new Entity(
      'test',
      [
        new Prop({
          name: 'prop1',
          type: 'autocomplete',
          label: 'first Property',
          fieldWidth: 2,
          autoCompleteService: 'product'
        }),
      ],
      [],
  );

  // configure
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DynamicFormModule, NoopAnimationsModule],
      declarations: [TestHostComponent],
    });

    // initialize meta data
    TestBed.get(EntityMetaDataRepository).registerMetaData(entity);
    fixture = TestBed.createComponent(TestHostComponent);

    comp = fixture.componentInstance;
    comp.props = entity.props;
  });



  it('basic', testasync(async () => {
       comp.inst = {};
       fixture.detectChanges();
       await fixture.whenStable();

       /*
       setInputValue('.prop1 input', 'fi');
       await fixture.whenStable();

       fixture.detectChanges();

       expect(overlayContainerElement.textContent)
          .toContain('Alabama', `Expected panel to display when input is
       focused.`);
      */
     }));

  it('initialValue', testasync(async () => {
       comp.inst = {
         prop1: {
           resourcePath: 'products/1',
           serviceName: 'productService',
         }
       };
       fixture.detectChanges();
       await fixture.whenStable();

       console.log('autocomplete works');
     }));

  // TODO
  it('required', testasync(async () => {}));
  it('disabled', testasync(async () => {}));
  it('save', testasync(async () => {}));
  it('reset', testasync(async () => {}));
});
