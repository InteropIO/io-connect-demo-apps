import { InstrumentInfo } from '../models/instruments'

const MORNING_STAR_BASE_URL =
  'https://tools.morningstar.co.uk/uk/stockreport/default.aspx?Site=uk&id='

export const instruments: InstrumentInfo[] = [
  {
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
    url: MORNING_STAR_BASE_URL + '0P00007NYP',
  },

  {
    ticker: 'BARC',
    bbgExchange: 'LN',
    isin: 'GB0031348658',
    description: 'Barclays Plc',
    currency: 'GBX',
    price: {
      close: 200.85,
      yearLow: 106.76,
      yearHigh: 217.63,
    },
    volume: {
      average: 36564354,
    },
    url: MORNING_STAR_BASE_URL + '0P00007NZP',
  },

  {
    ticker: 'BATS',
    bbgExchange: 'LN',
    isin: 'GB0002875804',
    description: 'British American Tobacco Plc',
    currency: 'GBX',
    price: {
      close: 2552.5,
      yearLow: 2467.0,
      yearHigh: 2961.5,
    },
    volume: {
      average: 3106768,
    },
    url: MORNING_STAR_BASE_URL + '0P00007O1O',
  },

  {
    ticker: 'DGE',
    bbgExchange: 'LN',
    isin: 'GB0002374006',
    description: 'Diageo Plc',
    currency: 'GBX',
    price: {
      close: 3656.5,
      yearLow: 2500.0,
      yearHigh: 3715.5,
    },
    volume: {
      average: 2687770,
    },
    url: MORNING_STAR_BASE_URL + '0P00007O7R',
  },

  {
    ticker: 'GSK',
    bbgExchange: 'LN',
    isin: 'GB0009252882',
    description: 'GlaxoSmithKline Plc',
    currency: 'GBX',
    price: {
      close: 1544.4,
      yearLow: 1190.8,
      yearHigh: 1554.2,
    },
    volume: {
      average: 6866664,
    },
    url: MORNING_STAR_BASE_URL + '0P00007OD0',
  },

  {
    ticker: 'HSBA',
    bbgExchange: 'LN',
    isin: 'GB0005405286',
    description: 'HSBC Holdings Plc ORD',
    currency: 'GBX',
    price: {
      close: 495.0,
      yearLow: 329.55,
      yearHigh: 501.4,
    },
    volume: {
      average: 25927255,
    },
    url: MORNING_STAR_BASE_URL + '0P00007OFH',
  },

  {
    ticker: 'INF',
    bbgExchange: 'LN',
    isin: 'GB00BMJ6DW54',
    description: 'Informa Plc ORD',
    currency: 'GBX',
    price: {
      close: 547.6,
      yearLow: 459.8,
      yearHigh: 603.6,
    },
    volume: {
      average: 4618680,
    },
    url: MORNING_STAR_BASE_URL + '0P0000KNCP',
  },

  {
    ticker: 'ITV',
    bbgExchange: 'LN',
    isin: 'GB0033986497',
    description: 'ITV Plc',
    currency: 'GBX',
    price: {
      close: 117.85,
      yearLow: 98.06,
      yearHigh: 134.15,
    },
    volume: {
      average: 11095831,
    },
    url: MORNING_STAR_BASE_URL + '0P00007OI2',
  },

  {
    ticker: 'LLOY',
    bbgExchange: 'LN',
    isin: 'GB0008706128',
    description: 'Lloyds Banking Group Plc',
    currency: 'GBX',
    price: {
      close: 52.89,
      yearLow: 30.82,
      yearHigh: 53.41,
    },
    volume: {
      average: 183324950,
    },
    url: MORNING_STAR_BASE_URL + '0P000090RG',
  },

  {
    ticker: 'RIO',
    bbgExchange: 'LN',
    isin: 'GB0007188757',
    description: 'Rio Tinto ORD',
    currency: 'GBX',
    price: {
      close: 72.71,
      yearLow: 59.58,
      yearHigh: 95.97,
    },
    volume: {
      average: 3552688,
    },
    url: MORNING_STAR_BASE_URL + '0P00007OTS',
  },

  {
    ticker: 'VOD',
    bbgExchange: 'LN',
    isin: 'GB00BH4HKS39',
    description: 'Vodafone Group Plc',
    currency: 'GBX',
    price: {
      close: 109.36,
      yearLow: 100.0,
      yearHigh: 157.52,
    },
    volume: {
      average: 64071830,
    },
    url: MORNING_STAR_BASE_URL + '0P00007WPO',
  },

  {
    ticker: 'TSLA',
    bbgExchange: 'US',
    isin: 'US88160R1014',
    description: 'Tesla, Inc',
    currency: 'US',
    price: {
      close: 187.71,
      yearLow: 101.81,
      yearHigh: 384.29,
    },
    volume: {
      average: 151897763,
    },
    url: MORNING_STAR_BASE_URL + '0P00007O1O',
  },

  // {
  //   bbgCode: 'RDSA LN',
  //   isin: 'GB00B03MLX29',
  //   description: 'Royal Dutch Shell CL A ORD',
  //   currency: 'GBX',
  //   price: {
  //     close: 1758.4,
  //     yearLow: 1282.78,
  //     yearHigh: 1801.8,
  //   },
  //   volume: {
  //     average: 15823018,
  //   },
  //   url: BASE_URL + '0P00007OU3',
  // },

  // {
  //   bbgCode: 'RDSB LN',
  //   isin: 'GB00B03MM408',
  //   description: 'Royal Dutch Shell CL B ORD',
  //   currency: 'GBX',
  //   price: {
  //     close: 1759.6,
  //     yearLow: 1227.0,
  //     yearHigh: 1813.4,
  //   },
  //   volume: {
  //     average: 7876301,
  //   },
  //   url: BASE_URL + '0P00007OU3',
  // },

  // {
  //   bbgCode: 'ULVR',
  //   isin: 'GB00B10RZP78',
  //   description: 'Unilever Ord',
  //   currency: 'GBX',
  //   price: {
  //     close: 3803.5,
  //     yearLow: 3450.0,
  //     yearHigh: 4924.0,
  //   },
  //   volume: {
  //     average: 5215033,
  //   },
  //   url: BASE_URL + '0P00007P0W',
  // },
  // {
  //   bbgCode: 'BHP LN',
  //   isin: 'GB00BH0P3Z91',
  //   description: 'BHP GROUP ORD SHS',
  //   currency: 'GBX',
  //   price: {
  //     close: 65.52,
  //     yearLow: 51.88,
  //     yearHigh: 82.07,
  //   },
  //   volume: {
  //     average: 4411661,
  //   },
  //   url: BASE_URL + '0P0000EYHW',
  // },
  // {
  //   bbgCode: 'RKT',
  //   isin: 'GB00B24CGK77',
  //   description: 'RECKITT BENCKISER GROUP ORD',
  //   currency: 'GBX',
  //   price: {
  //     close: 5987.0,
  //     yearLow: 4905.16,
  //     yearHigh: 6816.0,
  //   },
  //   volume: {
  //     average: 1407134,
  //   },
  //   url: BASE_URL + '0P000090MG',
  // },
  // {
  //   bbgCode: 'MSFT US',
  //   isin: 'US5949181045',
  //   description: 'Microsoft',
  //   currency: 'USD',
  //   price: {
  //     close: 301.25,
  //     yearLow: 224.26,
  //     yearHigh: 349.67,
  //   },
  //   volume: {
  //     average: 33954187,
  //   },
  //   url: BASE_URL + '0P000003MH',
  // },
  // {
  //   bbgCode: 'STX US',
  //   isin: 'IE00BKVD2N49',
  //   description: 'Seagate Technology Holdings',
  //   currency: 'EUR',
  //   price: {
  //     close: 108.17,
  //     yearLow: 67.76,
  //     yearHigh: 117.67,
  //   },
  //   volume: {
  //     average: 2410679,
  //   },
  //   url: BASE_URL + '0P000004VE',
  // },
  // {
  //   bbgCode: 'GOOG US',
  //   isin: 'US02079K1079',
  //   description: 'Alphabet A',
  //   currency: 'USD',
  //   price: {
  //     close: 2853.01,
  //     yearLow: 2002.02,
  //     yearHigh: 3042.0,
  //   },
  //   volume: {
  //     average: 1322187,
  //   },
  //   url: BASE_URL + '0P00012BBI',
  // },
  // {
  //   bbgCode: 'MRVL US',
  //   isin: 'US5738741041',
  //   description: 'Marvell Technology',
  //   currency: 'USD',
  //   price: {
  //     close: 68.63,
  //     yearLow: 37.92,
  //     yearHigh: 93.85,
  //   },
  //   volume: {
  //     average: 10873572,
  //   },
  //   url: BASE_URL + '0P000003H5',
  // },
  // {
  //   bbgCode: 'AKAM US',
  //   isin: 'US00971T1016',
  //   description: 'Akamai Technologies',
  //   currency: 'USD',
  //   price: {
  //     close: 114.58,
  //     yearLow: 92.64,
  //     yearHigh: 120.68,
  //   },
  //   volume: {
  //     average: 1324622,
  //   },
  //   url: BASE_URL + '0P0000007V',
  // },
  // {
  //   bbgCode: 'P2ST34 US',
  //   isin: 'US74624M1027',
  //   description: 'Pure Storage',
  //   currency: 'USD',
  //   price: {
  //     close: 25.94,
  //     yearLow: 16.79,
  //     yearHigh: 35.09,
  //   },
  //   volume: {
  //     average: 4084914,
  //   },
  //   url: BASE_URL + '0P00016Q76',
  // },
  // {
  //   bbgCode: 'OMCL US',
  //   isin: 'US68213N1090',
  //   description: 'Omnicell',
  //   currency: 'EUR',
  //   price: {
  //     close: 151.9,
  //     yearLow: 119.76,
  //     yearHigh: 187.29,
  //   },
  //   volume: {
  //     average: 314758,
  //   },
  //   url: BASE_URL + '0P0000042B',
  // },
  // {
  //   bbgCode: 'NFLX:US',
  //   isin: 'US64110L1061',
  //   description: 'Netflix',
  //   currency: 'USD',
  //   price: {
  //     close: 405.6,
  //     yearLow: 351.46,
  //     yearHigh: 700.99,
  //   },
  //   volume: {
  //     average: 6431437,
  //   },
  //   url: BASE_URL + '0P000003UP',
  // },
  // {
  //   bbgCode: 'ISRG US',
  //   isin: 'US46120E6023',
  //   description: 'Intuitive Surgical',
  //   currency: 'USD',
  //   price: {
  //     close: 285.6,
  //     yearLow: 227.47,
  //     yearHigh: 369.69,
  //   },
  //   volume: {
  //     average: 1869682,
  //   },
  //   url: BASE_URL + '0P00000301',
  // },
  // {
  //   bbgCode: 'COIN US',
  //   isin: 'US19260Q1076 ',
  //   description: 'Coinbase Global',
  //   currency: 'USD',
  //   price: {
  //     close: 181.31,
  //     yearLow: 162.2,
  //     yearHigh: 429.54,
  //   },
  //   volume: {
  //     average: 4972282,
  //   },
  //   url: BASE_URL + '0P0001M2C4',
  // },
  // {
  //   bbgCode: 'AAPL US',
  //   isin: 'US0378331005',
  //   description: 'Apple Inc',
  //   currency: 'USD',
  //   price: {
  //     close: 172.68,
  //     yearLow: 116.21,
  //     yearHigh: 182.94,
  //   },
  //   volume: {
  //     average: 100703861,
  //   },
  //   url: BASE_URL + '0P000000GY',
  // },
  // {
  //   bbgCode: 'AMZN:US',
  //   isin: 'US0231351067',
  //   description: 'Amazon.com Inc',
  //   currency: 'USD',
  //   price: {
  //     close: 2776.91,
  //     yearLow: 2707.04,
  //     yearHigh: 3773.08,
  //   },
  //   volume: {
  //     average: 3546975,
  //   },
  //   url: BASE_URL + '0P000000B7',
  // },
  // {
  //   bbgCode: 'FB US',
  //   isin: 'US30303M1027',
  //   description: 'Meta Platforms Inc',
  //   currency: 'USD',
  //   price: {
  //     close: 237.76,
  //     yearLow: 230.5,
  //     yearHigh: 384.33,
  //   },
  //   volume: {
  //     average: 23666795,
  //   },
  //   url: BASE_URL + '0P0000W3KZ',
  // },
  // {
  //   bbgCode: 'NVDA:US',
  //   isin: 'US67066G1040',
  //   description: 'NVIDIA Corp',
  //   currency: 'USD',
  //   price: {
  //     close: 239.48,
  //     yearLow: 115.67,
  //     yearHigh: 346.47,
  //   },
  //   volume: {
  //     average: 51720304,
  //   },
  //   url: BASE_URL + '0P000003RE',
  // },
  // {
  //   bbgCode: 'UNH US',
  //   isin: 'US91324P1021',
  //   description: 'UnitedHealth Group Inc',
  //   currency: 'USD',
  //   price: {
  //     close: 488.77,
  //     yearLow: 320.35,
  //     yearHigh: 509.23,
  //   },
  //   volume: {
  //     average: 3347620,
  //   },
  //   url: BASE_URL + '0P000005NU',
  // },
  // {
  //   bbgCode: 'AXP US',
  //   isin: 'US0258161092',
  //   description: 'American Express Co',
  //   currency: 'USD',
  //   price: {
  //     close: 184.04,
  //     yearLow: 125.63,
  //     yearHigh: 189.03,
  //   },
  //   volume: {
  //     average: 4167391,
  //   },
  //   url: BASE_URL + '0P000000CU',
  // },
  // {
  //   bbgCode: 'IEX US',
  //   isin: 'US45167R1041',
  //   description: 'IDEX Corp',
  //   currency: 'USD',
  //   price: {
  //     close: 202.62,
  //     yearLow: 190.56,
  //     yearHigh: 240.33,
  //   },
  //   volume: {
  //     average: 332400,
  //   },
  //   url: BASE_URL + '0P000002T9',
  // },
  // {
  //   bbgCode: 'NOW US',
  //   isin: 'US81762P1021',
  //   description: 'ServiceNow Inc',
  //   currency: 'USD',
  //   price: {
  //     close: 560.85,
  //     yearLow: 448.27,
  //     yearHigh: 707.6,
  //   },
  //   volume: {
  //     average: 1637024,
  //   },
  //   url: BASE_URL + '0P0000WDY1',
  // },
  // {
  //   bbgCode: 'SE US',
  //   isin: 'US81141R1005',
  //   description: 'SEA Limited',
  //   currency: 'USD',
  //   price: {
  //     close: 145.04,
  //     yearLow: 119.41,
  //     yearHigh: 372.7,
  //   },
  //   volume: {
  //     average: 7087938,
  //   },
  //   url: BASE_URL + '0P0001BRQ3',
  // },
  // {
  //   bbgCode: 'TSM US',
  //   isin: 'US8740391003',
  //   description: 'TSMC',
  //   currency: 'USD',
  //   price: {
  //     close: 119.84,
  //     yearLow: 107.58,
  //     yearHigh: 145.0,
  //   },
  //   volume: {
  //     average: 11222456,
  //   },
  //   url: BASE_URL + '0P000005AR',
  // },
  // {
  //   bbgCode: 'TTNT IN',
  //   isin: 'INE155A01022',
  //   description: 'Tata Motors',
  //   currency: 'INR',
  //   price: {
  //     close: 500.6,
  //     yearLow: 268.45,
  //     yearHigh: 536.7,
  //   },
  //   volume: {
  //     average: 13193457,
  //   },
  //   url: BASE_URL + '0P0000AZVC',
  // },
  // {
  //   bbgCode: 'RIL IN',
  //   isin: 'INE002A01018',
  //   description: 'Reliance Industries',
  //   currency: 'INR',
  //   price: {
  //     close: 2352.75,
  //     yearLow: 1876.7,
  //     yearHigh: 2751.35,
  //   },
  //   volume: {
  //     average: 6515042,
  //   },
  //   url: BASE_URL + '0P0000B1W1',
  // },
  // {
  //   bbgCode: 'JD US',
  //   isin: 'US47215P1066',
  //   description: 'JD.com',
  //   currency: 'MXN',
  //   price: {
  //     close: 1480.0,
  //     yearLow: 732.0,
  //     yearHigh: 2050.0,
  //   },
  //   volume: {
  //     average: 3613,
  //   },
  //   url: BASE_URL + '0P000132LM',
  // },
  // {
  //   bbgCode: 'SMSN LI',
  //   isin: 'US7960508882',
  //   description: 'Samsung Electronics',
  //   currency: 'USD',
  //   price: {
  //     close: 1535.5,
  //     yearLow: 1421.0,
  //     yearHigh: 1933.0,
  //   },
  //   volume: {
  //     average: 21154,
  //   },
  //   url: BASE_URL + '0P0000CCJT',
  // },
  // {
  //   bbgCode: '006405 KS',
  //   isin: 'US7960508882',
  //   description: 'Samsung SDI',
  //   currency: 'USD',
  //   price: {
  //     close: 108.0,
  //     yearLow: 103.6,
  //     yearHigh: 155.0,
  //   },
  //   volume: {
  //     average: 9101,
  //   },
  //   //two samsungs, same ISIN?
  //   url: BASE_URL + '0P0000CCJT',
  // },
  // {
  //   bbgCode: '2454 TT',
  //   isin: 'TW0002454006',
  //   description: 'Mediatek',
  //   currency: 'TWD',
  //   price: {
  //     close: 1085.0,
  //     yearLow: 821.0,
  //     yearHigh: 1215.0,
  //   },
  //   volume: {
  //     average: 5428455,
  //   },
  //   url: BASE_URL + '0P0000BZ4C',
  // },
  // {
  //   bbgCode: 'MDKA IJ',
  //   isin: 'ID1000134406',
  //   description: 'Merdeka Copper Gold',
  //   currency: 'IDR',
  //   price: {
  //     close: 3630.0,
  //     yearLow: 2090.0,
  //     yearHigh: 4140.0,
  //   },
  //   volume: {
  //     average: 68949865,
  //   },
  // }, //Not on morningstar - Indonesian stock exchange
  // {
  //   bbgCode: 'MA US',
  //   isin: 'US57636Q1040',
  //   description: 'MASTERCARD INC',
  //   currency: 'USD',
  //   price: {
  //     close: 390.07,
  //     yearLow: 306.0,
  //     yearHigh: 401.5,
  //   },
  //   volume: {
  //     average: 5418179,
  //   },
  //   url: BASE_URL + '0P00005U6B',
  // },
  // {
  //   bbgCode: 'DSV PZ',
  //   isin: 'DK0060079531',
  //   description: 'DSV A/S',
  //   currency: 'DKK',
  //   price: {
  //     close: 1350.5,
  //     yearLow: 1000.5,
  //     yearHigh: 1696.0,
  //   },
  //   volume: {
  //     average: 337457,
  //   },
  //   //Denmark SE -  not on morningstar
  // },
  // {
  //   bbgCode: 'UBER US',
  //   isin: 'US90353T1007',
  //   description: 'UBER TECHNOLOGIES INC',
  //   currency: 'USD',
  //   price: {
  //     close: 34.54,
  //     yearLow: 32.81,
  //     yearHigh: 64.05,
  //   },
  //   volume: {
  //     average: 29923253,
  //   },
  //   url: BASE_URL + '0P0001HD8R',
  // },
  // {
  //   bbgCode: 'SHOP US',
  //   isin: 'CA82509L1076',
  //   description: 'SHOPIFY INC',
  //   currency: 'USD',
  //   price: {
  //     close: 809.44,
  //     yearLow: 780.0,
  //     yearHigh: 1762.92,
  //   },
  //   volume: {
  //     average: 1631545,
  //   },
  //   url: BASE_URL + '0P00015ZGZ',
  // },
  // {
  //   bbgCode: 'HDFCB IN',
  //   isin: 'INE040A01026',
  //   description: 'HDFC BANK LTD',
  //   currency: 'INR',
  //   price: {
  //     close: 1515.35,
  //     yearLow: 1353.0,
  //     yearHigh: 1725.0,
  //   },
  //   volume: {
  //     average: 6491455,
  //   },
  //   url: BASE_URL + '0P0000C3NZ',
  // },
  // {
  //   bbgCode: 'EPAM US',
  //   isin: 'US29414B1044',
  //   description: 'EPAM SYSTEMS INC',
  //   currency: 'USD',
  //   price: {
  //     close: 443.52,
  //     yearLow: 338.69,
  //     yearHigh: 725.4,
  //   },
  //   volume: {
  //     average: 749827,
  //   },
  //   url: BASE_URL + '0P0000V8M8',
  // },
  // {
  //   bbgCode: 'V US',
  //   isin: 'US92826C8394',
  //   description: 'VISA INC',
  //   currency: 'USD',
  //   price: {
  //     close: 231.54,
  //     yearLow: 190.1,
  //     yearHigh: 252.67,
  //   },
  //   volume: {
  //     average: 11290187,
  //   },
  //   url: BASE_URL + '0P0000CPCP',
  // },
  // {
  //   bbgCode: 'SCHW US',
  //   isin: 'US8085131055',
  //   description: 'SCHWAB (CHARLES) CORP',
  //   currency: 'USD',
  //   price: {
  //     close: 88.89,
  //     yearLow: 54.98,
  //     yearHigh: 95.62,
  //   },
  //   volume: {
  //     average: 6808927,
  //   },
  //   url: BASE_URL + '0P00000175',
  // },
  // {
  //   bbgCode: 'AIR FP',
  //   isin: 'NL0000235190',
  //   description: 'AIRBUS SE',
  //   currency: 'EUR',
  //   price: {
  //     close: 111.64,
  //     yearLow: 89.54,
  //     yearHigh: 121.1,
  //   },
  //   volume: {
  //     average: 1639444,
  //   },
  //   url: BASE_URL + '0P00009WFE',
  // },
  // {
  //   bbgCode: 'GE US',
  //   isin: 'US3696043013',
  //   description: 'GENERAL ELECTRIC CO',
  //   currency: 'USD',
  //   price: {
  //     close: 98.32,
  //     yearLow: 88.05,
  //     yearHigh: 116.17,
  //   },
  //   volume: {
  //     average: 7064488,
  //   },
  //   url: BASE_URL + '0P000002DO',
  // },
  // {
  //   bbgCode: 'TMUS US',
  //   isin: 'US8725901040',
  //   description: 'T-MOBILE US INC',
  //   currency: 'USD',
  //   price: {
  //     close: 120.78,
  //     yearLow: 101.51,
  //     yearHigh: 150.2,
  //   },
  //   volume: {
  //     average: 5496945,
  //   },
  //   url: BASE_URL + '0P00008DL1',
  // },
  // {
  //   bbgCode: 'LSEG LN',
  //   isin: 'GB00B0SWJX34',
  //   description: 'LONDON STOCK EXCHANGE GROUP',
  //   currency: 'GBP',
  //   price: {
  //     close: 7194.0,
  //     yearLow: 6502.0,
  //     yearHigh: 10010.0,
  //   },
  //   volume: {
  //     average: 958063,
  //   },
  //   url: BASE_URL + '0P000090TO',
  // },
]
