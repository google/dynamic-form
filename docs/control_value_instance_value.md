# Control Value is not bound to instance Value

+   When a value is changed by user, the DOM input(&lt;input&gt;)'s value is
    updated by browser
+   The DOM input's value is pushed to Angular Form Control. Angular FormControl
    is used internally by this library

Here we have a bidirection binding between DOM input and FormControl.

However, the FormControl's value is not pushed to instance. This has the
benefits.

+   Instance is not touched. You can reset the form.
+   You can easily find out what property is modified.

When it is time to save the form, you can manually pull the value from Dynamic
Form Field components, set them to instance before handling the instance over to
server for saving.

Here is [an example:
Product_edit.ts->collectValues](https://cs.corp.google.com/piper///depot/google3/java/com/google/corp/bizapps/om/omweb/product/client/product/product_edit/product_edit.ts?l=239)
