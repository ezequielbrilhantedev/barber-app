'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { User } from '@/context/AuthContext';
import {
  Clock,
  Map,
  MapPin,
  Navigation,
  Star,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';

interface BarberShop {
  id: string;
  name: string;
  address: string;
  rating: number;
  distance: number;
  services: Array<{
    name: string;
    price: number;
    duration: number;
  }>;
  image?: string;
}

const ClientDashboard = ({ user }: { user: User }) => {
  console.log('ClientDashboard user:', user);
  const [barberShops, setBarberShops] = useState<
    BarberShop[]
  >([]);
  const [locationPermission, setLocationPermission] =
    useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    requestLocation();
    loadBarberShops();
  }, []);

  const requestLocation = async () => {
    if (navigator.geolocation) {
      try {
        await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            (position) => {
              setLocationPermission('granted');
              toast.success('Localização obtida!', {
                description:
                  'Encontrando barbearias próximas a você',
              });
              // ({
              //   title: "Localização obtida!",
              //   description: "Encontrando barbearias próximas a você"
              // });
              resolve(position);
            },
            (error) => {
              setLocationPermission('denied');
              toast.error('Localização negada', {
                description:
                  'Mostrando todas as barbearias disponíveis',
              });
              reject(error);
            }
          );
        });
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
      } catch (error) {
        console.log('Location denied');
      }
    }
  };

  const loadBarberShops = async () => {
    // Simulate API call
    await new Promise((resolve) =>
      setTimeout(resolve, 1000)
    );

    const mockBarberShops: BarberShop[] = [
      {
        id: '1',
        name: 'Barbearia do João',
        address: 'Rua das Flores, 123, Centro',
        rating: 4.8,
        distance: 0.5,
        services: [
          {
            name: 'Corte simples',
            price: 25,
            duration: 30,
          },
          { name: 'Barba', price: 15, duration: 20 },
          {
            name: 'Corte + Barba',
            price: 35,
            duration: 45,
          },
        ],
      },
      {
        id: '2',
        name: 'Cortes & Estilo',
        address: 'Av. Principal, 456, Vila Nova',
        rating: 4.6,
        distance: 1.2,
        services: [
          {
            name: 'Corte moderno',
            price: 30,
            duration: 40,
          },
          { name: 'Sobrancelha', price: 10, duration: 15 },
          {
            name: 'Corte + Barba + Sobrancelha',
            price: 45,
            duration: 60,
          },
        ],
      },
      {
        id: '3',
        name: 'Barbershop Premium',
        address: 'Rua do Comércio, 789, Bairro Alto',
        rating: 4.9,
        distance: 2.0,
        services: [
          {
            name: 'Corte premium',
            price: 40,
            duration: 45,
          },
          {
            name: 'Barba premium',
            price: 25,
            duration: 30,
          },
          {
            name: 'Pacote completo',
            price: 60,
            duration: 75,
          },
        ],
      },
    ];

    setBarberShops(mockBarberShops);
    setLoading(false);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            Carregando...
          </h1>
          <p className="text-muted-foreground">
            Encontrando as melhores barbearias para você
          </p>
        </div>
        <div className="grid gap-4">
          {[1, 2, 3].map((i) => (
            <Card key={i} className="animate-pulse">
              <CardContent className="p-6">
                <div className="h-6 bg-muted rounded mb-2"></div>
                <div className="h-4 bg-muted rounded w-3/4 mb-4"></div>
                <div className="h-4 bg-muted rounded w-1/2"></div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Barbearias próximas
          </h1>
          <p className="text-muted-foreground">
            {locationPermission === 'granted'
              ? 'Ordenadas por distância'
              : 'Todas as barbearias disponíveis'}
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm">
            <Map className="h-4 w-4 mr-2" />
            Ver no mapa
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={requestLocation}
          >
            <Navigation className="h-4 w-4 mr-2" />
            Atualizar localização
          </Button>
        </div>
      </div>

      <div className="grid gap-4">
        {barberShops.map((shop) => (
          <Card
            key={shop.id}
            className="hover:shadow-md transition-shadow cursor-pointer"
            onClick={() =>
              router.push(`/barbershop/${shop.id}`)
            }
          >
            <CardContent className="p-6">
              <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-xl font-semibold">
                      {shop.name}
                    </h3>
                    <Badge
                      variant="secondary"
                      className="ml-2"
                    >
                      <Star className="h-3 w-3 mr-1 fill-current" />
                      {shop.rating}
                    </Badge>
                  </div>

                  <div className="flex items-center text-muted-foreground mb-3">
                    <MapPin className="h-4 w-4 mr-1" />
                    <span className="text-sm">
                      {shop.address}
                    </span>
                    {locationPermission === 'granted' && (
                      <>
                        <span className="mx-2">•</span>
                        <span className="text-sm">
                          {shop.distance} km
                        </span>
                      </>
                    )}
                  </div>

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">
                      Serviços principais:
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {shop.services
                        .slice(0, 3)
                        .map((service, index) => (
                          <Badge
                            key={index}
                            variant="outline"
                            className="text-xs"
                          >
                            {service.name} - R${' '}
                            {service.price}
                          </Badge>
                        ))}
                    </div>
                  </div>
                </div>

                <div className="flex flex-col sm:items-end gap-2">
                  <Button className="w-full sm:w-auto">
                    Ver detalhes
                  </Button>
                  <div className="flex items-center text-xs text-muted-foreground">
                    <Clock className="h-3 w-3 mr-1" />A
                    partir de{' '}
                    {Math.min(
                      ...shop.services.map(
                        (s) => s.duration
                      )
                    )}{' '}
                    min
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {barberShops.length === 0 && (
        <Card>
          <CardContent className="text-center p-12">
            <MapPin className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">
              Nenhuma barbearia encontrada
            </h3>
            <p className="text-muted-foreground">
              Tente permitir o acesso à localização ou
              verifique sua conexão
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default ClientDashboard;
