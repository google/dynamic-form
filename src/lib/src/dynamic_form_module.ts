/**
 * @license
 * Copyright Google LLC All Rights Reserved.
 *
 * Use of this source code is governed by an MIT-style license that can be
 * found in the LICENSE file at https://angular.io/license
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
