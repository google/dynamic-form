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
import {By} from '@angular/platform-browser';


import {DynamicFormModule} from '../src/lib/src/dynamic_form_module';
import {Entity, NOTNULL_VALUE, NULL_VALUE, Prop, RequiredContext, SetValueContext} from '../src/lib/src/meta_datamodel';
import {DynamicFieldPropertyComponent} from '../src/lib/src/prop_component';
import {EntityMetaDataRepository, LookupSources} from '../src/lib/src/repositories';

import {ExampleLookupSrc} from './example_lookupsrc';


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

describe('SetValueContext', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;


  const entity = new Entity(
      'test',
      [
        new Prop({
          name: 'prop1',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: 'first Property',
        }),
        new Prop({
          name: 'prop2',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: 'second Property',
        }),
        new Prop({
          name: 'prop3',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: '3rd Property',
        }),
        new Prop({
          name: 'prop4',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: '4th Property',
        }),

        new Prop({
          name: 'prop5',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: 'fifth Property',
        }),
        new Prop({
          name: 'prop6',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: 'sixth Property',
        }),
        new Prop({
          name: 'prop7',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: 'seventh Property',
        }),
        new Prop({
          name: 'prop8',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: 'eighth Property',
        }),
      ],
      [
        {
          type: SetValueContext.TYPE,
          srcProp: 'prop1',
          srcValue: 'value2',
          target: 'prop2',
          targetValue: 'new value',
          skipFirstTime: false,
        },
        {
          type: SetValueContext.TYPE,
          srcProp: 'prop3',
          srcValue: NULL_VALUE,
          target: 'prop4',
          targetValue: 'new value',
          skipFirstTime: false,
        },
        {
          type: SetValueContext.TYPE,
          srcProp: 'prop5',
          srcValue: NULL_VALUE,
          target: 'prop6',
          targetValue: 'new value',
          skipFirstTime: false,
        },
        {
          type: SetValueContext.TYPE,
          srcProp: 'prop7',
          srcValue: NOTNULL_VALUE,
          target: 'prop8',
          targetValue: 'new value',
          skipFirstTime: false,
        }
      ]);


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
    comp.inst = {prop1: 'vaue1', prop5: 'value5'};
    fixture.detectChanges();
  });

  it('setValue', fakeAsync(() => {
       const input2 =
           fixture.debugElement.query(By.css('mat-form-field.prop2 input'));
       expect((input2.nativeElement as HTMLInputElement).value).toBe('');

       setInputValue('.prop1 input', 'value2');
       fixture.detectChanges();

       const dfComp = fixture.debugElement.query(By.css('gdf-prop.prop2'));
       expect(dfComp.componentInstance.control.value).toEqual('new value');
       expect((input2.nativeElement as HTMLInputElement).value)
           .toEqual('new value');
     }));

  it('setValueAtCreation', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();
         const input =
             fixture.debugElement.query(By.css('mat-form-field.prop4 input'));
         expect((input.nativeElement as HTMLInputElement).value)
             .toBe('new value');
       });
     }));

  it('setValueNullCase', fakeAsync(() => {
       const input =
           fixture.debugElement.query(By.css('mat-form-field.prop6 input'));
       expect((input.nativeElement as HTMLInputElement).value).toBe('');

       // prop5 value is set to null
       setInputValue('.prop5 input', '');
       fixture.detectChanges();

       const dfComp = fixture.debugElement.query(By.css('gdf-prop.prop6'));
       expect(dfComp.componentInstance.control.value).toEqual('new value');
       expect((input.nativeElement as HTMLInputElement).value)
           .toEqual('new value');
     }));

  it('setValueNotNullCase', fakeAsync(() => {
       const input =
           fixture.debugElement.query(By.css('mat-form-field.prop8 input'));
       expect((input.nativeElement as HTMLInputElement).value).toBe('');

       // prop5 value is set to null
       setInputValue('.prop7 input', 'some value');
       fixture.detectChanges();

       const dfComp = fixture.debugElement.query(By.css('gdf-prop.prop8'));
       expect(dfComp.componentInstance.control.value).toEqual('new value');
       expect((input.nativeElement as HTMLInputElement).value)
           .toEqual('new value');
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
