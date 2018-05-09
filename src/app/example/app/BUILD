load("//javascript/angular2:build_defs.bzl", "ng_module")

package(default_visibility = ["//java/com/google/corp/bizapps/om/omweb:internal"])

ng_module(
    name = "example",
    srcs = [
        "app.component.ts",
        "app.module.ts",
        "app_routing.module.ts",
    ],
    assets = ["app.ng.html"],
    deps = [
        "//java/com/google/corp/bizapps/om/omweb/shared/dynamicform",
        "//java/com/google/corp/bizapps/om/omweb/shared/dynamicform/example/app/book",
        "//java/com/google/corp/bizapps/om/omweb/shared/dynamicform/example/app/book_lookup",
        "//java/com/google/corp/bizapps/om/omweb/shared/dynamicform/example/app/proto_demo",
        "//third_party/javascript/angular2:common",
        "//third_party/javascript/angular2:core",
        "//third_party/javascript/angular2:forms",
        "//third_party/javascript/angular2:material",
        "//third_party/javascript/angular2:router",
    ],
)
