import { TreeView } from './tree-view';

export default async function LineageDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const lineageId = Number(id);

  return <TreeView lineageId={lineageId} />;
}
