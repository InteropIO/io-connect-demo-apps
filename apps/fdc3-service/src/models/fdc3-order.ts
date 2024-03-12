import { Fdc3Contact } from "./fdc3-contact";
import { Fdc3Instrument } from "./fdc3-instrument";

export interface Fdc3Order {
    type: "fdc3.order"
    id?: string
    side?: string // FIX Side <54>
    contact?: Fdc3Contact
    instrument?: Fdc3Instrument
    quantity?: number
    orderType?: string // FIX OrdType <40>
    limitPrice?: number; // only valid when orderType is limit
    timeInForce?: string // FIX TimeInForce <59>
    expireTime?: string; // "2020-09-01T16:30:00.000Z"
    notes?: string;
    createTime?: string; // "2020-09-01T09:30:00.000Z"
    amendTime?: string; // "2020-09-01T09:32:50.000Z"
    quantityFilled?: number;
    bookId?: string;

}