import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  documents: [],
};

const documentsSlice = createSlice({
  name: 'documents',
  initialState,
  reducers: {
    addDocument: (state, action) => {
      state.documents.push(action.payload);
    },
    deleteDocument: (state, action) => {
      state.documents = state.documents.filter(document => document.id !== action.payload);
    },
    editDocument: (state, action) => {
      const index = state.documents.findIndex(document => document.id === action.payload.id);
      if (index !== -1) {
        state.documents[index] = action.payload;
      }
    },
  },
});

export const { addDocument, deleteDocument, editDocument } = documentsSlice.actions;

export default documentsSlice.reducer;
