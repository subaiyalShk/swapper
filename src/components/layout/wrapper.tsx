import React from 'react';
import Navbar from './navbar';
import Footer from './footer';

const NAVBAR_HEIGHT = '80px'; // 5rem / h-20 tw

export interface NavbarProps {
  title?: string;
  navTitle?: string;
}

const Wrapper: React.FC<NavbarProps & { children: React.ReactNode }> = ({
  children,
}) => {
  return (
    <>
      <main
        className={'main'}
      >
        {children}
      </main>
    </>
   
  );
};

export default Wrapper;
