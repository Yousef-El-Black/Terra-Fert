import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

type CartProduct = {
  id: string | number;
  quantity: number;
};

interface CartState {
  value: CartProduct[];
}

const initialState: CartState = {
  value: [],
};

const cartSlice = createSlice({
  name: "cart",
  initialState,
  reducers: {
    addProduct: (state, action: PayloadAction<CartProduct>) => {
      const existingProduct = state.value.find(
        (item) => item.id === action.payload.id,
      );
      if (existingProduct) {
        existingProduct.quantity += action.payload.quantity;
      } else {
        state.value.push(action.payload);
      }
    },
    deleteProduct: (state, action: PayloadAction<string | number>) => {
      state.value = state.value.filter(
        (product) => product.id !== action.payload,
      );
    },
    updateQuantity: (state, action: PayloadAction<CartProduct>) => {
      state.value = state.value.map((product) =>
        product.id === action.payload.id ? action.payload : product,
      );
    },
    editAmountOfProduct: (
      state,
      action: PayloadAction<{ id: string | number; quantity: number }>,
    ) => {
      const product = state.value.find((item) => item.id === action.payload.id);

      if (product) {
        product.quantity = action.payload.quantity;
      }
    },
  },
});

export const {
  addProduct,
  deleteProduct,
  editAmountOfProduct,
  updateQuantity,
} = cartSlice.actions;
export default cartSlice.reducer;
