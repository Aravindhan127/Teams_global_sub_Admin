// ** Next Imports
import { NavLink, useLocation, useSearchParams } from 'react-router-dom'

// ** MUI Imports
import Chip from '@mui/material/Chip'
import ListItem from '@mui/material/ListItem'
import Typography from '@mui/material/Typography'
import Box from '@mui/material/Box'
import ListItemIcon from '@mui/material/ListItemIcon'
import { styled, useTheme } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'

// ** Configs Import
import themeConfig from 'src/configs/themeConfig'

// ** Custom Components Imports
import UserIcon from 'src/layouts/components/UserIcon'
import Translations from 'src/layouts/components/Translations'
import CanViewNavLink from 'src/layouts/components/acl/CanViewNavLink'

// ** Utils
import { handleURLQueries } from 'src/@core/layouts/utils'
import { useAuth } from 'src/hooks/useAuth'
import { useEffect } from 'react'

// ** Styled Components ->>>  Drawer child tab css
const MenuNavLink = styled(ListItemButton)(({ theme, item }) => ({
  width: '100%',
  borderRadius: 10, // Reduced border radius
  borderTopRightRadius: 10, // Reduced border radius
  borderBottomRightRadius: 10, // Reduced border radius
  color: theme.palette.text.primary,
  transition: 'padding-left .25s ease-in-out',
  '&.active': {
    '&, &:hover': {
      boxShadow: theme.shadows[3],
      // Single color background
      backgroundColor: item?.hasChild === false ? '#121280' : '#121280',
      color: theme.palette.primary.contrastText,
      '&:hover': {
        backgroundColor: item?.hasChild === false ? '#121280' : '#121280'
      }
    },
    '& .MuiTypography-root, & .MuiListItemIcon-root': {
      color: item?.hasChild === false ? '#ffffffff' : '#ffffffde'
    }
  }
}))

const MenuItemTextMetaWrapper = styled(Box)({
  width: '100%',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  transition: 'opacity .25s ease-in-out',

  ...(themeConfig.menuTextTruncate && { overflow: 'hidden' })
})

const VerticalNavLink = ({
  item,
  parent,
  navHover,
  settings,
  navVisible,
  isSubToSub,
  collapsedNavWidth,
  toggleNavVisibility,
  navigationBorderWidth
}) => {
  // ** Hooks
  const theme = useTheme()
  const location = useLocation()
  const [searchParams] = useSearchParams()
  const { user, isCompletedProfile } = useAuth()
  const type = window.localStorage.getItem('loginType')
  // ** Vars
  const { skin, navCollapsed } = settings
  const IconTag = parent && !item.icon ? themeConfig.navSubItemIcon : item.icon
  console.log('item', item?.hasChild)
  const conditionalBgColor = () => {
    if (skin === 'semi-dark' && theme.palette.mode === 'light') {
      return {
        color: `rgba(${theme.palette.customColors.dark}, 0.87)`,
        '&:hover': {
          backgroundColor: `rgba(${theme.palette.customColors.dark}, 0.04)`
        }
      }
    } else if (skin === 'semi-dark' && theme.palette.mode === 'dark') {
      return {
        color: `rgba(${theme.palette.customColors.light}, 0.87)`,
        '&:hover': {
          backgroundColor: `rgba(${theme.palette.customColors.light}, 0.04)`
        }
      }
    } else return {}
  }

  const isNavLinkActive = () => {
    if (location.pathname === item.path || handleURLQueries({ ...location, query: searchParams }, item.path)) {
      return true
    } else {
      return false
    }
  }

  // if (
  //   (item.type === "college" && type !== "college") ||
  //   (item.type === "organisation" && type !== "organisation")
  // ) {
  //   return null; // Don't render the list item if the condition fails
  // }
  console.log('isCompletedProfile', isCompletedProfile)

  return (
    <CanViewNavLink navLink={item}>
      <ListItem
        disablePadding
        className='nav-link'
        // disabled={isCompletedProfile === false}
        sx={{
          mt: 3.5,
          px: '0 !important',
          ...(isCompletedProfile === false ? { pointerEvents: 'none', opacity: 0.5 } : {})
        }}
      >
        {/* <Link to={item.path === undefined ? '/' : `${item.path}`}> */}
        <MenuNavLink
          to={item.path === undefined ? '/' : item.path}
          item={item}
          // item.type
          //   ? (item.type === "college" && type === "college") ||
          //     (item.type === "organisation" && type === "organisation")
          //     ? item.type === "college"
          //       ? "/college-user"
          //       : "/organization-user"
          //     : null
          //   : item.path}
          component={NavLink}
          className={isNavLinkActive() ? 'active' : ''}
          {...(item.openInNewTab ? { target: '_blank' } : null)}
          onClick={e => {
            if (item.path === undefined) {
              e.preventDefault()
              e.stopPropagation()
            }
            if (navVisible) {
              toggleNavVisibility()
            }
          }}
          sx={{
            py: 2.25,
            ...conditionalBgColor(),
            ...(item.disabled ? { pointerEvents: 'none' } : { cursor: 'pointer' }),
            pl: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 24) / 8 : 5.5,
            pr: navCollapsed && !navHover ? ((collapsedNavWidth - navigationBorderWidth - 24) / 2 - 5) / 4 : 3.5
          }}
        >
          {isSubToSub ? null : (
            <ListItemIcon
              sx={{
                color: 'text.primary',
                transition: 'margin .25s ease-in-out',
                ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2.5 }),
                ...(parent ? { ml: 1.25, mr: 3.75 } : {}) // This line should be after (navCollapsed && !navHover) condition for proper styling
              }}
            >
              <UserIcon
                icon={IconTag}
                componentType='vertical-menu'
                iconProps={{
                  sx: {
                    fontSize: '0.875rem',
                    ...(!parent ? { fontSize: '1.5rem' } : {}),
                    ...(parent && item.icon ? { fontSize: '0.875rem' } : {})
                  }
                }}
              />
            </ListItemIcon>
          )}

          <MenuItemTextMetaWrapper
            sx={{
              ...(isSubToSub ? { ml: 9 } : {}),
              ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
            }}
          >
            <Typography
              {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
                noWrap: true
              })}
            >
              <Translations
                text={item.title}
                // text={
                //   item.type
                //     ? (item.type === "college" && type === "college") ||
                //       (item.type === "organisation" && type === "organisation")
                //       ? item.type === "college"
                //         ? "College"
                //         : "Organization"
                //       : null
                //     : item.title
                // }
              />
            </Typography>
            {item.badgeContent ? (
              <Chip
                label={item.badgeContent}
                color={item.badgeColor || 'primary'}
                sx={{
                  ml: 1.25,
                  height: 20,
                  fontWeight: 500,
                  '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                }}
              />
            ) : null}
          </MenuItemTextMetaWrapper>
        </MenuNavLink>
        {/* </Link> */}
      </ListItem>
    </CanViewNavLink>
  )
}

export default VerticalNavLink
