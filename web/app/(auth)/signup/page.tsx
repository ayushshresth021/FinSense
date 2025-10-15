'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '../../../app/lib/store/auth';
import Image from 'next/image';
import { ArrowLeft } from 'lucide-react';
import LogoImage from '@/assets/logo.jpg';

export default function SignupPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { signup } = useAuthStore();
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    // Validate passwords match
    if (password !== confirmPassword) {
      setError('Passwords do not match');
      return;
    }

    // Validate password length
    if (password.length < 8) {
      setError('Password must be at least 8 characters');
      return;
    }

    setIsLoading(true);

    try {
      await signup(email, password);
      router.push('/dashboard');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="card p-8">
      {/* Back to Home Button */}
      <Link 
        href="/" 
        className="inline-flex items-center gap-2 text-sm text-secondary hover:text-primary transition-colors mb-6"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Home
      </Link>

      {/* Logo */}
      <div className="flex items-center justify-center gap-2 mb-8">
        <Image
          src={LogoImage}
          alt="FinSense logo"
          width={40}
          height={40}
          className="object-contain rounded-lg"
        />
        <span className="text-2xl font-bold">FinSense</span>
      </div>

      <h1 className="text-2xl font-bold text-center mb-2">Create your account</h1>
      <p className="text-secondary text-center mb-8">
        Start tracking your spending in seconds
      </p>

      {error && (
        <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 rounded-lg">
          <p className="text-red-400 text-sm">{error}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="email" className="block text-sm font-medium mb-2">
            Email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="you@example.com"
          />
        </div>

        <div>
          <label htmlFor="password" className="block text-sm font-medium mb-2">
            Password
          </label>
          <input
            id="password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium mb-2">
            Confirm Password
          </label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-4 py-3 bg-[rgb(var(--color-bg-tertiary))] border border-[rgb(var(--color-border-primary))] rounded-lg focus:outline-none focus:border-blue-500 transition-colors"
            placeholder="••••••••"
          />
        </div>

        <button
          type="submit"
          disabled={isLoading}
          className="w-full btn btn-primary py-3 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLoading ? 'Creating account...' : 'Create Account'}
        </button>
      </form>

      <p className="text-center text-secondary text-sm mt-6">
        Already have an account?{' '}
        <Link href="/login" className="text-blue-400 hover:text-blue-300">
          Sign in
        </Link>
      </p>
    </div>
  );
}