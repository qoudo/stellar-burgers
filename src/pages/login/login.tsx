import { FC, SyntheticEvent } from 'react';
import { LoginUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { loginUser } from '../../services/slices/userSlice';
import useForm from '../../hooks/useForm';

export const Login: FC = () => {
  const { values, createSetter } = useForm({ email: '', password: '' });

  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(loginUser(values));
  };

  return (
    <LoginUI
      errorText={error || ''}
      email={values.email}
      setEmail={createSetter('email')}
      password={values.password}
      setPassword={createSetter('password')}
      handleSubmit={handleSubmit}
    />
  );
};
