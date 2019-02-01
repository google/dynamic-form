/**
 * @license
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

import {ChangeDetectorRef, Component, ElementRef, EventEmitter, Injector, Input, OnDestroy, OnInit, Output} from '@angular/core';
import {AbstractControl, ControlContainer, FormArray, FormControl, FormGroup, ValidatorFn, Validators} from '@angular/forms';
import * as moment_ from 'moment';
import {Subscription} from 'rxjs';

import {PropValueSetterGetters} from './inst_service';
import {AnyType, BaseLookupValue, Entity, Prop} from './meta_datamodel';
import {assert} from './repositories';
import {AutoCompleteLookupService, EntityMetaDataRepository, LookupSources} from './repositories';

const moment = moment_;
/**
 * Editor component for property
 *
 * Example:
 * <gdf-prop [prop]="prop" [inst]="inst"></gdf-prop>
 * + prop: target {@link Prop} to edit
 * + inst: instance object from which property's value can be retrieved
 */
@Component({
  preserveWhitespaces: true,
  selector: 'gdf-prop',
  templateUrl: 'prop_component.ng.html',
})
export class DynamicFieldPropertyComponent implements OnInit, OnDestroy {
  @Input() prop: Prop;
  @Input() inst: {};

  /**
   * Developer has two approaches to specifiy prop
   * 1. use [prop]
   * 2. use [propName] and [entityName]
   * The second approach is convenient for some simple use case
   */
  @Input() propName: string;
  @Input() entityName: string;

  /**
   * Chain value change event from FormControl
   */
  // tslint:disable-next-line:no-any FormControl value can be anything
  @Output() valueChanges = new EventEmitter<any>();

  /**
   * css classes
   */
  propClasses = ['prop'];
  /**
   * FormControl
   */
  control: FormControl;

  /**
   * Used by Select to compare value from control to option
   * to decide whether an option is selected or not
   */
  compareWith: (o1: {}, o2: {}) => boolean;

  /**
   * Lookup Values used by autocomplete
   */
  autoLookupValues: BaseLookupValue[];

  /**
   * temporary to support native select
   */
  emptyLookupValue: BaseLookupValue = {
    description: 'none',
  };

  minForInput = Number.NEGATIVE_INFINITY;
  maxForInput = Number.POSITIVE_INFINITY;

  private _show = true;
  private internalLookups: BaseLookupValue[];
  private internalRequired = false;
  private subscription = new Subscription();
  private autoCompleteService: AutoCompleteLookupService;

  constructor(
      private readonly entityMetaDataRepository: EntityMetaDataRepository,
      private readonly elRef: ElementRef,
      private readonly parent: ControlContainer,
      private readonly lookupSources: LookupSources,
      private readonly propValueSetterGetters: PropValueSetterGetters,
      private readonly injector: Injector,
      private cd: ChangeDetectorRef,
  ) {
    this.compareWith =
        (option: BaseLookupValue|undefined|null,
         selected: BaseLookupValue|undefined|null) => {
          if (!option || !selected) {
            return false;
          }
          const equal = option.description === selected.description;
          return equal;
        };
  }

  get entity(): Entity {
    return this.prop.entity;
  }

  get show() {
    return this._show;
  }
  set show(value: boolean) {
    if (value === this._show) {
      return;
    }
    this._show = value;
    if (value) {
      this.elRef.nativeElement.classList.remove('hide');
    } else {
      this.elRef.nativeElement.classList.add('hide');
    }
  }

  get disabled() {
    return this.control ? this.control.disabled : false;
  }
  set disabled(value: boolean) {
    value ? this.control.disable() : this.control.enable();
  }
  get required() {
    return this.internalRequired;
  }
  set required(required: boolean) {
    if (required === this.internalRequired) {
      return;
    }
    if (required) {
      this.propClasses.push('required');
    } else {
      const index = this.propClasses.indexOf('required');
      if (index >= 0) {
        this.propClasses.splice(index, 1);
      }
    }

    this.internalRequired = required;
    this.control.clearValidators();
    this.control.setValidators(this.buildValidators());
    this.control.updateValueAndValidity();
  }

