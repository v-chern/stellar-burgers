import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectUserOrders,
  getUserOrders,
  clearUserOrders
} from '../../services/slices/userSlice';
import { fetchFeedOrders } from '../../services/slices/feedSlice';

export const ProfileOrders: FC = () => {
  /** DONE: взять переменную из стора */
  const orders: TOrder[] | null = useSelector(selectUserOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    //Обновление списка заказов пользователя
    if (!orders) {
      dispatch(getUserOrders());
      dispatch(fetchFeedOrders());
    }
    return () => {
      dispatch(clearUserOrders());
    };
  }, []);

  return <ProfileOrdersUI orders={orders || []} />;
};
