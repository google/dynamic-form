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

// Define type used by the system
export type UIType =
    'text'|'select'|'checkbox'|'radio'|'textarea'|'autocomplete';
export type DATAType = 'STRING'|'NUMBER'|'BOOLEAN'|'DATE'|'DATETIME';

export declare interface PropInterface {
  name: string;
  /**
   * This is used to decide what input to show.
   */
  type?: UIType;
  label: string;
  description?: string;
  /**
   * When UIType is text,
   * this type is passed to the type attribute to <input> element
   * the type can be email|url|date|datetime ...
   */
  controlType?: string;
  /**
   * min and max are constraint when controlType is number.
   */
  min?: number;
  max?: number;
  /**
   * minLength, maxLength are constraint when controlType is text
   */
  minLength?: number;
  maxLength?: number;
  isRequired?: boolean;
  /**
   * regular expression constraint.
   */
  regExp?: string;
  /**
   * Error Message for regular expression
   */
  regExpErrorMsg?: string;

  /**
   * Ad hoc tag attached to this property.
   * Client can use it for any purpose.
   */
  tags?: Map<string, string>;

  /**
   * Whether show this proprerty in editor view
   */
  showInEditor?: boolean;
  /**
   * Whether show this property in view
   */
  showInViewer?: boolean;

  /**
   * Wether this field is editable or not.
   * If not, it will be dsabled when showInEditor
   */
  editable?: boolean;
  viewable?: boolean;
  defaultValue?: string;

  /**
   * When UIType is select, lookupName and lookupSrc are used to
   * indicate when the drop list comes from
   */
  lookupName?: string;
  lookupSrc?: string;
  /**
   * Property value object type like number, date,
   * Explanation using date as an example:
   * Tne property is a date from UI perspective. UI will show a datePicker.
   * However the property value could be represented as a ISOString or
   * a Date object. This dataType specifies the property value type.
   */
  dataType?: DATAType;
  /**
   * Where this property definition comes from.
   * reserved value: predefined.
   */
  source?: string;

  /**
   * format for display date, dateTime, number
   * reference: https://angular.io/api/common/DatePipe,
   * https://angular.io/api/common/DecimalPipe
   */
  format?: string;
  /**
   * any information. Only specific client knows how to interpret it.
   * For example, product entity use this attribute to attach lookup
   * information.
   */
  // tslint:disable:no-any can be anything
  other?: any;

  /**
   * How wide this field should be:
   *
   * The unit is one default form field
   */
  fieldWidth?: number;

  /**
   * Service used to support angular material autocomplete
   */
  autoCompleteService?: string;
}
/**
 * Property definition
 */
export class Prop implements PropInterface {
  entity: Entity;

  name: string;
  /**
   * This is used to decide what input to show.
   */
  type: UIType;
  label: string;
  description?: string;
  /**
   * When UIType is text,
   * this type is passed to the type attribute to <input> element
   * the type can be email|url|date|datetime ...
   */
  controlType?: string;
  /**
   * min and max are constraint when controlType is number.
   */
  min?: number;
  max?: number;
  /**
   * minLength, maxLength are constraint when controlType is text
   */
  minLength?: number;
  maxLength?: number;
  isRequired: boolean;
  /**
   * regular expression constraint.
   */
  regExp?: string;
  /**
   * Error Message for regular expression
   */
  regExpErrorMsg?: string;

  /**
   * Ad hoc tag attached to this property.
   * Client can use it for any purpose.
   */
  tags: Map<string, string>;

  /**
   * Whether show this proprerty in editor view
   */
  showInEditor: boolean;
  /**
   * Whether show this property in view
   */
  showInViewer: boolean;

  /**
   * Wether this field is editable or not.
   * If not, it will be dsabled when showInEditor
   */
  editable: boolean;
  viewable: boolean;
  defaultValue?: string;

  /**
   * When UIType is select, lookupName and lookupSrc are used to
   * indicate when the drop list comes from
   */
  lookupName?: string;
  lookupSrc?: string;
  /**
   * Property value object type like number, date,
   * Explanation using date as an example:
   * Tne property is a date from UI perspective. UI will show a datePicker.
   * However the property value could be represented as a ISOString or
   * a Date object. This dataType specifies the property value type.
   */
  dataType: DATAType;
  /**
   * Where this property definition comes from.
   * reserved value: predefined.
   */
  source?: string;

