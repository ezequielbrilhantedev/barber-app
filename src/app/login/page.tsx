'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';
import { Chrome, Lock, Mail, Scissors } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';

export default function LoginPage() {
  const { login, loginWithGoogle, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  // const { login, loginWithGoogle, loading } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await login(email, password);
      toast('Login realizado com sucesso!', {
        description: 'Bem-vindo de volta ao BarberApp',
      });
      router.push('/dashboard');
    } catch (error) {
      toast('Erro no login', {
        description:
          'Verifique suas credenciais e tente novamente',
      });
    }
  };

  const handleGoogleLogin = async () => {
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/dashboard`,
      },
    });

    const {
      data: { user },
    } = await supabase.auth.getUser();
    console.log('User after Google login:', user);

    const { data: profile } = await supabase
      .from('users')
      .select('*')
      .eq('auth_user_id', user?.id)
      .single();

    if (!profile) {
      router.push('/register');
      return;
    } else {
      router.push('/dashboard');
    }

    // try {
    //   await loginWithGoogle();
    //   toast({
    //     title: "Login realizado com sucesso!",
    //     description: "Bem-vindo ao BarberApp"
    //   });
    //   navigate('/dashboard');
    // } catch (error) {
    //   toast({
    //     title: "Erro no login",
    //     description: "Não foi possível fazer login com Google",
    //     variant: "destructive"
    //   });
    // }
  };

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-50 to-slate-100">
      <div className="flex min-h-screen">
        {/* Left side - Hero section (hidden on mobile) */}
        <div className="hidden lg:flex lg:w-1/2 bg-primary text-primary-foreground p-12 flex-col justify-center">
          <div className="max-w-md">
            <div className="flex items-center mb-8">
              <div className="p-3 bg-primary-foreground/10 rounded-full mr-4">
                <Scissors className="h-8 w-8" />
              </div>
              <h1 className="text-3xl font-bold">
                BarberApp
              </h1>
            </div>
            <h2 className="text-4xl font-bold mb-6 leading-tight">
              Sua barbearia favorita a um clique de
              distância
            </h2>
            <p className="text-xl opacity-90 leading-relaxed">
              Encontre as melhores barbearias da sua região
              e agende seu horário com facilidade. Rápido,
              prático e seguro.
            </p>
          </div>
        </div>

        {/* Right side - Login form */}
        <div className="flex-1 flex items-center justify-center p-4 lg:p-12">
          <Card className="w-full max-w-md lg:max-w-lg">
            <CardHeader className="text-center pb-6 lg:pb-8">
              {/* Mobile header (visible only on small screens) */}
              <div className="flex justify-center mb-4 lg:hidden">
                <div className="p-3 bg-primary rounded-full">
                  <Scissors className="h-8 w-8 text-primary-foreground" />
                </div>
              </div>
              <CardTitle className="text-2xl lg:text-3xl">
                Entrar
              </CardTitle>
              <CardDescription className="text-base lg:text-lg mt-2">
                Entre em sua conta para continuar
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 lg:space-y-8">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base"
                onClick={handleGoogleLogin}
                // disabled={loading}
              >
                <Chrome className="h-5 w-5 mr-3" />
                Entrar com Google
              </Button>

              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t" />
                </div>
                <div className="relative flex justify-center text-sm uppercase">
                  <span className="bg-card px-3 text-muted-foreground">
                    Ou continue com
                  </span>
                </div>
              </div>

              <form
                onSubmit={handleSubmit}
                className="space-y-5 lg:space-y-6"
              >
                <div className="space-y-2">
                  <Label
                    htmlFor="email"
                    className="text-base"
                  >
                    Email
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={email}
                      onChange={(e) =>
                        setEmail(e.target.value)
                      }
                      className="pl-12 h-12 text-base"
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label
                    htmlFor="password"
                    className="text-base"
                  >
                    Senha
                  </Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) =>
                        setPassword(e.target.value)
                      }
                      className="pl-12 h-12 text-base"
                      required
                    />
                  </div>
                </div>
                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  // disabled={loading}
                >
                  {/* {loading ? 'Entrando...' : 'Entrar'} */}
                  Entrar
                </Button>
              </form>

              <div className="text-center text-sm lg:text-base">
                <span className="text-muted-foreground">
                  Não tem uma conta?{' '}
                </span>
                <Link
                  href={'/register'}
                  className="text-primary hover:underline font-medium"
                >
                  Cadastre-se
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
