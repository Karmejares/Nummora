// components/ui/loading-dot.tsx
export function LoadingDot({ size = 16 }: { size?: number }) {
  return (
    <div
      className="animate-spin rounded-full border-2 border-muted border-t-primary"
      style={{ width: size, height: size }}
    />
  );
}
