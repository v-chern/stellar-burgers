import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector } from '../../services/store';
import {
  selectBun,
  selectIngedients,
  selectRequest,
  selectOrder
} from '../../services/slices/userOrderSlice';

export const BurgerConstructor: FC = () => {
  /** DONE: взять переменные constructorItems, orderRequest и orderModalData из стора*/
  const constructorItems = {
    bun: useSelector(selectBun),
    ingredients: useSelector(selectIngedients)
  };
  const orderRequest = useSelector(selectRequest);

  const orderModalData = useSelector(selectOrder);

  const onOrderClick = () => {
    //TODO: тут реализовать отправку заказа
    console.log('order click');
    if (!constructorItems.bun || orderRequest) return;
  };

  const closeOrderModal = () => {
    //TODO: тут что то должно быть
    console.log('order modal close');
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
