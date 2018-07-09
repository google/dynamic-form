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
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';
import {MatSlideToggle} from '@angular/material';
import {By} from '@angular/platform-browser';

import {DynamicFormModule} from '../src/lib/src/dynamic_form_module';
import {Entity, Prop} from '../src/lib/src/meta_datamodel';
import {DynamicFieldPropertyComponent} from '../src/lib/src/prop_component';
import {EntityMetaDataRepository} from '../src/lib/src/repositories';

/**
 * Host component to test prop_component.ts
 */
@Component({
  template: `
  <form >
    <gdf-prop [prop]="prop" [inst]="inst"></gdf-prop>
  </form>
  `
})
export class TestHostComponent {
  prop: Prop;
  // tslint:disable-next-line:no-any property value can be anything
  inst: {[index: string]: any};
  @ViewChild(DynamicFieldPropertyComponent)
  propComp: DynamicFieldPropertyComponent;


  constructor() {}
}

describe('BooleanInput', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const entity = new Entity('test', [new Prop({
                              name: 'prop1',
                              type: 'checkbox',
                              controlType: 'boolean',
                              dataType: 'BOOLEAN',
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
    comp.inst = {prop1: true};
    fixture.detectChanges();
  });


  it('valueIsShown', () => {
    // query for the title <h1> by CSS element selector
    const de = fixture.debugElement.query(By.css('mat-slide-toggle'));
    expect(de).not.toBeNull();
    const toggler = de.componentInstance as MatSlideToggle;
    expect(toggler.checked).toBeTruthy();
  });

  it('toggle', () => {
    // query for the title <h1> by CSS element selector
    const de = fixture.debugElement.query(By.css('mat-slide-toggle'));

    const toggler = de.componentInstance as MatSlideToggle;
    fixture.debugElement.query(By.css('input')).nativeElement.click();
    expect(toggler.checked).not.toBeTruthy();
  });
});
