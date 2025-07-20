import type { ReactNode } from "react";

interface SectionProps {
  children: ReactNode;
  className?: string;
  crosses?: boolean;
  crossesOffset?: string;
  customPaddings?: boolean;
  id?: string;
}

export default function Section({
  children,
  className = "",
  crosses = false,
  crossesOffset = "",
  customPaddings = false,
  id,
}: SectionProps) {
  return (
    <section
      id={id}
      className={`
        relative
        ${customPaddings ? "" : "py-20"}
        ${className}
      `}
    >
      {children}
      {crosses && (
        <div className={`absolute inset-0 pointer-events-none ${crossesOffset}`}>
          <div className="absolute inset-0 bg-grid-white/[0.02] dark:bg-grid-black/[0.02]" />
        </div>
      )}
    </section>
  );
} 