  /**
   * format for display date, dateTime, number
   * reference: https://angular.io/api/common/DatePipe,
   * https://angular.io/api/common/DecimalPipe
   */
  format?: string;
  /**
   * any information. Only specific client knows how to interpret it.
   * For example, product entity use this attribute to attach lookup
   * information.
   */
  // tslint:disable:no-any can be anything
  other?: any;

  /**
   * How wide this field should be:
   *
   * The unit is one default form field
   */
  fieldWidth: number;

  /**
   * Service used to support angular material autocomplete
   */
  autoCompleteService?: string;

  constructor(optionsOverride: PropInterface) {
    const defaultOptions = {
      type: 'text',
      controlType: 'text',
      dataType: 'STRING',
      isRequired: false,
      tags: new Map<string, string>(),
      editable: true,
      viewable: true,
      showInEditor: true,
      showInViewer: true,
      source: PREDEFINED_FIELD_SRC,
      fieldWidth: 1,
    };
    const options = {...defaultOptions, ...optionsOverride};
    this.name = options.name;
    this.label = options.label;
    this.type = options.type as UIType;
    this.description = options.description || options.label;
    this.controlType = options.controlType;
    this.min = options.min;
    this.max = options.max;
    this.minLength = options.minLength;
    this.maxLength = options.maxLength;
    this.regExp = options.regExp;
    this.regExpErrorMsg = options.regExpErrorMsg;
    this.tags = options.tags;
    this.isRequired = options.isRequired;
    this.showInEditor = options.showInEditor;
    this.showInViewer = options.showInViewer;
    this.editable = options.editable;
    this.viewable = options.viewable;
    this.defaultValue = options.defaultValue;
    this.lookupName = options.lookupName;
    this.lookupSrc = options.lookupSrc;
    this.source = options.source;
    this.other = options.other;
    this.dataType = options.dataType as DATAType;
    this.format = options.format;
    this.fieldWidth = options.fieldWidth;
    this.autoCompleteService = options.autoCompleteService;
  }
}

export declare interface DynamicFieldContextInterface {
  // tslint:disable:no-any can be anything
  [index: string]: any;
  type: string;
  entity?: Entity;
  skipFirstTime: boolean;
}
/**
 * Basic type for property context definition.
 * Context is used to specify some special rule for property display.
 */
export abstract class DynamicFieldContext implements
    DynamicFieldContextInterface {
  // tslint:disable:no-any can be anything
  [index: string]: any;
  type: string;
  entity?: Entity;
  // whether to skip this context when form is loaded fist time
  skipFirstTime: boolean;
}

export declare interface ShowHideContextInterface extends
    DynamicFieldContextInterface {
  srcProp: string;
  srcValue: string;
  target: string;
  show: boolean;
}

/**
 * when srcProp with a value 'srcValue'
 * show('show'=true) or hide ('show'=false) the target property.
 * Otherwise, hide or show the target property.
 *
 * This is a special case for SegmentedShowHideContext below
 *
 */
export class ShowHideContext extends DynamicFieldContext implements
    ShowHideContextInterface {
  static TYPE = 'ShowHideContext';
  srcProp: string;
  srcValue: string;
  target: string;
  show: boolean;
}

export declare interface SegmentedShowHideContextInterface extends
    DynamicFieldContextInterface {
  srcProp: string;
  // map a value to a list of target prop
  segments: Map<string, string[]>;
  show: boolean;
  // reset value when property is shown.
  resetWhenShow?: boolean;
}
/**
 * srcProp controls the visibility of a list of properties.
 * When its value equals to one value (key of segments)
 * the props in segments.get(srcValue) are shown,
 * other props in the segments are hidden.
 */
export class SegmentedShowHideContext extends DynamicFieldContext implements
    SegmentedShowHideContextInterface {
  static TYPE = 'SegmentedShowHideContext';
  srcProp: string;
  // map a value to a list of target prop
  segments: Map<string, string[]>;
  show: boolean;
  // reset value when property is shown.
  resetWhenShow?: boolean;
}


export declare interface RequiredContextInterface extends
    DynamicFieldContextInterface {
  srcProp: string;
  srcValue: string;
  target: string;
  required: boolean;
}
/**
 * when srcProp has a value srcValue, target is required(required=true)
 * or not required(required=false).
 * Otherwise, it is not required or required.
 *
 * This is a special case for SegmentedrequireContext below
 */
