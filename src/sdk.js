import { RECEIVE_ACTIONS_NAME, SEND_ACTIONS_NAME } from './constants';
import { handlePostEvent } from './utils';
import Validator from './validator';
import storage from './storage';

const STORAGE_ACCOUNT_KEY = 'INCOGNITO_STORAGE_ACCOUNT';

export const connectAccount = () => {
  handlePostEvent(SEND_ACTIONS_NAME.REQUEST_CONNECT_ACCOUNT);
};

export const requestSendTx = (payload) => {
  const {
    accountName,
    toAddress,
    amount,
    memo,
    tokenId
  } = payload;
  new Validator('payload', payload).required().object(); // string
  new Validator('accountName', accountName).required().string(); // string
  new Validator('toAddress', toAddress).required().paymentAddress(); // string
  new Validator('amount', amount).required().amount(); // string
  new Validator('tokenId', tokenId).required().tokenId(); // string
  new Validator('memo', memo).string(); // string
  return new Promise((resolve, reject) => {
    try {
      const params = { accountName, toAddress, amount, memo, tokenId };
      handlePostEvent(SEND_ACTIONS_NAME.REQUEST_SEND_TX, params);
      resolve(params);
    } catch (error) {
      reject(error);
    }
  });
};

export const checkConnectAccount = async () => {
  setTimeout(() => {
    handlePostEvent(SEND_ACTIONS_NAME.CHECK_CONNECT_ACCOUNT);
  }, 500);
  return await storage.get(STORAGE_ACCOUNT_KEY);
};

const handleStorageData = async (actionName, data) => {
  switch (actionName) {
  case RECEIVE_ACTIONS_NAME.CONNECT_TO_ACCOUNT_SUCCESS: {
    await storage.set(STORAGE_ACCOUNT_KEY, data);
    break;
  }
  case RECEIVE_ACTIONS_NAME.DISCONNECT_ACCOUNT: {
    await storage.remove(STORAGE_ACCOUNT_KEY);
    break;
  }
  default: {
    break;
  }
  }
};

export const listenEvent = (callBack) => {
  try {
    window.addEventListener('message', (event) => {
      const response = event.data;
      const { data, actionKey, actionName } = response;
      if (!actionKey || actionKey !== RECEIVE_ACTIONS_NAME.ACTION_KEY) return;
      handleStorageData(actionName, data).then();
      callBack(actionName, data);
    }, false);
  } catch (error) {/*Ignored error*/}    
};