// frontend/src/hooks/auth/usePasswordReset.ts
import { useState } from 'react';
import { supabase } from '../../services/supabase/client';
import { showToast } from '../../components/ui/Toast/Toast';

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);

  const sendResetEmail = async (email: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });
      if (error) throw error;
      showToast.success('Password reset email sent. Check your inbox.');
      return true;
    } catch (error: any) {
      showToast.error(error.message || 'Failed to send reset email');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const updatePassword = async (newPassword: string) => {
    setIsLoading(true);
    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });
      if (error) throw error;
      showToast.success('Password updated successfully');
      return true;
    } catch (error: any) {
      showToast.error(error.message || 'Failed to update password');
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return { sendResetEmail, updatePassword, isLoading };
};
