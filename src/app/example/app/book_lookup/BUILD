load("//javascript/angular2:build_defs.bzl", "ng_module")

package(default_visibility = ["//java/com/google/corp/bizapps/om/omweb:internal"])

ng_module(
    name = "book_lookup",
    srcs = [
        "book_lookup.module.ts",
        "book_lookup.ts",
        "book_lookup_metadata.ts",
        "book_lookup_sample.ts",
    ],
    assets = [
        "book_lookup.css",
        "book_lookup.ng.html",
    ],
    deps = [
        "//java/com/google/corp/bizapps/om/omweb/shared/dynamicform",
        "//java/com/google/corp/bizapps/om/omweb/shared/dynamicform:proto_to_entity_converter_lib",
        "//javascript/typescript/contrib:assert",
        "//third_party/javascript/angular2:core",
        "//third_party/javascript/angular2:forms",
        "//third_party/javascript/angular2:material",
        "//third_party/javascript/angular2:router",
        "//third_party/javascript/node_modules/typescript:es2015.core",
    ],
)
