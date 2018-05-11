import {Component} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';
import {By} from '@angular/platform-browser';

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
      imports: [DynamicFormModule],
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
