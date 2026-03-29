// frontend/src/components/artist/FollowButton/FollowButton.tsx
import { useState } from 'react';
import { UserPlusIcon, UserMinusIcon } from '@heroicons/react/24/outline';
import { useFollow } from '../../../hooks/engagement/useFollow';
import { Button } from '../../ui/Button/Button';
import { showToast } from '../../ui/Toast/Toast';

export interface FollowButtonProps {
  artistId: string;
  initialFollowing: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const FollowButton = ({ artistId, initialFollowing, size = 'md' }: FollowButtonProps) => {
  const [isFollowing, setIsFollowing] = useState(initialFollowing);
  const { mutate: follow, isPending } = useFollow();

  const handleFollow = async () => {
    const previousState = isFollowing;
    setIsFollowing(!previousState);
    
    follow(
      { artistId, action: !previousState ? 'follow' : 'unfollow' },
      {
        onError: () => {
          setIsFollowing(previousState);
          showToast.error(`Failed to ${previousState ? 'unfollow' : 'follow'} artist`);
        },
        onSuccess: () => {
          showToast.success(previousState ? 'Unfollowed artist' : 'Now following artist');
        },
      }
    );
  };

  return (
    <Button
      variant={isFollowing ? 'outline' : 'primary'}
      size={size}
      onClick={handleFollow}
      isLoading={isPending}
      icon={isFollowing ? <UserMinusIcon className="w-4 h-4" /> : <UserPlusIcon className="w-4 h-4" />}
    >
      {isFollowing ? 'Following' : 'Follow'}
    </Button>
  );
};
