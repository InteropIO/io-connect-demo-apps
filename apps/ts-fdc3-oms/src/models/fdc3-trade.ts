import { Fdc3Instrument } from "./fdc3-instrument";
import { Fdc3Order } from "./fdc3-order";
import { Fdc3Contact } from "./fdc3-contact";

export interface Fdc3Trade {
    type: "fdc3.trade"
    side?: string
    instrument?: Fdc3Instrument
    order?: Fdc3Order;
    contact?: Fdc3Contact;
    sliceId?: string;
    quantity?: number
    price?: number;
    comments?: string;
    execBroker?: string;
    exchange?: string;
    timestamp?: Date;
}
