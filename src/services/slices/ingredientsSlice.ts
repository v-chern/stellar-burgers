import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { getIngredientsApi } from '@api';
import { TIngredient } from '@utils-types';

interface IngredientsState {
  buns: TIngredient[];
  mains: TIngredient[];
  sauces: TIngredient[];
  loading: boolean;
  error: string | null | undefined;
}

const initialState: IngredientsState = {
  buns: [],
  mains: [],
  sauces: [],
  loading: false,
  error: null
};

export const fetchIngredients = createAsyncThunk(
  'ingredients/fetchAll',
  async () => {
    const data = await getIngredientsApi();
    return data;
  }
);

const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState,
  reducers: {},
  selectors: {
    //getIngredientsSelector: (state) => state,
    selectBuns: (state) => state.buns,
    selectMains: (state) => state.mains,
    selectSauces: (state) => state.sauces,
    selectIsLoading: (state) => state.loading
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchIngredients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchIngredients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message;
      })
      .addCase(fetchIngredients.fulfilled, (state, action) => {
        state.loading = false;
        state.buns = [];
        state.mains = [];
        state.sauces = [];
        action.payload.forEach((ingredient) => {
          switch (ingredient.type) {
            case 'bun':
              state.buns.push(ingredient);
              break;
            case 'main':
              state.mains.push(ingredient);
              break;
            case 'sauce':
              state.sauces.push(ingredient);
              break;
            default:
              break;
          }
        });
      });
  }
});

export const { selectBuns, selectMains, selectSauces, selectIsLoading } =
  ingredientsSlice.selectors;

export default ingredientsSlice.reducer;
