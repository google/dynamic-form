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

import 'hammerjs';

import {APP_BASE_HREF} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {DynamicFormModule} from '../../lib/src/dynamic_form_module';

import {AppComponent} from './app.component';
import {AppRoutingModule} from './app_routing.module';
import {BookModule} from './book/book.module';
import {BookLookupModule} from './book_lookup/book_lookup.module';

@NgModule({
  imports: [
    DynamicFormModule,
    MatButtonModule,
    FormsModule,
    AppRoutingModule,
    BookModule,
    BookLookupModule,
    BrowserAnimationsModule,
  ],
  providers: [{provide: APP_BASE_HREF, useValue: '/'}],
  declarations: [
    AppComponent,
  ],
  bootstrap: [
    AppComponent,
  ]
})
export class AppModule {
}
