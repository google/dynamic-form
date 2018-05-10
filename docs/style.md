# Styling your form control

This library uses angular material form component internally. So angular
material theme applies

***Here are the behavior provided by default style.scss***

+   by default allinputs are laid out horizontally.
+   You can add 'vertical' css class to container tag so they are laid out
    vertically
+   Label and value are laid in the same line in ***View*** mode. Add 'full' css
    class to container tag so they are in separate lines

Please check example application to see how properties are styled.

Here are some recommendations how you style a particular property component

Attach ngClass to your gdf-prop

```html
 <gdf-prop [ngClass]="[propCtx.prop.name, propCtx.prop.controlType,
                                 propCtx.prop.type]"
                                          [inst]="inst"
                                          (valueChanges)="onTypeChange($event)"
                                          [prop]="propCtx.prop"></gdf-prop>
```

Here I attach these css classes to each gdf-prop

+   property name : so that I can pick out one specific property for styling
+   property control type: so I can pick all properties of the same control type
    for styling
+   property type: so I can pick all properties of the same type for styling

Here is [one example
css](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/product/product_edit/product_edit.scss).
Pay attention to those style attached to gdf-prop
