import { type Customers } from "#cds-models/sales";

export interface ICustomerController {
  afterRead(data: Customers): Customers;
}
