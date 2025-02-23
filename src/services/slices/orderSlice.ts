//TODO: реализовать слайс с сохранением заказа из констуктора и отправкой
//проверить стурктуру данных
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { orderBurgerApi } from '../../utils/burger-api';
import { TIngredient, TOrder } from '@utils-types';

interface OrderState {
    ingredients: TIngredient[];
    request: boolean;
    order: TOrder | null;
    error: string | null;
}

const initialState: OrderState = {
    ingredients: [],
    request: false,
    order: null,
    error: null
}

const orderSlice = createSlice({
  name: 'order',
  initialState,
  reducers: {},
  selectors: {
    selectIngedients: (state) => state.ingredients
  }
});

export const { selectIngedients } = orderSlice.selectors;
export default orderSlice.reducer;
