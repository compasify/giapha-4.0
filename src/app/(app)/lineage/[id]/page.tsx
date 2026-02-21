import { PrivacyGate } from './privacy-gate';

export default async function LineageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lineageId = Number(id);

  return <PrivacyGate lineageId={lineageId} />;
}
