import { getDateRange } from "../utils";

export const SHIPPING_UNIT = {
    save: {
        lable: 'tiết kiệm',
        day: getDateRange('save'),
        price_shipped: 23000
    },
    fast: {
        lable: 'Vận chuyển nhanh',
        day: getDateRange('fast'),
        price_shipped: 12500
    },
}