'use client';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import {
  Clock,
  MapPin,
  Scissors,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';

export default function Home() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 w-full">
      {/* Hero Section */}
      <div className="container mx-auto px-4 py-8 md:py-16 lg:py-20">
        <div className="text-center mb-12 md:mb-20">
          <div className="flex justify-center mb-6 md:mb-8">
            <div className="p-4 md:p-6 bg-primary rounded-full">
              <Scissors className="h-12 w-12 md:h-16 md:w-16 text-primary-foreground" />
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold text-gray-900 mb-6 md:mb-8">
            BarberApp
          </h1>
          <p className="text-lg md:text-xl lg:text-2xl text-gray-600 mb-8 md:mb-12 max-w-2xl lg:max-w-4xl mx-auto leading-relaxed">
            O jeito mais fácil de agendar seu corte de
            cabelo. Encontre barbearias próximas e agende
            quando quiser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 md:gap-6 justify-center">
            <Button
              size="lg"
              onClick={() => router.push('/login')}
              className="px-8 py-3 md:px-10 md:py-4 text-base md:text-lg cursor-pointer"
            >
              Entrar
            </Button>
            <Button
              size="lg"
              variant="outline"
              onClick={() => router.push('/register')}
              className="px-8 py-3 md:px-10 md:py-4 text-base md:text-lg cursor-pointer"
            >
              Cadastrar
            </Button>
          </div>
        </div>

        {/* Features */}
        <div className="grid md:grid-cols-3 gap-6 md:gap-8 lg:gap-12 mb-12 md:mb-20">
          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4 md:pb-6">
              <MapPin className="h-12 w-12 md:h-16 md:w-16 text-primary mx-auto mb-4 md:mb-6" />
              <CardTitle className="text-lg md:text-xl lg:text-2xl">
                Encontre Barbearias
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base lg:text-lg leading-relaxed">
                Localize as melhores barbearias próximas a
                você com facilidade
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4 md:pb-6">
              <Clock className="h-12 w-12 md:h-16 md:w-16 text-primary mx-auto mb-4 md:mb-6" />
              <CardTitle className="text-lg md:text-xl lg:text-2xl">
                Agende Online
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base lg:text-lg leading-relaxed">
                Escolha o horário que melhor funciona para
                você, sem complicações
              </CardDescription>
            </CardContent>
          </Card>

          <Card className="text-center hover:shadow-lg transition-shadow duration-300">
            <CardHeader className="pb-4 md:pb-6">
              <Star className="h-12 w-12 md:h-16 md:w-16 text-primary mx-auto mb-4 md:mb-6" />
              <CardTitle className="text-lg md:text-xl lg:text-2xl">
                Qualidade Garantida
              </CardTitle>
            </CardHeader>
            <CardContent>
              <CardDescription className="text-sm md:text-base lg:text-lg leading-relaxed">
                Avaliações reais de clientes para você
                escolher o melhor serviço
              </CardDescription>
            </CardContent>
          </Card>
        </div>

        {/* CTA for Barbers */}
        <div className="max-w-4xl mx-auto">
          <Card className="bg-primary text-primary-foreground">
            <CardHeader className="text-center pb-4 md:pb-6">
              <CardTitle className="text-2xl md:text-3xl lg:text-4xl mb-2 md:mb-4">
                É Barbeiro?
              </CardTitle>
              <CardDescription className="text-primary-foreground/80 text-base md:text-lg lg:text-xl">
                Cadastre sua barbearia e comece a receber
                agendamentos hoje mesmo
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Button
                variant="secondary"
                size="lg"
                onClick={() => router.push('/register')}
                className="px-8 py-3 md:px-10 md:py-4 text-base md:text-lg"
              >
                Cadastrar Barbearia
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
