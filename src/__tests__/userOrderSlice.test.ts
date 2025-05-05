import { expect, describe, it } from '@jest/globals';

import reducer, {
  initialState,
  addIngredient,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  placeOrder
} from '../services/slices/userOrderSlice';

jest.mock('@reduxjs/toolkit', () => {
  const actual = jest.requireActual('@reduxjs/toolkit');
  return {
    ...actual,
    nanoid: jest.fn(() => 'mocked-id')
  };
});

describe('check userOrderSlice actions', () => {
  afterAll(() => {
    jest.resetAllMocks();
  });

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

  const sauce = {
    _id: '2',
    name: 'sauce',
    type: 'sauce',
    proteins: 42,
    fat: 43,
    carbohydrates: 44,
    calories: 45,
    price: 100,
    image: 'sauce.jpg',
    image_large: 'sauce.jpg',
    image_mobile: 'sauce.jpg'
  };

  const userOrder = {
    _id: '1',
    status: 'test',
    name: 'test',
    createdAt: 'test',
    updatedAt: 'test',
    number: 1,
    ingredients: ['test']
  };

  it('should return initial state', () => {
    const newState = reducer(undefined, { type: '@@INIT' });
    expect(newState).toEqual(initialState);
  });

  it('should add bun to ingredients', () => {
    const newState = reducer(undefined, addIngredient(bun));
    expect(newState.bun).toEqual({ ...bun, id: 'mocked-id' });
  });

  it('should add ingredient to ingredients', () => {
    const newState = reducer(undefined, addIngredient(meat));
    expect(newState.ingredients).toEqual([{ ...meat, id: 'mocked-id' }]);
  });

  it('should move ingredient up', () => {
    const state = {
      ...initialState,
      ingredients: [
        { ...meat, id: '0' },
        { ...sauce, id: '1' }
      ]
    };
    const newState = reducer(state, moveIngredientUp({ ...sauce, id: '1' }));
    expect(newState.ingredients).toEqual([
      { ...sauce, id: '1' },
      { ...meat, id: '0' }
    ]);
  });

  it('should move ingredient down', () => {
    const state = {
      ...initialState,
      ingredients: [
        { ...meat, id: '0' },
        { ...sauce, id: '1' }
      ]
    };
    const newState = reducer(state, moveIngredientDown({ ...meat, id: '0' }));
    expect(newState.ingredients).toEqual([
      { ...sauce, id: '1' },
      { ...meat, id: '0' }
    ]);
  });

  it('should remove ingredient', () => {
    const state = {
      ...initialState,
      ingredients: [
        { ...meat, id: '0' },
        { ...sauce, id: '1' }
      ]
    };
    const newState = reducer(state, removeIngredient({ ...meat, id: '0' }));
    expect(newState.ingredients).toEqual([{ ...sauce, id: '1' }]);
  });

  it('should set request to true on placeOrder.pending', () => {
    const action = { type: placeOrder.pending.type };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initialState, request: true });
  });

  it('should set request to false and save error on placeOrder.rejected', () => {
    const action = {
      type: placeOrder.rejected.type,
      error: {
        message: 'error'
      }
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({
      ...initialState,
      request: false,
      error: 'error'
    });
  });

  it('should set request to false and save order on placeOrder.fulfilled', () => {
    const action = {
      type: placeOrder.fulfilled.type,
      payload: {
        order: userOrder
      }
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({
      ...initialState,
      request: false,
      order: userOrder
    });
  });
});
