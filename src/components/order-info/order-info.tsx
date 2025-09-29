import { FC, useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Preloader } from '../ui/preloader';
import { OrderInfoUI } from '../ui/order-info';
import { TIngredient } from '@utils-types';
import { useSelector, useDispatch } from '../../services/store';
import { getOrderByNumber } from '../../services/slices/feedSlice';

export const OrderInfo: FC = () => {
  const { number } = useParams();
  const dispatch = useDispatch();

  const ingredients = useSelector((state) => state.ingredients.ingredients);
  const orders = useSelector((state) => state.feed.orders);
  const feedOrders = useSelector((state) => state.feed.feed.orders);

  // Ищем заказ в локальных данных или загружаем с сервера
  const orderData = useMemo(() => {
    if (!number) return null;

    const orderNumber = parseInt(number);
    let order = orders.find((order) => order.number === orderNumber);

    if (!order) {
      order = feedOrders.find((order) => order.number === orderNumber);
    }

    return order || null;
  }, [number, orders, feedOrders]);

  useEffect(() => {
    if (!orderData && number) {
      // Если заказ не найден в локальных данных, загружаем с сервера через thunk
      dispatch(getOrderByNumber(parseInt(number)));
    }
  }, [orderData, number, dispatch]);

  /* Готовим данные для отображения */
  const orderInfo = useMemo(() => {
    if (!orderData || !ingredients.length) return null;

    const date = new Date(orderData.createdAt);

    type TIngredientsWithCount = {
      [key: string]: TIngredient & { count: number };
    };

    const ingredientsInfo = orderData.ingredients.reduce(
      (acc: TIngredientsWithCount, item) => {
        if (!acc[item]) {
          const ingredient = ingredients.find((ing) => ing._id === item);
          if (ingredient) {
            acc[item] = {
              ...ingredient,
              count: 1
            };
          }
        } else {
          acc[item].count++;
        }

        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...orderData,
      ingredientsInfo,
      date,
      total
    };
  }, [orderData, ingredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
