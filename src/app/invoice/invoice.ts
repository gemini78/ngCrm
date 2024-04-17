export type TInvoiceDetail = {
    quantity: number;
    amount: number;
    description: string;
}
export type TInvoiceStatus = 'PAID' | 'SENT' | 'CANCELED';

export type TInvoicesDetail = TInvoiceDetail[]

export type TInvoice = {
    customer_name: string;
    description: string;
    status: TInvoiceStatus;
    details: TInvoicesDetail
}