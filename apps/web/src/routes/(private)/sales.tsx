import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(private)/sales')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/(private)/sales"!</div>
}
