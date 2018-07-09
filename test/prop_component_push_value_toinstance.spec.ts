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

import {Component, DebugElement, ViewChild} from '@angular/core';
import {async, ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatOption, MatSelect} from '@angular/material';
import {By} from '@angular/platform-browser';
import * as moment_ from 'moment';

import {DynamicFormModule} from '../src/lib/src/dynamic_form_module';
import {DisableContext, Entity, NOTNULL_VALUE, NULL_VALUE, Prop, RequiredContext, RestrictLookupContext} from '../src/lib/src/meta_datamodel';
import {DynamicFieldPropertyComponent} from '../src/lib/src/prop_component';
import {EntityMetaDataRepository, LookupSources} from '../src/lib/src/repositories';

import {ExampleLookupSrc, ExampleLookupValue} from './example_lookupsrc';

const moment = moment_;
/**
 * Host component to test prop_component.ts
 */
@Component({
  preserveWhitespaces: true,
  template: `
  <form >
    <ng-container *ngFor="let prop of props">
      <gdf-prop [prop]="prop" [ngClass]="prop.name" [inst]="inst"></gdf-prop>
    </ng-container>
  </form>
  `
})
export class TestHostComponent {
  props: Prop[];
  // tslint:disable-next-line:no-any property value can be anything
  inst: {[index: string]: any};
}

describe('PushValue', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const date = new Date(2018, 3, 8);

  const entity = new Entity('test', [
    new Prop({
      name: 'prop1',
      type: 'select',
      controlType: 'text',
      dataType: 'STRING',
      label: 'first Property',
      lookupSrc: ExampleLookupSrc.NAME,
      lookupName: 'countries',
    }),
    new Prop({
      name: 'prop2',
      type: 'select',
      controlType: 'text',
      dataType: 'STRING',
      label: 'second Property',
      lookupSrc: ExampleLookupSrc.NAME,
      lookupName: 'currencies',
    }),
    new Prop({
      name: 'prop3',
      type: 'text',
      controlType: 'number',
      dataType: 'NUMBER',
      label: 'third Property',
    }),
    new Prop({
      name: 'prop4',
      type: 'text',
      controlType: 'number',
      dataType: 'STRING',
      label: 'fourth Property',
    }),
    new Prop({
      name: 'prop5',
      type: 'text',
      controlType: 'date',
      dataType: 'STRING',
      label: 'fifth Property',
    }),
    new Prop({
      name: 'prop6',
      type: 'text',
      controlType: 'date',
      dataType: 'DATE',
      label: 'sixth Property',
    }),
  ]);


  // configure
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DynamicFormModule, NoopAnimationsModule],
      declarations: [TestHostComponent],
    });

    // initialize meta data
    TestBed.get(EntityMetaDataRepository).registerMetaData(entity);
    TestBed.get(LookupSources)
        .registerLookupSource(ExampleLookupSrc.NAME, new ExampleLookupSrc());
    fixture = TestBed.createComponent(TestHostComponent);

    comp = fixture.componentInstance;
    comp.props = entity.props;

    comp.inst = {
      prop1: 'CA',
      prop2: 'CAD',
      'prop3': 5,
      'prop4': '4',
      'prop5': date.toISOString(),
      'prop6': date
    };
    fixture.detectChanges();
  });

  it('push value', fakeAsync(() => {
       // make sure value is a object
       const dfComp = fixture.debugElement.query(By.css('gdf-prop.prop1'))
                          .componentInstance as DynamicFieldPropertyComponent;
       expect(dfComp.control.value.code).toEqual('CA');
       setInputValue('.prop3 input', '6');
       comp.inst['prop1'] = '';
       comp.inst['prop2'] = '';
       comp.inst['prop3'] = 0;
       comp.inst['prop4'] = '0';
       comp.inst['prop5'] = '', comp.inst['prop6'] = undefined;

       const degugElements = fixture.debugElement.queryAll(By.css('gdf-prop'));
       for (const degugElement of degugElements) {
         (degugElement.componentInstance as DynamicFieldPropertyComponent)
             .pushValueToInstance();
       }
       // stringified value
       expect(comp.inst['prop1']).toEqual('CA');
       expect(comp.inst['prop2']).toEqual('CAD');

       // a number
       expect(comp.inst['prop3']).toBe(6);
       // a string
       expect(comp.inst['prop4']).toBe('4');
       expect(typeof comp.inst['prop5']).toBe('string');

       expect(comp.inst['prop5']).toBe(moment('2018-04-08').toISOString());
       expect(comp.inst['prop6'] instanceof Date).toBeTruthy();
       expect((comp.inst['prop6'] as Date).getTime()).toBe(date.getTime());
     }));

  function setInputValue(selector: string, value: string) {
    fixture.detectChanges();
    tick();
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    tick();
  }
});
