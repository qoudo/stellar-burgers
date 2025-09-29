import { ProfileUI } from '@ui-pages';
import { FC, FormEvent, useEffect, useMemo } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { updateUser } from '../../services/slices/userSlice';
import useForm from '../../hooks/useForm';

export const Profile: FC = () => {
  const dispatch = useDispatch();
  const user = useSelector((state) => state.user.user);

  const defaultFormValues = useMemo(
    () => ({
      name: user?.name || '',
      email: user?.email || '',
      password: ''
    }),
    [user?.name, user?.email]
  );

  const {
    values: formValue,
    handleChange: handleInputChange,
    resetForm
  } = useForm(defaultFormValues);

  useEffect(() => {
    resetForm(defaultFormValues);
  }, [defaultFormValues, resetForm]);

  const isFormChanged =
    formValue.name !== user?.name ||
    formValue.email !== user?.email ||
    !!formValue.password;

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    dispatch(updateUser(formValue));
  };

  const handleCancel = () => {
    resetForm(defaultFormValues);
  };

  return (
    <ProfileUI
      formValue={formValue}
      isFormChanged={isFormChanged}
      handleCancel={handleCancel}
      handleSubmit={handleSubmit}
      handleInputChange={handleInputChange}
    />
  );
};
