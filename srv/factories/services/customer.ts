import { CustomerService } from "@/srv/services/customer/implementation.js";
import { type ICustomerService } from "@/srv/services/customer/protocols.js";

const makeCustomerService = (): ICustomerService => {
  return new CustomerService();
};

export const customerService = makeCustomerService();
