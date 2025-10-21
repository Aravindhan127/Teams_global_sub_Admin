// ** Next Import
import { NavLink } from 'react-router-dom'

// ** MUI Imports
import IconButton from '@mui/material/IconButton'
import Box from '@mui/material/Box'
import { styled, useTheme } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons
import Close from 'mdi-material-ui/Close'
import CircleOutline from 'mdi-material-ui/CircleOutline'
import RecordCircleOutline from 'mdi-material-ui/RecordCircleOutline'

// ** Configs
import themeConfig from 'src/configs/themeConfig'
import Logo from '../../../../../assets/images/Logo.svg'
import { useAuth } from 'src/hooks/useAuth'

// ** Styled Components
const MenuHeaderWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  paddingRight: theme.spacing(4.5),
  transition: 'padding .25s ease-in-out',
  paddingBottom: '16px',
  paddingTop: '16px',
  borderBottom: '1px solid #F0F0F0',
  position: 'sticky',
  top: 0,
  zIndex: 1100,
  backgroundColor: '#FFFFFF'
}))

const StyledLink = styled('div')({
  display: 'flex',
  alignItems: 'center',
  textDecoration: 'none'
})

const VerticalNavHeader = props => {
  // ** Props
  const {
    hidden,
    navHover,
    settings,
    saveSettings,
    collapsedNavWidth,
    toggleNavVisibility,
    navigationBorderWidth,
    menuLockedIcon: userMenuLockedIcon,
    menuUnlockedIcon: userMenuUnlockedIcon,
    verticalNavMenuBranding: userVerticalNavMenuBranding
  } = props

  // ** Hooks & Vars
  const theme = useTheme()
  const { user } = useAuth()
  const { navCollapsed } = settings
  const menuCollapsedStyles = navCollapsed && !navHover ? { opacity: 0 } : { opacity: 1 }

  const menuHeaderPaddingLeft = () => {
    if (navCollapsed && !navHover) {
      if (userVerticalNavMenuBranding) {
        return 0
      } else {
        return (collapsedNavWidth - navigationBorderWidth - 30) / 8
      }
    } else {
      return 6
    }
  }

  return (
    <MenuHeaderWrapper className='nav-header' sx={{ pl: menuHeaderPaddingLeft() }}>
      {userVerticalNavMenuBranding ? (
        userVerticalNavMenuBranding(props)
      ) : (
        <NavLink to='/' style={{ textDecoration: 'none' }}>
          <StyledLink>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
              <Box
                sx={{
                  height: '140px',
                  maxHeight: '120px',
                  mt: 2,
                  mb: 5
                }}
              >
                <img
                  src={user?.orgDetails.logo || Logo}
                  onError={e => {
                    e.target.onerror = null
                    e.target.src = Logo
                  }}
                  style={{
                    width: '100%',
                    height: '100%',
                    objectFit: 'contain'
                  }}
                  alt='Organization Logo'
                />
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  mb: 2
                }}
              >
                <Typography variant='h6' fontWeight={600} color={'#121280'} fontSize={'1rem'}>
                  {user?.orgDetails?.orgName || 'OUR TEAMS GLOBAL'}
                </Typography>
              </Box>
            </Box>
          </StyledLink>
        </NavLink>
      )}
    </MenuHeaderWrapper>
  )
}

export default VerticalNavHeader
