import { Skeletons } from '@/components/shared/Skeletons';

export default function Loading() {
  return (
    <div className="container section section--narrow">
      <Skeletons count={1} />
    </div>
  );
}
