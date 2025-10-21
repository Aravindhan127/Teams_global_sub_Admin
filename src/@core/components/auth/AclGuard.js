// ** React Imports
import { useEffect, useState } from 'react'

import { useLocation, useNavigate } from 'react-router-dom'

// ** Context Imports
import { AbilityContext } from 'src/layouts/components/acl/Can'

// ** Config Import
import { buildAbilityFor } from 'src/configs/acl'
import authConfig from 'src/configs/auth'

// ** Component Import
import NotAuthorized from 'src/pages/401'
import BlankLayout from 'src/@core/layouts/BlankLayout'

// ** Hooks
import { useAuth } from 'src/hooks/useAuth'

const AclGuard = props => {
  // ** Props
  const { aclAbilities, children, guestGuard } = props
  const [ability, setAbility] = useState(undefined)

  // ** Hooks
  const auth = useAuth()
  const location = useLocation()
  const navigate = useNavigate()

  useEffect(
    () => {
      if (!(guestGuard || location.pathname === '/404' || location.pathname === '/500' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname === '/create-password')) {
        const currentPath = location.pathname + location.search + location.hash
        if (auth.user === null && !window.localStorage.getItem(authConfig.storageUserDataKeyName)) {
          if (currentPath !== '/') {
            navigate(`/login?redirect=${currentPath}`)
          } else {
            navigate('/login')
          }
        }
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  // If guestGuard is true and user is not logged in or its an error page, render the page without checking access
  if (guestGuard || location.pathname === '/404' || location.pathname === '/500' || location.pathname === '/login' || location.pathname === '/register' || location.pathname === '/forgot-password' || location.pathname === '/create-password') {
    return <>{children}</>
  }

  // User is logged in, build ability for the user based on his role
  if (auth.user && auth.user && !ability) {
    setAbility(buildAbilityFor(auth.user.role, aclAbilities.subject))
  }

  // Check the access of current user and render pages
  if (ability && ability.can(aclAbilities.action, aclAbilities.subject)) {
    return <AbilityContext.Provider value={ability}>{children}</AbilityContext.Provider>
  }

  // Render Not Authorized component if the current user has limited access
  return (
    <BlankLayout>
      {/* <NotAuthorized /> */}
    </BlankLayout>
  )
}

export default AclGuard
