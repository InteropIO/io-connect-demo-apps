interface OrderSides {
  [index: string]: any
}

/* Additional order sides
6 = Sell short exempt
7 = Undisclosed (valid for IOI and List Order messages only)
8 = Cross (orders where counterparty is an exchange, valid for all messages except IOIs)
9 = Cross short
A = Cross short exempt
B = "As Defined" (for use with multileg instruments)
C = "Opposite" (for use with multileg instruments)
D = Subscribe (e.g. CIV)
E = Redeem (e.g. CIV)
F = Lend (FINANCING - identifies direction of collateral)
G = Borrow (FINANCING - identifies direction of collateral)
*/
export const ORDER_SIDES: OrderSides = {
  '1': {
    displayName: 'Buy',
    shortName: 'B',
    enabled: true,
  },
  '2': {
    displayName: 'Sell',
    shortName: 'S',
    enabled: true,
  },
  '3': {
    displayName: 'Buy Minus',
    shortName: 'B-',
    enabled: false,
  },
  '4': {
    displayName: 'Sell Plus',
    shortName: 'S+',
    enabled: false,
  },
  '5': {
    displayName: 'Sell Short',
    shortName: 'SS',
    enabled: false,
  },
}

/* Additional Order Types
5 = Market on close (No longer used)
7 = Limit or better (Deprecated)
8 = Limit with or without
9 = On basis
A = On close (No longer used)
B = Limit on close (No longer used)
C = Forex - Market (No longer used)
D = Previously quoted
E = Previously indicated
F = Forex - Limit (No longer used)
G = Forex - Swap
H = Forex - Previously Quoted (No longer used)
I = Funari (Limit Day Order with unexecuted portion handled as Market On Close. E.g. Japan)
J = Market If Touched (MIT)
K = Market with Leftover as Limit (market order then unexecuted quantity becomes limit order at last price)
L = Previous Fund Valuation Point (Historic pricing) (for CIV)
M = Next Fund Valuation Point (Forward pricing) (for CIV)
P = Pegged
*/
export const ORDER_TYPES = {
  '1': {
    displayName: 'Market',
    enabled: true,
  },
  '2': {
    displayName: 'Limit',
    enabled: true,
  },
  '3': {
    displayName: 'Stop',
    enabled: true,
  },
  '4': {
    displayName: 'Stop Limit',
    enabled: true,
  },
  '6': {
    displayName: 'With or Without',
    enabled: true,
  },
  P: {
    displayName: 'Pegged',
    enabled: true,
  },
}

export const ORDER_VALIDITY = {
  '0': {
    displayName: 'Day',
    shortName: 'DAY',
    enabled: true,
  },
  '1': {
    displayName: 'Good Till Cancel',
    shortName: 'GTC',
    enabled: false,
  },
  '2': {
    displayName: 'At The Open',
    shortName: 'ATO',
    enabled: false,
  },
  '3': {
    displayName: 'Immediate Or Cancel',
    shortName: 'IOC',
    enabled: false,
  },
  '4': {
    displayName: 'Fill Or Kill',
    shortName: 'FOK',
    enabled: false,
  },
  '5': {
    displayName: 'Good Till Crossing',
    shortName: 'GTC',
    enabled: false,
  },
  '6': {
    displayName: 'Good Till Date',
    shortName: 'GTD',
    enabled: false,
  },
  '7': {
    displayName: 'At The Close',
    shortName: 'ATC',
    enabled: false,
  },
}
