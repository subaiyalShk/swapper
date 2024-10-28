'use client'

import { useEffect, useState } from 'react';
import { 
    useReadContract, 
    useWriteContract,
} from 'wagmi';
import {formatEther, parseEther} from 'viem';
import {toast} from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import BootcampTokenABI from '@/lib/contracts/BootcampTokenABI';
import TransactionStatus from '@/components/layout/transactionStatus';

type SendErc20ModalProps = {
  userAddress: `0x${string}` | undefined;
  balance: string;
  updateBalance: () => void;
};

export default function SendErc20Modal({ userAddress, balance, updateBalance}: SendErc20ModalProps) {
    const [toAddress, setToAddress] = useState('');
    const [tokenAmount, setTokenAmount] = useState(balance);
    const [isPendingClaim, setIsPendingClaim] = useState(false);
    const [isPendingSend, setIsPendingSend] = useState(false);
    const erc20ContractAddress = process.env.NEXT_PUBLIC_ERC20_CONTRACT_ADDRESS ??'0xd66cd7D7698706F8437427A3cAb537aBc12c8C88';
    const { data: hash, isPending, writeContractAsync } = useWriteContract();


    async function submitTransferErc20(e: React.FormEvent<any>) {
        e.preventDefault();
        if (!userAddress) {
          toast.warning('You must connect your wallet...');
          return;
        }
        setIsPendingSend(true);
        try {
            writeContractAsync({
                abi: BootcampTokenABI,
                address: erc20ContractAddress as `0x${string}`,
                functionName: 'transfer',
                args: [toAddress as `0x${string}`, parseEther(tokenAmount)],
            });
        } catch (error) {
            console.error(error);
        } finally {
            setIsPendingSend(false);
        }
    }

    return (
        <>
            <Dialog>
                <DialogTrigger asChild className="w-full">
                    <Button>Send ERC20</Button>
                </DialogTrigger>
                <DialogContent>
                    <DialogHeader>
                    <DialogTitle className="text-center">Send ERC20</DialogTitle>
                    <DialogDescription>
                        The amount entered will be sent to the address once you hit the Send
                        button
                    </DialogDescription>
                    </DialogHeader>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="address">Address</Label>
                        <Input
                        name="address"
                        placeholder="0xA0Cf…251e"
                        required
                        value={toAddress}
                        onChange={(event) => setToAddress(event.target.value)}
                        />
                    </div>
                    <div className="grid w-full items-center gap-1.5">
                        <Label htmlFor="value">Amount</Label>
                        <Input
                        name="value"
                        placeholder="0.05"
                        required
                        value={tokenAmount}
                        onChange={(event) => setTokenAmount(event.target.value)}
                        />
                    </div>
                    <Button onClick={submitTransferErc20} disabled={isPendingSend}>Send Tokens</Button>
                </DialogContent>
            </Dialog>
            {hash?<TransactionStatus hash={hash} refetch={updateBalance}/>:null}
        </>
    );
}