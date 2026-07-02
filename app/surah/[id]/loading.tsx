export default function SurahLoading() {
  return (
    <div className="space-y-4">
      <div className="card h-36 animate-pulse" />
      {Array.from({ length: 4 }).map((_, i) => (
        <div key={i} className="card h-48 animate-pulse" />
      ))}
    </div>
  );
}
