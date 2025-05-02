import { expect, describe, it } from '@jest/globals';

import reducer, {
  addIngredient,
  moveIngredientUp,
  moveIngredientDown,
  removeIngredient,
  clearUserOrder
} from '../services/slices/userOrderSlice';

import { TIngredient, TConstructorIngredient } from '@utils-types';

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

  it('should return initial state', () => {
    const initialState = reducer(undefined, { type: '@@INIT' });
    expect(initialState).toEqual({
      bun: null,
      ingredients: [],
      request: false,
      order: null,
      error: null
    });
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
    const initial = {
      bun: null,
      ingredients: [
        { ...meat, id: '0' },
        { ...sauce, id: '1' }
      ],
      request: false,
      order: null,
      error: null
    };
    const newState = reducer(initial, moveIngredientUp({ ...sauce, id: '1' }));
    expect(newState.ingredients).toEqual([
      { ...sauce, id: '1' },
      { ...meat, id: '0' }
    ]);
  });

  it('should move ingredient down', () => {
    const initial = {
      bun: null,
      ingredients: [
        { ...meat, id: '0' },
        { ...sauce, id: '1' }
      ],
      request: false,
      order: null,
      error: null
    };
    const newState = reducer(initial, moveIngredientDown({ ...meat, id: '0' }));
    expect(newState.ingredients).toEqual([
      { ...sauce, id: '1' },
      { ...meat, id: '0' }
    ]);
  });
});
