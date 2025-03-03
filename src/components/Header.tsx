
import React from 'react';
import AuthButtons from './AuthButtons';

const Header = () => {
  return (
    <header className="w-full py-6 border-b border-todo-border flex items-center justify-between px-6 sm:px-8">
      <h1 className="text-2xl font-semibold tracking-tight">TodoX</h1>
      <AuthButtons />
    </header>
  );
};

export default Header;
