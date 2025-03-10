import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useToast } from '@/components/ui/use-toast';
import { Github, LogIn, UserPlus,Camera as Google } from 'lucide-react';

const Auth = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { login, signup, googleSignIn, githubSignIn, isLoading } = useAuth();
  const { toast } = useToast();
  const isSignUp = location.pathname === '/sign-up';

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (isSignUp) {
        await signup(email, password, name);
        toast({
          title: "Account created",
          description: "You've successfully signed up!",
          duration: 3000,
        });
      } else {
        await login(email, password);
        toast({
          title: "Welcome back!",
          description: "You've successfully logged in.",
          duration: 3000,
        });
      }
      navigate('/');
    } catch (error) {
      toast({
        title: "Error",
        description: "There was a problem with authentication. Please try again.",
        variant: "destructive",
        duration: 3000,
      });
    }
  };

  const handleGoogleSignIn = async () => {
    try {
      await googleSignIn();
      toast({ title: "Signed in with Google", description: "Welcome!" });
      navigate('/');
    } catch (error) {
      toast({ title: "Google Sign-in Failed", description: "Try again.", variant: "destructive" });
    }
  };

  const handleGithubSignIn = async () => {
    try {
      await githubSignIn();
      toast({ title: "Signed in with GitHub", description: "Welcome!" });
      navigate('/');
    } catch (error) {
      toast({ title: "GitHub Sign-in Failed", description: "Try again.", variant: "destructive" });
    }
  };

  return (
    <div className="min-h-screen flex items-center p-4 justify-center bg-todo-bg">
      <div className="max-w-md w-full p-6 bg-background rounded-lg shadow-md">
        <h1 className="text-2xl font-semibold mb-6">
          {isSignUp ? 'Create an account' : 'Sign in to your account'}
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="block text-sm font-medium mb-1" htmlFor="name">
                Name
              </label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
              />
            </div>
          )}
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="email">
              Email
            </label>
            <Input
              id="email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium mb-1" htmlFor="password">
              Password
            </label>
            <Input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
            />
          </div>
          
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Processing...' : isSignUp ? 'Sign up' : 'Sign in'}
          </Button>
        </form>
        
        <div className="flex flex-col sm:flex-row items-center w-full justify-center space-y-4 sm:space-y-0 sm:space-x-4 mt-4">
          <Button onClick={handleGoogleSignIn} className="flex w-full sm:w-auto items-center space-x-2">
            <Google size={20} />
            <span>Sign in with Google</span>
          </Button>
          <Button onClick={handleGithubSignIn} className="flex w-full sm:w-auto items-center space-x-2">
            <Github size={20} />
            <span>Sign in with GitHub</span>
          </Button>
        </div>
        
        <div className="mt-4 text-center text-sm">
          {isSignUp ? (
            <p>
              Already have an account?{' '}
              <a onClick={() => navigate('/sign-in')} className="text-primary cursor-pointer hover:underline">
                Sign in
              </a>
            </p>
          ) : (
            <p>
              Don't have an account?{' '}
              <a onClick={() => navigate('/sign-up')} className="text-primary cursor-pointer hover:underline">
                Sign up
              </a>
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Auth;
