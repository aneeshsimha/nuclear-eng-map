interface Props {
  label: string;
  onRemove: () => void;
}

export function FilterChip({ label, onRemove }: Props) {
  return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
      {label}
      <button
        onClick={onRemove}
        className="ml-0.5 text-blue-600 hover:text-blue-900 leading-none cursor-pointer"
        aria-label={`Remove ${label} filter`}
      >
        ×
      </button>
    </span>
  );
}
