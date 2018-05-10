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
