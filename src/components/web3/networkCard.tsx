'use client';
import React from 'react';
import { Button, Box, Card, Flex, Avatar, Text, DataList, Badge, Code, IconButton, Link} from '@radix-ui/themes';
import SendEthModal from '@/components/web3/sendEthModal';
import { useEffect, useState } from 'react';

const NAVBAR_HEIGHT = '80px'; // 5rem / h-20 tw

export interface NetworkCardProps {
  ensAvatar?: string|null;
  ensName?: string|null;
  chainId?: number;
  chainName?: string;
  balance?: string;
  address?: string;
}

const NetworkCard: React.FC<NetworkCardProps> = ({
    ensAvatar,
    ensName,
    chainId,
    chainName,
    address,
    balance,
}) => {
  return (
    <Box>
        <Card>
            <Flex justify="between" gap={'7'} direction={'column'}>
                <Text as="div" size="5" weight="bold">
                    Connected Network
                </Text>
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
                            {chainName}
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
                        <DataList.Value>{ensName?ensName:<Link href="https://ens.domains/">Register your ENS here</Link>}</DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                        <DataList.Label minWidth="88px">Wallet Address</DataList.Label>
                        <DataList.Value>
                            <Link href={'https://etherscan.io/address/'+address}>{address?.slice(0,4)+"..."+address?.slice(-4)}</Link>
                        </DataList.Value>
                        </DataList.Item>
                        <DataList.Item>
                        <DataList.Label minWidth="88px">Balance</DataList.Label>
                        <DataList.Value>{balance}</DataList.Value>
                        </DataList.Item>
                    </DataList.Root>
                </Flex>
                <SendEthModal />
            </Flex>
        </Card>
    </Box>
  );
};

export default NetworkCard;