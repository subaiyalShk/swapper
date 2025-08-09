'use client';
  
import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import { Search } from 'lucide-react';

import { 
  Command,
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command';

type Token = {
  chainId: number;
  address: string;
  name: string;
  symbol: string;
  decimals: number;
  logoURI: string;
};

export interface TokenWithBalance extends Token {
  balance?: string;
}

interface TokenSearchDropdownProps {
  onSelect?: (token: TokenWithBalance) => void;
  className?: string;
  defaultToken?: TokenWithBalance;
}
const TokenImage = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [error, setError] = useState(false);
  
  // Convert IPFS URL to HTTPS URL
  const getImageUrl = (src: string) => {
    if (src.startsWith('ipfs://')) {
      return `https://ipfs.io/ipfs/${src.replace('ipfs://', '')}`;
    }
    return src;
  };
  
  if (error) {
    return (
      <div className={`bg-gray-100 rounded-full flex items-center justify-center ${className}`}>
        <span className="text-xs font-medium text-gray-500">
          {alt.slice(0, 2)}
        </span>
      </div>
    );
  }
  
  return (
    <div className="relative w-6 h-6">
      <Image
        src={getImageUrl(src)}
        alt={alt}
        fill
        className={className}
        onError={() => setError(true)}
      />
    </div>
  );
};
  
export default function TokenSearchDropdown({ 
  onSelect,
  className = ''
}: TokenSearchDropdownProps) {
  const [tokens, setTokens] = useState<Token[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fetchTokens = async () => {
      try {
        const response = await fetch('/api/tokens');
        if (!response.ok) {
          throw new Error('Failed to fetch tokens');
        }
        const data = await response.json();
        setTokens(data);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching tokens:', error);
        setIsLoading(false);
      }
    };

    fetchTokens();
  }, []);

  const handleTokenSelect = (token: Token) => {
    setSelectedToken(token);
    setOpen(false);
    onSelect?.(token);
  };

  return (
    <div className={`relative w-full max-w-xs ${className}`}>
      <button
        onClick={() => setOpen(true)}
        className="w-full flex items-center justify-between px-4 py-2 border rounded-lg bg-white hover:bg-gray-50 text-left"
      >
        {selectedToken ? (
          <div className="flex items-center space-x-2">
            <TokenImage 
              src={selectedToken.logoURI} 
              alt={selectedToken.symbol} 
              className="rounded-full"
            />
            <span>{selectedToken.symbol}</span>
          </div>
        ) : (
          <span className="text-gray-500">Select token</span>
        )}
      </button>

      <CommandDialog open={open} onOpenChange={setOpen}>
        <Command className="rounded-lg border shadow-md">
          <CommandInput 
            placeholder="Search tokens..." 
            value={searchTerm}
            onValueChange={setSearchTerm}
          />
          <CommandList>
            <CommandEmpty>No tokens found.</CommandEmpty>
            <CommandGroup heading="Tokens">
              {isLoading ? (
                <div className="p-4 text-center text-gray-500">
                  Loading tokens...
                </div>
              ) : (
                tokens
                  .filter(token =>
                    token.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                    token.symbol.toLowerCase().includes(searchTerm.toLowerCase())
                  )
                  .map((token) => (
                    <CommandItem
                      key={token.address}
                      onSelect={() => handleTokenSelect(token)}
                      className="flex items-center space-x-2 px-4 py-2"
                    >
                      <TokenImage 
                        src={token.logoURI} 
                        alt={token.symbol} 
                        className="rounded-full"
                      />
                      <div className="flex flex-col">
                        <span className="font-medium">{token.symbol}</span>
                        <span className="text-sm text-gray-500">
                          {token.name}
                        </span>
                      </div>
                    </CommandItem>
                  ))
              )}
            </CommandGroup>
          </CommandList>
        </Command>
      </CommandDialog>
    </div>
  );
}

