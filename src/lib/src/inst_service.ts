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

import {Injectable} from '@angular/core';
import {Subscription} from 'rxjs';

import {AnyType, BaseLookupValue, DisableContext, DynamicFieldContext, Entity, NOTNULL_VALUE, NULL_VALUE, Prop, RequiredContext, RestrictLookupContext, SegmentedClearValueContext, SegmentedRequiredContext, SegmentedShowHideContext, SetValueContext, ShowHideContext} from './meta_datamodel';
import {DynamicFieldPropertyComponent} from './prop_component';
import {assert} from './repositories';
import {EntityMetaDataRepository, LookupSources} from './repositories';

/**
 * How to retrieve/set a property value from/to instance
 */
export interface PropValueSetterGetter {
  /**
   * retrieve a prop value from instance
   */
  get(inst: {}, prop: Prop): AnyType;

  /**
   * set a prop value to instance
   */
  set(inst: {}, prop: Prop, value: AnyType): void;
  /**
   * return whether it can handle this entity?
   */
  canHandle(entity: Entity): boolean;
}


export class SimpleValueSetterGetter<T extends {}> implements
    PropValueSetterGetter {
  get(inst: T, prop: Prop): AnyType {
    type key = keyof T;
    return (inst[prop.name as key]) as any;
  }

  set(inst: T, prop: Prop, value: AnyType): void {
    type key = keyof T;
    (inst as any)[prop.name as key] = value;
  }

  canHandle(entity: Entity): boolean {
    return true;
  }
}


/**
 * A repository of setter and getter.
 */
@Injectable()
export class PropValueSetterGetters {
  private readonly defaultSetterGetter = new SimpleValueSetterGetter();
  private readonly setterGetters = new Array<PropValueSetterGetter>();

  registerSetterGetter(propValueSetterGetter: PropValueSetterGetter) {
    this.setterGetters.push(propValueSetterGetter);
  }
  getSetterGetter(entity: Entity): PropValueSetterGetter {
    const setterGetter =
        this.setterGetters.find(setterGetter => setterGetter.canHandle(entity));

    return setterGetter ? setterGetter : this.defaultSetterGetter;
  }
  getSetterGetterForProp(prop: Prop): PropValueSetterGetter {
    return this.getSetterGetter(prop.entity);
  }
}

/**
 * When default value si specified in Prop,
 * it is string type.
 * Here we want to convert it to a properly typed value
 */
@Injectable()
export class DefaultValueConverter {
  /**
   * Convert a text value to typed value
   */
  convert(prop: Prop, value: string): AnyType {
    if (value === NULL_VALUE) {
      return null;
    }
    if (value === undefined) {
      return null;
    }
    if (value === 'undefined') {
      return null;
    }

    if (prop.dataType.toUpperCase() === 'NUMBER') {
      return Number(value);
    }
    if (prop.dataType.toUpperCase() === 'BOOLEAN') {
      return (value as string).toUpperCase() === 'TRUE';
    }

    return value;
  }

  /**
   * Convert a typed value to string
   */
  convertToString(prop: Prop, value: AnyType): string|null {
    if (value === null || value === undefined) {
      return null;
    }
    return String(value);
  }
}

/**
 * populate default value to inst
 */
@Injectable()
export class DefaultInstPopulater {
  constructor(
      private readonly defaultValueConverter: DefaultValueConverter,
      private readonly lookupSources: LookupSources,
      private readonly entityMetaDataRepository: EntityMetaDataRepository,
      private readonly propValueSetterGetters: PropValueSetterGetters) {}

