A data service for generating and storing mocked market data.

# Build

To build use the scripts below:

```javascript
npm install
npm run build
```

# Output

Output bundles are available in format for usage.

## Glue42 Desktop

```javascript
 "data-service": "dist/data-service-${projectVersion}.js",
 "data-service-map": "dist/data-service-${projectVersion}.js.map"
 "index.html": "dist/index.html",
```

## Glue42 Core

Take the data-service js file and reference it in your Glue initialization file. Add plugin property to your glue config

```javascript
webPlatform: {
  config: {
    plugins: {
      definitions: [
        {
          name: 'data-service',
          critical: true,
          start: (glue) => {
            async function main() {
                await MockDataGenerator(glue)
              }
            }

            main()
          },
        },
      ]
    }
  }
}
```

# Registered methods

## T42.OMS.GetBidData

Generates a list of bids for instrument.

| Property    | Type     | Description                                                    | Required |
| ----------- | -------- | -------------------------------------------------------------- | -------- |
| `ticker`    | `string` | Instrument ticker                                              | Yes      |
| `lastPrice` | `number` | Price based on which the prices for the bids will be generated | Yes      |

Returns
| Property | Type |
|----------|------|
| `bids` | `BidData[]` |

Example

```js
{
  bids: [
    {
      count: 5,
      volume: 7900,
      price: 2770.99,
      side: '1',
    },
    {
      count: 4,
      volume: 10500,
      price: 3192.67,
      side: '2',
    },
  ]
}
```

## T42.OMS.MarketData [stream]

Stream market generated data for the specific instrument list. Subscribe for each symbol in the list.

Accepts
| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `instrumentList` | `Fdc3InstrumentList` | List with fdc3 instruments | Yes |

Returns
| Property | Type | Description |
|----------|------|-------------|
| `ticker` | `string` | Instrument ticker
| `lastTradedVolume` | `number` |Last traded volume
| `lastPrice` | `number` | Last traded price
| `openPrice` | `number` | Open price
| `lowPrice` | `number` | Lowest traded price for the day
| `highPrice` | `number` | Highest traded price for the day
| `prevClosePrice` | `number` | Close price for yesterday
| `totalVWAP` | `number` | Volume-weighted average price
| `time` | `Date` | Time of generating the data
| `description` | `String` | Description name
| `isin` | `string` | International Securities Identification Number
| `currency` | `string` | Currency of the

Example

```js
{
  data:
    {
      ticker: "BARC",
      volume: 36564354,
      lastTradedVolume: 10000,
      lastPrice: 212.901,
      openPrice: 237.003,
      lowPrice: 241.01999999999998,
      highPrice: 241.01999999999998,
      prevClosePrice: 160.68,
      totalVWAP: 236.60129999999998,
      time: "2022-02-18T15:18:18.368Z",
      description: "Barclays Plc",
      isin: "GB0031348658",
      currency: "GBX"
  }
}
```

# OrderManagementService

Stores custom orders and trades, created by T42.OMS.CreateOrder and T42.OMS.CreateTrade.
Generate orders, trades and slices. Once an order is generated slices are generated for the order until it's filled.

## T42.OMS.GetOrders

Accepts
| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `date` | `Date` | End period of the generated orders. Start period is 00.00.00 the same day | Yes |
| `withSlices` | `boolean` | Include the corresponding slices for the orders | No |
| `withTrades` | `boolean` | Include the corresponding trades for the orders | No |

Returns
| Property | Type |
|----------|------|
| `orders` | `OrderInfo []` |
| `slices` | `OrderSlice []` |
| `trades` | `OrderTrade []` |

Example

