import { Box, Grid, useMediaQuery } from '@mui/material'
import React from 'react'
import { styled, useTheme } from '@mui/material/styles'
import Logo from '../assets/images/Logo.svg'
import { useSettings } from 'src/@core/hooks/useSettings'


const RightWrapper = styled(Box)(({ theme }) => ({
    margin: 'auto',
    [theme.breakpoints.up('md')]: {
        maxWidth: 550
    }
}))

const AuthLayout = ({ children }) => {

    const theme = useTheme();
    const { settings } = useSettings()

    const { skin } = settings
    const hidden = useMediaQuery(theme.breakpoints.down('md'))

    return (
        <>
            <Grid container className='content-right' spacing={4}>
                <Grid item xs={12} md={12}>
                    <Box className='content-center'>
                        <RightWrapper sx={skin === 'bordered' ? { borderLeft: `1px solid ${theme.palette.divider}` } : {}}>
                            {
                                <Box display="flex" justifyContent="center" alignItems="center" marginBottom="1.5rem" >
                                    <img src={Logo} />
                                </Box>
                            }
                            {children}
                        </RightWrapper>
                    </Box>
                </Grid >
            </Grid >
        </>
    )
}

export default AuthLayout