export default function LoadingDots() {
  return (
    <span className="inline-flex items-center gap-1">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="h-1.5 w-1.5 animate-bounce rounded-full bg-amber"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}
