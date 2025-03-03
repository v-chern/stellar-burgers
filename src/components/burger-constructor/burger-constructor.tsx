import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  selectBun,
  selectIngedients,
  selectRequest,
  selectOrder,
  clearUserOrder,
  placeOrder
} from '../../services/slices/userOrderSlice';
import { selectIsAuthenticated } from '../../services/slices/userSlice';
import { useNavigate, useLocation } from 'react-router-dom';

export const BurgerConstructor: FC = () => {
  /** DONE: взять переменные constructorItems, orderRequest и orderModalData из стора*/
  const constructorItems = {
    bun: useSelector(selectBun),
    ingredients: useSelector(selectIngedients)
  };
  const orderRequest = useSelector(selectRequest);

  const orderModalData = useSelector(selectOrder);

  const userAuthenticated = useSelector(selectIsAuthenticated);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  const location = useLocation();

  const onOrderClick = () => {
    //Проверка авторизации и отправка заказа
    if (!constructorItems.bun || orderRequest) return;
    if (!userAuthenticated) {
      navigate('/login', { state: { from: location } });
    } else {
      const orderIngredients = [
        constructorItems.bun,
        constructorItems.bun
      ].concat(constructorItems.ingredients);
      dispatch(placeOrder(orderIngredients));
    }
  };

  const closeOrderModal = () => {
    //Очиста данных заказа
    dispatch(clearUserOrder());
  };

  const price = useMemo(
    () =>
      (constructorItems.bun ? constructorItems.bun.price * 2 : 0) +
      constructorItems.ingredients.reduce(
        (s: number, v: TConstructorIngredient) => s + v.price,
        0
      ),
    [constructorItems]
  );

  return (
    <BurgerConstructorUI
      price={price}
      orderRequest={orderRequest}
      constructorItems={constructorItems}
      orderModalData={orderModalData}
      onOrderClick={onOrderClick}
      closeOrderModal={closeOrderModal}
    />
  );
};