  populateInstance(inst: {}, entity: Entity) {
    for (const prop of entity.props) {
      if (prop.defaultValue) {
        let value = this.defaultValueConverter.convert(prop, prop.defaultValue);
        if (prop.lookupSrc && prop.lookupName) {
          const lookupSrc = this.lookupSources.getLookupSource(prop.lookupSrc);
          const lookupValue =
              lookupSrc.getLookupValues(prop.lookupName)
                  .find(
                      v => lookupSrc.lookupValueToString(v).toUpperCase() ===
                          (value as string).toUpperCase());
          if (lookupValue) {
            value = lookupSrc.lookupValueToPropValue(lookupValue);
          } else {
            value = undefined;
          }
        }
        this.propValueSetterGetters.getSetterGetter(entity).set(
            inst, prop, value);
      } else if (prop.dataType === 'BOOLEAN') {
        this.propValueSetterGetters.getSetterGetter(entity).set(
            inst, prop, false);
      }
    }
    return inst;
  }
}

export abstract class ContextProcessor {
  /**
   * register action according to ctx specification.
   * @return a subscription to FormControl value change
   */
  abstract processContext(
      ctx: DynamicFieldContext, inst: {}, entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[]): Subscription|undefined;

  constructor(
      protected defaultValueConverter: DefaultValueConverter,
      protected lookupSources: LookupSources) {}


  protected findComponent(
      propName: string, comps: DynamicFieldPropertyComponent[]) {
    return comps.find(dfComp => dfComp.prop.name === propName);
  }
  /**
   * retrieve property value in the format used by FormControl
   */
  protected getPropUIValue(
      prop: Prop, comps: DynamicFieldPropertyComponent[],
      propValueSetterGetter: PropValueSetterGetter, inst: {}): AnyType {
    const propComp = this.findComponent(prop.name, comps);
    let retValue = null;
    if (propComp) {
      retValue = propComp.control.value;
    } else {
      retValue = this.getOriginalValue(prop, propValueSetterGetter, inst);
    }
    // Note: retValue can be boolean. Don't use !retValue
    if (typeof retValue === 'undefined' ||
        (typeof retValue === 'string' && retValue.length === 0)) {
      retValue = null;
    }
    return retValue;
  }


  /**
   * We can get the value from control, but control may not exist
   * for in UI. We recompute the UI value from prop value.
   */
  protected getOriginalValue(
      prop: Prop, propValueSetterGetter: PropValueSetterGetter,
      inst: {}): AnyType {
    let originalValue = propValueSetterGetter.get(inst, prop);
    if (prop.type === 'select' && prop.lookupSrc && prop.lookupName &&
        originalValue) {
      originalValue =
          this.lookupSources.getLookupSource(prop.lookupSrc)
              .propValueToLookupValue(prop.lookupName, originalValue);
    }
    return originalValue;
  }

  /**
   * convert a stringified value to typed value
   * For lookup, return the lookup object. UI always use LookupObject for
   * selection
   */
  protected strValueToObject(value: string, prop: Prop): AnyType {
    if (prop.type === 'select' && prop.lookupSrc && prop.lookupName && value) {
      const lookupSrc = this.lookupSources.getLookupSource(prop.lookupSrc);
      return lookupSrc.getLookupValues(prop.lookupName)
          .find(
              code => lookupSrc.lookupValueToString(code).toUpperCase() ===
                  value.toUpperCase());

    } else {
      return this.defaultValueConverter.convert(prop, value);
    }
  }

  protected uiValueMatchSrcValue(
      newValue: AnyType, srcValue: string, srcProp: Prop): boolean {
    if (newValue === undefined || newValue === '') {
      newValue = null;
    }
    const srcValueInUI = this.strValueToObject(srcValue, srcProp);
    if (srcValueInUI === NOTNULL_VALUE && newValue !== null) {
      return true;
    }
    return srcValueInUI === newValue;
  }
}

@Injectable()
export class ContextProcessors {
  readonly processors = new Map<string, ContextProcessor>();

  registerContextProcessor(type: string, processor: ContextProcessor) {
    this.processors.set(type, processor);
  }
}

/**
 * Do something to SINGLE targetProp When SINGLE srcProp's value changes
 */
