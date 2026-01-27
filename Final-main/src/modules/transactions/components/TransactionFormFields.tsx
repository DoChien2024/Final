// import { type FieldVisibility } from '../constants'
// import type { TransactionOptions, LoadingStates } from '../types'

// // Import 3 Form riêng biệt
// import { TransactionDetailsForm } from './form/TransactionDetailsForm'
// import { DocumentAttachmentForm } from './form/DocumentAttachmentForm'
// import { InternalCommentsForm } from './form/InternalCommentsForm'

// interface SelectOption {
//   label: string
//   value: string
// }

// interface TransactionFormFieldsProps {
//   transactionTypeOptions: SelectOption[]
//   options: TransactionOptions
//   loadingStates: LoadingStates
//   fieldVisibility: FieldVisibility
//   minDate: Date
//   maxDate: Date
//   watchedValues: {
//     transactionType: string
//     clientName: string
//     currency: string
//   }
//   type: 'Debit' | 'Credit'
// }

// export function TransactionFormFields({
//   transactionTypeOptions,
//   options,
//   loadingStates,
//   fieldVisibility,
//   minDate,
//   maxDate,
//   watchedValues,
//   type,
// }: TransactionFormFieldsProps) {
//   const hasSelectedType = !!watchedValues.transactionType

//   return (
//     <div className="transaction-form-fields">
//       <TransactionDetailsForm
//         transactionTypeOptions={transactionTypeOptions}
//         options={options}
//         loadingStates={loadingStates}
//         fieldVisibility={fieldVisibility}
//         minDate={minDate}
//         maxDate={maxDate}
//         watchedValues={watchedValues}
//         showAllFields={hasSelectedType}
//         type={type}
//       />
//       <DocumentAttachmentForm defaultOpen={hasSelectedType} />
//       <InternalCommentsForm defaultOpen={hasSelectedType} />
//     </div>
//   )
// }