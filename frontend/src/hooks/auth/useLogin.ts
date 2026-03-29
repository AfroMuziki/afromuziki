// frontend/src/hooks/auth/useLogin.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase/client';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../components/ui/Toast/Toast';
import { paths } from '../../router/paths';

interface LoginCredentials {
  email: string;
  password: string;
}

export const useLogin = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { setUser, setSession } = useAuthStore();

  const login = async (credentials: LoginCredentials) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: credentials.email,
        password: credentials.password,
      });

      if (error) throw error;

      setSession(data.session);
      
      // Fetch user profile
      const { data: profile, error: profileError } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', data.user.id)
        .single();

      if (profileError) throw profileError;
      
      setUser(profile);
      showToast.success('Welcome back!');
      
      // Redirect based on role
      if (profile.role === 'admin') {
        navigate(paths.admin.dashboard);
      } else if (profile.role === 'artist') {
        navigate(paths.artist.dashboard);
      } else {
        navigate(paths.home);
      }
    } catch (error: any) {
      showToast.error(error.message || 'Login failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { login, isLoading };
};
