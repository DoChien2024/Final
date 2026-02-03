import { useFormContext } from 'react-hook-form';


interface StatusButtonsProps {
  statuses: readonly string[];
  value?: string;
  onChange?: (status: string) => void;
  className?: string;
  disabled?: boolean;
}

export function StatusButtons({ statuses, value, onChange, className = '', disabled = false }: StatusButtonsProps) {
  // Nếu dùng trong react-hook-form thì lấy context, còn không thì dùng props
  const form = useFormContext();
  const currentStatus = value ?? (form ? form.watch('status') : undefined);
  const setValue = form ? form.setValue : undefined;

  const handleClick = (status: string) => {
    if (disabled) return;
    if (onChange) onChange(status);
    if (setValue) setValue('status', status);
  };

  // Nếu disabled, chỉ hiển thị status đã chọn
  const displayStatuses = disabled && currentStatus ? [currentStatus] : statuses;

  return (
    <div className={`status-buttons-row ${className}`}>
      {displayStatuses.map((status) => (
        <button
          key={status}
          type="button"
          className={`status-btn-pill ${currentStatus === status ? 'active' : ''} status-${status.toLowerCase()}`}
          onClick={() => handleClick(status)}
          disabled={disabled}
          style={disabled ? { cursor: 'not-allowed', opacity: 0.8 } : {}}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
