'use client';
import { useState, useContext } from 'react';
import { ConnectKitButton } from 'connectkit';
import Wrapper from '@/components/layout/wrapper';
import {Flex} from '@radix-ui/themes';
import Navbar from '../components/layout/navbar';
import NetworkCard from '../components/layout/networkCard';
import ContractCard from '@/components/layout/contractCard';
import {AppContext} from '@/providers/globalStateProvider';

export default function Home() {
  // ----- Global State Variables -----
  const {
    chainId, 
    chain,
    userAddress,
    ensName,
    ensAvatar,
    accountBalance,
    isConnected
  } = useContext(AppContext);
  
  // ---- Render login page
  if (!isConnected) {
    return (
      <Wrapper>
        <ConnectKitButton />
      </Wrapper>
    )
  // ---- Render the main page
  }else{
    return (
      <>
        <Navbar/>
        <Wrapper>
          <Flex wrap={'wrap'} gap="7">
            <NetworkCard 
              chainId={chainId} 
              chainName={chain?.name} 
              address={userAddress} 
              ensName={ensName} 
              ensAvatar={ensAvatar}
              balance={accountBalance?.formatted}
            />
            <ContractCard 
              userAddress={userAddress}
            />
          </Flex>          
        </Wrapper>
      </>
    );
  }
}
