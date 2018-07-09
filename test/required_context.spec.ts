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
import {Entity, NOTNULL_VALUE, NULL_VALUE, Prop, RequiredContext} from '../src/lib/src/meta_datamodel';
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

describe('RequiredContext', () => {
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
          type: RequiredContext.TYPE,
          srcProp: 'prop1',
          srcValue: 'value2',
          target: 'prop2',
          required: true,
          skipFirstTime: false,
        },
        {
          type: RequiredContext.TYPE,
          srcProp: 'prop5',
          srcValue: NULL_VALUE,
          target: 'prop6',
          required: true,
          skipFirstTime: false,
        },
        {
          type: RequiredContext.TYPE,
          srcProp: 'prop7',
          srcValue: NOTNULL_VALUE,
          target: 'prop8',
          required: true,
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
    comp.inst = {prop1: 'vaue1'};
    fixture.detectChanges();
  });


  it('notRequiredByDefault', () => {
    const el = fixture.debugElement.query(By.css('mat-form-field.prop2'))
                   .nativeElement;
    expect(el.classList.contains('required')).toBeFalsy();
  });

  it('requiredAfterValueChange', fakeAsync(() => {
       setInputValue('.prop1 input', 'value2');
       fixture.detectChanges();
       const el = fixture.debugElement.query(By.css('mat-form-field.prop2'))
                      .nativeElement;
       expect(el.classList.contains('required')).toBeTruthy();

       const dfComp = fixture.debugElement.query(By.css('gdf-prop.prop2'))
                          .componentInstance;
       expect(dfComp.required).toBeTruthy();
       expect(dfComp.propClasses.indexOf('required')).toBeGreaterThanOrEqual(0);
     }));
  it('requiredNullcase', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();
         const el = fixture.debugElement.query(By.css('mat-form-field.prop6'))
                        .nativeElement;
         expect(el.classList.contains('required')).toBeTruthy();
         setInputValueAsync('.prop5 input', 'some');
         fixture.detectChanges();
         expect(el.classList.contains('required')).toBeFalsy();

         const dfComp = fixture.debugElement.query(By.css('gdf-prop.prop6'))
                            .componentInstance;
         expect(dfComp.required).toBeFalsy();
         expect(dfComp.propClasses.indexOf('required'))
             .not.toBeGreaterThanOrEqual(0);
       });
     }));

  it('requiredNotNullcase', fakeAsync(() => {
       // query for the title <h1> by CSS element selector
       const el = fixture.debugElement.query(By.css('mat-form-field.prop8'))
                      .nativeElement;
       expect(el.classList.contains('required')).toBeFalsy();

       setInputValue('.prop7 input', 'some');
       fixture.detectChanges();
       expect(el.classList.contains('required')).toBeTruthy();

       const dfComp = fixture.debugElement.query(By.css('gdf-prop.prop8'))
                          .componentInstance;
       expect(dfComp.required).toBeTruthy();
       expect(dfComp.propClasses.indexOf('required')).toBeGreaterThanOrEqual(0);
     }));



  function setInputValueAsync(selector: string, value: string) {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }

  function setInputValue(selector: string, value: string) {
    fixture.detectChanges();
    tick();
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
    tick();
  }
});