export abstract class SingleTargetContextProcessor extends ContextProcessor {
  constructor(
      protected defaultValueConverter: DefaultValueConverter,
      protected lookupSources: LookupSources) {
    super(defaultValueConverter, lookupSources);
  }

  processContext(
      ctx: DynamicFieldContext, inst: {}, entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[]): Subscription|undefined {
    const srcComp = this.findComponent(ctx['srcProp'], comps);
    const targetComp = this.findComponent(ctx['target'], comps);
    if (!targetComp) {
      return;
    }

    const srcProp = entity.findProp(ctx['srcProp']);
    const targetProp = entity.findProp(ctx['target']);
    const valueChangeFunction = this.getValueChangeFunction(
        ctx, inst, entity, propValueSetterGetter, comps, srcProp, targetProp,
        targetComp);
    let subscription: Subscription|undefined = undefined;
    if (srcComp) {
      subscription =
          srcComp.control.valueChanges.subscribe(valueChangeFunction);
    }
    if (!ctx.skipFirstTime) {
      const originalValue =
          this.getOriginalValue(srcProp, propValueSetterGetter, inst);
      Promise.resolve(null).then(() => {
        valueChangeFunction(originalValue);
      });
    }
    return subscription;
  }

  abstract getValueChangeFunction(
      ctx: DynamicFieldContext, inst: {}, entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[], srcProp: Prop, targetProp: Prop,
      targetComp: DynamicFieldPropertyComponent): (newValue: AnyType) => void;
}

@Injectable()
export class ShowHideContextProcessor extends SingleTargetContextProcessor {
  constructor(
      protected defaultValueConverter: DefaultValueConverter,
      protected lookupSources: LookupSources) {
    super(defaultValueConverter, lookupSources);
  }

  getValueChangeFunction(
      ctx: ShowHideContext, inst: {}, entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[], srcProp: Prop, targetProp: Prop,
      targetComp: DynamicFieldPropertyComponent): (newValue: AnyType) => void {
    return (newValue: AnyType) => {
      targetComp.show =
          this.uiValueMatchSrcValue(newValue, ctx.srcValue, srcProp) ?
          ctx.show :
          !ctx.show;
    };
  }
}


@Injectable()
export class SetValueContextProcessor extends SingleTargetContextProcessor {
  constructor(
      protected defaultValueConverter: DefaultValueConverter,
      protected lookupSources: LookupSources) {
    super(defaultValueConverter, lookupSources);
  }

  getValueChangeFunction(
      ctx: SetValueContext, inst: {}, entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[], srcProp: Prop, targetProp: Prop,
      targetComp: DynamicFieldPropertyComponent): (newValue: AnyType) => void {
    return (newValue: AnyType) => {
      if (this.uiValueMatchSrcValue(newValue, ctx.srcValue, srcProp)) {
        const targetValue = this.strValueToObject(ctx.targetValue, targetProp);
        targetComp.control.setValue(targetValue);
      }
    };
  }
}

/*
 * This context has multiple source properties. It can't extend
 * SingleTargetContextProcesssor
 */
@Injectable()
export class DisableContextProcessor extends ContextProcessor {
  constructor(
      protected defaultValueConverter: DefaultValueConverter,
      protected lookupSources: LookupSources) {
    super(defaultValueConverter, lookupSources);
  }

  processContext(
      ctx: DisableContext, inst: {}, entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[]): Subscription|undefined {
    const targetComp = this.findComponent(ctx.target, comps);

    if (!targetComp) {
      return;
    }
    const disableFunction = (newValue: AnyType) => {
      let disable = ctx.relation === 'and' ? true : false;
      for (const condition of ctx.srcs.entries()) {
        const srcProp = entity.findProp(condition[0]);
        const newUIValue =
            this.getPropUIValue(srcProp, comps, propValueSetterGetter, inst);
        const newDisable =
            this.uiValueMatchSrcValue(newUIValue, condition[1], srcProp) ?
            ctx.disable :
            !ctx.disable;
        if (ctx.relation === 'and') {
          disable = disable && newDisable;
        } else {
          disable = disable || newDisable;
        }
      }
      targetComp.disabled = disable;
    };
    const subscription = new Subscription();
    for (const condition of ctx.srcs.entries()) {
      const srcProp = entity.findProp(condition[0]);
      const srcComp = this.findComponent(srcProp.name, comps);
      if (srcComp) {
        subscription.add(
            srcComp.control.valueChanges.subscribe(disableFunction));
      }
    }
    if (!ctx.skipFirstTime) {
      Promise.resolve(null).then(() => {
        disableFunction(null);
      });
    }
    return subscription;
  }
}


