import { Address } from 'viem';

export interface AppState {
  user: string | null;
  theme: 'light' | 'dark';
  // Add other state properties as needed
}


export interface AppContextType {
  chainId: any; 
  chain: any;
  userAddress: any;
  ensName: any;
  ensAvatar: any;
  accountBalance: any;
  isConnected: any;
  refetchNativeBalance: any;
}

// https://docs.0x.org/0x-api-swap/api-references/get-swap-v1-price#response
export interface PriceResponse {
  chainId: number;
  price: string;
  estimatedPriceImpact: string;
  value: string;
  gasPrice: bigint;
  grossBuyAmount: string;
  gas: bigint;
  estimatedGas: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  buyAmount: string;
  sellTokenAddress: string;
  sellAmount: string;
  sources: any[];
  allowanceTarget: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  expectedSlippage: string | null;
}

// https://docs.0x.org/0x-api-swap/api-references/get-swap-v1-quote#response
export interface QuoteResponse {
  chainId: number;
  price: string;
  guaranteedPrice: string;
  estimatedPriceImpact: string;
  to: Address;
  from: string;
  data: Address;
  value: bigint;
  gas: bigint;
  estimatedGas: string;
  gasPrice: bigint;
  grossBuyAmount: string;
  protocolFee: string;
  minimumProtocolFee: string;
  buyTokenAddress: string;
  sellTokenAddress: string;
  buyAmount: string;
  sellAmount: string;
  sources: any[];
  orders: any[];
  allowanceTarget: string;
  decodedUniqueId: string;
  sellTokenToEthRate: string;
  buyTokenToEthRate: string;
  expectedSlippage: string | null;
}
