// frontend/src/hooks/auth/useAuth.ts
import { useAuthStore } from '../../store/authStore';
import { supabase } from '../../services/supabase/client';
import { showToast } from '../../components/ui/Toast/Toast';

export const useAuth = () => {
  const { user, session, isLoading, setUser, setSession, setIsLoading, logout } = useAuthStore();

  const signOut = async () => {
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      logout();
      showToast.success('Signed out successfully');
    } catch (error) {
      showToast.error('Failed to sign out');
      console.error('Sign out error:', error);
    }
  };

  return {
    user,
    session,
    isLoading,
    isAuthenticated: !!user,
    isArtist: user?.role === 'artist',
    isAdmin: user?.role === 'admin',
    signOut,
  };
};
