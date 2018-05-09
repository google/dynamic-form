load("//javascript/angular2:build_defs.bzl", "ng_module")

package(default_visibility = ["//java/com/google/corp/bizapps/om/omweb:internal"])

ng_module(
    name = "book",
    srcs = [
        "book.module.ts",
        "book.ts",
        "book_metadata.ts",
        "book_sample.ts",
    ],
    assets = ["book.ng.html"],
    deps = [
        "//java/com/google/corp/bizapps/om/omweb/shared/dynamicform",
        "//java/com/google/corp/bizapps/om/omweb/shared/dynamicform:proto_to_entity_converter_lib",
        "//third_party/javascript/angular2:core",
        "//third_party/javascript/angular2:forms",
        "//third_party/javascript/angular2:material",
        "//third_party/javascript/angular2:router",
    ],
)
