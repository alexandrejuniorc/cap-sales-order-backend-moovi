import cds, { type Service, type Request } from "@sap/cds";
import {
  type Customers,
  type Product,
  type SalesOrderItem,
} from "#cds-models/sales";

export default (srv: Service) => {
  srv.after("READ", "SalesOrderHeaders", (results: Customers) => {
    results.forEach((customer) => {
      if (!customer.email?.includes("@")) {
        customer.email = `${customer.email}@nãoexiste.com`;
      }
    });
  });

  srv.before("CREATE", "SalesOrderHeaders", async (req: Request) => {
    const { customer_id, items } = req.data as {
      customer_id: string;
      items: SalesOrderItem[];
    };

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

    const productIds = items.map((item: SalesOrderItem) => item.product_id);
    const PRODUCTS_EXISTS_QUERY = SELECT.from("sales.Products").where({
      id: { in: productIds },
    });
    const products = (await cds.run(PRODUCTS_EXISTS_QUERY)) as Product[];

    for (const item of items) {
      const product = products.find(
        (product) => product.id === item.product_id,
      );

      if (!product) {
        return req.reject(
          404,
          `Product with ID ${item.product_id} does not exist`,
        );
      }

      if (product.stock === 0) {
        return req.reject(
          400,
          `Product (${product.id} - ${product.name}) is out of stock`,
        );
      }
    }
  });
};
