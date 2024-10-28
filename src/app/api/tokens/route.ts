// app/api/tokens/route.ts
import { NextResponse } from 'next/server';

// types.ts
type Token = {
    chainId: number;
    address: string;
    name: string;
    symbol: string;
    decimals: number;
    logoURI: string;
};

type TokenList = {
    name: string;
    timestamp: string;
    version: {
        major: number;
        minor: number;
        patch: number;
    };
    tokens: Token[];
};
  
export async function GET() {
    try {
        const response = await fetch('https://tokens.uniswap.org', {
            next: { revalidate: 3600 }, // Revalidate every hour
        });
        
        if (!response.ok) {
            throw new Error('Failed to fetch token list');
        }

        const data: TokenList = await response.json();
        const ethereumTokens = data.tokens.filter(token => token.chainId === 1);
        
        return NextResponse.json(ethereumTokens);
    } catch (error) {
        return NextResponse.json(
            { error: 'Failed to fetch tokens' },
            { status: 500 }
        );
    }
}
