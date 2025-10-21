// ** MUI Imports
import { Divider } from '@mui/material'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'

const FooterContent = () => {

  return (
    <Box>
      <Divider sx={{ mb: 2 }} />
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
        <Typography sx={{ mr: 2 }} variant='body2'>
          ©   HiQLynks. All rights reserved {` ${new Date().getFullYear()}`}
        </Typography>

      </Box>
    </Box>
  )
}

export default FooterContent
