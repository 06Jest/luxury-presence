import type { InputHTMLAttributes, ReactNode, SelectHTMLAttributes } from "react";

const control =
  "w-full border-b border-clay-400 bg-transparent py-3 text-base text-ink-900 transition-colors duration-300 placeholder:text-ink-500/60 focus:border-ink-900 focus:outline-none";

function Label({ htmlFor, children }: { htmlFor: string; children: ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="eyebrow text-ink-500">
      {children}
    </label>
  );
}

export function TextField({
  id,
  label,
  className = "",
  ...props
}: { id: string; label: string; className?: string } & InputHTMLAttributes<HTMLInputElement>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <input id={id} className={control} {...props} />
    </div>
  );
}

export function SelectField({
  id,
  label,
  options,
  className = "",
  ...props
}: {
  id: string;
  label: string;
  options: readonly string[];
  className?: string;
} & SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      <Label htmlFor={id}>{label}</Label>
      <select id={id} className={`${control} appearance-none pr-6`} {...props}>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}
