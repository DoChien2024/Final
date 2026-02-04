import { useFormContext } from 'react-hook-form';
import { REQUIRED_MSG } from '@/utils/validationSchemas';

interface StatusButtonsProps {
  statuses: readonly string[];
  value?: string;
  onChange?: (status: string) => void;
  className?: string;
  disabled?: boolean;
}

export function StatusButtons({ statuses, value, onChange, className = '', disabled = false }: StatusButtonsProps) {
  const form = useFormContext();
  const currentStatus = value ?? (form ? form.watch('status') : undefined);
  const setValue = form ? form.setValue : undefined;
  const statusError = form?.formState?.errors?.status;

  const handleClick = (status: string) => {
    if (disabled) return;
    if (onChange) onChange(status);
    if (setValue) setValue('status', status);
  };

  const displayStatuses = disabled && currentStatus ? [currentStatus] : statuses;

  return (
    <>
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
      {statusError && <span className="form-error">{REQUIRED_MSG}</span>}
    </>
  );
}
