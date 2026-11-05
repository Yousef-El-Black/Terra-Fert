import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type Msg = {
  id: string | number;
  text: string;
  type: "error" | "success";
};

interface MsgState {
  value: Msg[];
}

const initialState: MsgState = {
  value: [],
};

const msgSlice = createSlice({
  name: "msg",
  initialState,
  reducers: {
    addMsg: (state, action: PayloadAction<Msg>) => {
      state.value.push(action.payload);
    },
    deleteMsg: (state, action: PayloadAction<string | number>) => {
      state.value = state.value.filter((msg) => msg.id !== action.payload);
    },
  },
});

export const { addMsg, deleteMsg } = msgSlice.actions;
export default msgSlice.reducer;
