'use client';

import { useState, useEffect } from 'react';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
    DrawerTrigger,
} from "@/components/ui/drawer"
import { 
    Box, 
    Flex,  
    Text, 
    DataList, 
    Badge, 
    Link
} from '@radix-ui/themes';
import { 
    useReadContract, 
    useWriteContract,
    useWaitForTransactionReceipt 
} from 'wagmi';
import { TimerIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import { Progress } from "@/components/ui/progress"
import { Button } from '../ui/button';

type transactionStatusProps = {
    isPending?: boolean|undefined;
    hash: `0x${string}`;
    refetch: () => void;
};

export default function TransactionStatus({ 
    isPending, 
    hash, 
    refetch
}: transactionStatusProps) {
    
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

    // ----------- Listen for transaction confirmation ------------
    useEffect(() => {
        console.log(isConfirmed, isConfirming)
        // When claim transaction is executed. 
        // we wait for the transaction to be confirmed.
        if (isConfirmed) {
            // show toast after half a second delay for the progress bar to complete.
            setTimeout(() => {
                // then refetch the balance of the user.
                refetch()
            },500)
        }
    }, [isConfirmed, isConfirming]);

    // ------------ Progress bar percentage ---------------------
    const progressPercentage = () => {
        if (isPending) {
            return 25;
        } else if (isConfirming) {
            return 50;
        } else if (isConfirmed) {
            return 100;
        }
        return 0;
    }

    return (
        <Drawer open={true}>
            <DrawerContent>
                <DrawerHeader>
                    <DrawerTitle>Please Wait</DrawerTitle>
                    <DrawerDescription>
                        <DataList.Root>
                            <DataList.Item align="center">
                                <DataList.Label minWidth="88px">transaction submitted</DataList.Label>
                                <DataList.Value>
                                    <Link href={'https://etherscan.io/address/'+hash}>{hash}</Link>
                                </DataList.Value>
                            </DataList.Item>
                            <DataList.Item align="center">
                                <DataList.Label minWidth="88px">Status</DataList.Label>
                                <DataList.Value>
                                {isConfirming?
                                    <Badge color='amber' variant="soft" radius="full">
                                        Transaction Confirming
                                    </Badge>:null
                                }
                                {isConfirmed? 
                                    <Badge color="jade" variant="soft" radius="full">
                                        Transaction Confirmed
                                    </Badge>:null
                                }
                                </DataList.Value>
                            </DataList.Item>
                        </DataList.Root>
                    </DrawerDescription>
                </DrawerHeader>
                <Progress value={progressPercentage()} className="w-[60%]"/>
            </DrawerContent>
        </Drawer>
    );
}