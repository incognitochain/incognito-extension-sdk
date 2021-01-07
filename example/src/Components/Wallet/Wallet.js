import React from 'react';
import styles from "./Wallet.styled";
import { Button, InputLabel, Container } from "@material-ui/core";
import { withStyles } from '@material-ui/core/styles';

const Wallet = React.memo((props) => {
    const { classes, account, onClick } = props;
    return (
        <Container>
            <Button className={classes.button} onClick={onClick}>
                <InputLabel className={classes.label}>
                    {account ? account.name : 'Connect to Wallet'}
                </InputLabel>
            </Button>
        </Container>
    );
});

export default withStyles(styles)(Wallet);