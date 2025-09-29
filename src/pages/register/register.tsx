import { FC, SyntheticEvent } from 'react';
import { RegisterUI } from '@ui-pages';
import { useSelector, useDispatch } from '../../services/store';
import { registerUser } from '../../services/slices/userSlice';
import useForm from '../../hooks/useForm';

export const Register: FC = () => {
  const { values, createSetter } = useForm({
    name: '',
    email: '',
    password: ''
  });

  const dispatch = useDispatch();
  const { error } = useSelector((state) => state.user);

  const handleSubmit = (e: SyntheticEvent) => {
    e.preventDefault();
    dispatch(registerUser(values));
  };

  return (
    <RegisterUI
      errorText={error || ''}
      email={values.email}
      userName={values.name}
      password={values.password}
      setEmail={createSetter('email')}
      setPassword={createSetter('password')}
      setUserName={createSetter('name')}
      handleSubmit={handleSubmit}
    />
  );
};
