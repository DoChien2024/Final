import { useFormContext } from 'react-hook-form';
import { useTransactionFormContext } from '../../../context/TransactionFormContext';

interface StatusButtonsProps {
  statuses: readonly string[];
  value?: string;
  onChange?: (status: string) => void;
  className?: string;
  disabled?: boolean;
}

export function StatusButtons({ statuses, value, onChange, className = '', disabled = false }: StatusButtonsProps) {
  const form = useFormContext();
  const { mode } = useTransactionFormContext();
  const currentStatus = value ?? (form ? form.watch('status') : undefined);
  const setValue = form ? form.setValue : undefined;
  const clearErrors = form ? form.clearErrors : undefined;

  // Check if in confirm/readonly mode
  const isReadOnly = disabled || !!mode;

  const handleClick = (status: string) => {
    if (isReadOnly) return;
    if (onChange) onChange(status);
    if (setValue) {
      setValue('status', status);
      if (clearErrors) clearErrors('status');
    }
  };

  const displayStatuses = isReadOnly && currentStatus ? [currentStatus] : statuses;

  return (
    <div className={`status-buttons-row ${className}`}>
      {displayStatuses.map((status) => (
        <button
          key={status}
          type="button"
          className={`status-btn-pill ${currentStatus === status ? 'active' : ''} status-${status.toLowerCase()}`}
          onClick={() => handleClick(status)}
          disabled={isReadOnly}
          style={isReadOnly ? { cursor: 'not-allowed', opacity: 0.8 } : {}}
        >
          {status}
        </button>
      ))}
    </div>
  );
}
