// ** React Imports
import { useEffect } from 'react'

// ** Next Imports
import { useNavigate } from 'react-router-dom'

// ** Hooks Import
import { useAuth } from 'src/hooks/useAuth'

// ** Config
import authConfig from 'src/configs/auth'

const GuestGuard = props => {
  const { children, fallback } = props
  const auth = useAuth()
  const navigate = useNavigate()
  useEffect(() => {
    if (window.localStorage.getItem(authConfig.storageUserDataKeyName)) {
      navigate('/')
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])
  if (auth.loading) {
    return fallback
  }

  return <>{children}</>
}

export default GuestGuard
