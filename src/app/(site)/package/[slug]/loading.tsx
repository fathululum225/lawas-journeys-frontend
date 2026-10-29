import { Skeletons } from '@/components/shared/Skeletons';

export default function Loading() {
  return (
    <div className="container section">
      <Skeletons count={1} />
    </div>
  );
}
