'use client';

import BarberDashboard from '@/components/BarberDashboard';
import ClientDashboard from '@/components/ClientDashboard';
import { User, useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { checkUserProfile } from '@/lib/userUtils';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const [userProfile, setUserProfile] =
    useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const { user: authUser } = useAuth();

  useEffect(() => {
    console.log('Dashboard: Iniciando useEffect...');
    console.log(
      'Dashboard: authUser do contexto:',
      authUser
    );

    if (authUser) {
      console.log(
        'Dashboard: Usuário encontrado no contexto, usando diretamente'
      );
      setUserProfile(authUser);
      setLoading(false);
      return;
    }

    const fetchProfile = async () => {
      console.log(
        'Dashboard: authUser não encontrado, buscando via Supabase...'
      );

      try {
        // Tentar múltiplas vezes para dar tempo para a sessão ser estabelecida
        let user = null;
        let attempts = 0;
        const maxAttempts = 5;

        while (!user && attempts < maxAttempts) {
          const { data } = await supabase.auth.getUser();
          user = data.user;

          if (!user) {
            console.log(
              `Dashboard: Tentativa ${
                attempts + 1
              }/${maxAttempts} - Usuário não encontrado, aguardando...`
            );
            await new Promise((resolve) =>
              setTimeout(resolve, 500)
            );
            attempts++;
          }
        }

        console.log('Dashboard: Usuário do auth:', user);

        if (!user) {
          console.error(
            'Dashboard: User not found após múltiplas tentativas, redirecionando para login'
          );
          router.push('/login');
          return;
        }

        console.log(
          'Dashboard: Buscando perfil para user.id:',
          user.id
        );
        const profile = await checkUserProfile(user.id);

        console.log(
          'Dashboard: Perfil retornado:',
          profile
        );

        if (!profile) {
          console.log(
            'Dashboard: User profile not found, redirecting to register'
          );
          router.push('/register');
          return;
        }

        console.log(
          'Dashboard: Definindo userProfile:',
          profile
        );
        setUserProfile(profile);
        setLoading(false);
        console.log(
          'Dashboard: Loading definido como false'
        );
      } catch (error) {
        console.error(
          'Dashboard: Erro ao buscar perfil:',
          error
        );
        router.push('/login');
      }
    };

    fetchProfile();
  }, [router, authUser]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        Carregando...
      </div>
    );
  }
  if (!userProfile) {
    return (
      <div className="flex items-center justify-center h-screen">
        Perfil não encontrado
      </div>
    );
  }

  {
    console.log('Dashboard userProfile:', userProfile.type);
  }

  return userProfile.type === 'customer' ? (
    <ClientDashboard user={userProfile} />
  ) : (
    <BarberDashboard user={userProfile} />
  );
}
