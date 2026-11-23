using {sales} from '../db/schema';

@requires: ['authenticated-user']
service MainService {
    @restrict: [
        {
            grant: 'READ',
            to   : 'user'
        },
        {
            grant: [
                'READ',
                'WRITE'
            ],
            to   : 'admin'
        }
    ]
    entity SalesOrderHeaders as projection on sales.SalesOrderHeaders;

    @restrict: [
        {
            grant: 'READ',
            to   : 'user'
        },
        {
            grant: [
                'READ',
                'WRITE'
            ],
            to   : 'admin'
        }
    ]
    entity Customers         as projection on sales.Customers;

    @restrict: [{
        grant: [
            'READ',
            'WRITE'
        ],
        to   : 'admin'
    }]
    entity Products          as projection on sales.Products;

    @restrict: [{
        grant: ['READ'],
        to   : [
            'admin',
            'developer'
        ]
    }]
    entity SalesOrderLogs    as projection on sales.SalesOrderLogs;
}
