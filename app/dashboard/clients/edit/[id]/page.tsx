// app/clients/[id]/page.tsx
export default function ClientDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Client Details: {params.id}</h1>
      {/* Placeholder for client details */}
    </div>
  );
}
