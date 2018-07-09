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

import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';
import {NoopAnimationsModule} from '@angular/platform-browser/animations';

import {DynamicFormModule} from '../src/lib/src/dynamic_form_module';
import {Entity, Prop} from '../src/lib/src/meta_datamodel';
import {EntityMetaDataRepository} from '../src/lib/src/repositories';

/**
 * Host component to test prop_component.ts
 */
@Component({
  template: `
  <form >
    <gdf-prop propName="prop1" [inst]="inst" entityName="test"></gdf-prop>
    <gdf-prop-viewer propName="prop1" [inst]="inst" entityName="test">
    </gdf-prop-viewer>
  </form>
  `
})
export class TestHostComponent {
  // tslint:disable-next-line:no-any can be any, test only
  inst: {[index: string]: any};
  constructor() {}
}

describe('BooleanInput', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;

  const entity = new Entity('test', [new Prop({
                              name: 'prop1',
                              type: 'text',
                              controlType: 'text',
                              dataType: 'STRING',
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
    comp.inst = {prop1: 'property 1'};
    fixture.detectChanges();
  });


  it('propEditor', () => {
    // query for the title <h1> by CSS element selector
    const de = fixture.debugElement.query(By.css('gdf-prop input'));
    expect(de).not.toBeNull();
    const el = de.nativeElement as HTMLInputElement;
    expect(el.value).toEqual('property 1');
  });

  it('propViewer', () => {
    // query for the title <h1> by CSS element selector
    const de = fixture.debugElement.query(By.css('gdf-prop-viewer span.value'));
    expect(de).not.toBeNull();
    const el = de.nativeElement as HTMLElement;
    const textContent = el.textContent || '';
    expect(textContent.trim()).toEqual('property 1');
  });
});
