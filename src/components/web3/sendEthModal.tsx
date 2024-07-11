'use client';
import { useEffect, useState, useContext } from 'react';
import { useSendTransaction, useWaitForTransactionReceipt } from 'wagmi';
import { parseEther } from 'viem';
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
import Link from 'next/link';
import { ExternalLinkIcon } from 'lucide-react';
import {AppContext} from '@/providers/globalStateProvider';

export default function SendEthModal() {
  // we trigger this function to get the updated balance
  // after the transaction is confirmed
  const {refetchNativeBalance, accountBalance} = useContext(AppContext);
  const [toAddress, setToAddress] = useState('');
  const [ethValue, setEthValue] = useState(accountBalance?.formatted);
  const { data: hash, isPending, sendTransaction } = useSendTransaction();
  const { isLoading: isConfirming, isSuccess: isConfirmed } =
    useWaitForTransactionReceipt({
      hash,
    });

  // ------- Submit Transaction -------
  async function submitSendTx(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    sendTransaction({
      to: toAddress as `0x${string}`,
      value: parseEther(ethValue),
    });
  }

  // ------- Update local and global state -------
  useEffect(() => {
    // refesh local state of eth value if global state changes
    //  this is useful when we refetch and local state is stale
    if(ethValue !== accountBalance?.formatted){
      setEthValue(accountBalance?.formatted)
    }
    // refetch the new balance if the transaction is confirmed
    if (isConfirmed) {
      refetchNativeBalance()
    }
  }, [isConfirmed, accountBalance]);

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>Send</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-center">Send ETH</DialogTitle>
          <DialogDescription>
            The amount entered will be sent to the address once you hit the Send button
          </DialogDescription>
        </DialogHeader>
        <div className="w-full">
          <form
            className="flex flex-col w-full gap-y-2"
            onSubmit={submitSendTx}
          >
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="address">Address</Label>
              <Input
                name="address"
                placeholder="0xA0Cf…251e"
                required
                onChange={(event) => setToAddress(event.target.value)}
              />
            </div>
            <div className="grid w-full items-center gap-1.5">
              <Label htmlFor="value">Amount</Label>
              <Input
                name="value"
                placeholder="0.05"
                type='number'
                value={ethValue}
                required
                onChange={(event) => setEthValue(event.target.value)}
              />
            </div>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Confirming...' : 'Send'}
            </Button>
          </form>
          {hash && (
            <div className="pt-8 flex flex-col items-center">
              <Link
                className="hover:text-accent flex items-center gap-x-1.5"
                href={`https://cardona-zkevm.polygonscan.com/tx/${hash}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                View tx on explorer <ExternalLinkIcon className="h4 w-4" />
              </Link>
              {isConfirming && <div>Waiting for confirmation...</div>}
              {isConfirmed && <div>Transaction confirmed.</div>}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}