import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { User } from '@/context/AuthContext';
import {
  Calendar,
  Clock,
  Plus,
  TrendingUp,
  User as UserIcon,
} from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
// import { useAuth, User } from '@/context/AuthContext';
// import { UserProfile } from '@/app/dashboard/page';

interface Appointment {
  id: string;
  clientName: string;
  service: string;
  date: string;
  time: string;
  status:
    | 'pending'
    | 'confirmed'
    | 'completed'
    | 'cancelled';
  price: number;
}

const BarberDashboard = ({ user }: { user: User }) => {
  console.log('BarberDashboard user:', user);
  // const { user } = useAuth();
  const [appointments, setAppointments] = useState<
    Appointment[]
  >([]);
  const [stats, setStats] = useState({
    todayAppointments: 0,
    weekAppointments: 0,
    monthRevenue: 0,
  });
  const router = useRouter();

  useEffect(() => {
    loadAppointments();
    loadStats();
  }, []);

  const loadAppointments = async () => {
    // Mock data
    const mockAppointments: Appointment[] = [
      {
        id: '1',
        clientName: 'João Silva',
        service: 'Corte + Barba',
        date: '2024-06-14',
        time: '09:00',
        status: 'confirmed',
        price: 35,
      },
      {
        id: '2',
        clientName: 'Pedro Santos',
        service: 'Corte simples',
        date: '2024-06-14',
        time: '10:30',
        status: 'pending',
        price: 25,
      },
      {
        id: '3',
        clientName: 'Carlos Lima',
        service: 'Barba',
        date: '2024-06-14',
        time: '14:00',
        status: 'confirmed',
        price: 15,
      },
      {
        id: '4',
        clientName: 'Ana Costa',
        service: 'Corte moderno',
        date: '2024-06-15',
        time: '11:00',
        status: 'pending',
        price: 30,
      },
    ];
    setAppointments(mockAppointments);
  };

  const loadStats = async () => {
    setStats({
      todayAppointments: 3,
      weekAppointments: 12,
      monthRevenue: 1250,
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'default';
      case 'pending':
        return 'secondary';
      case 'completed':
        return 'outline';
      case 'cancelled':
        return 'destructive';
      default:
        return 'secondary';
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case 'confirmed':
        return 'Confirmado';
      case 'pending':
        return 'Pendente';
      case 'completed':
        return 'Concluído';
      case 'cancelled':
        return 'Cancelado';
      default:
        return status;
    }
  };

  // Filter today's appointments
  const today = new Date().toISOString().split('T')[0];
  const todayAppointments = appointments.filter(
    (apt) => apt.date === today
  );
  const upcomingAppointments = appointments
    .filter((apt) => apt.date >= today)
    .slice(0, 5);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <p className="text-muted-foreground">
          Bem-vindo de volta, {user?.name}!
          {user?.barbershop && ` - ${user.barbershop.name}`}
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Hoje
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.todayAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              agendamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Esta semana
            </CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.weekAppointments}
            </div>
            <p className="text-xs text-muted-foreground">
              agendamentos
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Receita do mês
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              R$ {stats.monthRevenue}
            </div>
            <p className="text-xs text-muted-foreground">
              faturamento
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Ações rápidas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2 lg:grid-cols-4">
            <Button
              variant="outline"
              className="justify-start"
              onClick={() =>
                router.push('/barber/services')
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Gerenciar serviços
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() =>
                router.push('/barber/schedule')
              }
            >
              <Clock className="h-4 w-4 mr-2" />
              Configurar horários
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() =>
                router.push('/barber/location')
              }
            >
              <UserIcon className="h-4 w-4 mr-2" />
              Editar localização
            </Button>
            <Button
              variant="outline"
              className="justify-start"
              onClick={() =>
                router.push('/barber/bookings')
              }
            >
              <Calendar className="h-4 w-4 mr-2" />
              Ver todos agendamentos
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Today's Appointments */}
      <Card>
        <CardHeader>
          <CardTitle>Agendamentos de hoje</CardTitle>
          <CardDescription>
            {todayAppointments.length} agendamento(s) para
            hoje
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {todayAppointments.length > 0 ? (
              todayAppointments.map((appointment) => (
                <div
                  key={appointment.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div className="flex items-center space-x-4">
                    <div className="flex-shrink-0">
                      <Clock className="h-5 w-5 text-muted-foreground" />
                    </div>
                    <div>
                      <p className="font-medium">
                        {appointment.time}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {appointment.clientName}
                      </p>
                    </div>
                    <div>
                      <p className="font-medium">
                        {appointment.service}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        R$ {appointment.price}
                      </p>
                    </div>
                  </div>
                  <Badge
                    variant={getStatusColor(
                      appointment.status
                    )}
                  >
                    {getStatusText(appointment.status)}
                  </Badge>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <p className="text-muted-foreground">
                  Nenhum agendamento para hoje
                </p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Upcoming Appointments */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Próximos agendamentos</CardTitle>
            <CardDescription>
              Seus próximos compromissos
            </CardDescription>
          </div>
          <Button
            variant="outline"
            onClick={() => router.push('/barber/bookings')}
          >
            Ver todos
          </Button>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {upcomingAppointments.map((appointment) => (
              <div
                key={appointment.id}
                className="flex items-center justify-between p-3 border rounded"
              >
                <div className="flex items-center space-x-3">
                  <div>
                    <p className="font-medium text-sm">
                      {appointment.clientName}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {new Date(
                        appointment.date
                      ).toLocaleDateString()}{' '}
                      às {appointment.time}
                    </p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium">
                    {appointment.service}
                  </p>
                  <Badge
                    variant={getStatusColor(
                      appointment.status
                    )}
                    className="text-xs"
                  >
                    {getStatusText(appointment.status)}
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default BarberDashboard;
