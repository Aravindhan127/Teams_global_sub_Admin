// ** React Imports
import { useState, Fragment } from 'react'

// ** Next Import
import { useNavigate } from 'react-router-dom'

// ** MUI Imports
import Box from '@mui/material/Box'
import Menu from '@mui/material/Menu'
import Divider from '@mui/material/Divider'
import MenuItem from '@mui/material/MenuItem'
import IconButton from '@mui/material/IconButton'
import Typography from '@mui/material/Typography'

// ** Icons Imports
import LogoutVariant from 'mdi-material-ui/LogoutVariant'
import PermIdentityIcon from '@mui/icons-material/PermIdentity'
import KeyIcon from '@mui/icons-material/Key'

// ** Context
import { useAuth } from 'src/hooks/useAuth'
import DialogChangePassword from 'src/views/dialog/DialogChangePassword'

const UserDropdown = props => {
  // ** Props
  const { settings } = props

  // ** States
  const [anchorEl, setAnchorEl] = useState(null)
  const [openChangePasswordDialog, setOpenChangePasswordDialog] = useState(false)

  // ** Hooks
  const navigate = useNavigate()
  const { logout, user } = useAuth()

  // ** Vars
  const { direction } = settings

  const toggleChangePasswordDialog = () => {
    handleDropdownClose()
    setOpenChangePasswordDialog(!openChangePasswordDialog)
  }

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleDropdownClose = url => {
    if (url) {
      navigate(url)
    }
    setAnchorEl(null)
  }

  const handleLogout = () => {
    logout()
    handleDropdownClose()
  }

  return (
    <Fragment>
      <IconButton
        onClick={handleDropdownOpen}
        sx={{
          ml: 2,
          cursor: 'pointer',
          color: 'text.primary',
          '&:hover': {
            backgroundColor: 'action.hover'
          }
        }}
      >
        <PermIdentityIcon sx={{ fontSize: '3rem', color: 'white' ,backgroundColor: '#121280', padding: '0.5rem', borderRadius: '5rem'}} />
      </IconButton>
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
            <Box
              sx={{
                width: '2.5rem',
                height: '2.5rem',
                borderRadius: '50%',
                backgroundColor: 'primary.main',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white'
              }}
            >
              <PermIdentityIcon />
            </Box>
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
                  wordBreak: 'break-word',
                  overflow: 'hidden',
                  textOverflow: 'ellipsis'
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