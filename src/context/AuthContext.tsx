import { supabase } from '@/lib/supabaseClient';
import React, {
  createContext,
  useContext,
  useEffect,
  useState,
} from 'react';
import { toast } from 'sonner';

export interface User {
  id: string;
  auth_user_id: string;
  name: string;
  email: string;
  type: 'customer' | 'barber';
  barbershop?: {
    id: string;
    name: string;
    address: string;
    lat: number;
    lng: number;
  };
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  register: (
    email: string,
    password: string,
    name: string,
    type: 'customer' | 'barber',
    address?: string
  ) => Promise<void>;
  loginWithGoogle: () => Promise<void>;
  logout: () => void;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | null>(
  null
);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error(
      'useAuth must be used within an AuthProvider'
    );
  }
  return context;
};

export const AuthProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });
      if (error) {
        throw new Error(error.message);
      }

      const { data: profile, error: profileError } =
        await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', data.user?.id)
          .single();

      if (!profile || profileError)
        throw new Error('Perfil não encontrado');

      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(
        error.message || 'Erro ao fazer login'
      );
    } finally {
      setLoading(false);
    }
  };

  const register = async (
    email: string,
    password: string,
    name: string,
    type: 'customer' | 'barber',
    address?: string
  ) => {
    setLoading(true);
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          data: {
            full_name: name,
            role: type,
            address: address || null,
          },
        },
      });
      if (error) throw new Error(error.message);

      if (!data.session) {
        toast('Verifique seu e-mail!', {
          description:
            'Enviamos um link de confirmação para você ativar sua conta.',
          style: {
            backgroundColor: '#FFA500',
            color: '#ffffff',
          },
        });
        return;
      }

      const authUserId = data.user?.id;
      if (!authUserId) {
        throw new Error(
          'Usuário não autenticado. Verifique seu email para confirmação.'
        );
      }

      const { data: profile, error: profileError } =
        await supabase
          .from('users')
          .insert([
            {
              auth_user_id: authUserId,
              name,
              email,
              role: type,
              address: address || null,
            },
          ])
          .select()
          .single();

      if (!profile || profileError)
        throw new Error('Erro ao criar perfil');

      setUser(profile);
      localStorage.setItem('user', JSON.stringify(profile));
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(
        error.message || 'Erro ao criar conta'
      );
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data, error } =
        await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        });

      if (error) {
        throw new Error(error.message);
      }

      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
        throw new Error('Usuário não encontrado');
      }

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { data: profile, error: profileError } =
        await supabase
          .from('users')
          .select('*')
          .eq('auth_user_id', user.id)
          .maybeSingle();

      if (!profile) {
        const { data: newProfile, error: insertError } =
          await supabase
            .from('users')
            .insert([
              {
                auth_user_id: user.id,
                name:
                  user.user_metadata.full_name ||
                  user.email,
                role: 'customer',
                email: user.email,
              },
            ])
            .select()
            .single();

        if (insertError) {
          throw new Error(insertError.message);
        }

        setUser(newProfile);
        localStorage.setItem(
          'user',
          JSON.stringify(newProfile)
        );
      } else {
        setUser(profile);
        localStorage.setItem(
          'user',
          JSON.stringify(profile)
        );
      }
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      throw new Error(
        error.message || 'Erro ao fazer login com Google'
      );
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    await supabase.auth.signOut();
    setUser(null);
    localStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        loginWithGoogle,
        logout,
        loading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
