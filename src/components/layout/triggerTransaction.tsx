'use client';

import { useState } from 'react';
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
} from '@radix-ui/themes';
import { TimerIcon, CheckCircledIcon } from '@radix-ui/react-icons'
import { Progress } from "@/components/ui/progress"
import { Button } from '../ui/button';

type TriggerTransactionProps = {
    isPendingClaim?: boolean|undefined;
    handleTransaction: any;
    isPending?: boolean|undefined;
    hash?: string|undefined;
    isConfirming?: boolean|undefined;
    isConfirmed?: boolean|undefined;
    buttonName: string;
};

export default function TriggerTransaction({ 
    isPendingClaim, 
    handleTransaction, 
    isPending, 
    hash, 
    isConfirming, 
    isConfirmed,
    buttonName
}: TriggerTransactionProps) {


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
    <Drawer >
        <DrawerTrigger disabled={isPendingClaim} onClick={handleTransaction}>
            <Button>{buttonName}</Button>
        </DrawerTrigger>
        <DrawerContent>
            <DrawerHeader>
                <DrawerTitle>Please Wait</DrawerTitle>
                <DrawerDescription>
                    <Flex direction={'column'} gap="3">
                        <Box height="24px">
                            {isPending? 
                                <Flex align={'center'}>
                                    <TimerIcon/>
                                    <Text style={{'marginLeft':'10px'}}>submitting transaction</Text>
                                </Flex> 
                                :
                                <Flex align={'center'}>
                                    <CheckCircledIcon/>
                                    <Text style={{'marginLeft':'10px'}}>transaction submitted</Text>
                                </Flex>
                            }
                        </Box>
                        <Box height="24px">
                            {hash? "Transaction created: "+hash : ""}
                        </Box>
                        <Box height="24px">
                            {isConfirming? 
                                <Flex align={'center'}>
                                    <TimerIcon/>
                                    <Text style={{'marginLeft':'10px'}}>Transaction Confirming</Text>
                                </Flex> : null
                            }
                            {isConfirmed? 
                                <Flex align={'center'}>
                                    <CheckCircledIcon/>
                                    <Text style={{'marginLeft':'10px'}}>Transaction Confirmed</Text>
                                </Flex> : null 
                            }
                        </Box>
                    </Flex>
                </DrawerDescription>
            </DrawerHeader>
            <Progress value={progressPercentage()} className="w-[60%]"/>
        </DrawerContent>
    </Drawer>
  );
}