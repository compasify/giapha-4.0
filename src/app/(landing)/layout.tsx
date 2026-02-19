export default function LandingLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen">
      <header className="border-b">
        <div className="container mx-auto flex h-16 items-center px-4">
          <span className="text-lg font-semibold">Gia Phả Online</span>
        </div>
      </header>
      {children}
      <footer className="border-t py-6">
        <div className="container mx-auto px-4 text-center text-sm text-muted-foreground">
          © 2026 Gia Phả Online
        </div>
      </footer>
    </div>
  );
}
