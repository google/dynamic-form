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
import {DisableContext, Entity, NOTNULL_VALUE, NULL_VALUE, Prop, RequiredContext} from '../src/lib/src/meta_datamodel';
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

describe('DisableContext', () => {
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
        new Prop({
          name: 'prop9',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: 'ninth Property',
          editable: false,
        }),
      ],
      [
        {
          type: DisableContext.TYPE,
          srcs: new Map<string, string>(
              [['prop1', 'value1'], ['prop2', 'value2']]),
          relation: 'and',
          target: 'prop3',
          disable: true,
          skipFirstTime: false,
        },
        {
          type: DisableContext.TYPE,
          srcs: new Map<string, string>(
              [['prop4', 'value4'], ['prop5', 'value5']]),
          relation: 'or',
          target: 'prop6',
          disable: true,
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
    fixture = TestBed.createComponent(TestHostComponent);

    comp = fixture.componentInstance;
    comp.props = entity.props;
    comp.inst =
        {prop1: 'value1', prop2: 'value2', prop4: 'value4', prop5: 'value5'};
    fixture.detectChanges();
  });


  it('TestAnd', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();
         const el =
             fixture.debugElement.query(By.css('mat-form-field.prop3 input'))
                 .nativeElement;
         expect(el.disabled).toBeTruthy();

         setInputValueAsync('.prop2 input', '');
         fixture.detectChanges();
         expect(el.disabled).toBeFalsy();
       });
     }));

  it('TestOr', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();
         const el =
             fixture.debugElement.query(By.css('mat-form-field.prop6 input'))
                 .nativeElement;
         expect(el.disabled).toBeTruthy();

         setInputValueAsync('.prop4 input', '');
         fixture.detectChanges();
         expect(el.disabled).toBeTruthy();
         setInputValueAsync('.prop5 input', 'some value');
         fixture.detectChanges();
         expect(el.disabled).toBeFalsy();
       });
     }));

  // form control is disabled when property editable is false
  it('editable', async(() => {
       fixture.detectChanges();
       const el =
           fixture.debugElement.query(By.css('mat-form-field.prop9 input'))
               .nativeElement;
       expect(el.disabled).toBeTruthy();
     }));

  function setInputValueAsync(selector: string, value: string) {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }
});
