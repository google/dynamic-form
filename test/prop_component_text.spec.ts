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

describe('TextInput', () => {
  let comp: TestHostComponent;
  let fixture: ComponentFixture<TestHostComponent>;
  let de: DebugElement;
  let el: HTMLElement;

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
      type: 'text',
      controlType: 'text',
      dataType: 'STRING',
      label: 'second Property',
      regExp: '[a-zA-Z0-9]*',
    }),
    new Prop({
      name: 'prop3',
      type: 'text',
      controlType: 'text',
      dataType: 'STRING',
      label: 'third Property',
      regExp: '[a-zA-Z0-9]*',
      regExpErrorMsg: 'Only alphanumeric characters are allowed',
    }),
    new Prop({
      name: 'prop4',
      type: 'text',
      controlType: 'text',
      dataType: 'STRING',
      label: 'fourth Property',
      minLength: 3,
      maxLength: 10
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
    comp.inst = {prop1: 'value1'};
    fixture.detectChanges();
  });

  it('Label is shown', () => {
    // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('.prop1 mat-form-field'));
    el = de.nativeElement;
    expect(el.textContent).toContain(entity.props[0].label);
  });

  it('fieldWidth is handled', () => {
    // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('.prop1 mat-form-field'));
    el = de.nativeElement;
    expect(el.classList.contains('field-width-2')).toBeTruthy();
  });

  it('value is shown', () => {
    // query for the title <h1> by CSS element selector
    de = fixture.debugElement.query(By.css('.prop1 input'));
    el = de.nativeElement;
    expect((el as HTMLInputElement).value)
        .toEqual(comp.inst[entity.props[0].name]);
  });

  it('value is pushed to control', testasync(async () => {
       setInputValue('.prop1 input', 'value2');
       await fixture.whenStable();
       const propComp = fixture.debugElement.query(By.css('gdf-prop.prop1'))
                            .componentInstance as DynamicFieldPropertyComponent;
       expect(propComp.control.value).toEqual('value2');
       expect(comp.inst.prop1).toEqual('value1');
       propComp.pushValueToInstance();
       expect(comp.inst.prop1).toEqual('value2');
     }));

  it('pattern error', testasync(async () => {
       setInputValue('.prop2 input', 'value2');
       await fixture.whenStable();
       fixture.detectChanges();
       de = fixture.debugElement.query(By.css('gdf-prop.prop2 mat-error'));
       expect(de).toBeNull();
       setInputValue('.prop2 input', '$%^&');
       await fixture.whenStable();
       fixture.detectChanges();

       de = fixture.debugElement.query(By.css('gdf-prop.prop2 mat-error'));
       expect(de).not.toBeNull();
       el = de.nativeElement as HTMLElement;
       expect(el.textContent).toContain('Value must match pattern: ');
     }));

  it('error message for pattern', testasync(async () => {
       setInputValue('.prop3 input', '$%^&');
       await fixture.whenStable();
       fixture.detectChanges();

       de = fixture.debugElement.query(By.css('gdf-prop.prop3 mat-error'));
       expect(de).not.toBeNull();
       el = de.nativeElement as HTMLElement;
       expect(el.textContent)
           .toContain('Only alphanumeric characters are allowed');
     }));

  it('minlength', testasync(async () => {
       setInputValue('.prop4 input', 'v1');
       await fixture.whenStable();
       fixture.detectChanges();

       de = fixture.debugElement.query(By.css('gdf-prop.prop4 mat-error'));
       expect(de).not.toBeNull();
       el = de.nativeElement as HTMLElement;
       expect(el.textContent).toContain('Must have at least 3 characters');
     }));

  it('maxlength', testasync(async () => {
       setInputValue('.prop4 input', '12345678912');
       await fixture.whenStable();
       fixture.detectChanges();

       de = fixture.debugElement.query(By.css('gdf-prop.prop4 mat-error'));
       expect(de).not.toBeNull();
       el = de.nativeElement as HTMLElement;
       expect(el.textContent).toContain('Can have 10 characters at maximum');
     }));


  function setInputValue(selector: string, value: string) {
    const input = fixture.debugElement.query(By.css(selector)).nativeElement;
    input.value = value;
    input.dispatchEvent(new Event('input'));
  }
});