```js
{
  orders: [
    {
      orderId: 46342144,
      clientId: 'TEST2',
      instrument: 'ITV:LN',
      currency: 'GBX',
      side: '1',
      quantity: 840,
      quantityFilled: 840,
      dateCreated: '2022-02-18T07:02:28.000Z',
      orderType: '1',
      timeInForce: '0',
      limitPrice: 0,
      comments: '',
      averagePrice: 114.65121428571427,
      tradeStatus: 'Done',
      brokerId: 'XX',
      bookId: 'AGENCY',
      split: [
        {
          brokerIndex: 1,
          quantity: 840,
        },
      ],
    },
  ],
  trades: [
    [
        {
            orderId: 46342144,
            clientId: "TEST2",
            sliceId: 4634214401,
            side: "1",
            instrument: "ITV:LN",
            currency: "GBX",
            timestamp: "2022-02-18T07:02:47.000Z",
            quantity: 480,
            price: 116.6715,
            execBroker: "BROKER2",
            exchange: "XOFF",
            comments: "",
            bookId: "AGENCY"
        },
        {
            orderId: 46342144,
            clientId: "TEST2",
            sliceId: 4634214401,
            side: "1",
            instrument: "ITV:LN",
            currency: "GBX",
            timestamp: "2022-02-18T07:03:12.000Z",
            quantity: 360,
            price: 111.9575,
            execBroker: "BROKER2",
            exchange: "XOFF",
            comments: "",
            bookId: "AGENCY"
        }
    ],
  ],
  slices: [
    [
      {
          orderId: 46342144,
          clientId: "TEST2",
          instrument: "ITV:LN",
          currency: "GBX",
          side: "1",
          quantity: 840,
          quantityFilled: 840,
          dateCreated: "2022-02-18T07:02:28.000Z",
          orderType: "1",
          timeInForce: "0",
          limitPrice: 0,
          comments: "",
          averagePrice: 114.65121428571427,
          tradeStatus: "Done",
          brokerId: "BROKER2",
          bookId: "AGENCY",
          split: [
              {
                  brokerIndex: 1,
                  quantity: 840
              }
          ],
          sliceId: 4634214401,
          brokerExchange: "XOFF"
      }
    ]
  ]
}
```

## T42.OMS.GetOrder

Returns single order with it's corresponding slices and trades if passed in the arguments.

Accepts
| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `orderId` | `String` | Id of the requested order | Yes |
| `date` | `Date` | End period of the generated orders of which the order will be filtered from. Start period is 00.00.00 the same day | Yes |
| `withSlices` | `boolean` | Include the corresponding slices for the orders | No |
| `withTrades` | `boolean` | Include the corresponding trades for the orders | No |

Returns
| Property | Type |
|----------|------|
| `order` | `OrderInfo` |
| `slices` | `OrderSlice []` |
| `trades` | `OrderTrade []` |

Example

```js
{
  order: {
    dateCreated: "2022-02-18T07:05:31.000Z",
    side: "2",
    currency: "GBX",
    limitPrice: 0,
    quantityFilled: 1920,
    tradeStatus: "Done",
    quantity: 1920,
    brokerId: "XX",
    split: [
      {
        "brokerIndex": 1,
        "quantity": 1920
      }
    ],
    instrument: "BATS:LN",
    clientId: "TEST1",
    bookId: "AGENCY",
    averagePrice: 2600.359375,
    comments: "",
    orderId: 46342146,
    timeInForce: "0",
    orderType: "1"
  },
  slices: [
    {
      dateCreated: "2022-02-18T07:05:31.000Z",
      brokerExchange: "XOFF",
      side: "2",
      currency: "GBX",
      limitPrice: 0,
      quantityFilled: 1920,
      tradeStatus: "Done",
      quantity: 1920,
      brokerId: "BROKER2",
      split: [
          {
              brokerIndex: 1,
              quantity: 1920
          }
      ],
      instrument: "BATS:LN",
      clientId: "TEST1",
      bookId: "AGENCY",
      averagePrice: 2600.359375,
      comments: "",
      orderId: 46342146,
      sliceId: 4634214601,
      timeInForce: "0",
      orderType: "1"
    }
  ]
}
```

