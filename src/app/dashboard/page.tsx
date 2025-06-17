'use client';

import BarberDashboard from '@/components/BarberDashboard';
import ClientDashboard from '@/components/ClientDashboard';
import { useAuth, User } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function DashboardPage() {
  const { user } = useAuth();
  const [userProfile, setUserProfile] =
    useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const fetchProfile = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();
      if (!user) {
        console.error('User not found');
        router.push('/login');
        return;
      }

      const { data, error } = await supabase
        .from('users')
        .select('*')
        .eq('auth_user_id', user.id)
        .single();

      if (!data || error) {
        router.push('/register');
        return;
      }
      setUserProfile({ ...data, type: data.role });
      setLoading(false);
    };

    fetchProfile();
  }, [router]);

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

  return user?.type === 'customer' ? (
    <ClientDashboard user={userProfile} />
  ) : (
    <BarberDashboard user={userProfile} />
  );
}
