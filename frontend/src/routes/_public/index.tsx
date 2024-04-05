import { createFileRoute } from '@tanstack/react-router';

export const Route = createFileRoute('/_public/')({
  component: LandingPage,
});

function LandingPage() {
  return <div>Landing page</div>;
}