## T42.OMS.GetAllTrades

Return all daily trades as of date/time

Accepts
| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `date` | `Date` | End period of the trades. Start period is 00.00.00 the same day | Yes |

Returns
| Property | Type |
|----------|------|
| `trades` | `OrderTrade []` |

Example

```js
{
  trades: [
    {
      orderId: 46342144,
      clientId: 'TEST2',
      sliceId: 4634214401,
      side: '1',
      instrument: 'ITV:LN',
      currency: 'GBX',
      timestamp: '2022-02-18T07:02:47.000Z',
      quantity: 480,
      price: 116.6715,
      execBroker: 'BROKER2',
      exchange: 'XOFF',
      comments: '',
      bookId: 'AGENCY',
    },
  ]
}
```

## T42.OMS.GetOrderId

Returns orderId corresponding to the provided sliceId

Accepts
| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `sliceId` | `String` | sliceId of the required order | Yes |

Returns
| Property | Type |
|----------|------|
| `orderId` | `String` |

## T42.OMS.TradingPositions

Returns trading positions as of date/time for trades grouped by book and after that instruments

Accepts
| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `date` | `Date` | End period of the generated orders of which the order will be filtered from. Start period is 00.00.00 the same day | Yes |

Returns
| Property | Type |
|----------|------|
| `tradingPositions` | `TradePosition` |

Example

```js
{
  tradingPositions: {
    "AGENCY": {
      "ITV:LN": {
          book: "AGENCY",
          instrument: "ITV:LN",
          position: -1680,
          averagePrice: 119.87719589552236,
          totalVolume: 8040,
          totalPrice: 963812.6549999998,
          currency: "GBX"
      },
      "BATS:LN": {
          book: "AGENCY",
          instrument: "BATS:LN",
          position: -2972,
          averagePrice: 2474.029309596179,
          totalVolume: 9212,
          totalPrice: 22790758,
          currency: "GBX"
      }
    },
    "RISK": {
      "HSBA:LN": {
          book: "RISK",
          instrument: "HSBA:LN",
          position: 1260,
          averagePrice: 502.15,
          totalVolume: 7740,
          totalPrice: 3886641,
          currency: "GBX"
      },
      "BATS:LN": {
          book: "RISK",
          instrument: "BATS:LN",
          position: -3660,
          averagePrice: 2545.767027559055,
          totalVolume: 7620,
          totalPrice: 19398744.75,
          currency: "GBX"
      },
    }
  }
}
```

## T42.OMS.CreateOrder

Accepts
| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `order` | `OrderInfo` | Order which will be part of the custom orders | Yes |

Example

```
{
  order: {
    dateCreated: "2022-02-18T14:03:41.416Z",
    side: "2",
    currency: "GBX",
    limitPrice: 123,
    quantityFilled: 0,
    tradeStatus: "",
    expireTime: "2022-02-16T22:00:00.000Z",
    quantity: 123,
    brokerId: "",
    instrument: "BATS:LN",
    clientId: "client@outlook.com",
    averagePrice: 0,
    comments: "Instructions",
    orderId: 0,
    timeInForce: "6",
    orderType: "3"
  }
}
```

## T42.OMS.CreateTrade

Accepts
| Property | Type | Description | Required |
|----------|------|-------------|----------|
| `trade` | `OrderTrade` | Trade which will be part of the custom orders | Yes |

Example

```js
{
  trade: {
    side: "2",
    currency: "GBX",
    timestamp: "2022-02-18T09:59:00.000Z",
    quantity: 332,
    instrument: "BATS:LN",
    clientId: "TEST1",
    bookId: "AGENCY",
    comments: "Instructions",
    execBroker: "BROKER2",
    exchange: "XOFF",
    orderId: 46342146,
    sliceId: 4634214601,
    price: 123
  }
}

```

## T42.OMS.GetBrokers

