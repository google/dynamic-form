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
import {DisableContext, Entity, NOTNULL_VALUE, Prop} from '../src/lib/src/meta_datamodel';
import {DynamicFieldPropertyComponent} from '../src/lib/src/prop_component';
import {EntityMetaDataRepository, LookupSources} from '../src/lib/src/repositories';

import {ExampleLookupSrc} from './example_lookupsrc';

/**
 * Host component to test prop_component.ts
 */
@Component({
  preserveWhitespaces: true,
  template: `
  <form>
    <inst-editor entityName="test" [inst]="inst"></inst-editor>
  </form>
  `
})
export class TestHostComponent {
  props: Prop[];
  // tslint:disable-next-line:no-any property value can be anything
  inst: {[index: string]: any};
}

describe('InstEditorTest', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  const entity = new Entity(
      'test',
      [
        new Prop({
          name: 'id',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: 'id property',
          editable: false,
        }),
        new Prop({
          name: 'prop1',
          type: 'text',
          controlType: 'text',
          dataType: 'STRING',
          label: 'first Property',
          fieldWidth: 2,
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

      ],
      [{
        type: DisableContext.TYPE,
        srcs: new Map<string, string>([['id', NOTNULL_VALUE]]),
        relation: 'and',
        target: 'prop4',
        disable: true,
        skipFirstTime: false,
      }],
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
    comp.inst = {
      id: '',
      prop1: 'value1',
      prop2: 'value2',
      prop3: 'value3',
      prop4: 'value4',
    };
    fixture.detectChanges();
  });

  it('basic', testasync(() => {
       // prop 2 and prop3 are not cleared at fist time
       let el = fixture.debugElement.query(By.css('mat-form-field.prop1 input'))
                    .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('value1');

       el = fixture.debugElement.query(By.css('mat-form-field.prop2 input'))
                .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('value2');

       el = fixture.debugElement.query(By.css('mat-form-field.prop3 input'))
                .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('value3');

       el = fixture.debugElement.query(By.css('mat-form-field.prop4 input'))
                .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('value4');
     }));

  it('swapInstanceToBeEditted', testasync(async () => {
       comp.inst = {
         id: '',
         prop1: 'new value1',
         prop2: 'new value2',
         prop3: 'new value3',
         prop4: 'new value4',
       };
       fixture.detectChanges();
       await fixture.whenStable();
       fixture.detectChanges();

       // clear when loading
       const el =
           fixture.debugElement.query(By.css('mat-form-field.prop1 input'))
               .nativeElement as HTMLInputElement;
       expect(el.value).toEqual('new value1');
     }));

  /* If the id is not null, prop4is disabled after switch. */
  it('swapInstanceContext', testasync(async () => {
       let el = fixture.debugElement.query(By.css('mat-form-field.prop4 input'))
                    .nativeElement;
       expect(el.disabled).toBeFalsy();
       comp.inst = {
         id: '1',
         prop1: 'new value1',
         prop2: 'new value2',
         prop3: 'new value3',
         prop4: 'new value4',
       };
       fixture.detectChanges();
       await fixture.whenStable();
       fixture.detectChanges();

       el = fixture.debugElement.query(By.css('mat-form-field.prop4 input'))
                .nativeElement;
       expect(el.disabled).toBeTruthy();
     }));
});
