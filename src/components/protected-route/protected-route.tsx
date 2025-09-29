import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from '../../services/store';
import { Preloader } from '@ui';

type ProtectedRouteProps = {
  onlyUnAuth?: boolean;
  element: React.ReactElement;
};

export const ProtectedRoute = ({
  onlyUnAuth = false,
  element
}: ProtectedRouteProps): React.ReactElement => {
  const { isAuthChecked, user } = useSelector((state) => state.user);
  const location = useLocation();

  if (!isAuthChecked) {
    return <Preloader />;
  }

  if (onlyUnAuth && user) {
    const { from } = location.state || { from: { pathname: '/' } };
    return <Navigate to={from} />;
  }

  if (!onlyUnAuth && !user) {
    return <Navigate to='/login' state={{ from: location }} />;
  }

  return element;
};
