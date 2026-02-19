import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center">
      <h1 className="text-6xl font-bold">404</h1>
      <p className="mt-4 text-xl text-muted-foreground">Không tìm thấy trang</p>
      <Link
        href="/"
        className="mt-6 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
      >
        Về trang chủ
      </Link>
    </div>
  );
}
