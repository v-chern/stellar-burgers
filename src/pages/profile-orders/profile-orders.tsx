import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { selectOrders, getUserOrders } from '../../services/slices/userSlice';

export const ProfileOrders: FC = () => {
  /** DONE: взять переменную из стора */
  const orders: TOrder[] = useSelector(selectOrders);
  const dispatch = useDispatch();

  useEffect(() => {
    //TODO: костыль, исправить
    if (orders.length === 0) {
      dispatch(getUserOrders());
    }
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
