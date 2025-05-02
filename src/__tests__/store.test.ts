import { expect, describe, it } from '@jest/globals';
import { rootReducer } from '../services/store';
import ingredientsReducer from '../services/slices/ingredientsSlice';
import userOrderReducer from '../services/slices/userOrderSlice';
import feedReducer from '../services/slices/feedSlice';
import userReducer from '../services/slices/userSlice';

describe('check store', () => {
  it('should initialize root reducer', () => {
    const initialState = rootReducer(undefined, { type: '@@INIT' });
    expect(initialState).toHaveProperty('ingredients');
    expect(initialState).toHaveProperty('userOrder');
    expect(initialState).toHaveProperty('feed');
    expect(initialState).toHaveProperty('user');
    expect(initialState).toEqual({
      ingredients: ingredientsReducer(undefined, { type: '@@INIT' }),
      userOrder: userOrderReducer(undefined, { type: '@@INIT' }),
      feed: feedReducer(undefined, { type: '@@INIT' }),
      user: userReducer(undefined, { type: '@@INIT' })
    });
  });
});
