import { combineReducers } from 'redux';
import userReducer from './user/userSlice';
import transactionsReducer from './transactions/transactionsSlice';
import bankingDetailsReducer from './bankingDetails/bankingDetailsSlice';
import documentsReducer from './documents/documentsSlice';
import userRequestsReducer from './userRequests/userRequestsSlice';

const rootReducer = combineReducers({
  user: userReducer,
  transactions: transactionsReducer,
  bankingDetails: bankingDetailsReducer,
  documents: documentsReducer,
  userRequests: userRequestsReducer,
});

export default rootReducer;
