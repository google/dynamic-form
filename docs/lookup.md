# Lookup and Lookup Values

[TOC]

## Introduction

A lookup and its values are used to create drop down in UI.

## Concept

+   **Lookup**: value collection for a drop down. For example, you can define
    `Country` is a lookup.
+   **Lookup Value**: one value for a lookup. For example, `Country` lookup
    could have values like `US, CANADA, CHINA`, etc. Each particular country is
    a Lookup Value.
+   **Lookup Source**: A collection of lookups. A source where many lookups can
    be loaded. For example, a lookup source could have lookups like `Country,
    Currency, Unit of Measure, Employee Type`, etc.

## How to use Lookup

### Step 1. Define Lookup Source

A lookup source has several methods:

+   a method to return a list of Lookup value by giving lookup name.
+   convert a lookup Value object to a string.
+   Convert Lookup Value to Propety value, and vice versa. Drop Down Form
    control always use Lookup Value Object internally. Instance property may not
    use the Lookup Value object. These two methods convert between Lookup Value
    Object and Property value.

[Lookup Source
document](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/repositories.ts?l=24)

Here is an [example lookup
source](https://cs.corp.google.com/piper/ //depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/services/product_impl.ts?l=14).
It is regsitered to system by a name. Registration Example:
[here](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/services/product_dynamic_module.ts?l=43).

### Step 2. Use Lookup on Property

Once you have lookup, you can hook up property with a particular lookup.

```javascript
 new Prop({
          name: 'prop1',
          type: 'select',
          controlType: 'text',
          dataType: 'STRING',
          label: 'first Property',
          lookupSrc: ExampleLookupSrc.NAME,
          lookupName: 'countries',
        }
```

+   This property has a type of **select** so it is a drop down.
+   It will get its drop down choice from **ExampleLookupSrc.NAME** lookup
    source.
+   It uses the **countries** lookup.

### Step 3. Lookup Value

A Lookup Value is a Javascript Object. It has a description property. Drop down
list will show the description for end user to select the value. Lookup could
have other properties, which are not used by Dynamic Form Field.

You will extend you Lookup Value from
[BaseLookupValue](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/meta_datamodel.ts?l=249)
