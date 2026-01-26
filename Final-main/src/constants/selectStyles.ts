import type { StylesConfig } from 'react-select'

export interface SelectOption {
  value: string
  label: string
}

export const customSelectStyles: StylesConfig<SelectOption, false> = {
  control: (base, state) => ({
    ...base,
    padding: '2px 6px',
    border: '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '38px',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(94, 53, 177, 0.1)' : 'none',
    borderColor: state.isFocused ? '#5e35b1' : '#e0e0e0',
    '&:hover': {
      borderColor: state.isFocused ? '#5e35b1' : '#e0e0e0',
    },
    cursor: 'pointer',
  }),
  placeholder: (base) => ({
    ...base,
    color: '#bdbdbd',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#5e35b1' : state.isFocused ? '#ede9fe' : 'white',
    color: state.isSelected ? 'white' : '#212121',
    cursor: 'pointer',
    padding: '10px 12px',
    transition: 'background-color 0.15s ease',
    '&:hover': {
      backgroundColor: state.isSelected ? '#5e35b1' : '#ede9fe',
    },
    '&:active': {
      backgroundColor: '#5e35b1',
      color: 'white',
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 9999,
    overflow: 'visible',
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: '250px',
    padding: '4px 0',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
  singleValue: (base) => ({
    ...base,
    color: '#212121',
  }),
}
// Function to get select styles with error state
export const getSelectStyles = (hasError: boolean = false): StylesConfig<SelectOption, false> => ({
  ...customSelectStyles,
  control: (base, state) => ({
    ...base,
    padding: '2px 6px',
    border: hasError ? '1px solid #dc3545' : '1px solid #e0e0e0',
    borderRadius: '6px',
    fontSize: '14px',
    minHeight: '38px',
    boxShadow: state.isFocused ? '0 0 0 3px rgba(94, 53, 177, 0.1)' : 'none',
    borderColor: hasError ? '#dc3545' : (state.isFocused ? '#5e35b1' : '#e0e0e0'),
    '&:hover': {
      borderColor: hasError ? '#dc3545' : (state.isFocused ? '#5e35b1' : '#e0e0e0'),
    },
    cursor: 'pointer',
  }),
  option: (base, state) => ({
    ...base,
    backgroundColor: state.isSelected ? '#5e35b1' : state.isFocused ? '#ede9fe' : 'white',
    color: state.isSelected ? 'white' : '#212121',
    cursor: 'pointer',
    padding: '10px 12px',
    transition: 'background-color 0.15s ease',
    '&:hover': {
      backgroundColor: state.isSelected ? '#5e35b1' : '#ede9fe',
    },
    '&:active': {
      backgroundColor: '#5e35b1',
      color: 'white',
    },
  }),
  menu: (base) => ({
    ...base,
    borderRadius: '8px',
    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    zIndex: 9999,
    overflow: 'visible',
  }),
  menuList: (base) => ({
    ...base,
    maxHeight: '250px',
    padding: '4px 0',
  }),
  menuPortal: (base) => ({
    ...base,
    zIndex: 9999,
  }),
})