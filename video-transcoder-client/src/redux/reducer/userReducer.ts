import { PayloadAction, createSlice } from "@reduxjs/toolkit";

// <any> will be replaceed by user type
interface UserReducerInitialState {
  user: any | null;
  loader: boolean;
}

const initialState: UserReducerInitialState = {
  user: null,
  loader: true,
};

export type RootState = {
  userReducer: UserReducerInitialState; // Assuming your userReducer slice state is called UserReducerInitialState
  // Add other slice states here if you have them
};

export const userReducer = createSlice({
  name: "userReducer",
  initialState,
  reducers: {
    userExist: (state, action: PayloadAction<any>) => {
      state.loader = false;
      state.user = action.payload;
    },
    userNotExist: (state) => {
      state.loader = false;
      state.user = null;
    },

  },
});

export const { userExist, userNotExist } = userReducer.actions;
