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
import {DisableContext, Entity, NOTNULL_VALUE, NULL_VALUE, Prop, RequiredContext, RestrictLookupContext} from '../src/lib/src/meta_datamodel';
import {DynamicFieldPropertyComponent} from '../src/lib/src/prop_component';
import {EntityMetaDataRepository, LookupSources} from '../src/lib/src/repositories';

import {ExampleLookupSrc, ExampleLookupValue} from './example_lookupsrc';

/**
 * Host component to test prop_component.ts
 */
@Component({
  preserveWhitespaces: true,
  template: `
  <form  gdfEntityCtx="test" [inst]="inst" >
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

// tslint:disable-next-line:ban temporary skip test this CL will be reverted
xdescribe('RestrictLookupContext', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

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
      ],
      [
        {
          type: RestrictLookupContext.TYPE,
          srcProp: 'prop1',
          srcValue: 'US',
          target: 'prop2',
          targetValues: ['USD', 'CNY'],
          skipFirstTime: false,
        },
        {
          type: RestrictLookupContext.TYPE,
          srcProp: 'prop1',
          srcValue: 'CA',
          target: 'prop2',
          targetValues: ['CAD', 'CNY'],
          skipFirstTime: false,
        },
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
    comp.inst = {prop1: 'CA', prop2: 'CAD'};
    fixture.detectChanges();
  });

  it('TestLookupDefaultAndSwitch', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();
         const currencySelect =
             fixture.debugElement
                 .query(By.css('mat-form-field.prop2 mat-select'))
                 .componentInstance as MatSelect;
         // empty, CAD, CNY
         expect(currencySelect.options.length).toEqual(3);

         const matOption = currencySelect.selected as MatOption;
         expect(matOption.value.code).toEqual('CAD');

         const dfComp = fixture.debugElement.query(By.css('gdf-prop.prop1'))
                            .componentInstance as DynamicFieldPropertyComponent;
         const countries = TestBed.get(LookupSources)
                               .getLookupSource(ExampleLookupSrc.NAME)
                               .getLookupValues('countries');
         dfComp.control.setValue(
             countries.find((c: ExampleLookupValue) => c.code === 'US'));
         fixture.detectChanges();

         expect(currencySelect.options.length).toEqual(3);
         expect(currencySelect.selected).toBeUndefined();
         expect(currencySelect.options.find(
                    option => option.value && option.value.code === 'CAD'))
             .toBeUndefined();
         expect(currencySelect.options.find(
                    option => option.value && option.value.code === 'USD'))
             .not.toBeUndefined();
       });
     }));
});