  ngOnInit() {
    if (this.propName && this.entityName) {
      this.prop = this.entityMetaDataRepository.getEntity(this.entityName)
                      .findProp(this.propName);
    } else {
      this.propName = this.prop.name;
      this.entityName = this.prop.entity.name;
    }
    this.internalRequired = this.prop.isRequired;
    if (this.prop.type === 'autocomplete') {
      // run before buildControl. buildControl uses this.
      this.setupAutocomplete();
    }
    this.control = this.buildControl();
    this.subscription.add(this.control.valueChanges.subscribe(
        value => this.valueChanges.next(value)));
    if (this.prop.type === 'autocomplete') {
      this.subscription.add(this.control.valueChanges.subscribe(
          filter => this.autoCompleteService.setFilter(filter)));
    }
    this.propClasses.push(this.prop.name);
    if (this.prop.controlType) {
      this.propClasses.push(this.prop.controlType);
    }
    if (this.prop.isRequired) {
      this.propClasses.push('required');
    }
    if (this.prop.fieldWidth > 1) {
      this.propClasses.push(`field-width-${this.prop.fieldWidth}`);
    }
    if (this.parent) {
      if (this.parent.control instanceof FormGroup) {
        (this.parent.control as FormGroup)
            .addControl(this.prop.name, this.control);
      } else if (this.parent.control instanceof FormArray) {
        (this.parent.control as FormArray).push(this.control);
      }
    }

    if (this.prop.min !== undefined) {
      this.minForInput = Number(this.prop.min);
    }
    if (this.prop.max !== undefined) {
      this.maxForInput = Number(this.prop.max);
    }

    /*
    Put this into asynchronous to work around this issue.
    https://github.com/angular/angular/issues/18004
    plunker to reproduce the issue:
      https://plnkr.co/edit/lODxTJN8qy4s5YaC1JZD?p=preview
    */
    Promise.resolve().then(() => {
      this.control.setValidators(this.buildValidators());
      this.control.updateValueAndValidity({emitEvent: false});
    });
  }

  get lookups(): BaseLookupValue[] {
    if (this.internalLookups) {
      return this.internalLookups;
    }
    return this.lookupSources.getLookupSource(assert(this.prop.lookupSrc))
        .getLookupValues(assert(this.prop.lookupName));
  }
  set lookups(lookups: BaseLookupValue[]) {
    this.internalLookups = lookups;
    const newLookup =
        this.internalLookups.find(l => this.compareWith(l, this.control.value));
    if (!newLookup) {
      this.control.setValue(null);
    }
  }

  /**
   * Push the FormControl.value to Instance
   */
  pushValueToInstance() {
    let value = this.control.value;
    if (this.prop.lookupSrc) {
      if (value === this.emptyLookupValue) {
        value = null;
      }
      value = this.lookupSources.getLookupSource(this.prop.lookupSrc)
                  .lookupValueToPropValue(value as BaseLookupValue);
    }
    if (this.prop.type === 'autocomplete' && this.autoCompleteService) {
      if (typeof value === 'string') {
        // if value is string, it is user typed, not selected value
        value = null;
      } else {
        value = this.autoCompleteService.lookupValueToPropValue(
            value as BaseLookupValue);
      }
    }
    value = this.toTypedValue(value);
    this.propValueSetterGetters.getSetterGetterForProp(this.prop).set(
        this.inst, this.prop, value);
  }

  // a typed value is needed by property
  private toTypedValue(value: AnyType) {
    if (typeof value !== 'string') {
      return value;
    }
    if (this.prop.dataType === 'NUMBER') {
      if (value === '') {
        return null;
      }
      return Number(value);
    }

    // prop value type is date, not ISO string.
    if (this.prop.controlType === 'date') {
      /*
      date is in the format YYYY-MM-DD. it is local time.
      We can't use new Date(value) since JS date treats YYYY-MM-DD
      as UTC time. moment treats it as local time.
       */
      const m = moment(value);
      if (m.isValid()) {
        return this.prop.dataType === 'DATE' ? m.toDate() : m.toISOString();
      } else {
        return this.prop.dataType === 'DATE' ? null : '';
      }
    }

    if (this.prop.controlType === 'datetime' ||
        this.prop.controlType === 'datetime-local') {
      const m = moment(value);
      if (m.isValid()) {
        return this.prop.dataType === 'DATETIME' ? m.toDate() : m.toISOString();
      } else {
        return this.prop.dataType === 'DATETIME' ? null : '';
      }
    }

    return value;
  }

