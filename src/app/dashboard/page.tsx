'use client';

import BarberDashboard from '@/components/BarberDashboard';
import ClientDashboard from '@/components/ClientDashboard';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

export default function DashboardPage() {
  const router = useRouter();
  const { user: authUser, loading } = useAuth();

  useEffect(() => {
    console.log('Dashboard: Iniciando useEffect...');
    console.log(
      'Dashboard: authUser do contexto:',
      authUser
    );
    console.log('Dashboard: loading:', loading);

    // Se ainda está carregando, aguarda
    if (loading) {
      console.log(
        'Dashboard: Aguardando carregamento do auth...'
      );
      return;
    }

    // Se não há usuário autenticado, redireciona para login
    if (!authUser) {
      console.log(
        'Dashboard: Usuário não autenticado, redirecionando para login'
      );
      router.push('/login');
      return;
    }

    console.log(
      'Dashboard: Usuário autenticado encontrado:',
      authUser
    );
  }, [router, authUser, loading]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Carregando...
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="flex items-center justify-center h-screen">
        Redirecionando...
      </div>
    );
  }

  console.log('Dashboard authUser:', authUser.type);

  return authUser.type === 'customer' ? (
    <ClientDashboard user={authUser} />
  ) : (
    <BarberDashboard user={authUser} />
  );
}
