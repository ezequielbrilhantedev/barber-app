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
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/context/AuthContext';
import { zodResolver } from '@hookform/resolvers/zod';
// import { Textarea } from "@/components/ui/textarea";
import { Label } from '@radix-ui/react-label';
import {
  Chrome,
  Lock,
  Mail,
  MapPin,
  Scissors,
  User,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { z } from 'zod';

const formSchema = z
  .object({
    name: z.string().min(2, {
      message: 'O nome deve ter pelo menos 2 caracteres',
    }),
    email: z.string().email({
      message: 'Por favor, insira um email válido',
    }),
    password: z.string().min(5, {
      message: 'A senha deve ter pelo menos 5 caracteres',
    }),
    confirmPassword: z.string().min(5),
    userType: z.enum(['customer', 'barber'], {
      errorMap: () => ({
        message: 'Selecione um tipo de usuário',
      }),
    }),
    address: z.string().optional(),
  })
  .refine(
    (data) => data.password === data.confirmPassword,
    {
      message: 'As senhas não coincidem',
      path: ['confirmPassword'],
    }
  );

export default function RegisterPage() {
  const { loginWithGoogle, register } = useAuth();
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
      userType: 'customer',
      address: '',
    },
  });

  const userType = form.watch('userType');

  const handleRegister = async (
    values: z.infer<typeof formSchema>
  ) => {
    console.log('Register values:', values);
    try {
      setLoading(true);
      await register(
        values.email,
        values.password,
        values.name,
        values.userType,
        values.address
      );
    } catch (error) {
      console.log('Erro no registro:', error);
      toast.error('Erro ao criar conta', {
        style: {
          backgroundColor: '#ef4444',
          color: '#ffffff',
        },
        description:
          'Verifique seus dados e tente novamente',
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    try {
      setLoading(true);
      await loginWithGoogle();
      toast('Conta criada com sucesso!', {
        description: 'Bem-vindo ao BarberApp',
      });
      router.push('/dashboard');
    } catch (error) {
      console.log('Erro no login com Google:', error);
      toast('Erro no login', {
        description:
          'Não foi possível fazer login com Google',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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
              Junte-se à nossa comunidade
            </h2>
            <p className="text-xl opacity-90 leading-relaxed mb-6">
              Seja um cliente em busca do corte perfeito ou
              um barbeiro querendo expandir seus negócios, o
              BarberApp é o lugar certo para você.
            </p>
            <div className="space-y-3">
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-foreground rounded-full mr-3"></div>
                <span>Agendamentos simplificados</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-foreground rounded-full mr-3"></div>
                <span>Encontre barbearias próximas</span>
              </div>
              <div className="flex items-center">
                <div className="w-2 h-2 bg-primary-foreground rounded-full mr-3"></div>
                <span>Gerencie seu negócio</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right side - Register form */}
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
                Criar Conta
              </CardTitle>
              <CardDescription className="text-base lg:text-lg mt-2">
                Cadastre-se para começar a usar o BarberApp
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 lg:space-y-8">
              <Button
                type="button"
                variant="outline"
                className="w-full h-12 text-base"
                onClick={handleGoogleLogin}
                disabled={loading}
              >
                <Chrome className="h-5 w-5 mr-3" />
                Cadastrar com Google
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
                  onSubmit={form.handleSubmit(
                    handleRegister
                  )}
                  className="space-y-5 lg:space-y-6"
                >
                  <div className="space-y-2">
                    <Label
                      htmlFor="name"
                      className="text-base"
                    >
                      Nome completo
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                      <FormField
                        control={form.control}
                        name="name"
                        render={({ field }) => (
                          <Input
                            id="name"
                            type="text"
                            placeholder="Seu nome"
                            {...field}
                            className="pl-12 h-12 text-base"
                            required
                          />
                        )}
                      />
                    </div>
                  </div>

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

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 lg:gap-6">
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

                    <div className="space-y-2">
                      <Label
                        htmlFor="confirmPassword"
                        className="text-base"
                      >
                        Confirmar senha
                      </Label>
                      <div className="relative">
                        <Lock className="absolute left-3 top-3.5 h-5 w-5 text-muted-foreground" />
                        <FormField
                          control={form.control}
                          name="confirmPassword"
                          render={({ field }) => (
                            <Input
                              id="confirmPassword"
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
                  </div>

                  <div className="space-y-3">
                    <Label className="text-base">
                      Tipo de usuário
                    </Label>

                    <FormField
                      control={form.control}
                      name="userType"
                      render={({ field }) => (
                        <RadioGroup
                          value={field.value}
                          onValueChange={field.onChange}
                          className="flex flex-col lg:flex-row lg:space-x-6 space-y-2 lg:space-y-0"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="customer"
                              id="customer"
                            />
                            <Label
                              htmlFor="customer"
                              className="text-base"
                            >
                              Cliente
                            </Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem
                              value="barber"
                              id="barber"
                            />
                            <Label
                              htmlFor="barber"
                              className="text-base"
                            >
                              Barbeiro
                            </Label>
                          </div>
                        </RadioGroup>
                      )}
                    />
                  </div>

                  {userType === 'barber' && (
                    <div className="space-y-2">
                      <Label
                        htmlFor="address"
                        className="text-base"
                      >
                        Endereço da barbearia
                      </Label>
                      <div className="relative">
                        <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                        <FormField
                          control={form.control}
                          name="address"
                          render={({ field }) => (
                            <Textarea
                              id="address"
                              placeholder="Rua, número, bairro, cidade, CEP"
                              className="pl-12 resize-none min-h-[80px] text-base"
                              rows={3}
                              {...field}
                            />
                          )}
                        />
                      </div>
                    </div>
                  )}
                  <Button
                    type="submit"
                    className="w-full h-12 text-base cursor-pointer"
                    disabled={loading}
                  >
                    {loading
                      ? 'Criando conta...'
                      : 'Criar conta'}
                  </Button>
                </form>
              </Form>

              <div className="text-center text-sm lg:text-base">
                <span className="text-muted-foreground">
                  Já tem uma conta?{' '}
                </span>
                <Link
                  href="/login"
                  className="text-primary hover:underline font-medium"
                >
                  Entre aqui
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
