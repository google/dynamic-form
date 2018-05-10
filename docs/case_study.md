# Case study to show why this library is useful

## Requirement

One of software we developed catalogs all software and hardware products in
Google. **Product** is the entity.

+   product has many **basic properties**: name, sku, family, category, type,
    status, etc.
+   product has **general properties** related to specific functional area:
    +   it has properties related to order: orderable, evaluation sku
    +   it has propertues related to support: support sku, support terms
+   **family-specific properties**: Each product family has a list of properties
    for this family only.
    +   some of them are required.
    +   some of them has a list values for selection.
    +   some of them are number. Number must not be negative
    +   some of them have default value.
+   new properties are added after deployments
    +   Four properties are added to support Billing 3 after dogfood.

## Original typical impelementation.

+   one component to edit basic information: [html
    template](https://critique.corp.google.com/#review/174905152/depot/google3/experimental/order_monetizer/product/client/product/product_edit/components/product_edit_basic/product-edit-basic.html).
    [component
    ts](https://critique.corp.google.com/#review/174905152/depot/google3/experimental/order_monetizer/product/client/product/product_edit/components/product_edit_basic/product-edit-basic.ts).
    +   The template file has **many input/select tags: one for each basic
        property**.
    +   There are "required", "minLength" attributes for some inputs.
    +   **Each input/select has property-specific attributes: constraint,
        onChange, value binding.**
    +   There are many drop downs. Component ts file has code to load values for
        dropdown
    +   Component has logic to handle family selection: When family is selected,
        show a limited set of categories for selection.
+   one component to edit general information: [html
    template](https://critique.corp.google.com/#review/174905152/depot/google3/experimental/order_monetizer/product/client/product/product_edit/components/product_edit_general/product-edit-general.html)
    [Component
    ts](https://critique.corp.google.com/#review/174905152/depot/google3/experimental/order_monetizer/product/client/product/product_edit/components/product_edit_general/product-edit-general.ts)
    +   Constructed similarly to the above component
    +   Component ts has code to load dropdown values.
    +   template file has one input/select for each property.
+   show family-specific properties. [html
    template](https://cs.corp.google.com/piper///depot/google3/experimental/order_monetizer/product/client/product/product_edit/components/additional_info/additional-info.html?l=17)
    [Component
    ts](https://cs.corp.google.com/piper///depot/google3/experimental/order_monetizer/product/client/product/product_edit/components/additional_info/additional-info.ts)
    +   property definition (label, type, required) is defined in database.
    +   property value is attached to 'Product' as embedded proto/JS object.
    +   template html : messy html, some property constraints are never
        enforced.
    +   component ts: a lot of code to handling property value , property
        definition.

## Dynamic form implementation

+   Consolidate all templates to
    [product_edit.ng.html](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/product/product_edit/product_edit.ng.html)
    +   deleted basic component.
    +   deleted general componnet
    +   deleted component for family specific component.

### Benefit

+   no code to load dropdown values
+   no property-specific logic in template and JS code.
+   all enable, disable, onChange, required, error message are handled
    automatically. Developer only needs define these in [Prop
    definition](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/services/product_metadata.ts)
+   All properties are treated uniformly by UI. No matter whether
    +   its definition is in database or proto.
    +   its value is simple scalar or attached js object.
    +   where its dropdown values come from.
+   When new properties are needed, A [simple
    section](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/product/product_edit/product_edit.ng.html?l=170)
    is added.
+   developer is in full charge of layout and styling
+   accessbility is supported.

### Handle new Feature.

[One new feature](https://buganizer.corp.google.com/issues/70637030) is request
before launch. BA asks one field should only allow alphanumeric characters.

Here is [the implementation for that new
feature.](https://critique.corp.google.com/#review/179108083/depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/services/product_metadata.ts).

You only need to change the property specification/

### notes for myself

[components deleted when moving code to dynamic
form](ttps://critique.corp.google.com/#review/174905152)

[additioninfo component; not
used](https://cs.corp.google.com/piper///depot/google3/experimental/order_monetizer/product/client/product/product_edit/components/additional_info/additional-info.html?l=17)

[implementation with dynamic
form](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/product/product_edit/product_edit.ng.html)
