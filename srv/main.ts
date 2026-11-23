import cds, { type Service, type Request } from "@sap/cds";
import {
  type Customers,
  type Product,
  type Products,
  type SalesOrderHeaders,
  type SalesOrderItem,
  type SalesOrderItems,
} from "#cds-models/sales";

export default (srv: Service) => {
  srv.before("READ", "*", (req: Request) => {
    const isUser = req.user.is("user");
    const isAdmin = req.user.is("admin");

    if (!isUser && !isAdmin) {
      req.reject(403, "Access denied: You do not have permission to read this data.");
    }
  });

  srv.before(["WRITE", "UPDATE", "DELETE"], "*", (req: Request) => {
    const isAdmin = req.user.is("admin");

    if (!isAdmin) {
      req.reject(403, "Access denied: You do not have permission to modify this data.");
    }
  });

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
      totalAmount: number;
    };

    if (!customer_id) {
      return req.reject(400, "Customer ID is required");
    }

    if (!items || items.length === 0) {
      return req.reject(400, "At least one item is required");
    }

    const CUSTOMER_EXISTS_QUERY = SELECT.one.from("sales.Customers").where({ id: customer_id });
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
      const product = products.find((product) => product.id === item.product_id);

      if (!product) {
        return req.reject(404, `Product with ID ${item.product_id} does not exist`);
      }

      const quantity = item.quantity ?? 0;
      const stock = product.stock ?? 0;

      if (quantity <= 0) {
        return req.reject(400, `Quantity for product ${product.id} must be greater than zero`);
      }

      if (stock < quantity) {
        return req.reject(
          400,
          `Product (${product.id} - ${product.name}) has insufficient stock: requested ${quantity}, available ${stock}`,
        );
      }
    }

    let totalAmount = 0;

    items.forEach((item: SalesOrderItem) => {
      totalAmount += (item.price as number) * (item.quantity as number);
    });

    req.data.totalAmount = totalAmount;
  });

  srv.after("CREATE", "SalesOrderHeaders", async (results: SalesOrderHeaders, request: Request) => {
    const salesOrderHeaders = Array.isArray(request.data) ? request.data : ([request.data] as SalesOrderHeaders);

    for (const salesOrderHeader of salesOrderHeaders) {
      const salesOrderItems = salesOrderHeader.items as SalesOrderItems;

      for (const salesOrderItem of salesOrderItems) {
        await cds
          .update("sales.Products")
          .where({ id: salesOrderItem.product_id })
          .with({ stock: { "-=": salesOrderItem.quantity } });
      }
    }
  });
};
