import { User } from '@/context/AuthContext';
import { supabase } from '@/lib/supabaseClient';

export const checkUserProfile = async (
  userId: string
): Promise<User | null> => {
  try {
    console.log('Verificando perfil para userId:', userId);

    const { data: profile, error } = await supabase
      .from('users')
      .select('*')
      .eq('id', userId) // Usar 'id' em vez de 'auth_user_id'
      .maybeSingle();

    if (error) {
      console.error('Error fetching user profile:', error);
      return null;
    }

    if (!profile) {
      console.log(
        'Perfil não encontrado para userId:',
        userId
      );
      return null;
    }

    console.log('Perfil encontrado:', profile);

    // Convert role to type for consistency with the User interface
    return {
      ...profile,
      type: profile.role,
      auth_user_id: profile.id, // Manter compatibilidade
    };
  } catch (error) {
    console.error('Error in checkUserProfile:', error);
    return null;
  }
};

export const createUserProfile = async (
  userId: string,
  name: string,
  email: string,
  role: 'customer' | 'barber' = 'customer'
): Promise<User | null> => {
  try {
    console.log('Criando perfil para userId:', userId);

    const { data: newProfile, error } = await supabase
      .from('users')
      .insert([
        {
          id: userId, // Usar 'id' em vez de 'auth_user_id'
          name,
          email,
          role,
        },
      ])
      .select()
      .single();

    if (error) {
      console.error('Error creating user profile:', error);
      return null;
    }

    console.log('Perfil criado:', newProfile);

    return {
      ...newProfile,
      type: newProfile.role,
      auth_user_id: newProfile.id, // Manter compatibilidade
    };
  } catch (error) {
    console.error('Error in createUserProfile:', error);
    return null;
  }
};
