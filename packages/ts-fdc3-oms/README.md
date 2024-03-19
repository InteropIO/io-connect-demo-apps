# ACME OMS

# Overview

Acme OMS is a single React application with multiple pages which mimics some of the functionality of an OMS/EMS.  
It provides the following functionality/screens:

-   Current Orders - displays the current orders for the day.
-   Order History Page - displays historic orders based on given filtering criteria.
-   Order Entry Page/Dialog - allows for manual order entry.
-   Instrument Chart - displays a trading view chart for a given instrument - powered by www.tradingview.com
-   Data Service - service page providing "backend" information about orders. Automatically generates orders and trades/fills based on a static set of client Ids, instruments and brokers.

# Quick Start

## Prerequisites

-   Glue42 Enterprise version > 3.12
-   NodeJS version > 14

## Dependencies

Install dependencies by running `npm install` in the root folder. Also, install the service application dependencies by running `npm install` in `./acme-service`.

## Run in development mode.

1. Run `npm start`. Hosts Acme OMS on `http://localhost:3000`.
2. Run `npm start:acme-service` to start the service application. Hosted on `http://localhost:3001`.
3. Paste the `acme-oms_DEV.json` file to your local Glue42 Enterprise store (usually `%LocalAppData%\Tick42\GlueDesktop\config\apps` folder).
4. Search in Glue42 Toolbar, e.g. by typing _Acme_.

## Build for Glue42 Installer

1. Run `npm build`.
2. CD `./acme-service` and run `npm run build`.
3. Use `acme-oms.json` for the appropriate application definitions.

> Note: When making source code changes, always build a new version!

# Applications

All pages of the Acme OMS are registered as separate applications with Glue42, under the Acme OMS folder in the application directory.

> Note: It is required that the Data Service application/page is started in order to provide order information to the other pages.

## Acme Orders

### Overview

Displays the current orders for the day.

### Actions

-   Expand/Collapse ORDER ID Column - Show/Hide Slices corresponding to the Expanded Order.
-   Click on row - 1. [sync instrument]. 2. Raise ViewOrderHistory intent. 3. Sync Salesforce Contact for the selected Order Client
-   Right click on row + View Executions - Raise ViewOrderTradeHistory intent
-   Right click on row + Click for Pre-trade - 1. Calls BMLL T42.BMLL.MarketDataUpdate 2. Calls Abel Noser T42.AN.MarketImpactCost 3. Calls Virtu T42.Virtu.Pretrade
-   Right click on row + Click to track - Calls BBG T42.BBG.AppendWorksheetSecurities that push the selected instrument to 'Stock Watch' BBG worksheet
-   Click on Order Entry button - Order Entry dialog appears
-   Click on History button - Acme Order History with default filters
-   Click on '<' button - backward time with 1 minute
-   Shift + Click on '<' button - backward time with 24 minute
-   Click on '>' button - forward time with 1 minute
-   Shift + Click on '>' button - forward time with 24 minute
-   Click on the timer reset the time

## Acme Trade History

### Overview

Displays the trades for the day.

### Actions

-   Click on row - [sync instrument]
-   Right click + Click to Report (Trades) via Email - Opens Email with pre-populated subject and info for trades of the selected order
-   Right click + Click to Report (Trades) via Excel - Populate ts-acme-oms/Templates/TradesReport.xltx with trades of the selected order
-   Right click + Click to Report (Trades) via Chat - Opens chat with the selected client with information about the trades of the selected order
-   Right click + Click to track Calls BBG T42.BBG.AppendWorksheetSecurities that push the selected instrument to 'Stock Watch' BBG worksheet

## Acme Order History

### Overview

Displays the orders which meets the filter conditions.

### Actions

-   Click on row - 1. [sync instrument]. 2. Raise ViewOrderTradeHistory intent. 3. Sync Salesforce Contact for the selected Order Client
-   Right click on row + View Executions - Raise ViewOrderTradeHistory intent
-   Right click on row + Click for Pre-trade - 1. Calls BMLL T42.BMLL.MarketDataUpdate 2. Calls Abel Noser T42.AN.MarketImpactCost 3. Calls Virtu T42.Virtu.Pretrade
-   Right click on row + Click to track - Calls BBG T42.BBG.AppendWorksheetSecurities that push the selected instrument to 'Stock Watch' BBG worksheet

## Acme Order Entry

### Overview

Create order that will be displayed in Acme Orders. Once an order is created slices are generated and fills start generating until the quantity is filled.

## Acme Trade Entry

### Overview

Create trade for selected slice.

## Acme Watchlist

### Overview

Create multiple watch lists that monitors market information for the selected instruments.

