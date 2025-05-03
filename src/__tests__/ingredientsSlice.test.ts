import { expect, describe, it } from '@jest/globals';

import reducer, { fetchIngredients } from '../services/slices/ingredientsSlice';

describe('check ingredientsSlice', () => {
  const initial = {
    ingredients: [],
    loading: false,
    error: null
  };

  const bun = {
    _id: '0',
    name: 'bun',
    type: 'bun',
    proteins: 42,
    fat: 43,
    carbohydrates: 44,
    calories: 45,
    price: 100,
    image: 'bun.jpg',
    image_large: 'bun.jpg',
    image_mobile: 'bun.jpg'
  };

  const meat = {
    _id: '1',
    name: 'meat',
    type: 'main',
    proteins: 42,
    fat: 43,
    carbohydrates: 44,
    calories: 45,
    price: 100,
    image: 'meat.jpg',
    image_large: 'meat.jpg',
    image_mobile: 'meat.jpg'
  };

  it('should return initial state', () => {
    const newState = reducer(undefined, { type: '@@INIT' });
    expect(newState).toEqual(initial);
  });

  it('should set loading to true on fetchIngredients.pending', () => {
    const action = { type: fetchIngredients.pending.type };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, loading: true });
  });

  it('should set request to false and save error on fetchIngredients.rejected', () => {
    const action = {
      type: fetchIngredients.rejected.type,
      error: {
        message: 'error'
      }
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, loading: false, error: 'error' });
  });

  it('should set request to false and save ingredients on fetchIngredients.fulfilled', () => {
    const action = {
      type: fetchIngredients.fulfilled.type,
      payload: [bun, meat]
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({
      ...initial,
      loading: false,
      ingredients: [bun, meat]
    });
  });
});
