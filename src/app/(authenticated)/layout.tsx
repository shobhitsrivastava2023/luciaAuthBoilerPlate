import { redirect } from 'next/navigation';
import { getAuth } from '@/features/auth/get-auth';
export default async function AuthenticatedLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const { user } = await getAuth();

  if (!user) {
    redirect('/sign-in');
  }

  return <>{children}</>;
}