@Injectable()
export class RestrictedLookupProcessor extends SingleTargetContextProcessor {
  constructor(
      protected defaultValueConverter: DefaultValueConverter,
      protected lookupSources: LookupSources) {
    super(defaultValueConverter, lookupSources);
  }

  getValueChangeFunction(
      ctx: RestrictLookupContext, inst: {}, entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[], srcProp: Prop, targetProp: Prop,
      targetComp: DynamicFieldPropertyComponent): (newValue: AnyType) => void {
    return (newValue: AnyType) => {
      if (this.uiValueMatchSrcValue(newValue, ctx.srcValue, srcProp)) {
        const lookups = new Array<BaseLookupValue>();
        for (const targetStrValue of ctx.targetValues) {
          lookups.push(
              this.strValueToObject(targetStrValue, targetProp) as
              BaseLookupValue);
        }
        targetComp.lookups = lookups;
      }
    };
  }
}


@Injectable()
export class RequiredProcessor extends SingleTargetContextProcessor {
  constructor(
      protected defaultValueConverter: DefaultValueConverter,
      protected lookupSources: LookupSources) {
    super(defaultValueConverter, lookupSources);
  }

  getValueChangeFunction(
      ctx: RequiredContext, inst: {}, entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[], srcProp: Prop, targetProp: Prop,
      targetComp: DynamicFieldPropertyComponent): (newValue: AnyType) => void {
    return (newValue: AnyType) => {
      targetComp.required =
          this.uiValueMatchSrcValue(newValue, ctx.srcValue, srcProp) ?
          ctx.required :
          !ctx.required;
    };
  }
}

/**
 * When a SINGLE srcProp's value changes, do something to multiple properties.
 */
export abstract class SegmentedContextProcessor extends ContextProcessor {
  constructor(
      protected defaultValueConverter: DefaultValueConverter,
      protected lookupSources: LookupSources) {
    super(defaultValueConverter, lookupSources);
  }

  processContext(
      ctx: DynamicFieldContext, inst: {}, entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[]): Subscription|undefined {
    const srcComp = this.findComponent(ctx['srcProp'], comps);
    const srcProp = entity.findProp(ctx['srcProp']);

    const valueChangeFunction = this.getValueChangeFunction(
        ctx, inst, entity, propValueSetterGetter, comps, srcProp);
    let subscription: Subscription|undefined = undefined;
    if (srcComp) {
      subscription =
          srcComp.control.valueChanges.subscribe(valueChangeFunction);
    }
    if (!ctx.skipFirstTime) {
      const originalValue =
          this.getOriginalValue(srcProp, propValueSetterGetter, inst);
      Promise.resolve(null).then(() => {
        valueChangeFunction(originalValue);
      });
    }
    return subscription;
  }

  abstract getValueChangeFunction(
      ctx: DynamicFieldContext,
      inst: {},
      entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[],
      srcProp: Prop,
      ): (newValue: AnyType) => void;
}

@Injectable()
export class SegmentedShowHideProcessor extends SegmentedContextProcessor {
  constructor(
      protected defaultValueConverter: DefaultValueConverter,
      protected lookupSources: LookupSources) {
    super(defaultValueConverter, lookupSources);
  }

