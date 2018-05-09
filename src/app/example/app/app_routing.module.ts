import {NgModule} from '@angular/core';
import {RouterModule, Routes} from '@angular/router';

import {BookComponent} from './book/book';
import {BookLookupComponent} from './book_lookup/book_lookup';

const routes: Routes = [
  {path: '', redirectTo: '/book', pathMatch: 'full'},
  {path: 'book', component: BookComponent},
  {path: 'book_lookup', component: BookLookupComponent},
];

@NgModule({imports: [RouterModule.forRoot(routes)], exports: [RouterModule]})
export class AppRoutingModule {
}
