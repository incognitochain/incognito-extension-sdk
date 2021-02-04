import { RECEIVE_ACTIONS_NAME } from './src/constants';
import {
  listenEvent,
  requestSendTx,
  connectAccount,
  checkConnectAccount,
} from './src/sdk';
import storage from './src/storage';

export default ({
  storage,
  listenEvent,
  connectAccount,
  requestSendTx,
  checkConnectAccount,
  RECEIVE_ACTIONS_NAME
});