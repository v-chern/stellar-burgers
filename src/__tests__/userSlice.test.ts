import { expect, describe, it } from '@jest/globals';

import reducer, {
  loginUser,
  registerUser,
  getUser,
  updateUser,
  logoutUser,
  getUserOrders
} from '../services/slices/userSlice';

import { setCookie, deleteCookie } from '../utils/cookie';

jest.mock('../utils/cookie', () => ({
  setCookie: jest.fn(),
  deleteCookie: jest.fn()
}));

describe('check userSlice', () => {
  beforeEach(() => {
    const localStorageMock = {
      getItem: jest.fn(),
      setItem: jest.fn(),
      removeItem: jest.fn(),
      clear: jest.fn()
    };
    Object.defineProperty(window, 'localStorage', {
      value: localStorageMock
    });
  });

  const initial = {
    user: {
      name: '',
      email: ''
    },
    orders: null,
    isAuthenticated: false,
    isLoading: false,
    error: null
  };

  const userPayload = {
    user: {
      name: 'test',
      email: 'test@test.com'
    },
    accessToken: 'test-accessToken',
    refreshToken: 'test-refreshToken'
  };

  it('should return initial state', () => {
    const newState = reducer(undefined, { type: '@@INIT' });
    expect(newState).toEqual(initial);
  });

  it('should set isLoading to true on loginUser.pending', () => {
    const action = { type: loginUser.pending.type };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, isLoading: true });
  });

  it('should set isLoading to false and save error on loginUser.rejected', () => {
    const action = {
      type: loginUser.rejected.type,
      error: {
        message: 'error'
      }
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, isLoading: false, error: 'error' });
  });

  it('should set isLoading to false and save user on loginUser.fulfilled', () => {
    const action = {
      type: loginUser.fulfilled.type,
      payload: userPayload
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({
      ...initial,
      isLoading: false,
      isAuthenticated: true,
      user: userPayload.user
    });
    expect(setCookie).toHaveBeenCalledWith(
      'accessToken',
      userPayload.accessToken
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      userPayload.refreshToken
    );
  });

  it('should set isLoading to true on registerUser.pending', () => {
    const action = { type: registerUser.pending.type };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, isLoading: true });
  });

  it('should set isLoading to false and save error on registerUser.rejected', () => {
    const action = {
      type: registerUser.rejected.type,
      error: {
        message: 'error'
      }
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, isLoading: false, error: 'error' });
  });

  it('should set isLoading to false and save user on registerUser.fulfilled', () => {
    const action = {
      type: registerUser.fulfilled.type,
      payload: userPayload
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({
      ...initial,
      isLoading: false,
      isAuthenticated: true,
      user: userPayload.user
    });
    expect(setCookie).toHaveBeenCalledWith(
      'accessToken',
      userPayload.accessToken
    );
    expect(localStorage.setItem).toHaveBeenCalledWith(
      'refreshToken',
      userPayload.refreshToken
    );
  });

  it('should set isLoading to true on getUser.pending', () => {
    const action = { type: getUser.pending.type };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, isLoading: true });
  });

  it('should set isLoading to false and save error on getUser.rejected', () => {
    const action = {
      type: getUser.rejected.type,
      error: {
        message: 'error'
      }
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, isLoading: false, error: 'error' });
  });

  it('should set isLoading to false and save user on getUser.fulfilled', () => {
    const action = {
      type: getUser.fulfilled.type,
      payload: userPayload
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({
      ...initial,
      isLoading: false,
      isAuthenticated: true,
      user: userPayload.user
    });
  });

  it('should set isLoading to true on updateUser.pending', () => {
    const action = { type: updateUser.pending.type };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, isLoading: true });
  });

  it('should set isLoading to false and save error on updateUser.rejected', () => {
    const action = {
      type: updateUser.rejected.type,
      error: {
        message: 'error'
      }
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, isLoading: false, error: 'error' });
  });

  it('should set isLoading to false and save user on updateUser.fulfilled', () => {
    const action = {
      type: updateUser.fulfilled.type,
      payload: userPayload
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({
      ...initial,
      isLoading: false,
      isAuthenticated: true,
      user: userPayload.user
    });
  });

  it('should set isLoading to true on getUserOrders.pending', () => {
    const action = { type: getUserOrders.pending.type };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, isLoading: true });
  });

  it('should set isLoading to false and save error on getUserOrders.rejected', () => {
    const action = {
      type: getUserOrders.rejected.type,
      error: {
        message: 'error'
      }
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, isLoading: false, error: 'error' });
  });

  it('should set isLoading to false and save orders on getUserOrders.fulfilled', () => {
    const action = {
      type: getUserOrders.fulfilled.type,
      payload: [
        {
          _id: '1',
          status: 'test',
          name: 'test',
          createdAt: 'test',
          updatedAt: 'test',
          number: 1,
          ingredients: ['test']
        }
      ]
    };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({
      ...initial,
      isLoading: false,
      orders: action.payload
    });
  });

  it('should set isLoading to true on logoutUser.pending', () => {
    const action = { type: logoutUser.pending.type };
    const newState = reducer(undefined, action);
    expect(newState).toEqual({ ...initial, isLoading: true });
  });

  it('should set isLoading to false and save error on logoutUser.rejected', () => {
    const action = {
      type: logoutUser.rejected.type,
      error: {
        message: 'error'
      }
    };
    const newState = reducer({ ...initial, isAuthenticated: true }, action);
    expect(newState).toEqual({
      ...initial,
      isLoading: false,
      isAuthenticated: false,
      error: 'error'
    });
  });

  it('should set isLoading to false and save user on logoutUser.fulfilled', () => {
    const action = { type: logoutUser.fulfilled.type };
    const newState = reducer({ ...initial, isAuthenticated: true }, action);
    expect(newState).toEqual({
      ...initial,
      isLoading: false,
      isAuthenticated: false
    });
    expect(deleteCookie).toHaveBeenCalledWith('accessToken');
    expect(localStorage.clear).toHaveBeenCalled();
  });
});
