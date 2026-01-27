import { useFormContext } from 'react-hook-form';


interface StatusButtonsProps {
  statuses: readonly string[];
  value?: string;
  onChange?: (status: string) => void;
  className?: string;
}

export function StatusButtons({ statuses, value, onChange, className = '' }: StatusButtonsProps) {
  // Nếu dùng trong react-hook-form thì lấy context, còn không thì dùng props
  const form = useFormContext();
  const currentStatus = value ?? (form ? form.watch('status') : undefined);
  const setValue = form ? form.setValue : undefined;

  const handleClick = (status: string) => {
    if (onChange) onChange(status);
    if (setValue) setValue('status', status);
  };

  return (
    <div className={`status-buttons-row ${className}`}>
      {statuses.map((status) => (
        <button
          key={status}
          type="button"
          className={`status-btn-pill ${currentStatus === status ? 'active' : ''} status-${status.toLowerCase()}`}
          onClick={() => handleClick(status)}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
