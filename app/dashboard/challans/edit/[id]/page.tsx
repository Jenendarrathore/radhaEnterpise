// app/clients/[id]/page.tsx
export default function ChallanDetailPage({
  params,
}: {
  params: { id: string };
}) {
  return (
    <div>
      <h1>Challan Details: {params.id}</h1>
      {/* Placeholder for client details */}
    </div>
  );
}
