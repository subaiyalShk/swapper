'use client';

import Image from 'next/image';
import Link from 'next/link';
import MobileMenu from './mobileMenu';
import { usePathname } from 'next/navigation';
import { Button } from '../ui/button';
import { toast } from 'sonner';
// import { ConnectKitButton } from 'connectkit';
import { Box, Card, Flex, Avatar, Text, DataList, Badge, Code, IconButton } from '@radix-ui/themes';
import { useDisconnect } from "wagmi";

export type MenuItemType = {
  displayText: string;
  href: string;
  isMobileOnly: boolean;
};

const MENU_ITEMS: MenuItemType[] = [
  { displayText: 'devcamp', href: '/', isMobileOnly: false },
  { displayText: 'repo', href: '/github', isMobileOnly: false },
  { displayText: 'docs', href: '/docs', isMobileOnly: false },
  { displayText: 'faq', href: '/faq', isMobileOnly: false },
];

export default function Navbar() {
  const pathname = usePathname();
  const { disconnect } = useDisconnect();

  return (
    <header className="h-20 w-full bg-background">
      <Flex justify={'between'} align={'center'} height="100%">
        <Box width="64px" pl={'10px'}>
          <MobileMenu menuItems={MENU_ITEMS} pathname={pathname} />
        </Box>
        <Box height="64px">
          <div className="flex items-center justify-center">
            <nav className="hidden gap-6 lg:flex">
              {MENU_ITEMS.filter((menuItem) => !menuItem.isMobileOnly).map(
                (menuItem, index) => (
                  <Link
                    key={`${menuItem.displayText}-menuItem-${index}`}
                    className={`inline-flex items-center justify-center px-4 py-2 text-lg font-medium text-foreground transition-colors hover:text-primary focus:text-primary focus:outline-none ${
                      pathname === menuItem.href &&
                      'pointer-events-none underline decoration-primary decoration-[1.5px] underline-offset-[6px] hover:!text-foreground'
                    }`}
                    href={menuItem.href}
                  >
                    {menuItem.displayText}
                  </Link>
                )
              )}
            </nav>
          </div>
        </Box>
        <Box pr={'10px'}>
          <Button
            color='red'
            variant="outline"
            size="default"
            onClick={()=>disconnect()}
          >
            Logout
          </Button>
        </Box>
      </Flex>
        {/* <div>
          <Link className="flex w-20 items-center" href="/">
            <Image
              src="/images/logos/dabl-club-logo-black.png"
              alt="Dabl Club logo"
              width={512}
              height={512}
              className="h-20 w-20 transition duration-300 ease-in-out hover:scale-90"
            />
            <span className="sr-only">Regen Token</span>
          </Link>
        </div> */}
    </header>
  );
}
