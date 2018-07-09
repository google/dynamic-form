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

import {DynamicFormModule} from '../src/lib/src/dynamic_form_module';
import {DefaultInstPopulater} from '../src/lib/src/inst_service';
import {DisableContext, Entity, NOTNULL_VALUE, NULL_VALUE, Prop, RequiredContext, RestrictLookupContext} from '../src/lib/src/meta_datamodel';
import {DynamicFieldPropertyComponent} from '../src/lib/src/prop_component';
import {EntityMetaDataRepository, LookupSources} from '../src/lib/src/repositories';

import {ExampleLookupSrc, ExampleLookupValue} from './example_lookupsrc';

describe('DefaultInstPopulater', () => {
  const entity = new Entity(
      'test',
      [
        new Prop({
          name: 'prop1',
          type: 'select',
          controlType: 'text',
          dataType: 'STRING',
          label: 'first Property',
          lookupSrc: ExampleLookupSrc.NAME,
          lookupName: 'countries',
          defaultValue: 'US',
        }),
        new Prop({
          name: 'prop2',
          type: 'select',
          controlType: 'text',
          dataType: 'STRING',
          label: 'second Property',
          defaultValue: 'second',
        }),
        new Prop({
          name: 'prop3',
          type: 'checkbox',
          controlType: 'boolean',
          dataType: 'BOOLEAN',
          label: 'third Property',
          defaultValue: 'true',
        }),
        new Prop({
          name: 'prop4',
          type: 'text',
          controlType: 'number',
          dataType: 'NUMBER',
          label: 'fourth Property',
          defaultValue: '3',
        }),
        new Prop({
          name: 'prop5',
          type: 'checkbox',
          controlType: 'boolean',
          dataType: 'BOOLEAN',
          label: 'fifth Property',
        }),
      ],
      []);

  // configure
  beforeEach(() => {
    TestBed.configureTestingModule({imports: [DynamicFormModule, NoopAnimationsModule]});

    // initialize meta data
    TestBed.get(EntityMetaDataRepository).registerMetaData(entity);
    TestBed.get(LookupSources)
        .registerLookupSource(ExampleLookupSrc.NAME, new ExampleLookupSrc());
  });



  it('test DefaultInstPopulater', () => {
    const defaultInstPouplater =
        TestBed.get(DefaultInstPopulater) as DefaultInstPopulater;

    const inst: {[index: string]: {}} = {};
    defaultInstPouplater.populateInstance(inst, entity);
    expect(inst.prop1).toBe('US');
    expect(inst.prop2).toEqual('second');
    expect(inst.prop3).toBeTruthy();
    expect(inst.prop5).toBeFalsy();
    expect(inst.prop4).toBe(3);
  });
});
