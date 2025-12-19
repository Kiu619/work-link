import { debounce } from 'lodash'
import { useCallback, useEffect, useMemo, useState } from 'react'

/**
 * Hook để debounce một giá trị
 * @param value - Giá trị cần debounce
 * @param delay - Thời gian delay (ms)
 * @returns Giá trị đã được debounce
 * 
 * @example
 * const [searchText, setSearchText] = useState('')
 * const debouncedSearch = useDebouncedValue(searchText, 500)
 * 
 * useEffect(() => {
 *   // Gọi API với debouncedSearch
 *   fetchData(debouncedSearch)
 * }, [debouncedSearch])
 */
export function useDebouncedValue<T>(value: T, delay: number = 500): T {
  const [debouncedValue, setDebouncedValue] = useState<T>(value)

  useEffect(() => {
    const handler = setTimeout(() => {
      setDebouncedValue(value)
    }, delay)

    return () => {
      clearTimeout(handler)
    }
  }, [value, delay])

  return debouncedValue
}

/**
 * Hook để debounce một callback function
 * @param callback - Function cần debounce
 * @param delay - Thời gian delay (ms)
 * @returns Function đã được debounce
 * 
 * @example
 * const debouncedSearch = useDebouncedCallback((query: string) => {
 *   fetchSearchResults(query)
 * }, 500)
 * 
 * const handleChange = (e) => {
 *   setSearchText(e.target.value)
 *   debouncedSearch(e.target.value)
 * }
 */
export function useDebouncedCallback<T extends (...args: never[]) => void>(
  callback: T,
  delay: number = 500
): (...args: Parameters<T>) => void {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedFn = useMemo(() => debounce(callback, delay), [delay])

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      debouncedFn.cancel()
    }
  }, [debouncedFn])

  // Wrap để cập nhật callback mới nhất
  const stableCallback = useCallback(
    (...args: Parameters<T>) => {
      debouncedFn(...args)
    },
    [debouncedFn]
  )

  return stableCallback
}

/**
 * Hook để debounce state với setter
 * @param initialValue - Giá trị khởi tạo
 * @param delay - Thời gian delay (ms)
 * @returns [debouncedValue, setValue, immediateValue]
 * 
 * @example
 * const [debouncedQuery, setQuery, immediateQuery] = useDebouncedState('', 500)
 * 
 * // immediateQuery: cập nhật ngay khi user gõ (hiển thị trong input)
 * // debouncedQuery: cập nhật sau 500ms (dùng để gọi API)
 */
export function useDebouncedState<T>(
  initialValue: T,
  delay: number = 500
): [T, (value: T) => void, T] {
  const [immediateValue, setImmediateValue] = useState<T>(initialValue)
  const [debouncedValue, setDebouncedValue] = useState<T>(initialValue)

  const debouncedSetValue = useMemo(
    () => debounce((value: T) => setDebouncedValue(value), delay),
    [delay]
  )

  const setValue = useCallback(
    (value: T) => {
      setImmediateValue(value)
      debouncedSetValue(value)
    },
    [debouncedSetValue]
  )

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      debouncedSetValue.cancel()
    }
  }, [debouncedSetValue])

  return [debouncedValue, setValue, immediateValue]
}

// Export default hook phổ biến nhất
export default useDebouncedCallback
