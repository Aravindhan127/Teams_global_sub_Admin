// ** MUI Imports
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'

// ** Icons Imports
import MenuIcon from 'mdi-material-ui/Menu'

// ** Components
import Autocomplete from 'src/layouts/components/Autocomplete'
import ModeToggler from 'src/@core/layouts/components/shared-components/ModeToggler'
import UserDropdown from 'src/@core/layouts/components/shared-components/UserDropdown'
import LanguageDropdown from 'src/@core/layouts/components/shared-components/LanguageDropdown'
import NotificationDropdown from 'src/@core/layouts/components/shared-components/NotificationDropdown'
import { Typography } from '@mui/material'
import { useAuth } from 'src/hooks/useAuth'
import { useLocation } from 'react-router-dom'

const pathNameMap = {
  '/dashboard': 'Dashboard',
  '/profile': 'Profile',
  '/edit-clg-profile': 'Edit College Profile',
  '/edit-org-profile': 'Edit Organization Profile',
  '/college-user': 'College Users',
  '/student-list': 'Students',
  '/alumni': 'Alumni',
  '/faculty': 'Faculty',
  '/event': 'Events',
  '/email-campaign': 'Email Campaign',
  '/email-compose': 'Email Compose',
  '/fund-raise': 'Fund Raise',
  '/create-event': 'Event Form',
  '/admin': 'Admin',
  '/lounge': 'Lounge',
  '/view-guest': 'Attendees',
  '/guest-form': 'Guest Form',
  '/poll': 'Polls',
  '/mentorship-management': 'Mentorship Management',
  '/mentorship-request': 'Mentorship Request',
  '/new-campaign': 'New Campaign',
  '/campaign-management': 'Campaign Management',
  '/carrers': 'Careers',
  '/gallery': 'Gallery',
  '/archives': 'Archives',
  '/service-request': 'Service Request',
  '/department': 'Departments & Degree',
  '/chapter': 'Chapter',
  '/roles': 'User Roles',
  '/add-roles': 'Add Role',
  '/permission': 'Permissions',
  '/newsletter': 'Newsletter',
  '/bulk-upload': 'User Invitation',
  '/feedback': 'Feedback',
  '/help': 'Help',
  '/privacy-policy': 'Privacy Policy',
  '/terms-conditions': 'Terms and Condition',
  '/notifications': 'Notifications',
  '/contact-us': 'Contact Us',
  // Add more mappings as needed
  //org pages
  '/organization-user': 'Organization Users'
}

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const { user } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname
  console.log('user', user)

  const getPageTitle = path => {
    const basePath = Object.keys(pathNameMap).find(key => path.startsWith(key))
    return pathNameMap[basePath] || 'Page'
  }
  return (
    <Box sx={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between', py: 2, px: 2 }}>
      <Typography variant='fm-h7' fontWeight={700} color={'#1e3a8a'}>
        {' '}
        {getPageTitle(currentPath)}
      </Typography>
      <Box className='actions-left' sx={{ mr: 2, display: 'flex', alignItems: 'center' }}>
        {hidden ? (
          <IconButton color='inherit' sx={{ ml: -2.75 }} onClick={toggleNavVisibility}>
            <MenuIcon />
          </IconButton>
        ) : null}
        {/* <Autocomplete hidden={hidden} settings={settings} /> */}
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center' }}>
        {/* <LanguageDropdown settings={settings} saveSettings={saveSettings} /> */}
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <NotificationDropdown settings={settings} />
        <UserDropdown settings={settings} />
      </Box>
    </Box>
  )
}

export default AppBarContent
