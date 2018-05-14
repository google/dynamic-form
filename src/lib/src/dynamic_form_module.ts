/**
 * Copyright 2018 Google LLC
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 * https://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {HttpClientModule} from '@angular/common/http';
import {NgModule} from '@angular/core';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {MatAutocompleteModule, MatButtonModule, MatCheckboxModule, MatDatepickerModule, MatDialogModule, MatIconModule, MatInputModule, MatRadioModule, MatRippleModule, MatSelectModule, MatSlideToggleModule, MatTooltipModule} from '@angular/material';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DisableContext, RequiredContext, RestrictLookupContext, SegmentedClearValueContext, SegmentedRequiredContext, SegmentedShowHideContext, SetValueContext, ShowHideContext} from './/meta_datamodel';
import {EntityContextDirective, PropContextDirective} from './entity_directives';
import {InstEditorComponent} from './inst_editor';
import {ContextProcessors, DefaultInstPopulater, DefaultValueConverter, DisableContextProcessor, PropValueSetterGetters, RequiredProcessor, RestrictedLookupProcessor, SegmentedClearValueProcessor, SegmentedRequiredProcessor, SegmentedShowHideProcessor, SetValueContextProcessor, ShowHideContextProcessor} from './inst_service';
import {InstViewerComponent} from './inst_viewer';
import {DynamicFieldPropertyComponent} from './prop_component';
import {DynamicFieldPropertyViewerComponent} from './prop_viewer';
import {EntityMetaDataRepository, LookupSources} from './repositories';

@NgModule({
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatTooltipModule,
    MatSlideToggleModule,
    MatAutocompleteModule,
    HttpClientModule,
  ],
  declarations: [
    DynamicFieldPropertyComponent,
    DynamicFieldPropertyViewerComponent,
    EntityContextDirective,
    PropContextDirective,
    InstEditorComponent,
    InstViewerComponent,
  ],
  providers: [
    {
      provide: EntityMetaDataRepository,
      useClass: EntityMetaDataRepository,
    },
    {
      provide: LookupSources,
      useClass: LookupSources,
    },
    PropValueSetterGetters,
    DefaultValueConverter,
    ContextProcessors,
    ShowHideContextProcessor,
    SetValueContextProcessor,
    DisableContextProcessor,
    RestrictedLookupProcessor,
    RequiredProcessor,
    SegmentedShowHideProcessor,
    SegmentedRequiredProcessor,
    SegmentedClearValueProcessor,
    DefaultInstPopulater,
  ],
  exports: [
    DynamicFieldPropertyComponent,
    DynamicFieldPropertyViewerComponent,
    EntityContextDirective,
    PropContextDirective,
    InstEditorComponent,
    InstViewerComponent,
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatRadioModule,
    MatRippleModule,
    MatSelectModule,
    MatTooltipModule,
    MatSlideToggleModule,
  ],

})
export class DynamicFormModule {
  constructor(
      processors: ContextProcessors, showHide: ShowHideContextProcessor,
      setValue: SetValueContextProcessor, disable: DisableContextProcessor,
      restricted: RestrictedLookupProcessor, required: RequiredProcessor,
      segmentedShowHide: SegmentedShowHideProcessor,
      segmentedRequired: SegmentedRequiredProcessor,
      segmentedClearValue: SegmentedClearValueProcessor) {
    processors.registerContextProcessor(ShowHideContext.TYPE, showHide);
    processors.registerContextProcessor(SetValueContext.TYPE, setValue);
    processors.registerContextProcessor(DisableContext.TYPE, disable);
    processors.registerContextProcessor(RestrictLookupContext.TYPE, restricted);
    processors.registerContextProcessor(RequiredContext.TYPE, required);
    processors.registerContextProcessor(
        SegmentedClearValueContext.TYPE, segmentedClearValue);
    processors.registerContextProcessor(
        SegmentedRequiredContext.TYPE, segmentedRequired);
    processors.registerContextProcessor(
        SegmentedShowHideContext.TYPE, segmentedShowHide);
  }
}
