
import React, { useState } from 'react'
import {
    Box,
    Card,
    CardContent,
} from '@mui/material'
import ForgotPasswordForm from 'src/views/pages/forgotpassword/ForgotPasswordForm'
import ForgotOtpForm from 'src/views/pages/forgotpassword/ForgotOtpForm'
import NewPasswordForm from 'src/views/pages/forgotpassword/newPasswordForm'
import { styled } from '@mui/material/styles'

function CreatePassword() {
    const [step, setStep] = useState(1)
    const [email, setEmail] = useState('')
    const [userToken, setUserToken] = useState('')
    //console.log(" userToken", userToken);

    const BoxWrapper = styled(Box)(({ theme }) => ({
        [theme.breakpoints.down('xl')]: {
            width: '100%'
        },
        [theme.breakpoints.down('md')]: {
            maxWidth: 500
        }
    }))
    const onOtpSent = (email, token) => {
        setEmail(email)
        setUserToken(token)
        //console.log(" email token from main", email, token);
        setStep(prev => prev + 1)
    }

    const onOtpVerified = () => {
        setStep(prev => prev + 1)
    }

    return (
        <>
            <Box sx={{
                p: { md: 12, xs: 8 },
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: 'background.paper',
                borderRadius: '20px'
            }}>
                <BoxWrapper>
                    <CardContent>
                        {step === 1 && <ForgotPasswordForm onSuccess={onOtpSent} type={'create'} />}
                        {step === 2 && <ForgotOtpForm email={email} token={userToken} onSuccess={onOtpVerified} />}
                        {step === 3 && <NewPasswordForm email={email} token={userToken} type={'create'} />}
                    </CardContent>
                </BoxWrapper>
            </Box>
        </>
    )
}

export default CreatePassword
