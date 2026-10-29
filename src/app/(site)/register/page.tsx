import type { Metadata } from 'next';
import { pickParam, type SearchParams } from '@/lib/search-params';
import { AuthForm } from '@/components/auth/AuthForm';

export const metadata: Metadata = { title: 'Register', description: 'Create a Lawas Journeys account to manage your bookings.' };

export default async function RegisterPage({ searchParams }: { searchParams: SearchParams }) {
  return <AuthForm mode="register" next={pickParam(await searchParams, 'next') || undefined} />;
}
