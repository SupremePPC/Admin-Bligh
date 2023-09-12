import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { getAuth, deleteUser as deleteFirebaseUser } from "firebase/auth";
import { doc, deleteDoc } from "firebase/firestore";
import { db } from "../../firebaseConfig/firebase";

export const deleteUser = createAsyncThunk(
  'user/deleteUser',
  async (userId, { rejectWithValue }) => {
    try {
      const userRef = doc(db, "users", userId);
      await deleteDoc(userRef);

      const auth = getAuth();
      const user = auth.currentUser;

      if (user && user.uid === userId) {
        await deleteFirebaseUser(user);
      }

      return userId;
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const userSlice = createSlice({
  name: 'user',
  initialState: {
    users: [],
  },
  reducers: {
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    editUser: (state, action) => {
      const index = state.users.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.users[index] = action.payload;
      }
    }
  },
  extraReducers: (builder) => {
    builder.addCase(deleteUser.fulfilled, (state, action) => {
      state.users = state.users.filter(user => user.id !== action.payload);
    });
  }
});

export const { addUser, editUser } = userSlice.actions;
export default userSlice.reducer;
