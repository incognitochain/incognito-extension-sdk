import BigNumber from "bignumber.js";

export const saveData = (key, value) => {
    localStorage.setItem(key, JSON.stringify(value));
};

export const getData = (key) => {
    const result = localStorage.getItem(key);
    return JSON.parse(result);
};

export const removeData = (key) => {
    localStorage.removeItem(key);
};

export const convertToHumandAmount = (originalAmount, decimals) => {
    const amount = new BigNumber(originalAmount);
    if (amount.isNaN()) {
        return 0;
    }
    const indexNumber = new BigNumber(10).pow(decimals);
    return amount.dividedBy(indexNumber).toNumber();
};

export const ellipsisCenter = (payload) => {
    const { str, limit = 10, dots = '...' } = payload;
    try {
        const size = str.length;
        if (size < limit * 2 + dots.length) {
            return str;
        }
        const leftStr = str.substring(0, limit);
        const rightStr = str.substring(size - limit, size);
        return leftStr + dots + rightStr;
    } catch {
        return str;
    }
};