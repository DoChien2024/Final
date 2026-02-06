import { useFormContext } from 'react-hook-form'
import { FiLock } from 'react-icons/fi'
import type { TransactionFormValues } from '../../types'
import { useTransactionFormContext } from '../../context/TransactionFormContext'
import { SelectController } from '../form/share/SelectController'
import { 
  TransactionCurrencyField, 
  TransactionDateField, 
  TransactionTextField 
} from '../form/share/TransactionFormFields'
import { getBankLabel } from '../../utils/formatters'

export function TransactionFormUnified() {
  const { formState: { errors }} = useFormContext<TransactionFormValues>()
  const { 
    loadingStates, 
    fieldVisibility,
    formattedOptions, 
    minDate, 
    maxDate,
    clientName,
    onChange,
    type
  } = useTransactionFormContext()

  const { orgOptions, subOrgOptions, currencyOptions, bankOptions } = formattedOptions

  const bankLabel = getBankLabel(fieldVisibility.bankDirection)
  const isDebit = type === 'Debit'

  return (
    <>
      {/* Client Name - Only for Debit with showClientFields */}
      {isDebit && fieldVisibility.showClientFields && (
        <div className="form-table-row">
          <label className="form-table-label">
            Client Name <span className="required-asterisk">*</span>
          </label>
          <div className="form-table-input">
            <SelectController
              name="clientName"
              options={orgOptions}
              isLoading={loadingStates.orgs}
              extendOnChange={onChange.clientName}
            />
            {errors.clientName && <span className="form-error">{errors.clientName.message}</span>}
          </div>
        </div>
      )}

      {/* Sub-Org Name - Only for Debit with showClientFields */}
      {isDebit && fieldVisibility.showClientFields && (
        <div className="form-table-row">
          <label className="form-table-label">Sub-Org Name</label>
          <div className="form-table-input">
            <SelectController
              name="subOrgName"
              options={subOrgOptions}
              disabled={!clientName}
              isLoading={loadingStates.subOrgs}
            />
            {!clientName && <span className="lock-icon"><FiLock size={14} /></span>}
          </div>
        </div>
      )}

      {/* Transaction ID */}
      <TransactionTextField name="transactionId" label="Transaction ID" disabled />

      {/* Currency */}
      <div className="form-table-row">
        <label className="form-table-label">Currency <span className="required-asterisk">*</span></label>
        <div className="form-table-input">
          <SelectController
            name="currency"
            options={currencyOptions}
            isLoading={loadingStates.currencies}
            extendOnChange={onChange.currency}
          />
          {errors.currency && <span className="form-error">{errors.currency.message}</span>}
        </div>
      </div>

      {/* Amount */}
      <TransactionCurrencyField name="amount" label="Amount" required />

      {/* Fees */}
      {fieldVisibility.showFees && (
        <TransactionCurrencyField name="fees" label="Fees" tooltip="Transaction fees" />
      )}

      {/* Bank Charges */}
      {fieldVisibility.showBankCharges && (
        <TransactionCurrencyField name="bankCharges" label="Bank Charges" tooltip="Bank processing charges" />
      )}

      {/* GST Amount - Only for Debit */}
      {isDebit && fieldVisibility.showGstAmount && (
        <TransactionCurrencyField name="gstAmount" label="GST Amount" tooltip="Tax Withholding" />
      )}

      {/* Effective Date */}
      <TransactionDateField name="effectiveDate" label="Effective Date" required minDate={minDate} maxDate={maxDate} />

      {/* Bank Details */}
      <div className="form-table-row">
        <label className="form-table-label">
          {bankLabel} {bankOptions.length > 0 && <span className="required-asterisk">*</span>}
        </label>
        <div className="form-table-input">
          <SelectController
            name="bankAccount"
            options={bankOptions}
            isLoading={loadingStates.bankAccounts}
            extendOnChange={onChange.bankAccount}
            placeholder="Select bank account"
          />
          {errors.bankAccount && <span className="form-error">{errors.bankAccount.message}</span>}
        </div>
      </div>

      {/* Description */}
      <TransactionTextField
        name="description"
        label="Description"
        required
        disabled={!fieldVisibility.descriptionEditable}
        fullWidth
      />

      {/* Created Date */}
      <TransactionDateField
        name="createdDate"
        label="Created Date"
        required
        disabled
      />
    </>
  )
}
