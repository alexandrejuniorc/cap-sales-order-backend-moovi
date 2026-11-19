import type { Service } from "@sap/cds";
import type { Customers } from "#cds-models/sales";

export default (srv: Service) => {
  srv.after("READ", "SalesOrderHeaders", (results: Customers) => {
    results.forEach((customer) => {
      if (!customer.email?.includes("@")) {
        customer.email = `${customer.email}@nãoexiste.com`;
      }
    });
  });
};