  // a string value is needed by <input>
  private toStringValue(value: AnyType) {
    // tslint:disable-next-line:triple-equals check both null and undefined
    if (value == undefined || value === '') {
      return value;
    }
    if (this.prop.dataType === 'NUMBER') {
      return String(value);
    }
    // prop value type is date, not ISO string.
    if (this.prop.controlType === 'date') {
      return moment(value as string).isValid() ?
          moment(value as string).format('YYYY-MM-DD') :
          '';
    }
    if (this.prop.controlType === 'datetime' ||
        this.prop.controlType === 'datetime-local') {
      return moment(value as string).isValid() ?
          moment(value as string).format('YYYY-MM-DDTHH:ss') :
          '';
    }
    return value;
  }

  private buildControl() {
    return new FormControl(
        {value: this.getValueFromProp(), disabled: !this.prop.editable});
  }

  resetValue() {
    this.control.setValue(this.getValueFromProp());
  }
  private getValueFromProp() {
    // value from inst
    let value =
        this.propValueSetterGetters.getSetterGetterForProp(this.prop).get(
            this.inst, this.prop);
    if (this.prop.type === 'select' && this.prop.lookupSrc &&
        this.prop.lookupName && value) {
      value = this.lookupSources.getLookupSource(this.prop.lookupSrc)
                  .propValueToLookupValue(this.prop.lookupName, value);
    }
    if (this.prop.type === 'autocomplete' && value) {
      // set value at a later time. Need to go server to resolve value
      this.autoCompleteService.resolvePropValue(value).then(lookupValue => {
        if (!lookupValue) {
          return;
        }
        this.autoLookupValues = [lookupValue];
        this.control.setValue(lookupValue);
        this.cd.detectChanges();
      });
      value = undefined;
    }
    value = this.toStringValue(value);
    return value;
  }
  protected buildValidators() {
    const validators = new Array<ValidatorFn>();
    if (this.internalRequired) {
      validators.push(Validators.required);
    }
    if (this.internalRequired && this.prop.type === 'select') {
      validators.push(this.getDropdownRequiredValidatorFn());
    }
    if (this.internalRequired && this.prop.type === 'autocomplete') {
      validators.push(this.getDropdownRequiredValidatorFnForAutoComplete());
    }
    if (this.prop.min !== undefined) {
      validators.push(Validators.min(this.prop.min));
    }
    if (this.prop.max !== undefined) {
      validators.push(Validators.max(this.prop.max));
    }
    if (this.prop.minLength !== undefined) {
      validators.push(Validators.minLength(this.prop.minLength));
    }
    if (this.prop.maxLength !== undefined) {
      validators.push(Validators.maxLength(this.prop.maxLength));
    }
    if (this.prop.controlType === 'email') {
      validators.push(Validators.email);
    }
    if (this.prop.regExp) {
      validators.push(Validators.pattern(this.prop.regExp));
    }
    return validators;
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  //-----------------------autocomplete support
  /**
   * Used to display the selected Lookup for AutoComplete
   */
  displayFn(lookupvalue?: BaseLookupValue): string|undefined {
    return lookupvalue ? lookupvalue.description : undefined;
  }

  setupAutocomplete() {
    let serviceName = this.prop.autoCompleteService;
    if (!serviceName) {
      serviceName = `${this.prop.entity.name}_${this.prop.name}`;
    }
    this.autoCompleteService =
        // TODO(jjzhang) figure out how to workaround deprecation later
        // tslint:disable-next-line:deprecation later
        this.injector.get(serviceName) as AutoCompleteLookupService;
    this.subscription.add(
        this.autoCompleteService.getLookups().subscribe(lookups => {
          this.autoLookupValues = lookups;
          if (this.control.value && typeof this.control.value !== 'string') {
            /*
            Keep the old selected value
            This only occurs in rare case.
            */
            const desc = (this.control.value as BaseLookupValue).description;
            if (!this.autoLookupValues.find(v => v.description === desc)) {
              this.autoLookupValues.push(this.control.value);
            }
          }
          this.cd.detectChanges();
        }));
  }

  getDropdownRequiredValidatorFn() {
    return (c: AbstractControl) => {
      return (c.value === this.emptyLookupValue) ? {'required': true} : null;
    };
  }

  getDropdownRequiredValidatorFnForAutoComplete() {
    return (c: AbstractControl) => {
      return (typeof c.value === 'string' && c.value) ?
          {'requiredSelect': true} :
          null;
    };
  }
}
