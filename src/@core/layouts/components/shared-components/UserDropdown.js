// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Import
import { useNavigate } from 'react-router-dom'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Badge from '@mui/material/Badge'
import Avatar from '@mui/material/Avatar'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import CogOutline from 'mdi-material-ui/CogOutline'
import CurrencyUsd from 'mdi-material-ui/CurrencyUsd'
import EmailOutline from 'mdi-material-ui/EmailOutline'
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import AccountOutline from 'mdi-material-ui/AccountOutline'
import MessageOutline from 'mdi-material-ui/MessageOutline'
import HelpCircleOutline from 'mdi-material-ui/HelpCircleOutline'
import UserIcon from '../../../../assets/images/user.png'
import KeyIcon from '@mui/icons-material/Key';
// ** Context
import { useAuth } from 'src/hooks/useAuth'
import DialogChangePassword from 'src/views/dialog/DialogChangePassword'

// ** Styled Components
const BadgeContentSpan = styled('span')(({ theme }) => ({
  width: 8,
  height: 8,
  borderRadius: '50%',
  backgroundColor: theme.palette.success.main,
  boxShadow: `0 0 0 2px ${theme.palette.background.paper}`
}))

const UserDropdown = props => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false);

  // ** Hooks
  const navigate = useNavigate()
  const { logout, user } = useAuth()
  console.log("user", user)
  // ** Vars
  const { direction } = settings

  const toggleChangePasswordDialog = () => {
    handleDropdownClose();
    setOpenChangePasswordDialog(!openChangePasswordDialog);
  };
  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      navigate(url)
    }
    setAnchorEl(null)
  }

  const styles = {
    py: 2,
    px: 4,
    width: '100%',
    display: 'flex',
    alignItems: 'center',
    color: 'text.primary',
    textDecoration: 'none',
    '& svg': {
      fontSize: '1.375rem',
      color: 'text.secondary'
    }
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <Badge
        overlap='circular'
        onClick={handleDropdownOpen}
        sx={{ ml: 2, cursor: 'pointer' }}
        badgeContent={<BadgeContentSpan />}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
      >
        <Avatar
          alt=''
          onClick={handleDropdownOpen}
          sx={{ width: 40, height: 40 }}
          src={UserIcon}
        />
      </Badge>
      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={() => handleDropdownClose()}
        sx={{ '& .MuiMenu-paper': { width: 230, mt: 4 } }}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <Box sx={{ pt: 2, pb: 3, px: 4 }}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Badge
              overlap='circular'
              badgeContent={<BadgeContentSpan />}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
            >
              <Avatar alt='' src={UserIcon} sx={{ width: '2.5rem', height: '2.5rem' }} />
            </Badge>
            <Box sx={{ display: 'flex', ml: 3, alignItems: 'flex-start', flexDirection: 'column' }}>
              <Typography sx={{ fontWeight: 600, textTransform: "capitalize" }}>
                {user?.firstName} {user?.lastName}
              </Typography>
              <Typography
                variant='body2'
                sx={{
                  fontSize: '0.8rem',
                  color: 'text.disabled',
                  textTransform: 'capitalize',
                  wordBreak: 'break-word', // Ensures long text wraps to the next line
                  overflow: 'hidden',      // Hides any overflow
                  textOverflow: 'ellipsis' // Adds "..." if the text overflows
                }}
              >
                {user?.userEmail}
              </Typography>
            </Box>
          </Box>
        </Box>
        <Divider sx={{ mt: 0, mb: 1 }} />
        <MenuItem
          sx={{ py: 2 }}
          onClick={toggleChangePasswordDialog}
        >
          <KeyIcon sx={{ mr: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Change Password
        </MenuItem>
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/profile')}>
          <Box sx={styles}>
            <AccountOutline sx={{ mr: 2 }} />
            Profile
          </Box>
        </MenuItem> */}
        {/* <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/apps/email')}>
          <Box sx={styles}>
            <EmailOutline sx={{ mr: 2 }} />
            Inbox
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/apps/chat')}>
          <Box sx={styles}>
            <MessageOutline sx={{ mr: 2 }} />
            Chat
          </Box>
        </MenuItem>
        <Divider />
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/account-settings')}>
          <Box sx={styles}>
            <CogOutline sx={{ mr: 2 }} />
            Settings
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/pricing')}>
          <Box sx={styles}>
            <CurrencyUsd sx={{ mr: 2 }} />
            Pricing
          </Box>
        </MenuItem>
        <MenuItem sx={{ p: 0 }} onClick={() => handleDropdownClose('/pages/faq')}>
          <Box sx={styles}>
            <HelpCircleOutline sx={{ mr: 2 }} />
            FAQ
          </Box>
        </MenuItem> */}
        <Divider />
        <MenuItem sx={{ py: 2 }} onClick={handleLogout}>
          <LogoutVariant sx={{ mr: 2, fontSize: '1.375rem', color: 'text.secondary' }} />
          Logout
        </MenuItem>
      </Menu>
      <DialogChangePassword
        open={openChangePasswordDialog}
        toggle={toggleChangePasswordDialog}
      />

    </Fragment>
  )
}

export default UserDropdown
