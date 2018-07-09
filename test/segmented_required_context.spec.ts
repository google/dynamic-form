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
import {Entity, NOTNULL_VALUE, NULL_VALUE, Prop, RequiredContext, SegmentedRequiredContext} from '../src/lib/src/meta_datamodel';
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

describe('SegmentedRequiredContext', () => {
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
          label: 'third Property',
        }),
        new Prop({
          name: 'prop4',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: 'fourth Property',
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
        }),
      ],
      [
        {
          type: SegmentedRequiredContext.TYPE,
          srcProp: 'prop1',
          segments: new Map<string, string[]>(
              [['value1', ['prop2', 'prop3']], ['value2', ['prop4', 'prop5']]]),
          required: true,
          skipFirstTime: false,
        },
        {
          type: SegmentedRequiredContext.TYPE,
          srcProp: 'prop6',
          segments: new Map<string, string[]>([
            ['value61', ['prop7', 'prop8']], ['value62', ['prop7', 'prop9']]
          ]),
          required: true,
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
    comp.inst = {prop1: 'value1', prop6: 'value61'};
    fixture.detectChanges();
  });

  it('requiredByDefault', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();

         let el = fixture.debugElement.query(By.css('mat-form-field.prop2'))
                      .nativeElement;
         expect(el.classList.contains('required')).toBeTruthy();

         el = fixture.debugElement.query(By.css('mat-form-field.prop3'))
                  .nativeElement;
         expect(el.classList.contains('required')).toBeTruthy();

         el = fixture.debugElement.query(By.css('mat-form-field.prop4'))
                  .nativeElement;
         expect(el.classList.contains('required')).toBeFalsy();

         el = fixture.debugElement.query(By.css('mat-form-field.prop5'))
                  .nativeElement;
         expect(el.classList.contains('required')).toBeFalsy();
       });
     }));

  it('requiredChangeOnValue', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();
         setInputValueAsync('.prop1 input', 'value2');
         fixture.detectChanges();

         let el = fixture.debugElement.query(By.css('mat-form-field.prop4'))
                      .nativeElement;
         expect(el.classList.contains('required')).toBeTruthy();

         el = fixture.debugElement.query(By.css('mat-form-field.prop5'))
                  .nativeElement;
         expect(el.classList.contains('required')).toBeTruthy();

         el = fixture.debugElement.query(By.css('mat-form-field.prop2'))
                  .nativeElement;
         expect(el.classList.contains('required')).toBeFalsy();

         el = fixture.debugElement.query(By.css('mat-form-field.prop3'))
                  .nativeElement;
         expect(el.classList.contains('required')).toBeFalsy();
       });
     }));

  /*
  prop7 is required for when prop6 is value61
  prop8 is required too
   */
  it('requiredByDefaultForPropertyOverlap', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();

         let el = fixture.debugElement.query(By.css('mat-form-field.prop7'))
                      .nativeElement;
         expect(el.classList.contains('required')).toBeTruthy();

         el = fixture.debugElement.query(By.css('mat-form-field.prop8'))
                  .nativeElement;
         expect(el.classList.contains('required')).toBeTruthy();

         el = fixture.debugElement.query(By.css('mat-form-field.prop9'))
                  .nativeElement;
         expect(el.classList.contains('required')).toBeFalsy();
       });
     }));

  /*
  prop7 is still required for when prop6 is changed from value61 to value62
  prop9 is required, too
   */
  it('requiredChangeOnValueForPropertyOverlap', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();
         setInputValueAsync('.prop6 input', 'value62');
         fixture.detectChanges();

         let el = fixture.debugElement.query(By.css('mat-form-field.prop7'))
                      .nativeElement;
         expect(el.classList.contains('required')).toBeTruthy();

         el = fixture.debugElement.query(By.css('mat-form-field.prop9'))
                  .nativeElement;
         expect(el.classList.contains('required')).toBeTruthy();

         el = fixture.debugElement.query(By.css('mat-form-field.prop8'))
                  .nativeElement;
         expect(el.classList.contains('required')).toBeFalsy();
       });
     }));

  function setInputValueAsync(selector: string, value: string) {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }
});
