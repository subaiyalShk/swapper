'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, AppContextType } from '../../types';

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, setStateInternal] = useState<AppState>({
    user: null,
    theme: 'light',
  });

  useEffect(() => {
    // Load initial state from session storage
    const storedState = sessionStorage.getItem('appState');
    if (storedState) {
      setStateInternal(JSON.parse(storedState));
    }
  }, []);

  const setState = (newState: AppState) => {
    setStateInternal(newState);
    sessionStorage.setItem('appState', JSON.stringify(newState));
  };

  return (
    <AppContext.Provider value={{ state, setState }}>
      {children}
    </AppContext.Provider>
  );
};