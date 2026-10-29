import type { Metadata } from 'next';
import { pickParam, type SearchParams } from '@/lib/search-params';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata: Metadata = { title: 'Login', description: 'Sign in to see your Lawas Journeys bookings.' };

export default async function LoginPage({ searchParams }: { searchParams: SearchParams }) {
  return <AuthForm mode="login" next={pickParam(await searchParams, 'next') || undefined} />;
}
