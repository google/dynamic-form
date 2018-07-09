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

import {DatePipe, DecimalPipe} from '@angular/common';
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
  <inst-viewer entityName="test" [inst]="inst" [showLabel]="showLabel" class="full"></inst-viewer>
  `
})
export class TestHostComponent {
  showLabel = true;
  props: Prop[];
  // tslint:disable-next-line:no-any property value can be anything
  inst: {[index: string]: any};
}

describe('InstViewerTest', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  const date = new Date(2018, 3, 8);
  const entity = new Entity('test', [
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
      type: 'select',
      controlType: 'text',
      dataType: 'STRING',
      label: 'second Property',
      lookupSrc: ExampleLookupSrc.NAME,
      lookupName: 'currencies',
    }),
    new Prop({
      name: 'prop3',
      type: 'checkbox',
      controlType: 'checkbox',
      dataType: 'BOOLEAN',
      label: 'fourth property',
    }),
    new Prop({
      name: 'prop4',
      type: 'text',
      controlType: 'date',
      dataType: 'DATE',
      label: 'fourth property',
    }),
    new Prop({
      name: 'prop41',
      type: 'text',
      controlType: 'date',
      dataType: 'STRING',
      label: 'date as string property',
    }),
    new Prop({
      name: 'prop5',
      type: 'text',
      controlType: 'datetime-local',
      dataType: 'DATETIME',
      label: 'fifth property',
    }),
    new Prop({
      name: 'prop6',
      type: 'text',
      controlType: 'number',
      dataType: 'NUMBER',
      label: 'sixth property',
    }),
    new Prop({
      name: 'prop7',
      type: 'text',
      controlType: 'number',
      dataType: 'STRING',
      label: 'seventh property',
    }),
    new Prop({
      name: 'prop8',
      type: 'text',
      controlType: 'number',
      dataType: 'NUMBER',
      label: 'eigth property',
      format: '1.0-2',
    }),
  ]);

  // configure
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [DynamicFormModule, NoopAnimationsModule],
      declarations: [TestHostComponent],
      providers: [DatePipe],
    });

    // initialize meta data
    TestBed.get(EntityMetaDataRepository).registerMetaData(entity);
    TestBed.get(LookupSources)
        .registerLookupSource(ExampleLookupSrc.NAME, new ExampleLookupSrc());
    fixture = TestBed.createComponent(TestHostComponent);


    comp = fixture.componentInstance;
    comp.props = entity.props;
    comp.inst = {
      prop1: 'value1',
      prop2: 'USD',
      prop3: true,
      prop4: date,
      prop41: date.toISOString(),
      prop5: date,
      prop6: 6,
      prop7: '6.35674321',
      prop8: 6.35674321,
    };
    fixture.detectChanges();
  });

  it('showLabel', testasync(() => {
       const des = fixture.debugElement.queryAll(
           By.css('gdf-prop-viewer span.prop span.label'));
       expect(des.length).toEqual(entity.props.length);

       const label1 =
           fixture.debugElement
               .query(By.css('gdf-prop-viewer.prop1 span.prop span.label'))
               .nativeElement as HTMLInputElement;
       const textvalue = label1.textContent || '';
       expect(textvalue.trim()).toEqual(entity.props[0].label + ':');
     }));

  it('FieldWidth is handled', testasync(() => {
       const des = fixture.debugElement.queryAll(
           By.css('gdf-prop-viewer span.prop.field-width-2'));
       expect(des.length).toEqual(1);
     }));

  it('NotshowLabel', testasync(async () => {
       comp.showLabel = false;
       fixture.detectChanges();
       await fixture.whenStable();

       const des = fixture.debugElement.queryAll(
           By.css('gdf-prop-viewer span.prop span.label'));
       expect(des.length).toEqual(0);
     }));


  it('basicText', testasync(() => {
       const el =
           fixture.debugElement
               .query(By.css('gdf-prop-viewer.prop1 span.prop span.value'))
               .nativeElement as HTMLInputElement;
       const textvalue = el.textContent || '';
       expect(textvalue.trim()).toEqual('value1');
     }));

  it('lookupDescritionIsShown', testasync(() => {
       const el =
           fixture.debugElement
               .query(By.css('gdf-prop-viewer.prop2 span.prop span.value'))
               .nativeElement as HTMLInputElement;
       const textvalue = el.textContent || '';
       expect(textvalue.trim()).toEqual('US Dollar');
     }));

  it('checkboxShowYesNo', testasync(() => {
       const el =
           fixture.debugElement
               .query(By.css('gdf-prop-viewer.prop3 span.prop span.value'))
               .nativeElement as HTMLInputElement;
       const textvalue = el.textContent || '';
       expect(textvalue.trim()).toEqual('Yes');
     }));
  it('dateFormat', testasync(() => {
       const datePipe = TestBed.get(DatePipe);
       let el = fixture.debugElement
                    .query(By.css('gdf-prop-viewer.prop4 span.prop span.value'))
                    .nativeElement as HTMLInputElement;
       let textvalue = el.textContent || '';
       expect(textvalue.trim()).toEqual(datePipe.transform(date, 'mediumDate'));

       // prop41 is a date as string which will be converted to Date before
       // display
       el = fixture.debugElement
                .query(By.css('gdf-prop-viewer.prop41 span.prop span.value'))
                .nativeElement as HTMLInputElement;
       textvalue = el.textContent || '';
       expect(textvalue.trim()).toEqual(datePipe.transform(date, 'mediumDate'));

       el = fixture.debugElement
                .query(By.css('gdf-prop-viewer.prop5 span.prop span.value'))
                .nativeElement as HTMLInputElement;
       textvalue = el.textContent || '';
       expect(textvalue.trim()).toEqual(datePipe.transform(date, 'medium'));
     }));
  it('numberRound', testasync(() => {
       let el = fixture.debugElement
                    .query(By.css('gdf-prop-viewer.prop6 span.prop span.value'))
                    .nativeElement as HTMLInputElement;
       let textvalue = el.textContent || '';
       expect(textvalue.trim()).toEqual('6');

       // prop7 is a number, but its data type from server is number
       el = fixture.debugElement
                .query(By.css('gdf-prop-viewer.prop7 span.prop span.value'))
                .nativeElement as HTMLInputElement;
       textvalue = el.textContent || '';
       expect(textvalue.trim()).toEqual('6.357');

       el = fixture.debugElement
                .query(By.css('gdf-prop-viewer.prop8 span.prop span.value'))
                .nativeElement as HTMLInputElement;
       textvalue = el.textContent || '';
       expect(textvalue.trim()).toEqual('6.36');
     }));
});
