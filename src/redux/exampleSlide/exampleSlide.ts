import { createSlice, PayloadAction } from "@reduxjs/toolkit";

type InitialValue = {
  state: string;
};

const initialState: InitialValue = { state: "Egor" };

const ExampleSlide = createSlice({
  name: "example",
  initialState: initialState,
  reducers: {
    func: (state, action: PayloadAction<string>) => {
      state.state = action.payload;
    }
  }
});

export default ExampleSlide.reducer;
export const { func } = ExampleSlide.actions;