### Actions

-   Click on row - [sync instrument]
-   Right click + Remove - Remove selected instrument from current watch list
-   Right click + Click to track Calls BBG T42.BBG.AppendWorksheetSecurities that push the selected instrument to 'Stock Watch' BBG worksheet

## Acme Market Depth

### Overview

Monitors market information for the selected instruments. Also displays Bids and Asks.

### Actions

-   Selecting instrument from the select [sync instrument]

## Acme Trading Positions

### Overview

Grid with trade information for the day. The information is grouped by agency. And in each group the rows are grouped by instrument.

### Actions

-   Click on row - [sync instrument]
-   Click on '<' button - backward time with 1 minute
-   Shift + Click on '<' button - backward time with 24 minute
-   Click on '>' button - forward time with 1 minute
-   Shift + Click on '>' button - forward time with 24 minute
-   Click on the timer reset the time

## Acme Portfolio

### Overview

Market information for the selected fund.

### Actions

-   Select fund from select - 1) Open instruments for the selected fund 2) Sync already opened Morning Star for the fund
-   Select instrument row - Sync Morning Star with the selected instrument
-   Right click + Buy - Opens Order Entry dialog with some pre-populated fields
-   Right click + Sell - Opens Order Entry dialog with some pre-populated fields
-   Right click + Sell All - Opens Order Entry dialog with some pre-populated fields and all the quantity for the instrument
-   Right click on row + Click to track Calls BBG T42.BBG.AppendWorksheetSecurities that push the selected instrument to 'Stock Watch' BBG worksheet

# Exposed Intents

## ViewChart

View instrument chart in Acme OMS.

### Details

Intent name: "ViewChart"  
Expected context type: `fdc3.instrument`

### Example

```js
const intentContext = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'VOD',
    },
}
fdc3.raiseIntent('ViewChart', intentContext)
```

> Acme OMS only considers the `id.ticker` property of the context

## ViewOrderHistory

Show trade history in Acme OMS

### Details

Intent name: "ViewOrderHistory"  
Expected context type: `OrderFilter` (see `Used Data Structures` below)

### Example

```js
const intentContext = {
    type: 'OrderFilter',
    fromDate: '2021-11-20T00:00:00.000Z',
    clientId: 'CLI1',
    instrument: {
        type: 'fdc3.instrument',
        id: {
            BBG: 'BARC:LN',
        },
    },
}
fdc3.raiseIntent('ViewOrderHistory', intentContext)
```

> Notes for Acme OMS:
>
> -   for `instrument` only the `id.ticker` and `id.BBG` properties are considered.
> -   Default/current values will be used for omitted properties
> -   To clear current filters for client and instrument, specify empty values (`""`) for `clientId` and `instrument.id.BBG` respectively.
> -   Data for a maximum of 60 days will be displayed.

## NewOrder

Show a new order entry page in Acme OMS.  
Fields in the page can be pre-populated from the provided context.

### Details

Intent name: "NewOrder"  
Expected context type: `fdc3.order` (see `Used Data Structures` below)

### Example

```js
const intentContext = {
    type: 'fdc3.order',
    side: '5',
    quantity: '100',
    instrument: {
        type: 'fdc3.instrument',
        id: {
            BBG: 'AZN:LN',
        },
    },
    orderType: '2',
    limitPrice: 1234.56,
    timeInForce: '6',
    expireTime: '2021-12-03T16:30:00',
    notes: 'none',
    contact: {
        type: 'fdc3.contact',
        name: 'CLI1',
    },
}
fdc3.raiseIntent('NewOrder', intentContext)
```

> Notes for Acme OMS:
>
> -   Fields in the page for which no corresponding property was provided in the context will not be pre-populated.
> -   For `instrument` only the `id.BBG` property is considered.
> -   The `Client Id` field in the page is pre-populated from the `contact.name` property of the context.

## ViewOrderTradeHistory

### Details

Intent name: "ViewOrderTradeHistory"  
Expected context type: `fdc3.order` (see `Used Data Structures` below)

### Example

```js
const intentContext = {
    type: 'fdc3.order',
    side: '5',
    quantity: '100',
    instrument: {
        type: 'fdc3.instrument',
        id: {
            BBG: 'AZN:LN',
        },
    },
    orderType: '2',
    limitPrice: 1234.56,
    timeInForce: '6',
    expireTime: '2021-12-03T16:30:00',
    notes: 'none',
    contact: {
        type: 'fdc3.contact',
        name: 'CLI1',
    },
}
fdc3.raiseIntent('ViewOrderTradeHistory', intentContext)
```

