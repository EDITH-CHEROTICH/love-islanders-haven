
import { Skeleton } from '@/components/ui/skeleton';

const ProfileLoadingState = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-island-dark via-island to-island-dark pb-20">
      <div className="page-container pt-8 space-y-6">
        <Skeleton className="h-8 w-48 mx-auto" />
        <Skeleton className="h-80 w-full rounded-xl" />
        <Skeleton className="h-32 w-full rounded-lg" />
      </div>
    </div>
  );
};

export default ProfileLoadingState;
