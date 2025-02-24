//TODO: реализовать слайс с сохранением заказа из констуктора и отправкой
//проверить стурктуру данных
import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TConstructorIngredient, TIngredient, TOrder } from '@utils-types';
import { nanoid } from '@reduxjs/toolkit';

const swapIngredients = (
  a: TConstructorIngredient,
  b: TConstructorIngredient
) => {};

interface userOrderState {
  bun: TConstructorIngredient | null;
  ingredients: TConstructorIngredient[];
  request: boolean;
  order: TOrder | null;
  error: string | null;
}

const initialState: userOrderState = {
  bun: null,
  ingredients: [],
  request: false,
  order: null,
  error: null
};

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
    }
  },
  selectors: {
    selectIngedients: (state) => state.ingredients,
    selectBun: (state) => state.bun,
    selectRequest: (state) => state.request,
    selectOrder: (state) => state.order
  }
});

export const { addIngredient, moveIngredientUp, moveIngredientDown } =
  userOrderSlice.actions;
export const { selectIngedients, selectBun, selectRequest, selectOrder } =
  userOrderSlice.selectors;

export default userOrderSlice.reducer;
