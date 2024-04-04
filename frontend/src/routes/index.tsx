import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/')({
  component: LandingPage,
});

function LandingPage() {
  return <div>Landing page</div>;
}
