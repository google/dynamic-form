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

import {Component, DebugElement} from '@angular/core';
import {async as testasync, ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';
import * as moment_ from 'moment';

import {DynamicFormModule} from '../src/lib/src/dynamic_form_module';
import {InstEditorComponent} from '../src/lib/src/inst_editor';
import {Entity, Prop} from '../src/lib/src/meta_datamodel';
import {EntityMetaDataRepository} from '../src/lib/src/repositories';

const moment = moment_;
/**
 * Host component to test prop_component.ts
 */
@Component({
  preserveWhitespaces: true,
  template: `
  <form   >
    <inst-editor entityName="test" [inst]="inst"></inst-editor>
  </form>
  `
})
export class TestHostComponent {
  props: Prop[];
  // tslint:disable-next-line:no-any property value can be anything
  inst: {[index: string]: any};
}

describe('DateInput', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const entity = new Entity('test', [
    new Prop({
      name: 'prop1',
      type: 'text',
      controlType: 'date',
      dataType: 'DATE',
      label: 'first Property',
    }),
    new Prop({
      name: 'prop2',
      type: 'text',
      controlType: 'date',
      dataType: 'STRING',
      label: 'second Property',
    }),
    new Prop({
      name: 'prop3',
      type: 'text',
      controlType: 'datetime-local',
      dataType: 'DATETIME',
      label: 'third Property',
    }),
    new Prop({
      name: 'prop4',
      type: 'text',
      controlType: 'datetime-local',
      dataType: 'STRING',
      label: 'fourth Property',
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

    fixture = TestBed.createComponent(TestHostComponent);
    comp = fixture.componentInstance;
    comp.props = entity.props;
    comp.inst = {};
    fixture.detectChanges();
  });


  it('DateValueSetCorrecty', testasync(async () => {
       const d = new Date();
       comp.inst['prop1'] = d;
       comp.inst['prop2'] = d.toISOString();
       await fixture.whenStable();
       fixture.detectChanges();

       de = fixture.debugElement.query(By.css('.prop1 input'));
       el = de.nativeElement;
       expect((el as HTMLInputElement).value)
           .toEqual(moment(d).format('YYYY-MM-DD'));

       de = fixture.debugElement.query(By.css('.prop2 input'));
       el = de.nativeElement;
       expect((el as HTMLInputElement).value)
           .toEqual(moment(d).format('YYYY-MM-DD'));
     }));

  it('EmptyDateInput', testasync(async () => {
       await fixture.whenStable();
       fixture.detectChanges();

       comp.inst['prop1'] = '';
       comp.inst['prop2'] = '';

       const degugElement = fixture.debugElement.query(By.css('inst-editor'));
       const instEditor = degugElement.componentInstance as InstEditorComponent;
       instEditor.pushValueToInstance();

       expect(comp.inst.prop1).toBeUndefined();
       expect(comp.inst.prop2).toBeUndefined();
     }));

  it('userErrorCase', testasync(async () => {
       const d = new Date();
       // prop1 is supposed to be Date type.
       comp.inst['prop1'] = d.toISOString();
       comp.inst['prop2'] = d.toISOString();
       await fixture.whenStable();
       fixture.detectChanges();

       de = fixture.debugElement.query(By.css('.prop1 input'));
       el = de.nativeElement;
       expect((el as HTMLInputElement).value)
           .toEqual(moment(d).format('YYYY-MM-DD'));
     }));

  it('DateTimeValueSetCorrecty', testasync(async () => {
       const d = new Date();
       comp.inst['prop3'] = d;
       comp.inst['prop4'] = d.toISOString();
       await fixture.whenStable();
       fixture.detectChanges();

       de = fixture.debugElement.query(By.css('.prop3 input'));
       el = de.nativeElement;
       expect((el as HTMLInputElement).value)
           .toEqual(moment(d).format('YYYY-MM-DDTHH:ss'));

       de = fixture.debugElement.query(By.css('.prop4 input'));
       el = de.nativeElement;
       expect((el as HTMLInputElement).value)
           .toEqual(moment(d).format('YYYY-MM-DDTHH:ss'));
     }));

  it('userErrorCaseDateTime', testasync(async () => {
       const d = new Date();
       // prop3 is supposed to be Date type.
       comp.inst['prop3'] = d.toISOString();
       comp.inst['prop4'] = d.toISOString();
       await fixture.whenStable();
       fixture.detectChanges();

       de = fixture.debugElement.query(By.css('.prop3 input'));
       el = de.nativeElement;
       expect((el as HTMLInputElement).value)
           .toEqual(moment(d).format('YYYY-MM-DDTHH:ss'));
     }));
});
