import React, { useEffect } from 'react';
import ErrorBoundary from "../../Components/ErrorBoundary";
import SDK from 'incognito-extension-sdk';
import EXTENSION_EVENT from "../../Consts/extensionConstants";
import { STORAGE_KEY } from "../../Consts/appConstants";
import { saveData, removeData, getData } from '../../utils';

const enhanceListen = (WrappedComponent) => (props) => {
    const { account, setAccount } = props;

    const onExtensionEvent = (actionName, data) => {
        console.debug('DApp LISTEN EVENT WITH DATA: ', data);
        switch (actionName) {
            case EXTENSION_EVENT.CONNECT_TO_ACCOUNT_SUCCESS: {
                setAccount(data)
                saveData(STORAGE_KEY.ACCOUNT, data);
                break;
            }
            case EXTENSION_EVENT.CONNECT_TO_ACCOUNT_ERROR: {
                setAccount(data)
                break;
            }
            case EXTENSION_EVENT.DISCONNECT_ACCOUNT: {
                setAccount(null);
                removeData(STORAGE_KEY.ACCOUNT);
                break;
            }
            case EXTENSION_EVENT.SEND_TX_FINISH: {
                const { error, txInfo } = data;
                if (!error) return alert('SEND TX SUCCESS: ' + JSON.stringify(txInfo))
                alert('SEND TX WITH ERROR: ' + JSON.stringify(txInfo))
                break;
            }
            case EXTENSION_EVENT.CANCEL_SEND_TX: {
                // user cancel send tx
                break;
            }
            default: {
                break;
            }
        }
    };

    useEffect(() => {
        // listen event
        SDK.listenEvent((actionName, data) => {
            onExtensionEvent(actionName, data);
        });
    }, []);

    useEffect(() => {
        // get account
        const account = getData(STORAGE_KEY.ACCOUNT);
        setAccount(account);
        setTimeout(() => {
            SDK.checkConnectAccount();
        }, 500);
    }, []);

    return (
        <ErrorBoundary>
            <WrappedComponent {...{
                ...props,
                account,
            }} />
        </ErrorBoundary>
    );
};
export default enhanceListen;
