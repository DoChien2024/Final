import { useSearchParams } from 'react-router-dom'
import { useMemo, useCallback, useRef } from 'react'

export function useParams<T extends Record<string, string | number>>(
  defaultValues: T
) {
  const [searchParams, setSearchParams] = useSearchParams()
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null)

  // Parse params from URL with type safety
  const params = Object.keys(defaultValues).reduce((acc, key) => {
    const value = searchParams.get(key)
    const defaultValue = defaultValues[key]

    if (typeof defaultValue === 'number') {
      acc[key] = value ? Number(value) || defaultValue : defaultValue
    } else {
      acc[key] = value || defaultValue
    }

    return acc
  }, {} as Record<string, string | number>) as T

  // Update params to URL
  const updateParams = useCallback((newParams: Partial<T>) => {
    const updatedParams: Record<string, string> = {}

    Object.keys(defaultValues).forEach(key => {
      const value = key in newParams ? newParams[key] : params[key]
      updatedParams[key] = String(value)
    })

    setSearchParams(updatedParams)
  }, [defaultValues, params, setSearchParams])

  // Reset params to default values
  const resetParams = useCallback(() => {
    const defaultParams: Record<string, string> = {}
    
    Object.keys(defaultValues).forEach(key => {
      defaultParams[key] = String(defaultValues[key])
    })

    setSearchParams(defaultParams)
  }, [defaultValues, setSearchParams])

  // Remove a specific param (revert to default)
  const removeParam = useCallback((key: keyof T) => {
    const updatedParams: Record<string, string> = {}

    Object.keys(defaultValues).forEach(k => {
      if (k === key) {
        updatedParams[k] = String(defaultValues[k])
      } else {
        updatedParams[k] = String(params[k as keyof T])
      }
    })

    setSearchParams(updatedParams)
  }, [defaultValues, params, setSearchParams])

  // Debounced update (useful for search inputs)
  const debouncedUpdate = useCallback((newParams: Partial<T>, delay: number = 300) => {
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    debounceTimerRef.current = setTimeout(() => {
      updateParams(newParams)
    }, delay)
  }, [updateParams])

  // Cleanup debounce timer on unmount
  useMemo(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current)
      }
    }
  }, [])

  return {
    params,
    updateParams,
    resetParams,
    removeParam,
    debouncedUpdate,
  }
}
