import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { FiX } from 'react-icons/fi'
import { FormTextarea } from '@/components/form/FormTextarea'
import { FormDatePicker } from '@/components/form/FormDatePicker'
import { FormSelect } from '@/components/form/FormSelect'
import { FormNumberInput } from '@/components/form/FormNumberInput'
import { voucherSchema, type VoucherFormData } from '@/utils/validationSchemas'
import { useConfirmStore } from '@/store/useConfirmStore'
import { useVoucherFormMutations } from './hooks/useVoucherFormMutations'
import type { Voucher } from './voucher.types'

interface VoucherFormModalProps {
  isOpen: boolean
  onClose: () => void
  voucher?: Voucher | null
  mode: 'create' | 'edit'
}

const typeOptions = [
  { value: 'percentage', label: 'Percentage' },
  { value: 'fixed', label: 'Fixed' },
]

export default function VoucherFormModal({
  isOpen,
  onClose,
  voucher,
  mode,
}: VoucherFormModalProps) {
  const { confirmCreate } = useConfirmStore()
  const { createMutation } = useVoucherFormMutations()
  
  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<VoucherFormData>({
    resolver: zodResolver(voucherSchema) as any,
    mode: 'onChange',
    defaultValues: {
      code: '',
      description: '',
      startDate: '',
      endDate: '',
      quantityUse: undefined,
      type: '' as any,
      amount: undefined,
      minPayAmount: undefined,
      maxDiscountAmount: undefined,
      status: 'active',
    },
  })

  const typeValue = watch('type')
  const codeValue = watch('code') || ''

  const handleClose = () => {
    reset({
      code: '',
      description: '',
      startDate: '',
      endDate: '',
      quantityUse: undefined,
      type: '' as any,
      amount: undefined,
      minPayAmount: undefined,
      maxDiscountAmount: undefined,
      status: 'active',
    })
    onClose()
  }

  useEffect(() => {
    if (!isOpen) return
    
    // Xử lý Dữ liệu: Phân biệt mode bằng cờ (flag), fill dữ liệu bằng defaultValues
    if (voucher && mode === 'edit') {
      // Format dates for date input
      const formatDate = (dateString: string) => {
        if (!dateString) return ''
        return new Date(dateString).toISOString()
      }

      reset({
        code: voucher.code || '',
        description: voucher.description || '',
        startDate: formatDate(voucher.startDate),
        endDate: formatDate(voucher.endDate),
        quantityUse: voucher.quantityUse ? Number(voucher.quantityUse) : 1,
        type: voucher.type || 'percentage',
        amount: Number(voucher.amount) || 0,
        minPayAmount: Number(voucher.minPayAmount) || 0,
        maxDiscountAmount: Number(voucher.maxDiscountAmount) || 0,
        status: voucher.status === 'expired' ? 'inactive' : (voucher.status || 'active'),
      })
    } else if (mode === 'create') {
      // Empty form for create mode - only show placeholders
      reset({
        code: '',
        description: '',
        startDate: '',
        endDate: '',
        quantityUse: undefined,
        type: '' as any,
        amount: undefined,
        minPayAmount: undefined,
        maxDiscountAmount: undefined,
        status: 'active',
      })
    }
  }, [voucher, mode, isOpen, reset])

  const onSubmitForm = (data: VoucherFormData) => {
    // Format data to match API requirements - exactly like the main web
    const submitData: any = {
      code: data.code.trim(),
      description: data.description?.trim() || "",
      startDate: new Date(data.startDate).toISOString(),
      endDate: new Date(data.endDate).toISOString(),
      quantityUse: String(data.quantityUse),
      type: data.type,
      amount: String(data.amount),
      minPayAmount: String(data.minPayAmount),
      maxDiscountAmount: String(data.maxDiscountAmount),
      status: 'active',
    }
    
    confirmCreate(() => createMutation.mutate(submitData), 'this voucher')
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-container" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2 className="modal-title">
            {mode === 'create' ? 'Create Voucher' : 'Update Voucher'}
          </h2>
          <button onClick={handleClose} className="modal-close-btn" disabled={createMutation.isPending}>
            <FiX />
          </button>
        </div>

        <form onSubmit={handleSubmit(onSubmitForm)} className="modal-form">
          {/* Code */}
          <div className="form-group">
            <label htmlFor="code" className="form-label">
              Code <span className="required-asterisk">*</span>
            </label>
            <div style={{ position: 'relative' }}>
              <input
                type="text"
                id="code"
                {...register('code')}
                placeholder="Code"
                disabled={createMutation.isPending}
                className={`form-input ${errors.code ? 'error' : ''}`}
                maxLength={50}
              />
              <span
                style={{
                  position: 'absolute',
                  right: '12px',
                  top: '50%',
                  transform: 'translateY(-50%)',
                  fontSize: '13px',
                  color: '#9e9e9e',
                }}
              >
                {codeValue.length}/50
              </span>
            </div>
            {errors.code && <span className="error-message">{errors.code.message}</span>}
          </div>

          {/* Description */}
          <FormTextarea
            name="description"
            label="Description"
            register={register}
            error={errors.description}
            placeholder="Description"
            rows={4}
            disabled={createMutation.isPending}
          />

          {/* Start & End Date */}
          <div className="form-row">
            <FormDatePicker
              name="startDate"
              label="Start Date"
              control={control}
              error={errors.startDate}
              required
              placeholder="Select date"
              dateFormat="dd MMM yyyy"
              disabled={createMutation.isPending}
            />

            <FormDatePicker
              name="endDate"
              label="End Date"
              control={control}
              error={errors.endDate}
              required
              placeholder="Select date"
              dateFormat="dd MMM yyyy"
              minDate={watch('startDate') ? new Date(watch('startDate')) : undefined}
              disabled={createMutation.isPending}
            />
          </div>

          {/* Quantity */}
          <FormNumberInput
            name="quantityUse"
            label="Quantity"
            placeholder="Enter quantity"
            register={register}
            error={errors.quantityUse}
            disabled={createMutation.isPending}
            required
            min={1}
            step={1}
            allowDecimals={false}
          />

          {/* Type of coupon */}
          <FormSelect
            name="type"
            label="Type of coupon"
            control={control}
            options={typeOptions}
            error={errors.type}
            disabled={createMutation.isPending}
            required
            placeholder="Select"
            isClearable={true}
          />

          {/* Amount */}
          <FormNumberInput
            name="amount"
            label="Amount"
            placeholder="Amount"
            register={register}
            error={errors.amount}
            disabled={createMutation.isPending}
            required
            min={0.01}
            step={0.01}
            allowDecimals={true}
            suffix={typeValue === 'percentage' ? '%' : '$'}
          />

          {/* Condition - Min Payment */}
          <FormNumberInput
            name="minPayAmount"
            label="Condition"
            placeholder="Min of payment"
            register={register}
            error={errors.minPayAmount}
            disabled={createMutation.isPending}
            required
            min={0}
            step={0.01}
            allowDecimals={true}
          />

          {/* Condition Max Discount */}
          <FormNumberInput
            name="maxDiscountAmount"
            label="Condition max of discount"
            placeholder="Max of discount"
            register={register}
            error={errors.maxDiscountAmount}
            disabled={createMutation.isPending}
            required
            min={0}
            step={0.01}
            allowDecimals={true}
          />

          <div className="modal-footer">
            <button
              type="submit"
              className="btn-primary"
              disabled={createMutation.isPending}
            >
              {createMutation.isPending ? 'Creating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
