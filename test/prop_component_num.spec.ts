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
import {Entity, Prop} from '../src/lib/src/meta_datamodel';
import {DynamicFieldPropertyComponent} from '../src/lib/src/prop_component';
import {EntityMetaDataRepository} from '../src/lib/src/repositories';


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

describe('NumberInput', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let de: DebugElement;
  let el: HTMLElement;

  const entity = new Entity('test', [
    new Prop({
      name: 'prop1',
      type: 'text',
      controlType: 'number',
      dataType: 'NUMBER',
      label: 'first Property',
      min: 3,
      max: 10
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
    comp.inst = {prop1: 3};
    fixture.detectChanges();
  });


  it('value is shown', () => {
    de = fixture.debugElement.query(By.css('.prop1 input'));
    el = de.nativeElement;
    expect((el as HTMLInputElement).value)
        .toEqual(String(comp.inst[entity.props[0].name]));
  });

  it('value is pushed to control', async () => {
    setInputValue('.prop1 input', '5');
    await fixture.whenStable();
    const propComp =
        fixture.debugElement.query(By.css('gdf-prop')).componentInstance as
        DynamicFieldPropertyComponent;
    expect(propComp.control.value).toEqual('5');
  });

  it('min', async () => {
    setInputValue('.prop1 input', '2');
    await fixture.whenStable();
    fixture.detectChanges();
    comp =
        fixture.debugElement.query(By.css('gdf-prop.prop1')).componentInstance;
    de = fixture.debugElement.query(By.css('gdf-prop.prop1 mat-error'));
    expect(de).not.toBeNull();
    el = de.nativeElement as HTMLElement;
    expect(el.textContent).toContain('minimal allowed value: 3');
  });

  it('max', testasync(async () => {
       setInputValue('.prop1 input', '12');
       await fixture.whenStable();
       fixture.detectChanges();

       de = fixture.debugElement.query(By.css('gdf-prop.prop1 mat-error'));
       expect(de).not.toBeNull();
       el = de.nativeElement as HTMLElement;
       expect(el.textContent).toContain('maximal allowed value: 10');
     }));

  function setInputValue(selector: string, value: string) {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }
});
