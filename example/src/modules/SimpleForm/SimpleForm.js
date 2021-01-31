import React from 'react';
import Wallet from "../../Components/Wallet";
import { Container, Button, TextField, MenuItem, Select } from '@material-ui/core';
import SDK from 'incognito-extension-sdk';
import withEnhance from './SimpleForm.enhance';
import { convertToHumandAmount, ellipsisCenter } from '../../utils';

const SimpleForm = React.memo((props) => {
    const {
        classes,
        account,
        address,
        amount,
        memo,
        token,
        changeText,
        pressWallet
    } = props;

    const renderTokenList = () => {
        if (!account) return;
        return (
            <Select
                id="select"
                defaultValue={account?.tokens ? account.tokens[0] : null}
                className={classes.list}
                onChange={event => changeText(event, 'token')}>
                {account.tokens.map((token) =>
                    <MenuItem key={token.tokenId} value={token}>
                        {token.symbol}
                    </MenuItem>
                )}
            </Select>
        );
    };

    const renderAccountInfo = () => {
        if (!account) return null;
        let currentToken = token;
        if (!token) currentToken = account.tokens[0];
        return (
          <>
              <p>{`Balance: ${convertToHumandAmount(currentToken?.amount, currentToken?.pDecimals)} ${currentToken.symbol}`}</p>
              <p>{`Address: ${ellipsisCenter({ str: account.paymentAddress, limit: 15 })}`}</p>
          </>
        );
    }

    const onRequestSendTx = async () => {
        try {
            if (!account) return null;
            let currentToken = token;
            if (!token) currentToken = account.tokens[0];
            const tokenId = currentToken.tokenId;
            await SDK.requestSendTx({
                accountName: account?.name,
                toAddress: address,
                amount: amount + '',
                memo,
                tokenId
            })
        } catch (e) {}
    };

    return (
        <Container className={classes.wrapper}>
            <Wallet account={account} onClick={pressWallet}/>
            {renderAccountInfo()}
            <div className={classes.row}>
                <TextField
                    className={classes.input}
                    type="number"
                    id="standard-error-helper-text"
                    label="Amount"
                    value={amount}
                    onChange={event => changeText(event, 'amount')}
                    helperText='Integer number, larger than 0'
                />
                {renderTokenList()}
            </div>
            <TextField
                className={classes.input}
                id="standard-error-helper-text"
                label="Payment Address"
                value={address}
                onChange={event => changeText(event, 'address')}
            />
            <TextField
                className={classes.input}
                id="standard-error-helper-text"
                label="Memo (optional)"
                value={memo}
                onChange={event => changeText(event, 'memo')}
                helperText='String, less than 512 bytes'
            />
            <Button
                disabled={!amount || !address}
                className={classes.submit}
                onClick={onRequestSendTx}
            >
                Send
            </Button>
        </Container>
    );
});

export default withEnhance(SimpleForm);
