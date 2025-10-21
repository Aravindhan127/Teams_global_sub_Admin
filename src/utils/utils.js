import toast from "react-hot-toast";
import moment from "moment";

export function isPercentage(value) {
    // Regular expression to match a percentage value
    const percentageRegex = /^(\d+(\.\d+)?%$)|^100%$/;

    return percentageRegex.test(value);
}

export function toastSuccess(message) {
    toast.success(message);
}

export function toastError(error) {
    toast.error(error.response?.data?.message || error.response?.message || error.message);
}

export const formateDateString = (dateString, format = "ll") => {
    return moment(dateString).format(format);
}


export const formatCurrency = (input, currency = 'CFA') => {
    // Convert input to a number if it's a string
    const value = typeof input === 'string' ? parseFloat(input) : input;

    // Check if the input is a valid number
    if (isNaN(value)) {
        return '-';
    }

    const formattedCurrency = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: currency,
    }).format(value);

    return formattedCurrency;
}

export const formatPercentage = (input) => {
    // Convert input to a number if it's a string
    const value = typeof input === 'string' ? parseFloat(input) : input;

    // Check if the input is a valid number
    if (isNaN(value)) {
        return '-';
    }

    return `${value} %`;
}