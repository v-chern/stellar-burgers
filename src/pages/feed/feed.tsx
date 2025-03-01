import { useSelector, useDispatch } from '../../services/store';

import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import {
  fetchFeedOrders,
  selectFeedOrders,
  selectFeedIsLoading
} from '../../services/slices/feedSlice';

export const Feed: FC = () => {
  /** : взять переменную из стора */
  const orders: TOrder[] = useSelector<TOrder[]>(selectFeedOrders);
  const feedIsLoading = useSelector(selectFeedIsLoading);

  const dispatch = useDispatch();
  const handleFeedUpdate = () => {
    dispatch(fetchFeedOrders());
  };

  useEffect(() => {
    handleFeedUpdate();
  }, []);

  if (!orders.length || feedIsLoading) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleFeedUpdate} />;
};
