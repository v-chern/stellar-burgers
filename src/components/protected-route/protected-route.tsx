import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { Preloader } from '@ui';
import { useSelector } from '../../services/store';
import {
  selectUser,
  selectIsLoading,
  selectIsAuthenticated
} from '../../services/slices/userSlice';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  children: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth,
  children
}: ProtectedRouteProps) => {
  const isAuthLoading = useSelector(selectIsLoading);
  const isAuthenticated = useSelector(selectIsAuthenticated);
  const location = useLocation();

  if (isAuthLoading) {
    return <Preloader />;
  }

  if (!onlyUnAuth && !isAuthenticated) {
    return <Navigate replace to='/login' />;
  }

  if (onlyUnAuth && isAuthenticated) {
    const from = location.state?.from || { pathname: '' };
    return <Navigate replace to={from} />;
  }

  return children;
};
