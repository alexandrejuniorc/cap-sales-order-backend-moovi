import { type Customers } from "#cds-models/sales";
import { CustomerModel } from "@/srv/models/customer.js";
import { type ICustomerService } from "./protocols.js";

export class CustomerService implements ICustomerService {
  constructor() {}

  afterRead(data: Customers): Customers {
    return data.map((customer) =>
      CustomerModel.create({
        id: customer.id as string,
        firstName: customer.firstName as string,
        lastName: customer.lastName as string,
        email: customer.email as string,
      })
        .setDefaultEmailDomain()
        .toObject(),
    );
  }
}
