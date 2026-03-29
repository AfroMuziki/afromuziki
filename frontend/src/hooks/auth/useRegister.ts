// frontend/src/hooks/auth/useRegister.ts
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase/client';
import { showToast } from '../../components/ui/Toast/Toast';
import { paths } from '../../router/paths';

interface RegisterCredentials {
  email: string;
  password: string;
  username: string;
  fullName?: string;
  role?: 'user' | 'artist';
}

export const useRegister = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const register = async (credentials: RegisterCredentials) => {
    setIsLoading(true);
    try {
      // Sign up with Supabase Auth
      const { data, error } = await supabase.auth.signUp({
        email: credentials.email,
        password: credentials.password,
        options: {
          data: {
            username: credentials.username,
            full_name: credentials.fullName,
            role: credentials.role || 'user',
          },
        },
      });

      if (error) throw error;

      showToast.success('Registration successful! Please verify your email.');
      navigate(paths.login);
    } catch (error: any) {
      showToast.error(error.message || 'Registration failed');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  return { register, isLoading };
};
