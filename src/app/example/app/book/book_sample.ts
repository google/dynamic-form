/**
 * This is the sample definition of Book class.
 * In production, this is usually defined by back-end services.
 */
export class Book {
  name: string;
  description: string;
  author: string;
  price: Price;
  isAvailable: boolean;

  constructor(
      name?: string, description?: string, author?: string, price?: Price,
      isAvailabe?: boolean) {
    this.name = name ? name : '';
    this.description = description ? description : '';
    this.author = author ? author : '';
    this.price = price ? price : {amount: 0.00, currency: 'USD'};
    this.isAvailable = isAvailabe ? isAvailabe : false;
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
