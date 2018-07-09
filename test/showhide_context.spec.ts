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
import {MatSlideToggle} from '@angular/material';
import {By} from '@angular/platform-browser';

import {DynamicFormModule} from '../src/lib/src/dynamic_form_module';
import {Entity, NOTNULL_VALUE, NULL_VALUE, Prop, RequiredContext, ShowHideContext} from '../src/lib/src/meta_datamodel';
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
  `,
  styles: [`
  gdf-prop.hide {
  display:none;
  }
  `]
})
export class TestHostComponent {
  props: Prop[];
  // tslint:disable-next-line:no-any property value can be anything
  inst: {[index: string]: any};
}

describe('ShowHideContext', () => {
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
          type: 'checkbox',
          controlType: 'text',
          dataType: 'BOOLEAN',
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
      ],

      [
        {
          type: ShowHideContext.TYPE,
          srcProp: 'prop1',
          srcValue: 'value1',
          target: 'prop2',
          show: false,
          skipFirstTime: false,
        },
        {
          type: ShowHideContext.TYPE,
          srcProp: 'prop3',
          srcValue: 'true',
          target: 'prop4',
          show: true,
          skipFirstTime: false,
        },
        {
          type: ShowHideContext.TYPE,
          srcProp: 'prop5',
          srcValue: NULL_VALUE,
          target: 'prop6',
          show: true,
          skipFirstTime: false,
        },
        {
          type: ShowHideContext.TYPE,
          srcProp: 'prop7',
          srcValue: NOTNULL_VALUE,
          target: 'prop8',
          show: true,
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
    comp.inst = {prop1: 'value1', prop3: true};
    fixture.detectChanges();
  });

  /*
   *1. test show=false is handled correctly.
   *2. test Show/Hide is processed at loading
   */
  it('Prop2NotShownByDefault', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();
         const el =
             fixture.debugElement.query(By.css('gdf-prop.prop2')).nativeElement;
         expect(el.classList.contains('hide')).toBeTruthy();
         expect(el.offsetParent).toBeNull();
       });
     }));

  /*
   * Show/Hide is processed when value is changed
   */
  it('ShowProp2', fakeAsync(() => {
       setInputValue('.prop1 input', 'value2');
       fixture.detectChanges();
       const el =
           fixture.debugElement.query(By.css('gdf-prop.prop2')).nativeElement;
       expect(el.classList.contains('hide')).toBeFalsy();
       expect(el.offsetParent).not.toBeNull();
     }));
  /*
   * Show/Hide can depends on checkBox
   */
  it('Prop4ShownByDefault', () => {
    const el =
        fixture.debugElement.query(By.css('gdf-prop.prop4')).nativeElement;
    expect(el.classList.contains('hide')).toBeFalsy();
    expect(el.offsetParent).not.toBeNull();
  });

  /*
   * Can update show/hide on checkbox
   */
  it('HideProp4', fakeAsync(() => {
       // toggle prop3 to false;
       const de = fixture.debugElement.query(By.css('.prop3 mat-slide-toggle'));
       de.query(By.css('input')).nativeElement.click();
       fixture.detectChanges();

       const el =
           fixture.debugElement.query(By.css('gdf-prop.prop4')).nativeElement;
       expect(el.classList.contains('hide')).toBeTruthy();
       expect(el.offsetParent).toBeNull();
     }));
  /*
   * null value can be processed properly
   */
  it('ShowHideProp6ByNull', fakeAsync(() => {
       // prop6 is shown by default since prop5 has no default value
       const prop6El =
           fixture.debugElement.query(By.css('gdf-prop.prop6')).nativeElement;
       expect(prop6El.classList.contains('hide')).toBeFalsy();
       expect(prop6El.offsetParent).not.toBeNull();

       // give a value to prop5
       setInputValue('.prop5 input', 'some value');
       fixture.detectChanges();
       expect(prop6El.classList.contains('hide')).toBeTruthy();
       expect(prop6El.offsetParent).toBeNull();
     }));
  /*
   * Not Null value can be processed properly
   */
  it('HideShowProp8ByNotNull', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();
         // prop8 is hidden by default since prop7 has no default value
         const prop8El =
             fixture.debugElement.query(By.css('gdf-prop.prop8')).nativeElement;
         expect(prop8El.classList.contains('hide')).toBeTruthy();
         expect(prop8El.offsetParent).toBeNull();

         // give a value to prop5
         setInputValueAsync('.prop7 input', 'some value');
         fixture.detectChanges();
         expect(prop8El.classList.contains('hide')).toBeFalsy();
         expect(prop8El.offsetParent).not.toBeNull();
       });
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
