# incognito-extension-sdk
This allows you to work with the Incognito Extension, without the additional overhead of having to write your own integration code for the platform.

# Installation
Open a Terminal in the project root and run:

#### `$ yarn add https://github.com/incognitochain/incognito-extension-sdk`

## Dowload Example

#### `$ git clone https://github.com/incognitochain/incognito-extension-sdk/tree/main/example`

run `yarn install` and `yarn start` try your example, you'll love it.

# Usage

### Create method storage data

```javascript
const STORAGE_KEY = 'INCOGNITO_STORAGE';

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
```

### Check connect

```javascript
import SDK from 'incognito-extension-sdk';

...

// after connect account success, save account info in localStorage, get account info when reload tab
const account = getData(STORAGE_KEY.ACCOUNT);

// check account is connected, respone will receive in SDK.listenEvent
setTimeout(() => {
    SDK.checkConnectAccount();
}, 500);

```
### Request connect

```javascript
import SDK from 'incognito-extension-sdk';

...

// call this method request connect to Incognito Extension
SDK.connectAccount()

```

### Request send transaction

```javascript
import SDK from 'incognito-extension-sdk';

...

await SDK.requestSendTx({
    accountName: string, // require
    toAddress: string, // require
    amount: string, // require
    memo: string, // optional
    tokenId: string // require
})

```

### Listen event from extension

#### Custom event name:

```javascript
import SDK from 'incognito-extension-sdk';

const EXTENSION_CONSTANTS = SDK.RECEIVE_ACTIONS_NAME;

const EXTENSION_EVENT = {
    CONNECT_TO_ACCOUNT_SUCCESS: EXTENSION_CONSTANTS.CONNECT_TO_ACCOUNT_SUCCESS,
    CONNECT_TO_ACCOUNT_ERROR: EXTENSION_CONSTANTS.CONNECT_TO_ACCOUNT_ERROR,
    DISCONNECT_ACCOUNT: EXTENSION_CONSTANTS.DISCONNECT_ACCOUNT,
    SEND_TX_FINISH: EXTENSION_CONSTANTS.SEND_TX_FINISH,
    CANCEL_SEND_TX: EXTENSION_CONSTANTS.CANCEL_SEND_TX,
}
  
```

#### Listen event:

```javascript
import SDK from 'incognito-extension-sdk';

const onExtensionEvent = (actionName, data) => {
  // use witch case catch event name match with EXTENSION_EVENT
};

SDK.listenEvent((actionName, data) => {
    onExtensionEvent(actionName, data);
});

```

## Event name:

### 1. Event connect account:

```javascript
case EXTENSION_EVENT.CONNECT_TO_ACCOUNT_SUCCESS: {
    saveData(STORAGE_KEY, data);
    break;
}
```

#### Props:
```javascript 
 data = {
  accountNane: string,
  paymentAddress: string,
  tokens: [{
        mount: string,
        change: string,
        decimals: number,
        default: boolean,
        formatAmount: string,
        formatAmountNoClip: string,
        formatBalanceByPRV: string,
        formatBalanceByPrv: string,
        formatBalanceByUsd: string,
        formatPriceByPrv: string,
        formatPriceByUsd: string,
        iconUrl: string,
        incognitoTotalSupply: number,
        isBep2Token: boolean,
        isCentralized: boolean,
        isDecentralized: boolean,
        isDeposable: boolean,
        isErc20Token: boolean,
        isFollowed: boolean,
        isIncognitoToken: boolean,
        isNativeToken: boolean,
        isPrivacyToken: boolean,
        isPrivateCoin: boolean,
        isPrivateToken: boolean,
        isToken: boolean,
        isVerified: boolean,
        isWithdrawable: boolean,
        name: string,
        networkName: string,
        pDecimals: number,
        pSymbol: string,
        pricePrv: number,
        priceUsd: number,
        rootNetworkName: string,
        symbol: string,
        tokenId: string,
    }],
 }
```
Note: Tokens is all tokens account followed.

### 2: Event disconnect account

```javascript
case EXTENSION_EVENT.DISCONNECT_ACCOUNT: {
    removeData(STORAGE_KEY.ACCOUNT);
    break;
}
```

### 3: Event send transaction finish

```javascript
case EXTENSION_EVENT.SEND_TX_FINISH: {
  const { error, txInfo } = data;
  if (!error) return console.debug('SEND TX SUCCESS: ' + txInfo);
  console.debug('SEND TX WITH ERROR: ' + txInfo);
  break;
}
```

#### Props:
```javascript 
 txInfo = {
    txId: string,
    paymentAddress: string,
    time: string,
    amount: string,
    symbol: string,
    fee: number,
    feeSymbol: string,
 }
```

### 4: Event cancel send tx

```javascript
case EXTENSION_EVENT.CANCEL_SEND_TX: {
    // user cancel send tx
    break;
}

```


  
