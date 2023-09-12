import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  bankingDetails: [],
};

const bankingDetailsSlice = createSlice({
  name: 'bankingDetails',
  initialState,
  reducers: {
    addBankingDetail: (state, action) => {
      state.bankingDetails.push(action.payload);
    },
    deleteBankingDetail: (state, action) => {
      state.bankingDetails = state.bankingDetails.filter(detail => detail.id !== action.payload);
    },
    editBankingDetail: (state, action) => {
      const index = state.bankingDetails.findIndex(detail => detail.id === action.payload.id);
      if (index !== -1) {
        state.bankingDetails[index] = action.payload;
      }
    },
  },
});

export const { addBankingDetail, deleteBankingDetail, editBankingDetail } = bankingDetailsSlice.actions;

export default bankingDetailsSlice.reducer;
