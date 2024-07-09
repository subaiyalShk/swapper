'use client';
import { useState, useEffect } from 'react';
import PageWithNavbar from '@/components/layout/wrapper';
import { Account } from '@/components/web3/account';
import { ConnectKitButton } from 'connectkit';
import SignInPage from '@/components/signInPage';
import Wrapper from '@/components/layout/wrapper';
import { Button, Box, Card, Flex, Avatar, Text, DataList, Badge, Code, IconButton, Link} from '@radix-ui/themes';
import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi';
import SendEthModal from '@/components/web3/sendEthModal';
import { mainnet } from 'viem/chains';
import Navbar from '../components/layout/navbar';

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
          <Box>
            <Card>
              <Flex gap="3" align="center">
                {ensAvatar && ensName && (
                  <Avatar
                    size="3"
                    src="https://images.unsplash.com/photo-1607346256330-dee7af15f7c5?&w=64&h=64&dpr=2&q=70&crop=focalpoint&fp-x=0.67&fp-y=0.5&fp-z=1.4&fit=crop"
                    radius="full"
                    fallback="T"
                  />
                )}
                <DataList.Root>
                  <DataList.Item align="center">
                    <DataList.Label minWidth="88px">Chain Name</DataList.Label>
                    <DataList.Value>
                      <Badge color="jade" variant="soft" radius="full">
                        {chain?.name}
                      </Badge>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth="88px">Chain ID</DataList.Label>
                    <DataList.Value>
                      <Flex align="center" gap="2">
                        <Code variant="ghost">{chainId}</Code>
                        <IconButton
                          size="1"
                          aria-label="Copy value"
                          color="gray"
                          variant="ghost"
                        >
                          {/* <CopyIcon /> */}
                        </IconButton>
                      </Flex>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth="88px">ENS</DataList.Label>
                    <DataList.Value>{ensName}</DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth="88px">Wallet Address</DataList.Label>
                    <DataList.Value>
                      <Link href="mailto:vlad@workos.com">{address}</Link>
                    </DataList.Value>
                  </DataList.Item>
                  <DataList.Item>
                    <DataList.Label minWidth="88px">Balance</DataList.Label>
                    <DataList.Value>{accountBalance.data?.formatted}</DataList.Value>
                  </DataList.Item>
                  <SendEthModal />
                </DataList.Root>
              </Flex>
            </Card>
          </Box>
          {/* <Account /> */}
        </Wrapper>
      </>
    );
  }
}
