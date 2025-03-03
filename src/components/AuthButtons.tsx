
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useNavigate } from 'react-router-dom';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User } from 'lucide-react';

const AuthButtons = () => {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();

  if (isAuthenticated) {
    return (
      <div className="flex items-center">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <User size={18} />
              <span>Account</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => {
                logout();
                navigate('/sign-in');
              }}
            >
              Log out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <Button variant="ghost" size="sm" onClick={() => navigate('/sign-in')}>
        Login
      </Button>
      <Button size="sm" onClick={() => navigate('/sign-up')}>
        Sign Up
      </Button>
    </div>
  );
};

export default AuthButtons;
