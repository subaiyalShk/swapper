'use client';
import { useState, useContext } from 'react';
import { ConnectKitButton } from 'connectkit';
import Wrapper from '@/components/layout/wrapper';
import {Flex} from '@radix-ui/themes';
import Navbar from '../components/layout/navbar';
import NetworkCard from '../components/layout/networkCard';
import ContractCard from '@/components/web3/contractCard';
import {AppContext} from '@/providers/globalStateProvider';
import TokenSearchDropdown from '@/components/web3/TokenSearchDropdown';
import TransactionHistory from '@/components/web3/transactionHistory';
import Image from 'next/image'



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

  const selectedTokens = (token: any) => {
    console.log('Selected token:', token)
  }
  
  // ---- Render login page
  if (!isConnected) {
    return (
      <Wrapper>
        <Flex direction="column" align={'center'} gap="3">
          <Image src="/Swapper.png" alt="hero" width={300} height={300} />
          <ConnectKitButton />
        </Flex>
      </Wrapper>
    )
  // ---- Render the main page
  }else{
    return (
      <>
        <Navbar/>
        <Wrapper>
          <Flex wrap={'wrap'} justify={'center'} gap="7" mt="5" >
            <NetworkCard 
              chainId={chainId} 
              chainName={chain?.name} 
              address={userAddress} 
              ensName={ensName} 
              ensAvatar={ensAvatar}
              balance={accountBalance?.formatted}
            />
            <Flex direction={'column'} justify={'between'}>
              <TokenSearchDropdown 
                onSelect={selectedTokens} 
              />
              <ContractCard 
                userAddress={userAddress}
              />
            </Flex>
            <TransactionHistory
              initialAddress={userAddress}
              providerUrl={process.env.NEXT_PUBLIC_INFURA_URL || ''}
            />
          </Flex>   
        </Wrapper>
      </>
    );
  }
}
