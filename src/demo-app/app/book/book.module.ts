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

import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material';
import {RouterModule} from '@angular/router';
import {DynamicFormModule} from '../../../lib/src/dynamic_form_module';
import {PropValueSetterGetters} from '../../../lib/src/inst_service';
import {Entity} from '../../../lib/src/meta_datamodel';
import {EntityMetaDataRepository} from '../../../lib/src/repositories';

import {BookComponent} from './book';
import {BOOK_ENTITY, BookValueSetterGetter} from './book_metadata';

@NgModule({
  imports: [
    DynamicFormModule,
    MatButtonModule,
    FormsModule,
    RouterModule,
  ],
  providers: [
    BookValueSetterGetter,
  ],
  declarations: [
    BookComponent,
  ],
  bootstrap: [
    BookComponent,
  ]
})
export class BookModule {
  constructor(
      entityMetaDataRepository: EntityMetaDataRepository,
      propValueSetterGetters: PropValueSetterGetters,
      bookValueSetterGetter: BookValueSetterGetter,
  ) {
    // Register Book entity to the entity repository.
    // You only need to do this ONCE in your application.
    entityMetaDataRepository.registerMetaData(
        new Entity(BOOK_ENTITY.name, BOOK_ENTITY.props, BOOK_ENTITY.contexts));
    // Register Book entity setter and getter to repository.
    // You only need to do this ONCE in your application.
    propValueSetterGetters.registerSetterGetter(bookValueSetterGetter);
  }
}
