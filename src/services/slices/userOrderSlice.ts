//TODO: реализовать слайс с сохранением заказа из констуктора и отправкой
//проверить стурктуру данных
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';

interface UserOrderState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  request: boolean;
  order: TOrder | null;
  error: string | null;
}

const initialState: UserOrderState = {
  bun: null,
  ingredients: [],
  request: false,
  order: null,
  error: null
};

export const placeOrder = createAsyncThunk(
  'orders/placeOrder',
  async (ingredients: TConstructorIngredient[]) => {
    const data = ingredients.map((item) => item._id);
    const res = await orderBurgerApi(data);
    return res;
  }
);

const userOrderSlice = createSlice({
  name: 'userOrder',
  initialState,
  reducers: {
    addIngredient: (state, action: PayloadAction<TIngredient>) => {
      const ingredient = action.payload;
      if (ingredient.type === 'bun') {
        state.bun = { ...ingredient, id: nanoid() };
      } else {
        state.ingredients.push({ ...ingredient, id: nanoid() });
      }
    },
    moveIngredientUp: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const idx = state.ingredients.findIndex(
        (item: TConstructorIngredient) => item.id === action.payload.id
      );
      if (idx > 0) {
        [state.ingredients[idx - 1], state.ingredients[idx]] = [
          state.ingredients[idx],
          state.ingredients[idx - 1]
        ];
      }
    },
    moveIngredientDown: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      const idx = state.ingredients.findIndex(
        (item: TConstructorIngredient) => item.id === action.payload.id
      );
      if (idx >= 0 && idx < state.ingredients.length - 1) {
        [state.ingredients[idx], state.ingredients[idx + 1]] = [
          state.ingredients[idx + 1],
          state.ingredients[idx]
        ];
      }
    },
    removeIngredient: (
      state,
      action: PayloadAction<TConstructorIngredient>
    ) => {
      state.ingredients = state.ingredients.filter(
        (item: TConstructorIngredient) => item.id != action.payload.id
      );
    }
  },
  selectors: {
    selectIngedients: (state) => state.ingredients,
    selectBun: (state) => state.bun,
    selectRequest: (state) => state.request,
    selectOrder: (state) => state.order
  },
  extraReducers: (builder) => {
    builder
      .addCase(placeOrder.pending, (state) => {
        state.request = true;
      })
      .addCase(placeOrder.rejected, (state, action) => {
        state.request = false;
        console.log(action);
      })
      .addCase(placeOrder.fulfilled, (state, action) => {
        state.request = false;
        console.log(action);
      });
  }
});

export const {
  addIngredient,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient
} = userOrderSlice.actions;
export const { selectIngedients, selectBun, selectRequest, selectOrder } =
  userOrderSlice.selectors;

export default userOrderSlice.reducer;
