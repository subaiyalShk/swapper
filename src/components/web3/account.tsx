'use client';

import { useAccount, useBalance, useEnsAvatar, useEnsName } from 'wagmi';
import { useEffect, useState } from 'react';
import { mainnet } from 'viem/chains';
import Image from 'next/image';
import SendErc20Modal from '@/components/web3/sendErc20Modal';
import SendEthModal from '@/components/web3/sendEthModal';

export function Account() {
  const [isMounted, setIsMounted] = useState(false);
  const {address: userAddress, address, chain, chainId } = useAccount();
  const accountBalance = useBalance({
    address,
  });
  const { data: ensName } = useEnsName({
    address,
    chainId: mainnet.id,
  });
  const { data: ensAvatar } = useEnsAvatar({
    name: ensName!,
    chainId: mainnet.id,
  });

  useEffect(() => {
    if (!isMounted) {
      setIsMounted(true);
    }
  }, [isMounted]);

  return (
    <div className="flex flex-col items-center text-center gap-y-4">
      {ensAvatar && ensName && isMounted && (
        <div className="flex items-center gap-x-2">
          <Image
            alt="ENS Avatar"
            src={ensAvatar}
            className="h-16 w-16 rounded-full"
            height={64}
            width={64}
          />
          {ensName && <p className="text-2xl">{ensName}</p>}
        </div>
      )}
      {address && isMounted && (
        <>
          <p className="text-lg">{address}</p>
        </>
      )}
      <div className="flex flex-col gap-y-2">
        {accountBalance && (
          <p className="text-xl">
            Balance: {accountBalance.data?.formatted} ETH
          </p>
        )}
        {chain && chainId && isMounted && (
          <p className="text-lg">
            {chain.name}, chainId: {chainId}
          </p>
        )}
      </div>
      <div className="flex justify-center gap-x-8">
        <div className="w-2/5">
          <SendEthModal />
        </div>
        <div className="w-2/5">
          <SendErc20Modal userAddress={userAddress} />
        </div>
        {/* <div className="w-2/5">
          <SwapErc20Modal userAddress={userAddress} />
        </div> */}
      </div>
    </div>
  );
}