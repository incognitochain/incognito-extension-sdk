import React, { useEffect } from 'react';
import ErrorBoundary from "../../Components/ErrorBoundary";
import SDK from 'incognito-extension-sdk';
import EXTENSION_EVENT from "../../Consts/extensionConstants";

const enhanceListen = (WrappedComponent) => (props) => {
    const { account, setAccount } = props;

    const onExtensionEvent = (actionName, data) => {
        console.debug('DApp LISTEN EVENT WITH DATA: ', data);
        switch (actionName) {
            case EXTENSION_EVENT.CONNECT_TO_ACCOUNT_SUCCESS: {
                setAccount(data)
                break;
            }
            case EXTENSION_EVENT.CONNECT_TO_ACCOUNT_ERROR: {
                setAccount(data)
                break;
            }
            case EXTENSION_EVENT.DISCONNECT_ACCOUNT: {
                setAccount(null);
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

    const handleCheckConnectAccount = React.useCallback(async () => {
        const account = await SDK.checkConnectAccount();
        setAccount(account)
    }, [] );

    useEffect(() => {
        // Implement SDK with storage
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
        handleCheckConnectAccount().then();
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
