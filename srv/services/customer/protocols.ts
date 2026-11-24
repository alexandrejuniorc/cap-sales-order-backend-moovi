import { type Customers } from "#cds-models/sales";

export interface ICustomerService {
  afterRead(data: Customers): Customers;
}
