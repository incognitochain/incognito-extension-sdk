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