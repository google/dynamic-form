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

/**
 * This is the sample definition of BookLookup class.
 * In production, this is usually defined by back-end services.
 */
export class BookLookup {
  name: string;
  description: string;
  author: string;
  price: Price;
  isAvailable: boolean;
  // Add "country" to demonstrate Lookup usage.
  country: string;


  constructor(
      name?: string, description?: string, author?: string, price?: Price,
      isAvailabe?: boolean, country?: string) {
    this.name = name ? name : '';
    this.description = description ? description : '';
    this.author = author ? author : '';
    this.price = price ? price : {amount: 0.00, currency: 'USD'};
    this.isAvailable = isAvailabe ? isAvailabe : false;
    this.country = country ? country : 'US';
  }
}

/**
 * Here we have a separate interface Price to demonstrate a little complex
 * scenario, where the structure of entity and instance are not the same.
 */
export interface Price {
  amount: number;
  currency: string;
}
