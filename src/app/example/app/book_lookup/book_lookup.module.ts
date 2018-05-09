import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {MatButtonModule, MatTabsModule} from '@angular/material';
import {RouterModule} from '@angular/router';

import {DynamicFormModule} from '../../../dynamic_form_module';
import {PropValueSetterGetters} from '../../../inst_service';
import {Entity} from '../../../meta_datamodel';
import {EntityMetaDataRepository, LookupSources, NameValueLookupSource, NameValueLookupValue} from '../../../repositories';

import {BookLookupComponent} from './book_lookup';
import {BOOK_LOOKUP_ENTITY, BOOK_LOOKUP_SRC, BookLookupValueSetterGetter} from './book_lookup_metadata';

@NgModule({
  imports: [
    DynamicFormModule,
    MatButtonModule,
    FormsModule,
    RouterModule,
    MatTabsModule,
  ],
  providers: [
    BookLookupValueSetterGetter,
  ],
  declarations: [
    BookLookupComponent,
  ],
  bootstrap: [
    BookLookupComponent,
  ]
})
export class BookLookupModule {
  constructor(
      entityMetaDataRepository: EntityMetaDataRepository,
      propValueSetterGetters: PropValueSetterGetters,
      bookLookupValueSetterGetter: BookLookupValueSetterGetter,
      lookupSources: LookupSources,
  ) {
    // Registers Book entity to the entity repository.
    // You only need to do this ONCE in your application.
    entityMetaDataRepository.registerMetaData(new Entity(
        BOOK_LOOKUP_ENTITY.name, BOOK_LOOKUP_ENTITY.props,
        BOOK_LOOKUP_ENTITY.contexts));
    // Registers BookLookup entity setter and getter to repository.
    // You only need to do this ONCE in your application.
    propValueSetterGetters.registerSetterGetter(bookLookupValueSetterGetter);
    // Registers LookupSource to repository.
    // You only need to do this ONCE in your application.
    lookupSources.registerLookupSource(
        BOOK_LOOKUP_SRC, this.getCustomLookupSource());
  }

  /**
   * Constructs the custom Lookup Source.
   * Here we construct the Lookup Source with two Lookups: currency, country.
   * And we utilize the NameValueLookupSource and NameValueLookupValue class to
   * do so.
   * In order to construct a Lookup Source, we need to have a class implements
   * LookupSource interface. And class NameValueLookupSource implements
   * LookupSource interface, is provided by the library already.
   * With NameValueLookupSource, you can have your own Lookup Source in a map
   * structure, and Lookup Value would be like this:
   * {value: 'US', description: 'United States'}
   * value is what to store,
   * description is what to display on UI.
   * You can also have your own Lookup Source class instead of utilizing
   * NameValueLookupSource like we do here. Just need to make sure the class
   * implements LookupSource interface.
   */
  private getCustomLookupSource(): NameValueLookupSource {
    // Defines currency Lookup values.
    const currencyLookupValues: NameValueLookupValue[] = [];
    currencyLookupValues.push(new NameValueLookupValue('U.S. Dollar', 'USD'));
    currencyLookupValues.push(
        new NameValueLookupValue('Canadian Dollar', 'CAD'));
    currencyLookupValues.push(new NameValueLookupValue('Chinese Yuan', 'CNY'));
    currencyLookupValues.push(new NameValueLookupValue('Euro', 'EUR'));
    currencyLookupValues.push(
        new NameValueLookupValue('Australian Dollar', 'AUD'));

    // Defines country Lookup values.
    const countryLookupValues: NameValueLookupValue[] = [];
    countryLookupValues.push(new NameValueLookupValue('United States', 'US'));
    countryLookupValues.push(new NameValueLookupValue('Canada', 'CA'));
    countryLookupValues.push(new NameValueLookupValue('China', 'CN'));
    countryLookupValues.push(new NameValueLookupValue('Europe', 'EU'));
    countryLookupValues.push(new NameValueLookupValue('Australia', 'AU'));

    // Creates Lookup Source and adds currencyLookupValues, countryLookupValues
    // to it.
    // Note: the name of each Lookup needs to match what you define as the
    // property name in the entity (./book_lookup_metadata.ts).
    const customLookupSource = new NameValueLookupSource();
    customLookupSource.lookups.set('currency', currencyLookupValues);
    customLookupSource.lookups.set('country', countryLookupValues);

    return customLookupSource;
  }
}
