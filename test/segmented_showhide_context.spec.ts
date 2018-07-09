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
import {Entity, NOTNULL_VALUE, NULL_VALUE, Prop, RequiredContext, SegmentedShowHideContext, ShowHideContext} from '../src/lib/src/meta_datamodel';
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

describe('SegmentedShowHideContext', () => {
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
          type: SegmentedShowHideContext.TYPE,
          srcProp: 'prop1',
          segments: new Map<string, string[]>(
              [['value1', ['prop2', 'prop3']], ['value2', ['prop4', 'prop5']]]),
          show: true,
          skipFirstTime: false,
          resetWhenShow: true,
        },
        {
          type: SegmentedShowHideContext.TYPE,
          srcProp: 'prop6',
          segments: new Map<string, string[]>([
            ['value61', ['prop7', 'prop8']], ['value62', ['prop7', 'prop9']]
          ]),
          show: true,
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

  it('PropShowAtDefault', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();

         // prop2 and prop3 are shown
         let el =
             fixture.debugElement.query(By.css('gdf-prop.prop2')).nativeElement;
         expect(el.classList.contains('hide')).toBeFalsy();
         expect(el.offsetParent).not.toBeNull();

         el =
             fixture.debugElement.query(By.css('gdf-prop.prop3')).nativeElement;
         expect(el.classList.contains('hide')).toBeFalsy();
         expect(el.offsetParent).not.toBeNull();

         // prop4 and prop5 are hidden
         el =
             fixture.debugElement.query(By.css('gdf-prop.prop4')).nativeElement;
         expect(el.classList.contains('hide')).toBeTruthy();
         expect(el.offsetParent).toBeNull();

         el =
             fixture.debugElement.query(By.css('gdf-prop.prop5')).nativeElement;
         expect(el.classList.contains('hide')).toBeTruthy();
         expect(el.offsetParent).toBeNull();
       });
     }));

  it('ChangeShowHide', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();

         setInputValueAsync('.prop1 input', 'value2');
         fixture.detectChanges();
         // prop4 and prop5 are shown
         let el =
             fixture.debugElement.query(By.css('gdf-prop.prop4')).nativeElement;
         expect(el.classList.contains('hide')).toBeFalsy();
         expect(el.offsetParent).not.toBeNull();

         el =
             fixture.debugElement.query(By.css('gdf-prop.prop5')).nativeElement;
         expect(el.classList.contains('hide')).toBeFalsy();
         expect(el.offsetParent).not.toBeNull();

         // prop2 and prop3 are hidden
         el =
             fixture.debugElement.query(By.css('gdf-prop.prop2')).nativeElement;
         expect(el.classList.contains('hide')).toBeTruthy();
         expect(el.offsetParent).toBeNull();

         el =
             fixture.debugElement.query(By.css('gdf-prop.prop3')).nativeElement;
         expect(el.classList.contains('hide')).toBeTruthy();
         expect(el.offsetParent).toBeNull();
       });
     }));

  it('resetWhenShow', async(() => {
       fixture.detectChanges();


       fixture.whenStable().then(() => {
         fixture.detectChanges();

         const input4 =
             fixture.debugElement.query(By.css('gdf-prop.prop4 input'))
                 .nativeElement as HTMLInputElement;

         expect(input4.value).toEqual('');

         comp.inst.prop4 = 'text 4';
         setInputValueAsync('.prop1 input', 'value2');
         fixture.detectChanges();
         // prop4 and prop5 are shown
         const el =
             fixture.debugElement.query(By.css('gdf-prop.prop4')).nativeElement;
         expect(el.classList.contains('hide')).toBeFalsy();
         expect(el.offsetParent).not.toBeNull();
         expect(input4.value).toEqual('text 4');
       });
     }));

  /*
 Prop7 is shown up when prop6 is value61
 */
  it('PropShowAtDefaultForPropertyOverlap', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();

         // prop7 and prop8 is shown
         let el =
             fixture.debugElement.query(By.css('gdf-prop.prop7')).nativeElement;
         expect(el.classList.contains('hide')).toBeFalsy();
         expect(el.offsetParent).not.toBeNull();

         el =
             fixture.debugElement.query(By.css('gdf-prop.prop8')).nativeElement;
         expect(el.classList.contains('hide')).toBeFalsy();
         expect(el.offsetParent).not.toBeNull();

         // prop9 is hidden
         el =
             fixture.debugElement.query(By.css('gdf-prop.prop9')).nativeElement;
         expect(el.classList.contains('hide')).toBeTruthy();
         expect(el.offsetParent).toBeNull();
       });
     }));

  /*
   Prop7 is still shown up when prop6 is changed from value61 to value62.
   It is associated with both values
   */
  it('ChangeShowHideForPropertyOverlap', async(() => {
       fixture.detectChanges();
       fixture.whenStable().then(() => {
         fixture.detectChanges();

         setInputValueAsync('.prop6 input', 'value62');
         fixture.detectChanges();
         // prop7 and prop9 are shown
         let el =
             fixture.debugElement.query(By.css('gdf-prop.prop7')).nativeElement;
         expect(el.classList.contains('hide')).toBeFalsy();
         expect(el.offsetParent).not.toBeNull();

         el =
             fixture.debugElement.query(By.css('gdf-prop.prop9')).nativeElement;
         expect(el.classList.contains('hide')).toBeFalsy();
         expect(el.offsetParent).not.toBeNull();

         // prop 8 is hidden
         el =
             fixture.debugElement.query(By.css('gdf-prop.prop8')).nativeElement;
         expect(el.classList.contains('hide')).toBeTruthy();
         expect(el.offsetParent).toBeNull();
       });
     }));

  function setInputValueAsync(selector: string, value: string) {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }
});
