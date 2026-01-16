import { useState, useEffect } from 'react'
import { FiSearch } from 'react-icons/fi'
import { useParams } from '../../hooks/useParams' 


interface SearchBarProps {
  placeholder?: string
  isFetching?: boolean
}

export default function SearchBar({ placeholder = 'Search...'}: SearchBarProps) {
  const { params, debouncedUpdate } = useParams({ search: '' })
  const [inputValue, setInputValue] = useState(params.search)

  useEffect(() => {
    setInputValue(params.search)
  }, [params.search])

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = e.target.value
    setInputValue(val)
    debouncedUpdate({ search: val }, 500)
  }

  return (
    <div className="search-input-wrapper" style={{ position: 'relative', width: '100%' }}>
      <FiSearch 
        style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#999' }} 
      />
      
      <input
        type="text"
        placeholder={placeholder}
        value={inputValue}
        onChange={handleChange}
        className="search-input"
        style={{ 
          padding: '8px 40px', 
          width: '100%',
          borderRadius: '4px',
          border: '1px solid #ddd'
        }}
      />
    </div>
  )
}