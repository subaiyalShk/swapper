'use client'
import { useEffect } from 'react';
import {Address,erc20Abi,parseEther} from 'viem';
import { useChainId,useReadContract,useWaitForTransactionReceipt,useWriteContract} from 'wagmi';
import { Button } from '../ui/button';
import {POLYGON_EXCHANGE_PROXY} from '@/lib/constants';

export default function ApproveOrReviewButton({userAddress, onClick, sellAmount,sellTokenAddress, disabled}: {
        userAddress: Address | undefined;
        onClick: (e: React.MouseEvent<HTMLButtonElement>) => Promise<void>;
        sellAmount: string;
        sellTokenAddress: Address;
        disabled?: boolean;
    }) {

    const chainId = useChainId() || 137;
    const exchangeProxy = (chainId: number): Address => {
        if (chainId === 137) {
            return POLYGON_EXCHANGE_PROXY;
        }
        return POLYGON_EXCHANGE_PROXY;
    };
    
    const { data: approvalTxHash, error: errorWriteContract,writeContractAsync} = useWriteContract();
    const { isLoading: isConfirming, isSuccess: isTxConfirmed } = useWaitForTransactionReceipt({hash: approvalTxHash});
    const { data: allowance, refetch: refetchAllowance } = useReadContract({
        address: sellTokenAddress,
        abi: erc20Abi,
        functionName: 'allowance',
        args: [userAddress ?? '0x0', exchangeProxy(chainId)],
        query: {
          enabled: Boolean(userAddress),
        },
    });

    useEffect(() => {
        if (isTxConfirmed) {
          refetchAllowance();
        }
    }, [isTxConfirmed, refetchAllowance, allowance]);

    async function onClickHandler(event: React.MouseEvent<HTMLElement>) {
        event.preventDefault();
        try {
          await writeContractAsync({
            abi: erc20Abi,
            address: sellTokenAddress,
            functionName: 'approve',
            args: [exchangeProxy(chainId), parseEther(sellAmount)],
          });
        } catch (error) {
          console.error(error);
        }
    }

    if (errorWriteContract) {
        return <div>Something went wrong: {errorWriteContract.message}</div>;
    }else if (allowance === 0n || (allowance && allowance < parseEther(sellAmount))) {
        return (
          <>
            <Button onClick={onClickHandler}>
              {isConfirming ? 'Approving…' : 'Approve'}
            </Button>
          </>
        );
    }else return (
        <Button
          disabled={disabled}
          onClick={async (event) => await onClick(event)}
        >
          {disabled ? 'Insufficient Balance' : 'Review Swap'}
        </Button>
    );
}