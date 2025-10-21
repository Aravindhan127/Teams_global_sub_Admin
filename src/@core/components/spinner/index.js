// ** MUI Import
import Box from '@mui/material/Box'
import CircularProgress from '@mui/material/CircularProgress'
import Logo from '../../../assets/images/Logo.svg'

const FallbackSpinner = () => {

  return (
   <Box
      sx={{
        height: '100vh',
        display: 'flex',
        alignItems: 'center',
        flexDirection: 'column',
        justifyContent: 'center'
      }}
    >
      <Box
                     component="img"
                     src={Logo}
                     alt="Logo"
                     sx={{
                       width: { xs: '100px', sm: '130px', md: '160px' }, // responsive
                       height: 'auto',
                       borderRadius: '12px', 
                     }}
                   />
      <CircularProgress disableShrink sx={{ mt: 6 }} />
    </Box>
  )
}

export default FallbackSpinner
