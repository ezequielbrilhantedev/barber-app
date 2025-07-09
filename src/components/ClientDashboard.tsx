'use client';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { useAuth, User } from '@/context/AuthContext';
import {
  Clock,
  LogOut,
  MapPin,
  Navigation,
  Star,
  User as UserIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Input } from './ui/input';

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
  estimatedTime: string;
  image?: string;
}

const ClientDashboard = ({ user }: { user: User }) => {
  console.log('ClientDashboard user:', user);
  const { logout } = useAuth();
  const [barberShops, setBarberShops] = useState<
    BarberShop[]
  >([]);
  const [locationPermission, setLocationPermission] =
    useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [userLocation, setUserLocation] = useState<{
    lat: number;
    lng: number;
  } | null>(null);
  const router = useRouter();

  useEffect(() => {
    requestLocation();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    if (locationPermission !== null) {
      loadBarberShops();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [locationPermission, userLocation]);

  const requestLocation = async () => {
    if (!navigator.geolocation) {
      toast.error('Geolocalização não suportada', {
        description:
          'Seu navegador não suporta geolocalização',
      });
      setLocationPermission('denied');
      return;
    }

    // Verificar se já temos permissão
    if (navigator.permissions) {
      try {
        const permission =
          await navigator.permissions.query({
            name: 'geolocation',
          });
        if (permission.state === 'granted') {
          getCurrentLocation();
          return;
        }
        if (permission.state === 'denied') {
          setLocationPermission('denied');
          return;
        }
      } catch {
        console.log('Permission API not supported');
      }
    }

    // Solicitar localização
    toast.info('Permissão de localização', {
      description:
        'Permitir acesso à localização para encontrar barbearias próximas?',
      action: {
        label: 'Permitir',
        onClick: () => getCurrentLocation(),
      },
      duration: 8000, // Mais tempo para ler no mobile
    });
  };

  const getCurrentLocation = () => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
        setLocationPermission('granted');
        toast.success('Localização obtida!', {
          description:
            'Buscando barbearias próximas a você',
        });
      },
      (error) => {
        console.error('Erro ao obter localização:', error);
        setLocationPermission('denied');
        toast.error('Localização negada', {
          description:
            'Mostrando todas as barbearias disponíveis',
        });
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 300000, // 5 minutos
      }
    );
  };

  const calculateDistance = (
    barbershopLat: number,
    barbershopLng: number
  ): number => {
    if (!userLocation) return 0;

    const R = 6371; // Raio da Terra em km
    const dLat =
      ((barbershopLat - userLocation.lat) * Math.PI) / 180;
    const dLng =
      ((barbershopLng - userLocation.lng) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((userLocation.lat * Math.PI) / 180) *
        Math.cos((barbershopLat * Math.PI) / 180) *
        Math.sin(dLng / 2) *
        Math.sin(dLng / 2);
    const c =
      2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  const loadBarberShops = async () => {
    setLoading(true);
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
        distance: userLocation
          ? calculateDistance(-23.5505, -46.6333)
          : 0.5,
        estimatedTime: 'A partir de 20 min',
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
        distance: userLocation
          ? calculateDistance(-23.5515, -46.6343)
          : 1.2,
        estimatedTime: 'A partir de 15 min',
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
        distance: userLocation
          ? calculateDistance(-23.5525, -46.6353)
          : 2.0,
        estimatedTime: 'A partir de 30 min',
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
      {
        id: '4',
        name: 'Barbearia do Zé',
        address: 'Rua da Alegria, 321, Jardim Alegre',
        rating: 4.5,
        distance: userLocation
          ? calculateDistance(-23.5535, -46.6363)
          : 0.8,
        estimatedTime: 'A partir de 25 min',
        services: [
          {
            name: 'Corte tradicional',
            price: 20,
            duration: 30,
          },
          {
            name: 'Barba + Bigode',
            price: 18,
            duration: 25,
          },
          {
            name: 'Corte + Barba + Bigode',
            price: 38,
            duration: 50,
          },
        ],
      },
      {
        id: '5',
        name: 'Estilo & Cabelo',
        address: 'Av. das Nações, 654, Parque das Nações',
        rating: 4.7,
        distance: userLocation
          ? calculateDistance(-23.5545, -46.6373)
          : 1.5,
        estimatedTime: 'A partir de 20 min',
        services: [
          {
            name: 'Corte estilizado',
            price: 35,
            duration: 35,
          },
          {
            name: 'Barba + Sobrancelha',
            price: 20,
            duration: 30,
          },
          {
            name: 'Pacote completo',
            price: 50,
            duration: 60,
          },
        ],
      },
    ];

    // Ordenar por distância se tivermos localização
    if (locationPermission === 'granted' && userLocation) {
      mockBarberShops.sort(
        (a, b) => a.distance - b.distance
      );
    }

    setBarberShops(mockBarberShops);
    setLoading(false);
  };

  const handleViewDetails = (barbershopId: string) => {
    router.push(`/barbershop/${barbershopId}`);
  };

  const handleLogout = async () => {
    await logout();
    router.push('/login');
  };

  const updateLocation = () => {
    requestLocation();
  };

  const openMaps = () => {
    // Implementar abertura do mapa
    toast.info('Funcionalidade em desenvolvimento', {
      description:
        'A visualização no mapa será implementada em breve',
    });
  };

  return (
    <div className="min-h-screen bg-gray-50 w-full">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">
                BarberApp
              </h1>
            </div>
            <div className="flex items-center space-x-2 sm:space-x-4">
              <div className="hidden sm:flex items-center text-sm text-gray-600">
                <UserIcon className="h-4 w-4 mr-2" />
                <span className="hidden md:inline">
                  {user.name}
                </span>
                <Badge variant="secondary" className="ml-2">
                  Cliente
                </Badge>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleLogout}
                className="text-gray-600"
              >
                <LogOut className="h-4 w-4 sm:mr-2" />
                <span className="hidden sm:inline">
                  Sair
                </span>
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
        {/* Top Section */}
        <div className="mb-6">
          <div className="mb-4 sm:mb-6">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
              Barbearias próximas
            </h2>
            <p className="text-sm sm:text-base text-gray-600">
              {locationPermission === 'granted'
                ? 'Ordenadas por distância'
                : 'Todas as barbearias disponíveis'}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col space-y-3 sm:flex-row sm:space-y-0 sm:space-x-3">
            <Button
              variant="outline"
              onClick={openMaps}
              className="flex items-center justify-center w-full sm:w-auto px-4 py-2"
            >
              <MapPin className="h-4 w-4 mr-2" />
              <span className="text-sm">Ver no mapa</span>
            </Button>
            <Button
              variant="outline"
              onClick={updateLocation}
              className="flex items-center justify-center w-full sm:w-auto px-4 py-2"
            >
              <Navigation className="h-4 w-4 mr-2" />
              <span className="text-sm">
                Atualizar localização
              </span>
            </Button>
          </div>

          <div>
            <Input
              type="search"
              placeholder="Encontre sua barbearia!"
              className="bg-white border border-gray-300 rounded-md shadow-sm focus:ring-2 focus:ring-gray-500 focus:border-transparent w-full mt-4 sm:mt-6"
            />
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-8 sm:py-12">
            <div className="animate-spin rounded-full h-6 w-6 sm:h-8 sm:w-8 border-b-2 border-gray-900"></div>
            <span className="ml-3 text-sm sm:text-base text-gray-600">
              Carregando barbearias...
            </span>
          </div>
        )}

        {/* Barbershops List */}
        {!loading && (
          <div className="space-y-4">
            {barberShops.map((barbershop) => (
              <Card
                key={barbershop.id}
                className="hover:shadow-md transition-shadow"
              >
                <CardContent className="p-4 sm:p-6">
                  <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                    <div className="flex-1">
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
                        <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-2 sm:mb-0">
                          {barbershop.name}
                        </h3>
                        <div className="flex items-center">
                          <Star className="h-4 w-4 text-yellow-400 fill-current" />
                          <span className="ml-1 text-sm font-medium text-gray-700">
                            {barbershop.rating}
                          </span>
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row sm:items-center text-gray-600 mb-3 gap-1 sm:gap-0">
                        <div className="flex items-center min-w-0">
                          <MapPin className="h-4 w-4 mr-1 flex-shrink-0" />
                          <span className="text-sm truncate pr-2">
                            {barbershop.address}
                          </span>
                        </div>
                        <span className="hidden sm:inline text-sm ml-4 flex-shrink-0">
                          • {barbershop.distance.toFixed(1)}{' '}
                          km
                        </span>
                        <span className="sm:hidden text-xs text-gray-500 flex-shrink-0">
                          {barbershop.distance.toFixed(1)}{' '}
                          km de distância
                        </span>
                      </div>

                      <div className="flex items-center text-gray-600 mb-4">
                        <Clock className="h-4 w-4 mr-1" />
                        <span className="text-sm">
                          {barbershop.estimatedTime}
                        </span>
                      </div>

                      <div className="mb-4">
                        <p className="text-sm font-medium text-gray-700 mb-2">
                          Serviços principais:
                        </p>
                        <div className="flex flex-wrap gap-1.5 sm:gap-2">
                          {barbershop.services
                            .slice(0, 3)
                            .map((service, index) => (
                              <Badge
                                key={index}
                                variant="secondary"
                                className="text-xs whitespace-nowrap"
                              >
                                {service.name} - R${' '}
                                {service.price}
                              </Badge>
                            ))}
                          {barbershop.services.length >
                            3 && (
                            <Badge
                              variant="outline"
                              className="text-xs text-gray-500"
                            >
                              +
                              {barbershop.services.length -
                                3}{' '}
                              serviços
                            </Badge>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="sm:ml-6 flex sm:block">
                      <Button
                        onClick={() =>
                          handleViewDetails(barbershop.id)
                        }
                        className="bg-gray-900 hover:bg-gray-800 text-white w-full sm:w-auto"
                      >
                        Ver detalhes
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Empty State */}
        {!loading && barberShops.length === 0 && (
          <div className="text-center py-8 sm:py-12 px-4">
            <MapPin className="h-10 w-10 sm:h-12 sm:w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-base sm:text-lg font-medium text-gray-900 mb-2">
              Nenhuma barbearia encontrada
            </h3>
            <p className="text-sm sm:text-base text-gray-600 mb-4 max-w-md mx-auto">
              Tente atualizar sua localização ou verifique
              sua conexão
            </p>
            <Button
              onClick={updateLocation}
              variant="outline"
              className="w-full sm:w-auto"
            >
              Tentar novamente
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ClientDashboard;
