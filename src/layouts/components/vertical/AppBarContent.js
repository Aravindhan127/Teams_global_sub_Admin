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
  '/carrers': 'Jobopedia',
  '/whatsapp-Business': 'WhatsApp Business',
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
  '/organization-user': 'Members',
}

const AppBarContent = props => {
  // ** Props
  const { hidden, settings, saveSettings, toggleNavVisibility } = props
  const { user } = useAuth()
  const location = useLocation()
  const currentPath = location.pathname

  const getPageTitle = path => {
    const basePath = Object.keys(pathNameMap).find(key => path.startsWith(key))
    return pathNameMap[basePath] || 'Page'
  }

  // Function to get current date in the format shown in the image
  const getCurrentDate = () => {
    const date = new Date()
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' }
    return date.toLocaleDateString('en-US', options)
  }

  return (
    <Box 
      sx={{ 
        width: '100%', 
        display: 'flex', 
        alignItems: 'center', 
        justifyContent: 'space-between', 
        py: 2,
        px: 0, // Remove horizontal padding
        backgroundColor: 'white',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        zIndex: 10,
        
      }}
    >
      <Box sx={{ display: 'flex', flexDirection: 'column', pl: 3 }}> {/* Add left padding only to content */}
        <Typography variant='h4' fontWeight={700} color={'#1e3a8a'} sx={{ lineHeight: 1.2, mb: 0.5 }}>
          {getPageTitle(currentPath)}
        </Typography>
        <Typography variant='body2' color='text.secondary' sx={{ fontSize: '0.875rem' }}>
          {getCurrentDate()}
        </Typography>
      </Box>
      <Box className='actions-right' sx={{ display: 'flex', alignItems: 'center', gap: 1, pr: 3 }}> {/* Add right padding only to content */}
        <ModeToggler settings={settings} saveSettings={saveSettings} />
        <NotificationDropdown settings={settings} />
        <UserDropdown settings={settings} />
        {hidden && (
          <IconButton color='inherit' onClick={toggleNavVisibility} sx={{ ml: 1 }}>
            <MenuIcon />
          </IconButton>
        )}
      </Box>
    </Box>
  )
}

export default AppBarContent