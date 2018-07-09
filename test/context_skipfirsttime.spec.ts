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
import {async as testasync, ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';

import {DynamicFormModule} from '../src/lib/src/dynamic_form_module';
import {Entity, NOTNULL_VALUE, NULL_VALUE, Prop, RequiredContext, SegmentedClearValueContext, SegmentedRequiredContext} from '../src/lib/src/meta_datamodel';
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

describe('SegmentedClearValueContextSKipFirstTime', () => {
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
          type: SegmentedClearValueContext.TYPE,
          srcProp: 'prop1',
          segments: new Map<string, string[]>(
              [['value1', ['prop2', 'prop3']], ['value2', ['prop4', 'prop5']]]),
          clear: true,
          skipFirstTime: true,
        },
        {
          type: SegmentedClearValueContext.TYPE,
          srcProp: 'prop6',
          segments: new Map<string, string[]>(
              [['value6', ['prop7']], ['value61', ['prop8']]]),
          clear: true,
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
    comp.inst = {
      prop1: 'value1',
      prop2: 'value2',
      prop3: 'value3',
      prop4: 'value4',
      prop5: 'value5',
      prop6: 'value6',
      prop7: 'value7',
      prop8: 'value8',
      prop9: 'value9',
    };
    fixture.detectChanges();
  });

  it('clearValueAtLoadNotSkip', testasync(async () => {
       await fixture.whenStable();
       const el =
           fixture.debugElement.query(By.css('mat-form-field.prop7 input'))
               .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('');
     }));

  it('clearValueAtLoadSkip', testasync(async () => {
       await fixture.whenStable();
       // prop 2 and prop3 are not cleared at fist time
       let el = fixture.debugElement.query(By.css('mat-form-field.prop2 input'))
                    .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('value2');

       el = fixture.debugElement.query(By.css('mat-form-field.prop3 input'))
                .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('value3');

       el = fixture.debugElement.query(By.css('mat-form-field.prop4 input'))
                .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('value4');

       el = fixture.debugElement.query(By.css('mat-form-field.prop5 input'))
                .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('value5');
     }));

  it('clearValueWhenChange', testasync(async () => {
       fixture.detectChanges();
       setInputValue('.prop1 input', 'value2');
       await fixture.whenStable();
       fixture.detectChanges();

       // clear when loading
       let el = fixture.debugElement.query(By.css('mat-form-field.prop2 input'))
                    .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('value2');

       el = fixture.debugElement.query(By.css('mat-form-field.prop3 input'))
                .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('value3');

       // clear after change
       el = fixture.debugElement.query(By.css('mat-form-field.prop4 input'))
                .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('');

       el = fixture.debugElement.query(By.css('mat-form-field.prop5 input'))
                .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('');
     }));

  function setInputValue(selector: string, value: string) {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }
});
