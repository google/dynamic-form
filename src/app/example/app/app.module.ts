import 'hammerjs';

import {APP_BASE_HREF} from '@angular/common';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule} from '@angular/material';

import {DynamicFormModule} from '../../dynamic_form_module';

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
