'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Form, FormField } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useAuth } from '@/context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
import { Chrome, Lock, Mail, Scissors } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z.object({
  email: z.string().email({
    message: 'Por favor, insira um email válido',
  }),
  password: z.string().min(5, {
    message: 'A senha deve ter pelo menos 5 caracteres',
  }),
});

export default function LoginPage() {
  const { login, loginWithGoogle } = useAuth();
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  async function handleLogin(
    values: z.infer<typeof formSchema>
  ) {
    console.log('Login values:', values);
    try {
      setLoading(true);
      await login(values.email, values.password);
      toast('Login realizado com sucesso!', {
        description: 'Bem-vindo de volta ao BarberApp',
        style: {
          backgroundColor: '#22c55e',
          color: '#ffffff',
        },
      });
      router.push('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast.error('Erro no login', {
        style: {
          backgroundColor: '#ef4444',
          color: '#ffffff',
        },
        description:
          'Verifique suas credenciais e tente novamente',
      });
    } finally {
      setLoading(false);
    }
  }

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast('Login realizado com sucesso!', {
        description: 'Bem-vindo ao BarberApp',
      });
      router.push('/dashboard');
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (error) {
      toast('Erro no login', {
        description:
          'Não foi possível fazer login com Google',
      });
    } finally {
      setLoading(false);
    }
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

              <Form {...form}>
                <form
                  onSubmit={form.handleSubmit(handleLogin)}
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
                      <FormField
                        control={form.control}
                        name="email"
                        render={({ field }) => (
                          <Input
                            id="email"
                            type="email"
                            placeholder="seu@email.com"
                            className="pl-12 h-12 text-base"
                            required
                            {...field}
                          />
                        )}
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
                      <FormField
                        control={form.control}
                        name="password"
                        render={({ field }) => (
                          <Input
                            id="password"
                            type="password"
                            placeholder="••••••••"
                            className="pl-12 h-12 text-base"
                            required
                            {...field}
                          />
                        )}
                      />
                    </div>
                  </div>
                  <Button
                    type="submit"
                    className="w-full h-12 text-base"
                    disabled={loading}
                  >
                    {loading ? 'Entrando...' : 'Entrar'}
                  </Button>
                </form>
              </Form>

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
