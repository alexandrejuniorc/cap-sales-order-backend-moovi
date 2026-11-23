using {sales} from '../db/schema';

@requires: ['authenticated-user']
service MainService {
    @requires: [
        'user',
        'admin'
    ]
    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;

    @requires: [
        'user',
        'admin'
    ]
    entity Customers         as projection on sales.Customers;

    @requires: ['admin']
    entity Products          as projection on sales.Products;
}
