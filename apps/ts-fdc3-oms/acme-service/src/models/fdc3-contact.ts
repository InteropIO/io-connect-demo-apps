export interface Fdc3Contact {
    type: "fdc3.contact";
    name?: string;
    id?: {
        email?: string;
        [key: string]: unknown;
    };
}