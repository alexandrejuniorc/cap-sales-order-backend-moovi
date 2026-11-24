import { type Customers } from "#cds-models/sales";
import { type ICustomerService } from "@/srv/services/customer/protocols.js";
import { type ICustomerController } from "./protocols.js";

export class CustomerController implements ICustomerController {
  constructor(private readonly customerService: ICustomerService) {}

  public afterRead(data: Customers): Customers {
    return this.customerService.afterRead(data);
  }
}
