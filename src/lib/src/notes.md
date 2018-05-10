#EntityMetaDataRespository
Containing the meta data for all Entities used by frontend web UI



# Value Representation
A value has 3 type representation
+ UI Value: Used by UI and FormControl. For example, LookupValue is represented as a Lookup Object from Lookup Src
+ Prop Value: Used by entity.prop. This value is a typed, object style value. But it may be different from UI object
+ string value: used to specified default value and entity context specification


#TODO
+ support an array of value for <input>
+ support multi select
+ add namespace support to separate the name to avoid entity name conflict
+ currency format in view






#property editor (DynamicFieldComponent)
+ option to show placeholder mode (auto, float, always) or no (for list layout)
+ angular material date picker for date


#TODO big item: new component
+ UI to define property
+ UI to manage lookup and values
+ generate the data model from Discovery BUILD RULE and Discovery URL

