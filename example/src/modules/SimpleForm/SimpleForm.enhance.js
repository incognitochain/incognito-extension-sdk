import React, { useState } from 'react';
import ErrorBoundary from "../../Components/ErrorBoundary";
import styles from "./SimpleForm.styled";
import { withStyles } from '@material-ui/core/styles';
import { compose } from "recompose";
import SDK from 'incognito-extension-sdk';
import enhanceListen from './SimpleFormListen.enhance';

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

    return (
        <ErrorBoundary>
            <WrappedComponent {...{
                ...props,
                account,

                address,
                amount,
                memo,
                token,

                setAccount,
                changeText: onChangeText,
                pressWallet: onClickWallet,
            }} />
        </ErrorBoundary>
    );
};
export default compose(withStyles(styles), enhance, enhanceListen);
