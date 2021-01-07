import React, { useEffect, useState } from 'react';
import ErrorBoundary from "../../Components/ErrorBoundary";
import styles from "./SimpleForm.styled";
import { withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import SDK from 'incognito-extension-sdk';
import EXTENSION_EVENT from "../../Consts/extensionConstants";

const enhance = (WrappedComponent) => (props) => {
    const [account, setAccount] = useState(null);
    const [sendData, setSendData] = useState({});
    const { address, amount, memo, token } = sendData;

    const onChangeText = (event, field) => {
        const value = event.target.value;
        setSendData({
            ...sendData,
            [field]: value
        });
    }

    const onClickWallet = () => SDK.connectAccount();

    const onExtensionEvent = (actionName, data) => {
        console.debug('DApp LISTEN EVENT WITH DATA: ', data);
        switch (actionName) {
            case EXTENSION_EVENT.CONNECT_TO_ACCOUNT_SUCCESS: {
                setAccount(data)
                localStorage.setItem('connected', 'connected');
                break;
            }
            case EXTENSION_EVENT.CONNECT_TO_ACCOUNT_ERROR: {
                setAccount(data)
                break;
            }
            case EXTENSION_EVENT.DISCONNECT_ACCOUNT: {
                setAccount(null);
                localStorage.removeItem('connected');
                break;
            }
            case EXTENSION_EVENT.SEND_TX_FINISH: {
                const { error, txInfo } = data;
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
        SDK.listenEvent((actionName, data) => {
            onExtensionEvent(actionName, data);
        });
    }, []);

    useEffect(async () => {
        const connected = localStorage.getItem('connected');
        // wait wakeup screen
        setTimeout(() => {
            if(connected) SDK.connectAccount()
        }, 500)
    }, []);

    return (
        <ErrorBoundary>
            <WrappedComponent {...{
                ...props,
                account,

                address,
                amount,
                memo,
                token,

                changeText: onChangeText,
                pressWallet: onClickWallet
            }} />
        </ErrorBoundary>
    );
};
export default compose(withStyles(styles), enhance);
