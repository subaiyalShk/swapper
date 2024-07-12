'use client'
import { useEffect, useState } from 'react';
import Image from 'next/image';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import {
    POLYGON_EXCHANGE_PROXY,
    POLYGON_TOKENS,
    POLYGON_TOKENS_BY_SYMBOL,
    Token,
} from '@/lib/constants';
import { PriceResponse, QuoteResponse} from '../../../types';
import { 
    useChainId,
    useBalance,
    useReadContract,
    useSendTransaction,
    useWaitForTransactionReceipt,
    useWriteContract,
} from 'wagmi';
// toast for better ux
import { toast } from 'sonner';
import {
    Address,
    erc20Abi,
    formatUnits,
    parseEther,
    parseUnits
} from 'viem';
  import ApproveOrReviewButton from './approveOrReviewBtn';
  
import qs from 'qs';

type SendErc20ModalProps = {
  userAddress: `0x${string}` | undefined;
};

export default function SwapErc20Modal({ userAddress }: SendErc20ModalProps) {
    const [isMounted, setIsMounted] = useState(false);
    const [sellToken, setSellToken] = useState('wmatic');
    const [sellAmount, setSellAmount] = useState('');
    const [buyToken, setBuyToken] = useState('usdc');
    const [buyAmount, setBuyAmount] = useState('');
    const [price, setPrice] = useState<PriceResponse | undefined>();
    const [tradeDirection, setSwapDirection] = useState('sell');
    const [quote, setQuote] = useState<QuoteResponse | undefined>();
    const [finalize, setFinalize] = useState(false);
    const chainId = useChainId() || 137;

    const tokensByChain = (chainId: number) => {
        if (chainId === 137) {
          return POLYGON_TOKENS_BY_SYMBOL;
        }
        return POLYGON_TOKENS_BY_SYMBOL;
    };
    const sellTokenObject = tokensByChain(chainId)[sellToken];
    const buyTokenObject = tokensByChain(chainId)[buyToken];

    const sellTokenDecimals = sellTokenObject.decimals;
    const buyTokenDecimals = buyTokenObject.decimals;
    const parsedSellAmount = sellAmount && tradeDirection === 'sell'? parseUnits(sellAmount, sellTokenDecimals).toString() : undefined;
    const parsedBuyAmount = buyAmount && tradeDirection === 'buy'? parseUnits(buyAmount, buyTokenDecimals).toString() : undefined;

    const { data: userTokenBalance } = useBalance({
        address: userAddress,
        token: sellTokenObject.address,
    });

    // Check if user can cover the desired sellAmount comparing it to the user's token balance
    const insufficientBalance =
    userTokenBalance && sellAmount
      ? parseUnits(sellAmount, sellTokenDecimals) > userTokenBalance.value
      : true;

    
    async function getQuote(e: React.MouseEvent<HTMLButtonElement>) {
        e.preventDefault();
        if (!userAddress || !price) {
          toast.warning('You must connect your wallet...');
          return;
        }
    
        const params = {
          sellToken: price.sellTokenAddress,
          buyToken: price.buyTokenAddress,
          sellAmount: price.sellAmount,
          takerAddress: userAddress,
        };
        try {
          const response = await fetch(`/api/quote?${qs.stringify(params)}`);
          const data = await response.json();
          setQuote(data);
          setFinalize(true);
        } catch (error) {
          console.error(error);
        }
      }

    const handleSellTokenChange = (value: string) => {
        setSellToken(value);
    };

    function handleBuyTokenChange(value: string) {
        setBuyToken(value);
    }

    useEffect(() => {
        if (!isMounted) {
        setIsMounted(true);
        }
    }, [isMounted]);

    useEffect(() => {
        const params = {
          sellToken: sellTokenObject.address,
          buyToken: buyTokenObject.address,
          sellAmount: parsedSellAmount,
          buyAmount: parsedBuyAmount,
          takerAddress: userAddress,
        };

        console.log(params);
    
        async function main() {
          const response = await fetch(`/api/price?${qs.stringify(params)}`);
          const data = await response.json();
          console.log(data);
          if (data.buyAmount) {
            
            setBuyAmount(formatUnits(data.buyAmount, buyTokenObject.decimals));
            setPrice(data);
          }
        }
    
        if (sellAmount !== '') {
          main();
        }
      }, [
        sellTokenObject.address,
        buyTokenObject.address,
        parsedSellAmount,
        parsedBuyAmount,
        userAddress,
        sellAmount,
        setPrice,
      ]
    );

    

    return (
        <Dialog>
        <DialogTrigger asChild className="w-full">
            <Button>Swap ERC20</Button>
        </DialogTrigger>
        <DialogContent>
            <DialogHeader>
            <DialogTitle className="text-center">Swap ERC20</DialogTitle>
            <DialogDescription>
                The amount entered will be swapped for the amount of tokens
                displayed in the second row
            </DialogDescription>
            </DialogHeader>
            {isMounted ? (
            <div className="w-full">
                <form className="flex flex-col w-full gap-y-8">
                <div className="w-full flex flex-col gap-y-4">
                    <div className="w-full flex items-center gap-1.5">
                    <Image
                        alt={buyToken}
                        className="h-9 w-9 mr-2 rounded-md"
                        src={POLYGON_TOKENS_BY_SYMBOL[sellToken].logoURI}
                        width={6}
                        height={6}
                    />
                    <Select
                        onValueChange={handleSellTokenChange}
                        defaultValue="wmatic"
                    >
                        <SelectTrigger className="w-1/4">
                        <SelectValue placeholder="Theme" />
                        </SelectTrigger>
                        <SelectContent>
                        {POLYGON_TOKENS.map((token: Token) => {
                            return (
                            <SelectItem
                                key={token.address}
                                value={token.symbol.toLowerCase()}
                            >
                                {token.symbol}
                            </SelectItem>
                            );
                        })}
                        </SelectContent>
                    </Select>
                    <Input
                        className="w-3/4"
                        type="number"
                        name="sell-amount"
                        id="sell-amount"
                        placeholder="Enter amount..."
                        value={sellAmount}
                        onChange={(event) => {
                          setSwapDirection('sell');
                          setSellAmount(event.target.value)
                        }}
                        required
                    />
                    </div>
                    <div className="w-full flex items-center gap-1.5">
                    <Image
                        alt={buyToken}
                        className="h-9 w-9 mr-2 rounded-md"
                        src={POLYGON_TOKENS_BY_SYMBOL[buyToken].logoURI}
                        width={6}
                        height={6}
                    />
                    <Select
                        onValueChange={handleBuyTokenChange}
                        defaultValue="usdc"
                    >
                        <SelectTrigger className="w-1/4">
                        <SelectValue placeholder="Buy..." />
                        </SelectTrigger>
                        <SelectContent>
                        {POLYGON_TOKENS.map((token: Token) => {
                            return (
                            <SelectItem
                                key={token.address}
                                value={token.symbol.toLowerCase()}
                            >
                                {token.symbol}
                            </SelectItem>
                            );
                        })}
                        </SelectContent>
                    </Select>
                    <Input
                        className="w-3/4"
                        type="number"
                        id="buy-amount"
                        name="buy-amount"
                        placeholder="Enter amount..."
                        value={buyAmount}
                        disabled
                    />
                    </div>
                </div>
                <ApproveOrReviewButton 
                  sellAmount={sellAmount}
                  sellTokenAddress={POLYGON_TOKENS_BY_SYMBOL[sellToken].address}
                  userAddress={userAddress as `0x${string}`}
                  onClick={getQuote}
                  disabled={insufficientBalance}
                />
                </form>
            </div>
            ) : (
            <p>Loading...</p>
            )}
        </DialogContent>
        </Dialog>
    );
}