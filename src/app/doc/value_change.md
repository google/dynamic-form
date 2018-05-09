# Listen for ValueChange event

If one or more properties are changed, you want to do something like
showing/hiding/disabling/enabling controls for other properties in the same
entity. This can be accomplished by adding context metadata to Entity. Several
Context implementation are provided out of box. Please refer the [this
file](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/shared/dynamicform/meta_datamodel.ts?l=129)
for supported context.

Test folder has examples for each context.

You have several options if what you want is ==not supported==.

## Add valueChanges event listener to a particular gdf-prop.

```html
      <gdf-prop [prop]="prop" [ngClass]="prop.name" [inst]="inst" (valueChanges)="onValueChange(newValue)"></gdf-prop>
```

## Add a new Context

If you think your case is generic enough, please file a request so it can be
supported by this library out of box.

## subscribe FormControl.valueChanges.

You can query all the DynamicFieldPropertyComponents in yout container
component. Here is [one
example](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/product/product_edit/product_edit.ts?l=32).
You then subscribe one particular component like this

```javascript
this.propComps.find(dfComp=>dfComp.prop.name === 'propName').control.subscribe((value)=>{
 console.log(`value is changed to ${value}`);
});
```
