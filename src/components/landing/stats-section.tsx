const STATS = [
  { value: '19+', label: 'Loại sự kiện', description: 'Sinh, mất, kết hôn, tốt nghiệp...' },
  { value: '3', label: 'Miền xưng hô', description: 'Bắc, Trung, Nam' },
  { value: '∞', label: 'Thành viên', description: 'Không giới hạn số lượng' },
  { value: '100%', label: 'Miễn phí', description: 'Không quảng cáo, không phí ẩn' },
] as const;

export function StatsSection() {
  return (
    <section className="py-16 sm:py-20 bg-vn-red">
      <div className="container mx-auto px-4">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-4 max-w-5xl mx-auto">
          {STATS.map((stat) => (
            <div key={stat.label} className="text-center">
              <div className="text-4xl sm:text-5xl font-bold text-white">{stat.value}</div>
              <div className="mt-2 text-base font-semibold text-white/90">{stat.label}</div>
              <div className="mt-1 text-sm text-white/60">{stat.description}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}