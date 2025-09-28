import { FC, useMemo } from 'react';
import { TConstructorIngredient } from '@utils-types';
import { BurgerConstructorUI } from '@ui';
import { useSelector, useDispatch } from '../../services/store';
import {
  orderBurger,
  closeOrderModal
} from '../../services/slices/burgerBuilderSlice';

export const BurgerConstructor: FC = () => {
  const dispatch = useDispatch();
  const { bun, ingredients, orderRequest, orderModalData } = useSelector(
    (state) => state.burgerBuilder
  );
  const user = useSelector((state) => state.user.user);

  const constructorItems = {
    bun,
    ingredients
  };

  const onOrderClick = () => {
    if (!constructorItems.bun || orderRequest) return;
    if (!user) return;

    const ingredientIds = [
      bun?._id,
      ...ingredients.map((ingredient) => ingredient._id),
      bun?._id
    ].filter(Boolean) as string[];

    dispatch(orderBurger(ingredientIds));
  };

  const handleCloseOrderModal = () => {
    dispatch(closeOrderModal());
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
      closeOrderModal={handleCloseOrderModal}
    />
  );
};
