import { CustomerController } from "@/srv/controllers/customer/implementation.js";
import { type ICustomerController } from "@/srv/controllers/customer/protocols.js";
import { customerService } from "../services/customer.js";

const makeCustomerController = (): ICustomerController => {
  return new CustomerController(customerService);
};

export const customerController = makeCustomerController();
