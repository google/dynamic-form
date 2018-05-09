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
