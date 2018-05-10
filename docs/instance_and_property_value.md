# Explain Instance concept and Property Value

## Instance

Instance can be anything. It doesn't have to match the Entity Definition.

The only requirement is **this library need to know how to retrieve property
value from instance** so FormControl can retrieve the value and use it as
initial value.

For this purpose, you define a [Property Setter and
Getter](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/inst_service.ts?l=11)
for your Entity. It has two methods:

+   get property value from instance
+   set property value from instance

here is an
[example](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/services/product_impl.ts?l=162).
It is registered to system
[here](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/services/product_dynamic_module.ts?l=49)

## Simple Property Setter and Getter

If your property can be accessed by property name like this inst[propName], you
don't define Property Setter and Getter. It is supported by system

## Create a new instance

A new Instance can be created by using
[DefaultInstPopulater](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/inst_service.ts?l=111).

```javascript
  const newInstance = defaultInstPopulater.populateInstance(inst, entity);
```

This will set values for all property with a defaultValue.