Returns
| Property | Type |
|----------|------|
| `brokers` | `BrokerInfo[]` |

Example

```js
{
  brokers: [
    {
      brokerId: 'BROKER1',
      brokerExchange: 'XOFF',
    },
    {
      brokerId: 'BROKER2',
      brokerExchange: 'XOFF',
    },
  ]
}
```

## T42.OMS.GetInstruments

Retrieve a list of supported instruments

Returns
| Property | Type |
|----------|------|
| `instruments` | `InstrumentInfo[]` |

Example

```js
{
  instruments: {
    ticker: 'AZN',
    bbgExchange: 'LN',
    isin: 'GB0009895292',
    description: 'AstraZeneca Plc',
    currency: 'GBX',
    price: {
      close: 9138.0,
      yearLow: 6499.8,
      yearHigh: 9258.4,
    },
    volume: {
      average: 2120914,
    },
  }
}
```

## GetFdc3Instruments

Returns a list of supported instruments with Fdc3InstrumentList

Returns
| Property | Type |
|----------|------|
| `instruments` | `Fdc3InstrumentList[]` |

Example

```js
{
  instruments: {
    type: 'fdc3.instrumentList',
    instruments: [{
      type: 'fdc3.instrument',
      name: 'AstraZeneca Plc',
      id: { ticker: 'AZN' },
    }]
  }
}
```

## T42.OMS.GetClients

Returns a list of clients

Returns
| Property | Type |
|----------|------|
| `clients` | `ClientInfo[]` |

Example

```js
{
  clients: [
    {
      clientId: 'TEST2',
      email: 'test2.demo@tick42.com',
      salesforceId: '0031i00000z03KaAAI',
    },
  ]
}
```

## T42.OMS.GetOrderValidity

Returns
| Property | Type |
|----------|------|
| `orderValidity` | `[value]: {displayName: string, shortName: string, enabled: boolean}` |

Example

```js
{
  orderValidity: {
    '0': {
      displayName: 'Day',
      shortName: 'DAY',
      enabled: true,
    },
    '1': {
      displayName: 'Good Till Cancel',
      shortName: 'GTC',
      enabled: true,
    },
  }
}
```

## T42.OMS.GetOrderTypes

Returns
| Property | Type |
|----------|------|
| `orderTypes` | `[value]: {displayName: string, enabled: boolean}` |

Example

```js
{
  orderTypes: {
    '1': {
      displayName: 'Market',
      enabled: true,
    },
    '2': {
      displayName: 'Limit',
      enabled: true,
    },
  }
}
```

## T42.OMS.GetOrderSides

Returns
| Property | Type |
|----------|------|
| `orderSides` | `[value]: {displayName: string, shortName: string, enabled: boolean}` |

```js
{
  orderSides: {
    '1': {
      displayName: 'Buy',
      shortName: 'B',
      enabled: true,
    },
    '2': {
      displayName: 'Sell',
      shortName: 'S',
      enabled: true,
    }
  }
}
```

## T42.OMS.GetFunds

Returns
| Property | Type |
|----------|------|
| `funds` | `FundInfo []` |

```js
{
  funds: [
    {
      name: 'GAM Star Disruptive Growth Inst Acc GBP',
      isin: 'IE00B5VMHR51',
      url: 'https://www.morningstar.co.uk/uk/funds/snapshot/snapshot.aspx?id=F00000Q28W',
      instruments: [
        {
          ticker: 'MSFT',
          bbgExchange: 'US',
          url: 'https://tools.morningstar.co.uk/uk/stockreport/default.aspx?Site=uk&id=0P000003MH',
          portfolioPercent: 7.7,
          currency: 'USD',
          isin: 'US5949181045',
          quantity: 7700000,
          volume: {
            average: 33954187,
          },
          price: {
            close: 301.25,
            yearLow: 224.26,
            yearHigh: 349.67,
          },
          description: 'Microsoft',
        },
      ],
    },
  ]
}
```
