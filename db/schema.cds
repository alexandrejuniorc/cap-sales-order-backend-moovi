using {managed} from '@sap/cds/common';

namespace sales;

entity SalesOrderHeaders : managed {
    key id          : UUID;
        totalAmount : Decimal(15, 2);

        customer    : Association to Customers;
        items       : Composition of many SalesOrderItems
                          on items.header = $self;
}

entity SalesOrderItems {
    key id       : UUID;
        quantity : Integer;
        price    : Decimal(15, 2);

        header   : Association to SalesOrderHeaders;
        product  : Association to Products;
}

entity Customers {
    key id        : UUID;
        firstName : String(20);
        lastName  : String(100);
        email     : String(255);
}

entity Products {
    key id    : UUID;
        name  : String(255);
        price : Decimal(15, 2);
}
