# incognito-extension-sdk
This allows you to work with the Incognito Extension, without the additional overhead of having to write your own integration code for the platform.

# Installation
Open a Terminal in the project root and run:

#### `$ yarn add https://github.com/incognitochain/incognito-extension-sdk`

## Quick Start

```javascript

import SDK from 'incognito-extension-sdk';

const main = async () => {
    // manager storage account by localStorage
    SDK.storage.implement({
        setMethod: async (key, data) => {
            return localStorage.setItem(key, data);
        },
        getMethod: async (key) => {
            return localStorage.getItem(key);
        },
        removeMethod: async (key) => localStorage.removeItem(key),
        namespace: 'DAPP_EXAMPLE',
    });

    // check connect account when open website
    let account = await SDK.checkConnectAccount();
    if (!account) {
        // request connect to extension
        SDK.connectAccount();
    };
    
    // Constants
    const PRV_ID = '0000000000000000000000000000000000000000000000000000000000000004';
    
    const EXTENSION_CONSTANTS = SDK.RECEIVE_ACTIONS_NAME;
    
    const EXTENSION_EVENT = {
        CONNECT_TO_ACCOUNT_SUCCESS: EXTENSION_CONSTANTS.CONNECT_TO_ACCOUNT_SUCCESS,
        CONNECT_TO_ACCOUNT_ERROR: EXTENSION_CONSTANTS.CONNECT_TO_ACCOUNT_ERROR,
        DISCONNECT_ACCOUNT: EXTENSION_CONSTANTS.DISCONNECT_ACCOUNT,
        SEND_TX_FINISH: EXTENSION_CONSTANTS.SEND_TX_FINISH,
        CANCEL_SEND_TX: EXTENSION_CONSTANTS.CANCEL_SEND_TX,
    };
    
    // request send transaction
    const onRequestSendTx = async () => {
        await SDK.requestSendTx({
            accountName: account.name,
            toAddress: account.paymentAddress,
            amount: '1',
            memo: 'test send transaction',
            tokenId: PRV_ID
        });
    };

    // handle when receive event from extension
    const onExtensionEvent = (actionName, data) => {
        switch (actionName) {
            // dapp connect with extension success
            case EXTENSION_EVENT.CONNECT_TO_ACCOUNT_SUCCESS: {
                // Todo: handle when account connected
                console.debug('Connect account success: ', data)
                account = data;
                setTimeout(() => { onRequestSendTx().then(); }, 3000)
                break;
            }
            // dapp disconnect with extension
            case EXTENSION_EVENT.DISCONNECT_ACCOUNT: {
                // Todo: handle when account disconnected
                console.debug('Disconnect account')
                account = null;
                break;
            }
            // request send transaction finish
            case EXTENSION_EVENT.SEND_TX_FINISH: {
                // if error === null, request send transaction success with data `txInfo` and and vice versa.
                const { error, txInfo } = data;
                console.debug('Send transaction finish: ', data)
                break;
            }
            // user cancel request send transaction
            case EXTENSION_EVENT.CANCEL_SEND_TX: {
                // Todo: handle when user cancel send transaction
                break;
            }
            default: {
                break;
            }
        }
    };

    // listen all event from extension post to dapp
    SDK.listenEvent((actionName, data) => {
        onExtensionEvent(actionName, data);
    });
};

// timeout waiting extension establish
setTimeout(() => {
    main();
}, 1000)

```

## API

### Implement storage SDK

We handle storage data by localStorage

```javascript
import SDK from 'incognito-extension-sdk';

...

SDK.storage.implement({
    setMethod: async (key, data) => {
        return localStorage.setItem(key, data);
    },
    getMethod: async (key) => {
        return localStorage.getItem(key);
    },
    removeMethod: async (key) => localStorage.removeItem(key),
    namespace: 'DAPP_EXAMPLE',
});

```

### Check connect

Check account connected when open website

```javascript
import SDK from 'incognito-extension-sdk';

...

// checkConnectAccount return account connected, if didn't connected, return null
const account = await SDK.checkConnectAccount();

```
#### Props:
```javascript 
 account = {
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

When extension disconnect account, you can listen this event below

```javascript
case EXTENSION_EVENT.DISCONNECT_ACCOUNT: {
    break;
}

```

### 3: Event send transaction finish

When request send transaction finish, catch this event below

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

User cancel send transaction, `don't send transaction`, catch this event below

```javascript
case EXTENSION_EVENT.CANCEL_SEND_TX: {
    // user cancel send tx
    break;
}

```


  
