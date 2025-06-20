import { FC, ReactNode, useReducer } from 'react';
import { Context, initialState, reducer } from './Context';

const ContextProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState());
  return (
    <Context.Provider value={{ state, dispatch }}>{children}</Context.Provider>
  );
};

export default ContextProvider;
