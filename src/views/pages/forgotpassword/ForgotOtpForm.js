import React, { useState } from 'react'
import { Alert, Box, Button, Container, FormHelperText, Snackbar, Typography } from '@mui/material'
import { MuiOtpInput } from 'mui-one-time-password-input'

import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import toast from 'react-hot-toast';
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { LoadingButton } from '@mui/lab'
import Translations from 'src/layouts/components/Translations'
const validationSchema = yup.object().shape({
    otp: yup
        .string()
        .required('OTP is required')
        .matches(/^\d{4}$/, 'OTP must be a number')
})

function OtpForm({ onSuccess, email, token }) {

    const [otp, setOtp] = useState('')
    const [open, setOpen] = React.useState(false)

    console.log("otp: ", otp);

    const handleOtpChange = newValue => {
        setOtp(newValue)
    }

    const { control, handleSubmit, setValue } = useForm({
        resolver: yupResolver(validationSchema)
    })

    const handleOtpVerify = async (e) => {
        try {
            const response = await axiosInstance.post(ApiEndPoints.AUTH.verifotp, {
                otp: otp
            }, { headers: { Authorization: `Bearer ${token}` } });

            if (response.status === 200) {
                setOpen(true);
                onSuccess(response.data.data.token);
            } else {
            }
            toast.success(response.data.message);

        } catch (error) {
            toast.error(error.response.data.message)
        }
    }

    const handleResendOtp = async () => {
        try {
            const response = await axiosInstance.post(
                ApiEndPoints.AUTH.forgot,
                {
                    userEmail: email,
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.status === 200) {
                setOtp(""); // Clear local state
                setValue("otp", ""); // Clear react-hook-form field
                toast.success("OTP resent successfully!");
            }
        } catch (error) {
            toast.error(error.response?.data.message || "Failed to resend OTP");
        }
    };

    return (
        <>
            <form onSubmit={handleSubmit(handleOtpVerify)}>
                <Typography variant='h6'>Verify Your OTP</Typography>
                <Typography variant='subtitle1'>Please Enter 4 digit code sent to</Typography>
                <Typography variant='body2'>{email}</Typography>
                <Controller
                    name='otp'
                    control={control}
                    defaultValue=''
                    render={({ field, fieldState }) => (
                        <>
                            <MuiOtpInput
                                {...field}
                                value={otp}
                                onChange={newValue => {
                                    handleOtpChange(newValue)
                                    field.onChange(newValue)
                                }}
                                style={{ display: 'flex', justifyContent: 'center', marginTop: '3vh', width: "380px" }}
                            />
                            {fieldState.invalid ? <FormHelperText error>{fieldState.error?.message}</FormHelperText> : null}
                        </>
                    )}
                />
                <Box sx={{ display: "flex", justifyContent: "end" }}>
                    <Typography
                        variant='body2'
                        onClick={handleResendOtp}
                        sx={{
                            mt: 3,
                            textTransform: "none",
                            cursor: "pointer",
                        }}
                    >
                        Resend OTP
                    </Typography>
                </Box>
                <LoadingButton fullWidth size='large' type='submit' variant='contained' sx={{ marginTop: '20px' }} >
                    <Translations text="Verify" />
                </LoadingButton>
                {open && (
                    <Snackbar open={open} autoHideDuration={2000}>
                        <Alert severity='success' sx={{ width: '100%', color: 'fff' }}>
                            OTP verified Successfully
                        </Alert>
                    </Snackbar>
                )}
            </form>
        </>

    )
}
export default OtpForm
