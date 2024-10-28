import { useState, useEffect } from 'react';
import { ethers } from 'ethers';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ArrowUpRight, ArrowDownLeft, Loader2, Search } from 'lucide-react';

interface TransactionHistoryProps {
  initialAddress: string;
  providerUrl: string;
}

interface Transaction {
  hash: string;
  from: string;
  to: string;
  value: number;
  timestamp: string;
  status: 'Success' | 'Failed';
  type: 'Sent' | 'Received';
}

interface TransactionSummary {
  totalSent: number;
  totalReceived: number;
  count: number;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ initialAddress, providerUrl }) => {
  const [searchAddress, setSearchAddress] = useState(initialAddress);
  const [inputAddress, setInputAddress] = useState(initialAddress);
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [summary, setSummary] = useState<TransactionSummary>({
    totalSent: 0,
    totalReceived: 0,
    count: 0
  });

  // Replace with your Etherscan API key
  const ETHERSCAN_API_KEY = process.env.NEXT_PUBLIC_ETHERSCAN_API_KEY;

  const fetchTransactionsFromEtherscan = async (address: string) => {
    if (!address || !ETHERSCAN_API_KEY) return [];

    const normalizedAddress = address.toLowerCase();
    const apiUrl = `https://api.etherscan.io/api?module=account&action=txlist&address=${normalizedAddress}&startblock=0&endblock=99999999&sort=desc&apikey=${ETHERSCAN_API_KEY}`;

    const response = await fetch(apiUrl);
    const data = await response.json();
    console.log('data from etherscan: ',data)

    if (data.status === '1' && data.result) {
      return data.result.map((tx: any) => ({
        hash: tx.hash,
        from: tx.from,
        to: tx.to,
        value: parseFloat(ethers.utils.formatEther(tx.value)),
        timestamp: new Date(parseInt(tx.timeStamp) * 1000).toISOString(),
        status: tx.isError === '0' ? 'Success' : 'Failed',
        type: tx.from.toLowerCase() === normalizedAddress ? 'Sent' : 'Received'
      }));
    }
    
    throw new Error(data.message || 'Failed to fetch transactions');
  };

  const fetchTransactions = async (address: string) => {
    if (!ethers.utils.isAddress(address)) {
      setError('Invalid Ethereum address');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const txs = await fetchTransactionsFromEtherscan(address);
      
      const totalSent = txs
        .filter((tx: Transaction) => tx.type === 'Sent') // Specify type here
        .reduce((sum: number, tx: Transaction) => sum + tx.value, 0); // Specify type here
        
        const totalReceived = txs
        .filter((tx: Transaction) => tx.type === 'Received') // Specify type here
        .reduce((sum: number, tx: Transaction) => sum + tx.value, 0); // Specify type here

      setTransactions(txs);
      setSummary({
        totalSent,
        totalReceived,
        count: txs.length
      });
    } catch (error) {
      setError(error instanceof Error ? error.message : 'An unknown error occurred');
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = () => {
    if (inputAddress) {
      setSearchAddress(inputAddress);
      void fetchTransactions(inputAddress);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };

  useEffect(() => {
    if (searchAddress) {
      void fetchTransactions(searchAddress);
    }
  }, []);

  const formatAddress = (address: string): string => {
    return `${address.slice(0, 6)}...${address.slice(-4)}`;
  };

  return (
    <Card className="w-full max-w-2xl shadow-lg">
      <CardHeader>
        <CardTitle className="text-xl font-bold">Transaction History</CardTitle>
        <div className="flex gap-2 mt-4">
          <Input
            placeholder="Enter Ethereum address"
            value={inputAddress}
            onChange={(e) => setInputAddress(e.target.value)}
            onKeyPress={handleKeyPress}
            className="flex-1"
          />
          <Button 
            onClick={handleSearch}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <Search className="h-4 w-4" />
            Search
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex justify-center items-center h-40">
            <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
          </div>
        ) : error ? (
          <div className="text-red-500 text-center p-4">{error}</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-sm text-gray-500">Total Transactions</div>
                <div className="text-xl font-bold">{summary.count}</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-sm text-gray-500">Total Sent</div>
                <div className="text-xl font-bold">{summary.totalSent.toFixed(4)} ETH</div>
              </div>
              <div className="bg-gray-100 rounded-lg p-4">
                <div className="text-sm text-gray-500">Total Received</div>
                <div className="text-xl font-bold">{summary.totalReceived.toFixed(4)} ETH</div>
              </div>
            </div>

            {transactions.length === 0 ? (
              <div className="text-center text-gray-500 py-8">
                No transactions found for this address
              </div>
            ) : (
              <div className="space-y-4">
                {transactions.map((tx) => (
                  <div
                    key={tx.hash}
                    className="border rounded-lg p-4 hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        {tx.type === 'Sent' ? (
                          <ArrowUpRight className="text-red-500" />
                        ) : (
                          <ArrowDownLeft className="text-green-500" />
                        )}
                        <span className={tx.type === 'Sent' ? 'text-red-500' : 'text-green-500'}>
                          {tx.value.toFixed(4)} ETH
                        </span>
                      </div>
                      <span className="text-sm text-gray-500">
                        {new Date(tx.timestamp).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="mt-2 text-sm text-gray-600">
                      <div>From: {formatAddress(tx.from)}</div>
                      <div>To: {formatAddress(tx.to)}</div>
                      <div className="mt-1">
                        <a
                          href={`https://etherscan.io/tx/${tx.hash}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="text-blue-500 hover:text-blue-600"
                        >
                          View on Etherscan
                        </a>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default TransactionHistory;