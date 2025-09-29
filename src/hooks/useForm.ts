import {
  useState,
  ChangeEvent,
  Dispatch,
  SetStateAction,
  useCallback
} from 'react';

function useForm<T extends { [key: string]: string }>(baseForm: T) {
  const [form, setForm] = useState<T>(baseForm);

  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    const element = e.target;
    setForm((pastForm) => ({ ...pastForm, [element.name]: element.value }));
  }, []);

  const resetForm = useCallback((newForm: T) => {
    setForm(newForm);
  }, []);

  // Создаем функции для установки конкретных полей
  function createSetter(fieldName: keyof T): Dispatch<SetStateAction<string>> {
    return (value: SetStateAction<string>) => {
      setForm((pastForm) => ({
        ...pastForm,
        [fieldName]:
          typeof value === 'function' ? value(pastForm[fieldName]) : value
      }));
    };
  }

  return { values: form, handleChange, resetForm, createSetter };
}

export default useForm;
