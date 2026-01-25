'use client';

import React, { createContext, useContext, useCallback, useState } from 'react';

interface FormContextType {
  resetKey: number;
  resetForm: () => void;
}

const FormContext = createContext<FormContextType | null>(null);

export const useFormContext = () => useContext(FormContext);

interface FormProviderProps {
  children: React.ReactNode;
}

export const FormProvider = ({ children }: FormProviderProps) => {
  const [resetKey, setResetKey] = useState(0);

  const resetForm = useCallback(() => {
    setResetKey((prev) => prev + 1);
  }, []);

  return (
    <FormContext.Provider value={{ resetKey, resetForm }}>
      {children}
    </FormContext.Provider>
  );
};
