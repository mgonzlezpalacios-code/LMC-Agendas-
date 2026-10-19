import { useEffect, useState } from 'react'

// Estado persistido en LocalStorage. Si el almacenamiento no está disponible
// (modo privado, cuota llena) la app sigue funcionando en memoria.
export function useLocalStorage(key, initialValue) {
  const [value, setValue] = useState(() => {
    try {
      const raw = window.localStorage.getItem(key)
      return raw === null ? initialValue : JSON.parse(raw)
    } catch {
      return initialValue
    }
  })

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* sin persistencia */
    }
  }, [key, value])

  return [value, setValue]
}
