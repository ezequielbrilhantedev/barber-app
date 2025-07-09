import { supabase } from '@/lib/supabaseClient';
import {
  checkUserProfile,
  createUserProfile,
} from '@/lib/userUtils';
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

    // Listen for auth state changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (event === 'SIGNED_IN' && session?.user) {
          console.log(
            'AuthContext: SIGNED_IN event, user:',
            session.user.id
          );

          // Check if user profile exists
          let profile = await checkUserProfile(
            session.user.id
          );

          if (!profile) {
            console.log(
              'AuthContext: Perfil não encontrado, criando para Google OAuth...'
            );
            // Tentar criar perfil para usuários do Google OAuth
            profile = await createUserProfile(
              session.user.id,
              session.user.user_metadata?.full_name ||
                session.user.email?.split('@')[0] ||
                'Usuário',
              session.user.email || '',
              'customer'
            );
          }

          if (profile) {
            console.log(
              'AuthContext: Definindo usuário no contexto:',
              profile
            );
            setUser(profile);
            localStorage.setItem(
              'user',
              JSON.stringify(profile)
            );
          } else {
            console.error(
              'AuthContext: Não foi possível obter ou criar perfil'
            );
          }
        } else if (event === 'SIGNED_OUT') {
          console.log('AuthContext: SIGNED_OUT event');
          setUser(null);
          localStorage.removeItem('user');
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const login = async (email: string, password: string) => {
    setLoading(true);
    try {
      console.log('Tentando login com:', { email });

      // 1. Primeiro fazer login no Supabase Auth
      const { data, error } =
        await supabase.auth.signInWithPassword({
          email,
          password,
        });

      if (error) {
        console.error('Erro de autenticação:', error);
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Usuário não encontrado');
      }

      console.log(
        'Login no auth bem-sucedido, buscando perfil...'
      );

      // 2. Buscar perfil do usuário usando o ID do auth
      const { data: profile, error: profileError } =
        await supabase
          .from('users')
          .select('*')
          .eq('id', data.user.id) // Usar 'id' diretamente, não 'auth_user_id'
          .maybeSingle();

      if (profileError) {
        console.error(
          'Erro ao buscar perfil:',
          profileError
        );
        throw new Error('Erro ao buscar perfil do usuário');
      }

      if (!profile) {
        console.error(
          'Perfil não encontrado na tabela users'
        );
        throw new Error(
          'Perfil não encontrado. Tente fazer um novo cadastro.'
        );
      }

      console.log('Perfil encontrado:', profile);

      // 3. Converter role para type para consistência com a interface
      const userProfile = {
        ...profile,
        type: profile.role,
        auth_user_id: profile.id, // Manter compatibilidade
      };

      setUser(userProfile);
      localStorage.setItem(
        'user',
        JSON.stringify(userProfile)
      );

      console.log('Login concluído com sucesso');
      console.log(
        'Estado do usuário definido:',
        userProfile
      );
    } catch (error: unknown) {
      console.error('Erro completo no login:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao fazer login';
      throw new Error(errorMessage);
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
      console.log('Tentando registrar usuário:', {
        name,
        email,
        type,
      });

      // 1. Criar usuário no Supabase Auth
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

      if (error) {
        console.error(
          'Erro ao criar usuário no auth:',
          error
        );
        throw new Error(error.message);
      }

      if (!data.user) {
        throw new Error('Falha ao criar usuário');
      }

      console.log('Usuário criado no auth:', data.user.id);

      // 2. Verificar se precisa de confirmação de email
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

      // 3. Criar perfil na tabela users usando o ID do auth como chave primária
      const { data: profile, error: profileError } =
        await supabase
          .from('users')
          .insert([
            {
              id: data.user.id, // Usar o ID do auth como chave primária
              name,
              email,
              role: type,
              address: address || null,
            },
          ])
          .select()
          .single();

      if (profileError) {
        console.error(
          'Erro ao criar perfil:',
          profileError
        );
        // Se falhar, tentar deletar o usuário do auth para manter consistência
        await supabase.auth.signOut();
        throw new Error('Erro ao criar perfil do usuário');
      }

      if (!profile) {
        throw new Error('Erro ao criar perfil');
      }

      console.log('Perfil criado com sucesso:', profile);

      // 4. Configurar usuário no estado
      const userProfile = {
        ...profile,
        type: profile.role,
        auth_user_id: profile.id, // Manter compatibilidade
      };

      setUser(userProfile);
      localStorage.setItem(
        'user',
        JSON.stringify(userProfile)
      );

      console.log('Registro concluído com sucesso');
    } catch (error: unknown) {
      console.error('Erro no registro:', error);
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao criar conta';
      throw new Error(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  const loginWithGoogle = async () => {
    setLoading(true);
    try {
      const { error } = await supabase.auth.signInWithOAuth(
        {
          provider: 'google',
          options: {
            redirectTo: `${window.location.origin}/dashboard`,
          },
        }
      );

      if (error) {
        throw new Error(error.message);
      }

      // O redirecionamento e criação de perfil será feito pelo onAuthStateChange
      console.log('Google OAuth iniciado com sucesso');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error
          ? error.message
          : 'Erro ao fazer login com Google';
      throw new Error(errorMessage);
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
