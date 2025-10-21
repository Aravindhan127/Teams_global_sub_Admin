import useMediaQuery from '@mui/material/useMediaQuery'

// ** Layout Imports
// !Do not remove this Layout import
import Layout from 'src/@core/layouts/Layout'

// ** Navigation Imports
import VerticalNavItems from 'src/navigation/vertical'
import HorizontalNavItems from 'src/navigation/horizontal'

// ** Component Import
// Uncomment the below line (according to the layout type) when using server-side menu
// import ServerSideVerticalNavItems from './components/vertical/ServerSideNavItems'
// import ServerSideHorizontalNavItems from './components/horizontal/ServerSideNavItems'

import VerticalAppBarContent from './components/vertical/AppBarContent'
import HorizontalAppBarContent from './components/horizontal/AppBarContent'

// ** Hook Import
import { useSettings } from 'src/@core/hooks/useSettings'
import AfterVerticalNavMenuContent from './components/vertical/AfterVerticalNavMenuContent'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import { ApiEndPoints } from 'src/network/endpoints'
import { axiosInstance } from 'src/network/adapter'
import { toastError } from 'src/utils/utils'

const UserLayout = ({ children }) => {
  // ** Hooks
  const { rolePremission, user, isMasterAdmin } = useAuth()
  const { settings, saveSettings } = useSettings()
  const [loading, setLoading] = useState(false)
  const [allPermission, setAllPermission] = useState([])
  /**
   *  The below variable will hide the current layout menu at given screen size.
   *  The menu will be accessible from the Hamburger icon only (Vertical Overlay Menu).
   *  You can change the screen size from which you want to hide the current layout menu.
   *  Please refer useMediaQuery() hook: https://mui.com/material-ui/react-use-media-query/,
   *  to know more about what values can be passed to this hook.
   *  ! Do not change this value unless you know what you are doing. It can break the template.
   */
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'))
  const fetchAllPermissionData = () => {
    setLoading(true)

    axiosInstance
      .get(ApiEndPoints.PERMISSION.getPermissions + `?type='all'`)
      .then(response => {
        setAllPermission(response.data.data.permissions)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    fetchAllPermissionData()
  }, [])


  const getAccessibleNavItems = navItems => {
    if (!rolePremission) return [];
    const userType = user?.orgDetails?.orgType;

    // SuperAdmin has access to all items
    if (isMasterAdmin === 'true') {
      return navItems;
    }

    const permissions = rolePremission?.permissions.map(p => p.permissionName) || [];

    const filterNavItems = items => {
      return items
        ?.map(item => {
          // Only include items where the type matches the userType and the permission exists
          if (
            (!item.type || item.type === userType) && // Match type or allow items without type
            (!item.permission || permissions.includes(item.permission)) // Match permission or allow items without permission
          ) {
            return {
              ...item,
              children: item.children ? filterNavItems(item.children) : undefined // Recursively filter children
            };
          }

          return null; // Exclude items that do not match
        })
        .filter(Boolean); // Remove null items
    };

    return filterNavItems(navItems);
  };


  console.log("rolePremission", rolePremission);
  console.log("aa", user);
  console.log("allPermission", allPermission);
  return (
    <Layout
      hidden={hidden}
      settings={settings}
      saveSettings={saveSettings}
      {...(settings.layout === 'horizontal'
        ? {
          // ** Navigation Items
          horizontalNavItems: HorizontalNavItems(),

          // Uncomment the below line when using server-side menu in horizontal layout and comment the above line
          // horizontalNavItems: ServerSideHorizontalNavItems(),
          // ** AppBar Content
          horizontalAppBarContent: () => (
            <HorizontalAppBarContent hidden={hidden} settings={settings} saveSettings={saveSettings} />
          )
        }
        : {
          // ** Navigation Items
          verticalNavItems: getAccessibleNavItems(VerticalNavItems()),
          afterVerticalNavMenuContent: AfterVerticalNavMenuContent,

          // Uncomment the below line when using server-side menu in vertical layout and comment the above line
          // verticalNavItems: ServerSideVerticalNavItems(),
          // ** AppBar Content
          verticalAppBarContent: props => (
            <VerticalAppBarContent
              hidden={hidden}
              settings={settings}
              saveSettings={saveSettings}
              toggleNavVisibility={props.toggleNavVisibility}
            />
          )
        })}
    >
      {children}
    </Layout>
  )
}

export default UserLayout
