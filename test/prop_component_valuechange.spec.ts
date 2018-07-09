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
import {ComponentFixture, fakeAsync, TestBed, tick} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {By} from '@angular/platform-browser';


import {DynamicFormModule} from '../src/lib/src/dynamic_form_module';
import {Entity, Prop} from '../src/lib/src/meta_datamodel';
import {DynamicFieldPropertyComponent} from '../src/lib/src/prop_component';
import {EntityMetaDataRepository} from '../src/lib/src/repositories';


/**
 * Host component to test prop_component.ts
 */
@Component({
  preserveWhitespaces: true,
  template: `
  <form >
    <gdf-prop [prop]="prop" [inst]="inst" (valueChanges)="valueChanged($event)"></gdf-prop>
  </form>
  `
})
export class TestHostComponent {
  prop: Prop;
  // tslint:disable-next-line:no-any property value can be anything
  inst: {[index: string]: any};
  @ViewChild(DynamicFieldPropertyComponent)
  propComp: DynamicFieldPropertyComponent;

  newvalue: string|undefined;
  valueChanged(value: string) {
    this.newvalue = value;
  }

  constructor() {}
}

describe('ValueChange', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const entity = new Entity('test', [new Prop({
                              name: 'prop1',
                              type: 'text',
                              controlType: 'number',
                              dataType: 'NUMBER',
                              label: 'first Property',
                            })]);

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
    comp.prop = entity.props[0];
    comp.inst = {prop1: 3};
    fixture.detectChanges();
  });

  it('value change is invoked', fakeAsync(() => {
       expect(comp.newvalue).toBeUndefined();
       setInputValue('input', '5');
       expect(comp.propComp.control.value).toEqual('5');
       expect(comp.newvalue).toEqual('5');
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
