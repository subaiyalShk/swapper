'use client'

import React, {useState, useEffect} from 'react';
import { 
    Box, 
    Card, 
    Flex,  
    Text, 
    DataList, 
    Badge, 
    Link, 
    Skeleton,
    Spinner
} from '@radix-ui/themes';
import { Button } from '../ui/button';
import { 
    useReadContract, 
    useWriteContract,
    useWaitForTransactionReceipt 
} from 'wagmi';
import BootcampTokenABI from '@/lib/contracts/BootcampTokenABI';
import {toast} from 'sonner';
import SendErc20Modal from '@/components/web3/sendErc20Modal';
import SwapErc20Modal from '@/components/web3/swapErc20Modal';
import TransactionStatus from '@/components/layout/transactionStatus';
import {formatEther} from 'viem';

const NAVBAR_HEIGHT = '80px'; // 5rem / h-20 tw

export interface ContractCardProps {
  userAddress?: string|null;
}

const ContractCard: React.FC<ContractCardProps> = ({userAddress}) => {
    const erc20ContractAddress = process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS ??'0xd66cd7D7698706F8437427A3cAb537aBc12c8C88';
    const [transactionInProgress, setTransactionInProgress] = useState(false);
    // ----------- Write to the contract to claim tokens ---------------------
    const { 
        // this variable will be updated on each fetch only
        data: hash, 
        // this variable will be equal to true when a user confirms 
        // the transaction from their wallet. default is false
        isPending, 
        // we use this function to write to the contract
        writeContractAsync 
    } = useWriteContract();

    
    
    // ---- Read the balance of the user from the contract ------------
    const { 
        // this variable will be updated on first fetch only
        data: erc20Balance,
        // we use this variable to show a loading state of the card 
        isLoading, 
        // When isConfirmed is true -> transaction is on the blockchain, 
        // we refetch the balance of the user
        refetch 
    } = useReadContract({
        abi: BootcampTokenABI,
        address: erc20ContractAddress as `0x${string}`,
        functionName: 'balanceOf',
        args: [userAddress as `0x${string}`],
        query: {
            enabled: Boolean(userAddress),
        },
    });

    const { data: hasClaimed } = useReadContract({
        address: erc20ContractAddress as `0x${string}`,
        abi: BootcampTokenABI,
        functionName: 'hasAddressClaimed',
        args: [userAddress as `0x${string}`],
      })


    // ------------ Logic to handle claiming tokens ---------------------
    async function handleClaimTokens(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) {
        e.preventDefault();
        // we set the pending claim state to true
        // so that the button is disabled to prevent multiple clicks
        setTransactionInProgress(true);
        try {
            // we write to the contract to claim tokens
            // from useWriteContract hook
            writeContractAsync({
                abi: BootcampTokenABI,
                address: erc20ContractAddress as `0x${string}`,
                // here we have to make sure this is a valid function
                // to confirm find it in the contract abi
                functionName: 'claim',
                args: [userAddress as `0x${string}`],
            });
        } catch (error) {
            console.error(error);
        }finally{
            setTransactionInProgress(false);
        }

    }

    // ------------ Render the card ---------------------
    return (
        <Box>
            {/* show skeleton when when reading from smart contract */}
            <Skeleton loading={isLoading}>
                <Card className="w-full max-w-2xl shadow-lg">
                    <Flex direction="column" gap="3" align="center">
                        <Text as="div" size="5" weight="bold">
                            Connected Smart Contract
                        </Text>
                        <Flex gap="3" align="center">
                            <DataList.Root>
                                <DataList.Item align="center">
                                    <DataList.Label minWidth="88px">Contract Address</DataList.Label>
                                    <DataList.Value>
                                        <Link href={'https://etherscan.io/address/'+erc20ContractAddress}>{erc20ContractAddress.slice(0,4)+"..."+erc20ContractAddress.slice(-4)}</Link>
                                    </DataList.Value>
                                </DataList.Item>
                                {
                                    erc20Balance!==undefined?
                                    <DataList.Item>
                                        <DataList.Label minWidth="88px">Balance</DataList.Label>
                                        <DataList.Value>{parseFloat(formatEther(erc20Balance)).toFixed(2)}</DataList.Value>
                                    </DataList.Item>:
                                    <DataList.Value>
                                        <Badge color="jade" variant="soft" radius="full">
                                            Claim Your Tokens !
                                        </Badge>
                                    </DataList.Value>
                                }
                            </DataList.Root>
                        </Flex>
                        {
                            !hasClaimed &&
                            <Button onClick={handleClaimTokens}>Claim Tokens</Button>
                        }
                        {
                            erc20Balance!==undefined &&
                            <SendErc20Modal 
                                userAddress={`0x${userAddress}`} 
                                balance={parseFloat(formatEther(erc20Balance)).toFixed(2)}
                                updateBalance={refetch}
                            />
                        }
                    </Flex>
                </Card>
            </Skeleton>
            {hash && <TransactionStatus hash={hash as `0x${string}`} refetch={refetch}/>}
        </Box>
    );
};

export default ContractCard;