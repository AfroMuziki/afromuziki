// frontend/src/hooks/auth/useLogout.ts
import { useNavigate } from 'react-router-dom';
import { supabase } from '../../services/supabase/client';
import { useAuthStore } from '../../store/authStore';
import { showToast } from '../../components/ui/Toast/Toast';
import { paths } from '../../router/paths';

export const useLogout = () => {
  const navigate = useNavigate();
  const { logout } = useAuthStore();

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      logout();
      showToast.success('Signed out successfully');
      navigate(paths.home);
    } catch (error) {
      showToast.error('Failed to sign out');
      console.error('Sign out error:', error);
    }
  };

  return { signOut };
};