export class RequiredContext extends DynamicFieldContext implements
    RequiredContextInterface {
  static TYPE = 'required';
  srcProp: string;
  srcValue: string;
  target: string;
  required: boolean;
}

export declare interface SegmentedRequiredContextInterface extends
    DynamicFieldContextInterface {
  srcProp: string;
  segments: Map<string, string[]>;
  required: boolean;
}
/**
 * srcProp controls the requireness of a list of properties.
 * When its value equals to one value (key of segments)
 * the props in segments.get(srcValue) are required,
 * other props in the segments are not required.
 */
export class SegmentedRequiredContext extends DynamicFieldContext implements
    SegmentedRequiredContextInterface {
  static TYPE = 'SegmentedRequiredContext';
  srcProp: string;
  // map a value to a list of target prop
  segments: Map<string, string[]>;
  required: boolean;
}


export declare interface SegmentedClearValueContextInterface extends
    DynamicFieldContextInterface {
  srcProp: string;
  // map a value to a list of target prop
  segments: Map<string, string[]>;
  clear: boolean;
}
/**
 * srcProp controls the null-ness of a list of properties.
 * When its value equals to one value (key of segments)
 * the props in segments.get(srcValue) can have value.
 * Other props can't have value.
 */
export class SegmentedClearValueContext extends DynamicFieldContext implements
    SegmentedClearValueContextInterface {
  static TYPE = 'SegmentedClearContext';
  srcProp: string;
  // map a value to a list of target prop
  segments: Map<string, string[]>;
  clear: boolean;
}

export declare interface SetValueContextInterface extends
    DynamicFieldContextInterface {
  srcProp: string;
  srcValue: string;
  target: string;
  targetValue: string;
}

/**
 * When srcProp has a value srcValue, set target to targetValue
 */
export class SetValueContext extends DynamicFieldContext implements
    SetValueContextInterface {
  static TYPE = 'SetValue';
  srcProp: string;
  srcValue: string;
  target: string;
  targetValue: string;
}


export declare interface DisableContextInterface extends
    DynamicFieldContextInterface {
  srcs: Map<string, string>;
  relation: 'and'|'or';
  target: string;
  disable: boolean;
}
/**
 * When srcs conditions are met, disable(disable=true) or enable(disable=false)
 * target prop.
 * enable or disable target otherwise
 */
export class DisableContext extends DynamicFieldContext implements
    DisableContextInterface {
  static TYPE = 'Disable';
  srcs: Map<string, string>;
  relation: 'and'|'or';
  target: string;
  disable: boolean;
}


export declare interface RestrictLookupContextInterface extends
    DynamicFieldContextInterface {
  srcProp: string;
  srcValue: string;
  target: string;
  targetValues: string[];
}
/**
 * When srcProp has a value srcValue, restrict target dropdown list to
 * targetValues
 */
export class RestrictLookupContext extends DynamicFieldContext implements
    RestrictLookupContextInterface {
  static TYPE = 'RestrictLookup';
  srcProp: string;
  srcValue: string;
  target: string;
  targetValues: string[];
}

/**
 * An item in dropdown
 */
export class BaseLookupValue {
  description?: string;
}

export declare interface EntityInterface {
  name: string;
  props: Prop[];
  contexts: DynamicFieldContext[];
}
/**
 * An entity
 */
export class Entity implements EntityInterface {
  name: string;
  props: Prop[];
  contexts: DynamicFieldContext[];

  constructor(
      name: string, props: Prop[] = [], contexts: DynamicFieldContext[] = []) {
    this.name = name;
    this.props = props;
    for (const prop of props) {
      prop.entity = this;
    }
    for (const ctx of contexts) {
      ctx.entity = this;
    }
    this.contexts = contexts;
  }

  findProp(propName: string): Prop {
    for (const prop of this.props) {
      if (prop.name.toUpperCase() === propName.toUpperCase()) {
        return prop;
      }
    }
    throw new Error(`Couldn't find prop for ${propName}`);
  }
}

/**
 * represent not null value for Context
 */
export const NOTNULL_VALUE = '_notnull';
/**
 * reprsent null value for context and default value
 */
export const NULL_VALUE = '_null';

export type AnyType = {}|null|undefined|boolean|string|number;

export const PREDEFINED_FIELD_SRC = 'predefined';