## NewTrade

Show a new trade entry page in Acme OMS.  
Fields in the page can be pre-populated from the provided context.

### Details

Intent name: "NewTrade"  
Expected context type: `fdc3.trade` (see `Used Data Structures` below)

### Example

```js
const intentContext = {
    type: 'fdc3.trade',
    side: '2',
    order: {
      id: "12345",
      instrument: {
        type: 'fdc3.instrument',
          id: {
            BBG: 'AZN:LN',
          },
      },
    },
    sliceId: "3456" ,
    quantity: '100',
    price: 1234.56,
    comments: "Intent trade"
    timeInForce: '6',
    timestamp: '2021-12-03T16:30:00',
}
fdc3.raiseIntent('NewOrder', intentContext)
```

## MarketDepth

Show Market Depth page in Acme OMS.  
The instrument can be pre-populated from the provided context.

### Details

Intent name: "MarketDepth"  
Expected context type: `fdc3.instrument` (see `Used Data Structures` below)

### Example

```js
const intentContext = {
    type: 'fdc3.instrument',
    id: {
        ticker: 'VOD',
    },
}

fdc3.raiseIntent('MarketDepth', intentContext)
```

# Used Data Structures

## fdc3.contact

As defined in in the fdc3 standard [here](https://fdc3.finos.org/docs/context/ref/Contact)

> Acme OMS only considers a limited number of properties, as documented in the corresponding intents.

## fdc3.instrument

As defined in in the fdc3 standard [here](https://fdc3.finos.org/docs/context/ref/Instrument)

> Acme OMS only considers a limited number of properties, as documented in the corresponding intents.

## fdc3.order

### Details

| Property         | Type            | Required | Example Value                                                                               |
| ---------------- | --------------- | -------- | ------------------------------------------------------------------------------------------- |
| `type`           | string          | Yes      | `'fdc3.order'`                                                                              |
| `createTime`     | string          | No       | "2020-09-01T09:30:00.000Z"                                                                  |
| `amendTime`      | string          | No       | "2020-09-01T09:32:50.000Z"                                                                  |
| `id`             | string          | No       | `'A123456'`                                                                                 |
| `side`           | string          | No       | `'1'` - Buy, `'2'`- Sell etc. Values follow the FIX "Side" field (54) specification.        |
| `instrument`     | fdc3.instrument | No       | `{ type: "fdc3.instrument", ... }`                                                          |
| `quantity`       | number          | No       | `200`                                                                                       |
| `orderType`      | string          | No       | `'1'` - Market, `'2'`- Limit etc. Values follow the FIX "OrdType" field (40) specification. |
| `limitPrice`     | number          | No       | `12.345`                                                                                    |
| `timeInForce`    | string          | No       | `'0'` - Day, `'1'`- GTC etc. Values follow the FIX "TimeInForce" field (59) specification.  |
| `expireTime`     | string          | No       | "2020-09-01T16:30:00.000Z"                                                                  |
| `notes`          | string          | No       | Free text with additional instructions                                                      |
| `filledQuantity` | number          | No       | `0`                                                                                         |
| `bookId`         | string          | No       | `'AGEN'`                                                                                    |
| `contact`        | fdc3.contact    | No       | `{ type: "fdc3.contact", ... }`                                                             |

### Example

```js
const order = {
    type: 'fdc3.order',
    side: '1',
    instrument: {
        type: 'fdc3.instrument',
        name: 'AstraZeneca Plc',
        id: {
            ticker: 'AZN',
            RIC: 'AZN.L',
            ISIN: 'GB0009895292',
        },
    },
    quantity: 200,
    orderType: '2',
    limitPrice: 8192.16,
    timeInForce: '6',
    expirytime: '2020-09-01T16:30:00.000Z',
    contact: {
        type: 'fdc3.contact',
        name: 'Jane Doe',
        id: {
            email: 'jane.doe@mail.com',
        },
    },
    id: '12345678',
}

fdc3.broadcast(order)
```

## OrderFilter

### Details

| Property     | Type               | Required | Example Value                                                    |
| ------------ | ------------------ | -------- | ---------------------------------------------------------------- |
| `type`       | string             | Yes      | `'OrderFilter'`                                                  |
| `fromDate`   | string &#124; Date | No       | `'2020-09-01T16:30:00.000Z'`<br/>or<br/>`new Date('2020-09-01')` |
| `toDate`     | string &#124; Date | No       | as `fromDate`                                                    |
| `instrument` | fdc3.instrument    | No       | `{ type: "fdc3.instrument", ... }`                               |
| `clientId`   | string             | No       | `'CLI1'`                                                         |