  getValueChangeFunction(
      ctx: SegmentedShowHideContext,
      inst: {},
      entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[],
      srcProp: Prop,
      ): (newValue: AnyType) => void {
    return (newValue: AnyType) => {
      const showStatus = new Map<string, boolean>();
      for (const srcValue of ctx.segments.keys()) {
        const matched = this.uiValueMatchSrcValue(newValue, srcValue, srcProp);
        const show = matched ? ctx.show : !ctx.show;
        /*
         * A property can be controlled by multiple keys
         * It is shown if one of key say it should show
         */
        for (const target of assert(ctx.segments.get(srcValue))) {
          if (showStatus.has(target)) {
            showStatus.set(target, showStatus.get(target) || show);
          } else {
            showStatus.set(target, show);
          }
        }
      }
      for (const [target, show] of showStatus.entries()) {
        const targetComp = this.findComponent(target, comps);
        if (!targetComp) {
          continue;
        }
        targetComp.show = show;
        if (show && ctx.resetWhenShow &&
            // tslint:disable-next-line:triple-equals check null and undefined
            targetComp.control.value == undefined) {
          targetComp.resetValue();
        }
      }
    };
  }
}



@Injectable()
export class SegmentedRequiredProcessor extends SegmentedContextProcessor {
  constructor(
      protected defaultValueConverter: DefaultValueConverter,
      protected lookupSources: LookupSources) {
    super(defaultValueConverter, lookupSources);
  }

  getValueChangeFunction(
      ctx: SegmentedRequiredContext,
      inst: {},
      entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[],
      srcProp: Prop,
      ): (newValue: AnyType) => void {
    return (newValue: AnyType) => {
      const requiredStatus = new Map<string, boolean>();
      for (const srcValue of ctx.segments.keys()) {
        const matched = this.uiValueMatchSrcValue(newValue, srcValue, srcProp);
        const required = matched ? ctx.required : !ctx.required;
        /*
         * A property can be controlled by multiple keys
         * It is required if it is required in one of the case
         */
        for (const target of assert(ctx.segments.get(srcValue))) {
          if (requiredStatus.has(target)) {
            requiredStatus.set(target, requiredStatus.get(target) || required);
          } else {
            requiredStatus.set(target, required);
          }
        }
      }
      for (const [target, required] of requiredStatus.entries()) {
        const targetComp = this.findComponent(target, comps);
        if (!targetComp) {
          continue;
        }
        targetComp.required = required;
      }
    };
  }
}



@Injectable()
export class SegmentedClearValueProcessor extends SegmentedContextProcessor {
  constructor(
      protected defaultValueConverter: DefaultValueConverter,
      protected lookupSources: LookupSources) {
    super(defaultValueConverter, lookupSources);
  }

  getValueChangeFunction(
      ctx: SegmentedClearValueContext,
      inst: {},
      entity: Entity,
      propValueSetterGetter: PropValueSetterGetter,
      comps: DynamicFieldPropertyComponent[],
      srcProp: Prop,
      ): (newValue: AnyType) => void {
    return (newValue: AnyType) => {
      const clearStatus = new Map<string, boolean>();
      for (const srcValue of ctx.segments.keys()) {
        const matched = this.uiValueMatchSrcValue(newValue, srcValue, srcProp);
        const clear = matched ? ctx.clear : !ctx.clear;
        /*
         * A property can be controlled by multiple keys
         * Only clear the value if all properties say it should be cleared
         */
        for (const target of assert(ctx.segments.get(srcValue))) {
          if (clearStatus.has(target)) {
            const previousClear = clearStatus.get(target) as boolean;
            clearStatus.set(target, previousClear && clear);
          } else {
            clearStatus.set(target, clear);
          }
        }
      }
      for (const [target, clear] of clearStatus.entries()) {
        const targetComp = this.findComponent(target, comps);
        if (!targetComp) {
          continue;
        }
        if (clear) {
          targetComp.control.setValue(null);
        }
      }
    };
  }
}
