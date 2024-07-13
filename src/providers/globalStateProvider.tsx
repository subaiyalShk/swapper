'use client';
import React, { createContext, useContext, useState, useEffect } from 'react';
import { AppState, AppContextType } from '../../types';
import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi';
import { mainnet } from 'viem/chains';

export const AppContext = createContext({
    chainId: 0,
    chain: null,
    userAddress: '',
    ensName: '',
    ensAvatar: '',
    accountBalance: null,
    isConnected: false
} as AppContextType);

export const GlobalStateProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  
  // -------- User account variables ----------
  const {
    address: userAddress, 
    address, 
    chain, 
    chainId, 
    isConnected 
  } = useAccount();
  // -------- User account balance ----------
  const { 
    data: accountBalance,
    // use this function to refetch the balance
    // usefull when we send tokens to a different address
    // and we want to see the updated balance
    refetch:refetchNativeBalance
  } = useBalance({address});
  const { data: ensName } = useEnsName({address, chainId: mainnet.id});
  const { data: ensAvatar } = useEnsAvatar({name: ensName!, chainId: mainnet.id});



  return (
    <AppContext.Provider value={{ 
        chainId, 
        chain,
        userAddress,
        ensName,
        ensAvatar,
        accountBalance,
        isConnected,
        refetchNativeBalance
    }}>
      {children}
    </AppContext.Provider>
  );
};