import Box from "@mui/material/Box"
import Typography from "@mui/material/Typography"
import { styled } from '@mui/material/styles'
import ListItemButton from '@mui/material/ListItemButton'
import LogoutIcon from '../../../@core/components/icons/LogoutIcon'
import themeConfig from "../../../configs/themeConfig";
import Translations from "../Translations"
import { useAuth } from "../../../hooks/useAuth"
import { ListItem, ListItemIcon } from "@mui/material"
import UserIcon from "../UserIcon"

// ** Styled Components
const MenuNavLink = styled(ListItemButton)(({ theme }) => ({
  width: '100%',
  borderRadius: 100,
  borderTopRightRadius: 100,
  borderBottomRightRadius: 100,
  color: theme.palette.text.primary,
  transition: 'padding-left .25s ease-in-out',
  backgroundColor: theme.palette.secondary.main,
  '&:hover': {
    boxShadow: theme.shadows[3],
    backgroundColor: theme.palette.secondary.dark,
  },
  '& .MuiTypography-root, & .MuiListItemIcon-root': {
    color: `${theme.palette.common.white} !important`,
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

function AfterVerticalNavMenuContent(props) {

  // ** Hooks
  const auth = useAuth();

  const { settings, navHover, collapsedNavWidth, navigationBorderWidth } = props
  const { navCollapsed } = settings

  return <Box
    className='nav-items'
    sx={{
      transition: 'padding .25s ease',
      '& > :first-of-type': { mt: '0' },
      pr: !navCollapsed || (navCollapsed && navHover) ? 4.5 : 1.25,
      pl: !navCollapsed || (navCollapsed && navHover) ? 4.5 : 1.25,
      pt: !navCollapsed || (navCollapsed && navHover) ? 4.5 : 1.25,
      pb: !navCollapsed || (navCollapsed && navHover) ? 4.5 : 1.25,
    }}
  >
    <ListItem
      disablePadding
      className='nav-link'
      sx={{ mt: 1.5, px: '0 !important' }}
    >
      {/* <MenuNavLink
        onClick={(e) => {
          auth.logout()
        }}
        sx={{
          py: 2.25,
          cursor: 'pointer',
          pl: navCollapsed && !navHover ? (collapsedNavWidth - navigationBorderWidth - 24) / 8 : 5.5,
          pr: navCollapsed && !navHover ? ((collapsedNavWidth - navigationBorderWidth - 24) / 2 - 5) / 4 : 3.5
        }}
      >
        <ListItemIcon
          sx={{
            color: 'text.primary',
            transition: 'margin .25s ease-in-out',
            ...(navCollapsed && !navHover ? { mr: 0 } : { mr: 2.5 }),
          }}
        >
          <UserIcon
            icon={LogoutIcon}
            componentType='vertical-menu'
            iconProps={{
              sx: {
                fontSize: '1.5rem',
              }
            }}
          />
        </ListItemIcon>

        <MenuItemTextMetaWrapper
          sx={{
            ...(navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 })
          }}
        >
          <Typography
            {...((themeConfig.menuTextTruncate || (!themeConfig.menuTextTruncate && navCollapsed && !navHover)) && {
              noWrap: true
            })}
          >
            <Translations text={"Logout"} />
          </Typography>
        </MenuItemTextMetaWrapper>
      </MenuNavLink> */}
    </ListItem>
  </Box>
}

export default AfterVerticalNavMenuContent
