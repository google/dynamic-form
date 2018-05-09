# Google Dynamic Form Field (go/dynamicfield)

[TOC]

## Introduction

How do you create a page to edit an piece of structured data? You create a form
control for each property. And very likely, you would add validators to form
control. Most of form controls are very similar to each other. So why can't
these form controls be generated from data model specification?

This is what this library does. It generates the form controls from data model
specification. With this library, you would not build your form controls from
scratch, but through a configurable way.

Here is a case study to demonstrate ==[the benefit of this
library](case_study.md)==.

NOTE: Currently, this library only supports Angular 2 projects, and is built on
top of Angular2 Material.

## Terminology

These are important terms to get started with this library.

*   **Entity** : An object to model such as book, house, etc.

    *Please refer: [Entity Definiton Source
    Code](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/meta_datamodel.ts?l=251).*

*   **Property**: An entity has many properties. For example, book has author,
    ISBN number, etc. And here author is a Book entity's property. The same as
    ISBN number. This is [the more detailed description for Property
    Definition](property_for_prop.md), where you can find all attirbutes to
    define a property in detail.

    *Please refer: [Property Definition Source
    Code](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/meta_datamodel.ts?l=7).*

*   **Context**: When an entity is edited, properties interact with each other
    in UI. These interaction rules are termed as a **Context**. Here are some
    examples:

    *   Only show property B when property A's value is 5.
    *   Disable property B when property A is checked.
    *   Property B is required when A's value is 6.
    *   Clear property B's value when A is checked.

    *Please refer: [Context Definition Source
    Code](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/meta_datamodel.ts?l=129).*

*   **Form Control**: Text input box, check box, drop down, Radio, Date Picker,
    etc.

## Quick Start

This section would give you a brief idea of how to utilize this library in a
high-level perspective.

### Step 0: import dependency

Import needed types and
[DynamicFormModule](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/dynamic_form_module.ts?l=74)
from `java/com/google/corp/bizapps/om/omweb/shared/dynamicform`

e.g.

```typescript
import {DynamicFormModule} from 'java/com/google/corp/bizapps/om/omweb/shared/dynamicform';
```

### Step 1: Define data model (Entity)

Here is an example:

```javascript
new Entity(
      'test',
      [new Prop({
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
          isRequired: true,
          minLength: 5,
        }),
      ],
      [{
          type: ShowHideContext.TYPE,
          srcProp: 'prop3',
          srcValue: 'true',
          target: 'prop4',
          show: true
        }
      ]);
```

+   This example defines `test` Entity.
+   It has 2 properties and one context.
+   The context specifies that showing `prop4` when `prop3` is checked, hiding
    `prop4` otherwise.

NOTE: [Example in
Production](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/services/product_metadata.ts)

==The Entity Model can be generated from [proto or discovery
doc](discovery.md).==

### Step 2: register data model(Entity) to entity Respository

```javascript
@NgModule(...)
export class MyModule {
  constructor(entityMetaDataRepository:EntityMetaDataRepository){
    entityMetaDataRepository.registerMetaData(entity)
  }
}
```

You only do this **once** in your application.

### Step 3 construct your page

```html
 <form  gdfEntityCtx="test" [inst]="inst" >
    <ng-container *ngFor="let prop of props">
      <gdf-prop [prop]="prop" [ngClass]="prop.name" [inst]="inst"></gdf-prop>
    </ng-container>
  </form>
```

==Here you need to use `<gdf-prop>` instead of `<input>` to construct a form
control.==

The angular component for `gdf-prop` is
**[DynamicFieldPropertyComponent](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/prop_component.ts)**
This component generates form control according to property definition. For
example, it generates

+   A dropdown if the Prop.type is **select**.
+   a togggler if the Prop.type is **checkbox**

It needs two input parameters

+   **prop**: property to be edited.
+   **inst**: from which property value is retrieved.

It uses Angular [FormControl](https://angular.io/api/forms/FormControl)
internally.

It needs to be inside a
[ControlContainer](https://angular.io/api/forms/ControlContainer).
**&lt;form&gt;** is a convenient way to create ControlContainer.

For more information, please refer to source code
**[DynamicFieldPropertyComponent](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/prop_component.ts)**

**gdfEntityCtx** is an angular directive from this library. it processes and
sets up Entity.Context properly.

*   It needs two inputs. Here **test** is entity name. `[inst]="inst"` is an
    instance of test entity. Property value is retrieved from inst
*   It has several properties
    *   entity: Entity which can be used in template
    *   controlInst: This is map. The key is property's name. The value is the
        value of FormControl for this property.
    *   propComps: All the DynamicFieldPropertyComponent in the form.

Here is [one
example](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/product/product_edit/product_edit.ng.html)
how these properties are used

==You can also use inst-editor which is a wrapper component for all the tag
mentioned above.==

### Step 4 include default style in your index.html

One css file is provided by this library. This filedefines default css layout
and some convenient css classes. Include
"//java/com/google/corp/bizapps/om/omweb/shared/dynamicform:dynamicform_css"
blaze build rule in your css_binary. For development, add it to static_files
sections in the ts_deveserver rule. Please refer to example application below

## Quick Start Examples

Here are several [examples](examples.md) provided for your reference to get
familiar with terminologies, usage, and so on.

It is deployed https://dynamicform-198202.appspot.com.

Brief introduction for each example (please follow the sequence):

-   Book

    [Source
    Code](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/example/app/book/).

    This example demonstrates some basic and common usage of this library.

-   Book Lookup

    [Source
    Code](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/example/app/book_lookup/).

    This example is based on the Book example, with the enhancement on Lookup
    usage. You will know how to use Lookup for drop downs from this example.

## References

+   [Instance, retrieve Property Value, Default Value
    support](instance_and_property_value.md)
+   [Dropdown support](lookup.md)
+   [no bidrection binding between UI and
    Instance](control_value_instance_value.md)
+   [Listen for value change](value_change.md)
+   [Styling your component](style.md)
+   Component References:
    +   [Edit
        Instance](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/inst_editor.ts)
    +   [Edit Particular
        properties](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/prop_component.ts)
    +   [Display
        Instance](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/inst_viewer.ts)
    +   [Display
        properties](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/prop_viewer.ts)
