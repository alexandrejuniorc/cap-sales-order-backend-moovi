import cds, { type Service, type Request } from "@sap/cds";
import { type Customers } from "#cds-models/sales";

export default (srv: Service) => {
  srv.after("READ", "SalesOrderHeaders", (results: Customers) => {
    results.forEach((customer) => {
      if (!customer.email?.includes("@")) {
        customer.email = `${customer.email}@nãoexiste.com`;
      }
    });
  });

  srv.before("CREATE", "SalesOrderHeaders", async (req: Request) => {
    const { customer_id, items } = req.data;

    if (!customer_id) {
      return req.reject(400, "Customer ID is required");
    }

    if (!items || items.length === 0) {
      return req.reject(400, "At least one item is required");
    }

    const CUSTOMER_EXISTS_QUERY = SELECT.one
      .from("sales.Customers")
      .where({ id: customer_id });
    const customerExists = await cds.run(CUSTOMER_EXISTS_QUERY);

    if (!customerExists) {
      return req.reject(400, `Customer with ID ${customer_id} does not exist`);
    }
  });
};
