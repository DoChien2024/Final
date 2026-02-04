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
import { ReadOnlyField } from '../form/ReadOnlyField'

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
    type,
    mode
  } = useTransactionFormContext()
  
  const isReadOnly = !!mode

  const { orgOptions, subOrgOptions, currencyOptions, bankOptions } = formattedOptions

  const bankLabel = getBankLabel(fieldVisibility.bankDirection)
  const isDebit = type === 'Debit'

  return (
    <>
      {/* Client Name - Only for Debit with showClientFields */}
      {isDebit && fieldVisibility.showClientFields && (
        isReadOnly ? (
          <ReadOnlyField name="clientName" label="Client Name" type="select" options={orgOptions} />
        ) : (
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
        )
      )}

      {/* Sub-Org Name - Only for Debit with showClientFields */}
      {isDebit && fieldVisibility.showClientFields && (
        isReadOnly ? (
          <ReadOnlyField name="subOrgName" label="Sub-Org Name" type="select" options={subOrgOptions} />
        ) : (
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
        )
      )}

      {/* Transaction ID */}
      <ReadOnlyField name="transactionId" label="Transaction ID" />

      {/* Currency */}
      {isReadOnly ? (
        <ReadOnlyField name="currency" label="Currency" type="select" options={currencyOptions} />
      ) : (
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
      )}

      {/* Amount */}
      {isReadOnly ? (
        <ReadOnlyField name="amount" label="Amount" type="currency" />
      ) : (
        <TransactionCurrencyField name="amount" label="Amount" required />
      )}

      {/* Fees */}
      {fieldVisibility.showFees && (
        isReadOnly ? (
          <ReadOnlyField name="fees" label="Fees" type="currency" />
        ) : (
          <TransactionCurrencyField name="fees" label="Fees" tooltip="Transaction fees" />
        )
      )}

      {/* Bank Charges */}
      {fieldVisibility.showBankCharges && (
        isReadOnly ? (
          <ReadOnlyField name="bankCharges" label="Bank Charges" type="currency" />
        ) : (
          <TransactionCurrencyField name="bankCharges" label="Bank Charges" tooltip="Bank processing charges" />
        )
      )}

      {/* GST Amount - Only for Debit */}
      {isDebit && fieldVisibility.showGstAmount && (
        isReadOnly ? (
          <ReadOnlyField name="gstAmount" label="GST Amount" type="currency" />
        ) : (
          <TransactionCurrencyField name="gstAmount" label="GST Amount" tooltip="Tax Withholding" />
        )
      )}

      {/* Effective Date */}
      {isReadOnly ? (
        <ReadOnlyField name="effectiveDate" label="Effective Date" type="date" />
      ) : (
        <TransactionDateField name="effectiveDate" label="Effective Date" required minDate={minDate} maxDate={maxDate} />
      )}

      {/* Bank Details */}
      {isReadOnly ? (
        <ReadOnlyField name="bankAccount" label={bankLabel} type="select" options={bankOptions} />
      ) : (
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
      )}

      {/* Description */}
      {isReadOnly ? (
        <ReadOnlyField name="description" label="Description" />
      ) : (
        <TransactionTextField
          name="description"
          label="Description"
          required
          disabled={!fieldVisibility.descriptionEditable}
          fullWidth
        />
      )}

      {/* Created Date */}
      {isReadOnly ? (
        <ReadOnlyField name="createdDate" label="Created Date" type="date" />
      ) : (
        <TransactionDateField
          name="createdDate"
          label="Created Date"
          required
          disabled
        />
      )}
    </>
  )
}
