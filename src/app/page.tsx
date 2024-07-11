'use client';
import { useState, useEffect } from 'react';
import PageWithNavbar from '@/components/layout/wrapper';
import { Account } from '@/components/web3/account';
import { ConnectKitButton } from 'connectkit';
import SignInPage from '@/components/signInPage';
import Wrapper from '@/components/layout/wrapper';
import { Button, Box, Card, Flex, Avatar, Text, DataList, Badge, Code, IconButton, Link} from '@radix-ui/themes';
import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi';
import { mainnet } from 'viem/chains';
import Navbar from '../components/layout/navbar';
import NetworkCard from '../components/layout/networkCard';
import ContractCard from '@/components/layout/contractCard';


export default function Home() {
  const [mode, setMode] = useState<'native' | 'erc20'| null>(null);
  const {address: userAddress, address, chain, chainId, isConnected } = useAccount();
  const accountBalance = useBalance({address});
  const { data: ensName } = useEnsName({address, chainId: mainnet.id});
  const { data: ensAvatar } = useEnsAvatar({name: ensName!, chainId: mainnet.id});

  useEffect(() => {
   console.log('ensName', ensName)
   console.log('ensAvatar', ensAvatar)
   console.log('accountBalance', accountBalance)
  },[])

  if (!isConnected) {
    return (
      <Wrapper>
        <ConnectKitButton />
      </Wrapper>
    )
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
              balance={accountBalance?.data?.formatted}
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
