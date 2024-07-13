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
import { TimerIcon, CheckCircledIcon } from '@radix-ui/react-icons'
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
import TriggerTransaction from '@/components/layout/triggerTransaction';

const NAVBAR_HEIGHT = '80px'; // 5rem / h-20 tw

export interface ContractCardProps {
  userAddress?: string|null;
}

const ContractCard: React.FC<ContractCardProps> = ({userAddress}) => {
    const erc20ContractAddress = process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS ??'0xd66cd7D7698706F8437427A3cAb537aBc12c8C88';
    const [isPendingClaim, setIsPendingClaim] = useState(false);
    // ----------- Write to the contract to claim tokens ---------------------
    const { 
        // this variable will be updated on each fetch only
        data: hash, 
        // this variable will be equal to true when a transaction is being executed only
        // default is false
        isPending, 
        // we use this function to write to the contract
        writeContractAsync 
    } = useWriteContract();

    // ----------- Transaction life cycle ---------------------
    const { 
        // this will be true when transaction hash is created 
        // and transaction is being broadcasted to the network only
        isLoading: isConfirming, 
        // this will be true when transaction hash is created 
        isSuccess: isConfirmed 
    } = useWaitForTransactionReceipt({
        // here we are passing reference to the variable that holds 
        // the transaction hash from useWriteContract hook
        hash
    });
    
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

    // ----------- Listen for transaction confirmation ------------
    useEffect(() => {
        // When claim transaction is executed. 
        // we wait for the transaction to be confirmed.
        if (isConfirmed) {
            // show toast after half a second delay for the progress bar to complete.
            setTimeout(() => {
                toast("Tokens Recieved !", {
                    description: "transaction hash: "+ hash,
                }) 
                // then refetch the balance of the user.
                refetch()
            },500)
        }
    }, [isConfirmed]);

    // ------------ Logic to handle claiming tokens ---------------------
    async function handleClaimTokens(
        e: React.MouseEvent<HTMLButtonElement, MouseEvent>
        ) {
        // we set the pending claim state to true
        // so that the button is disabled to prevent multiple clicks
        setIsPendingClaim(true);
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
            setIsPendingClaim(false);
        }

    }


    // ------------ Render the card ---------------------
    return (
        <Box>
            {/* show skeleton when when reading from smart contract */}
            <Skeleton loading={isLoading}>
                <Card>
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
                                    erc20Balance===0n?
                                    <DataList.Item align="center">
                                        <DataList.Label minWidth="88px">Balance</DataList.Label>
                                        <DataList.Value>
                                        <Badge color="jade" variant="soft" radius="full">
                                            Tokens not claimed
                                        </Badge>
                                        </DataList.Value>
                                    </DataList.Item>
                                    :
                                    <DataList.Item>
                                        <DataList.Label minWidth="88px">Balance</DataList.Label>
                                        <DataList.Value>{erc20Balance?.toString()}</DataList.Value>
                                    </DataList.Item>
                                }
                                {
                                    erc20Balance===0n?
                                        <TriggerTransaction
                                            isPendingClaim={isPendingClaim}
                                            handleTransaction={handleClaimTokens}
                                            isPending={isPending}
                                            hash={hash}
                                            isConfirming={isConfirming}
                                            isConfirmed={isConfirmed}
                                            buttonName="Claim Tokens"
                                        />
                                    :
                                    <>
                                        <SendErc20Modal userAddress={`0x${userAddress}`} />
                                        <SwapErc20Modal userAddress={userAddress as `0x${string}`} />
                                    </>
                                }
                            </DataList.Root>
                        </Flex>
                    </Flex>
                </Card>
            </Skeleton>
        </Box>
    );
};

export default ContractCard;