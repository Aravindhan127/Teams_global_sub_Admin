import React from 'react'
import { Box, Grid, useMediaQuery } from '@mui/material'
import { styled, useTheme } from '@mui/material/styles'
import Logo from '../assets/images/Logo.svg'
import { useSettings } from 'src/@core/hooks/useSettings'

// Styled RightWrapper renamed to avoid conflict
const StyledRightWrapper = styled(Box)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    maxWidth: 550,
  },
}))

const AuthLayout = ({ children }) => {
  const theme = useTheme()
  const { settings } = useSettings()
  const { skin } = settings
  const hidden = useMediaQuery(theme.breakpoints.down('md'))

  return (
    <Grid container className="content-right" spacing={4}>
      <Grid item xs={12} md={12}>
        <Box className="content-center">
          <StyledRightWrapper
            sx={
              skin === 'bordered'
                ? { borderLeft: `1px solid ${theme.palette.divider}` }
                : {}
            }
          >
            {/* Logo Box */}
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              mb={4} // margin-bottom
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
            </Box>

            {/* Render children content */}
            {children}
          </StyledRightWrapper>
        </Box>
      </Grid>
    </Grid>
  )
}

export default AuthLayout
