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
import {
  RadioGroup,
  RadioGroupItem,
} from '@/components/ui/radio-group';
import { useAuth } from '@/context/AuthContext';
// import { Textarea } from "@/components/ui/textarea";
import { supabase } from '@/lib/supabaseClient';
import { Label } from '@radix-ui/react-label';
import {
  Chrome,
  Link,
  Lock,
  Mail,
  Scissors,
  User,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function RegisterPage() {
  const { register } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
  };

  const handleGoogleLogin = async () => {
    const { error: signInError } =
      await supabase.auth.signInWithOAuth({
        provider: 'google',
      });
    if (signInError) {
      setError(signInError.message);
    } else {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100">
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

              <form
                onSubmit={handleSubmit}
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
                    <Input
                      id="name"
                      type="text"
                      placeholder="Seu nome"
                      // value={formData.name}
                      // onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="pl-12 h-12 text-base"
                      required
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
                    <Input
                      id="email"
                      type="email"
                      placeholder="seu@email.com"
                      // value={formData.email}
                      // onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="pl-12 h-12 text-base"
                      required
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
                      <Input
                        id="password"
                        type="password"
                        placeholder="••••••••"
                        // value={formData.password}
                        // onChange={(e) => setFormData({...formData, password: e.target.value})}
                        className="pl-12 h-12 text-base"
                        required
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
                      <Input
                        id="confirmPassword"
                        type="password"
                        placeholder="••••••••"
                        // value={formData.confirmPassword}
                        // onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                        className="pl-12 h-12 text-base"
                        required
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <Label className="text-base">
                    Tipo de usuário
                  </Label>
                  <RadioGroup
                    // value={formData.userType}
                    // onValueChange={(value: 'client' | 'barber') => setFormData({...formData, userType: value})}
                    className="flex flex-col lg:flex-row lg:space-x-6 space-y-2 lg:space-y-0"
                  >
                    <div className="flex items-center space-x-2">
                      <RadioGroupItem
                        value="client"
                        id="client"
                      />
                      <Label
                        htmlFor="client"
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
                </div>

                {/* {formData.userType === 'barber' && (
                  <div className="space-y-2">
                    <Label htmlFor="address" className="text-base">Endereço da barbearia</Label>
                    <div className="relative">
                      <MapPin className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                      <Textarea
                        id="address"
                        placeholder="Rua, número, bairro, cidade, CEP"
                        value={formData.address}
                        onChange={(e) => setFormData({...formData, address: e.target.value})}
                        className="pl-12 resize-none min-h-[80px] text-base"
                        rows={3}
                        required
                      />
                    </div>
                  </div>
                )} */}

                <Button
                  type="submit"
                  className="w-full h-12 text-base"
                  disabled={loading}
                >
                  {loading
                    ? 'Criando conta...'
                    : 'Criar conta'}
                </Button>
              </form>

              <div className="text-center text-sm lg:text-base">
                <span className="text-muted-foreground">
                  Já tem uma conta?{' '}
                </span>
                <Link
                  to="/login"
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
