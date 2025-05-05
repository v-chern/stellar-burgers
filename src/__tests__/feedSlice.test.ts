import { expect, describe, it } from '@jest/globals';

import reducer, {
  fetchFeedOrders,
  initialState
} from '../services/slices/feedSlice';

describe('check feedSlice', () => {
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

  it('should set loading to true on fetchFeedOrders.pending', () => {
    const action = { type: fetchFeedOrders.pending.type };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initialState, loading: true });
  });

  it('should set loading to false and save error on fetchFeedOrders.rejected', () => {
    const action = {
      type: fetchFeedOrders.rejected.type,
      error: {
        message: 'error'
      }
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({
      ...initialState,
      loading: false,
      error: 'error'
    });
  });

  it('should set loading to false and save orders on fetchFeedOrders.fulfilled', () => {
    const action = {
      type: fetchFeedOrders.fulfilled.type,
      payload: {
        orders: [userOrder],
        total: 1,
        totalToday: 1
      }
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({
      ...initialState,
      loading: false,
      feed: { orders: [userOrder], total: 1, totalToday: 1 }
    });
  });
});
