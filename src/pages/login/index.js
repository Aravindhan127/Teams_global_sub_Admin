import { Box, FormHelperText, MenuItem, Select } from '@mui/material'
import React, { useState } from 'react'
import { styled } from '@mui/material/styles'
import Typography from '@mui/material/Typography'
import FormLabel from '@mui/material/FormLabel'
import TextField from '@mui/material/TextField'
import FormControl from '@mui/material/FormControl'
import InputAdornment from '@mui/material/InputAdornment'
import IconButton from '@mui/material/IconButton'
import Translations from 'src/layouts/components/Translations'
import useCustomTranslation from 'src/@core/hooks/useCustomTranslation'
import { useForm, Controller } from 'react-hook-form'
import * as yup from 'yup'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import { Visibility, VisibilityOff } from '@mui/icons-material'
import { FormValidationMessages } from 'src/constants/form.const'
import { useAuth } from 'src/hooks/useAuth'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { toastError, toastSuccess } from 'src/utils/utils'
import { Link } from 'react-router-dom'

const BoxWrapper = styled(Box)(({ theme }) => ({
    [theme.breakpoints.down('xl')]: {
        width: '100%'
    },
    [theme.breakpoints.down('md')]: {
        maxWidth: 500
    }
}))
const LinkStyled = styled(Link)(({ theme }) => ({
    fontSize: '0.875rem',
    textDecoration: 'none',
    color: theme.palette.primary.main
}))
const validationSchema = yup.object().shape({
    userEmail: yup.string().email(FormValidationMessages.EMAIL.invalid).required(FormValidationMessages.EMAIL.required),
    // password: yup
    //     .string()
    //     .min(FormValidationMessages.PASSWORD.minLength, FormValidationMessages.PASSWORD.minLengthErrorMessage)
    //     .matches(FormValidationMessages.PASSWORD.pattern, FormValidationMessages.PASSWORD.patternErrorMessage)
    //     .required(FormValidationMessages.PASSWORD.required),
    password: yup
        .string()
        .required(FormValidationMessages.PASSWORD.required),
})

const LoginPage = () => {

    const auth = useAuth();
    const translation = useCustomTranslation()

    const [showPassword, setShowPassword] = useState(false)
    const [loading, setLoading] = useState(false)

    const {
        control,
        handleSubmit,
        formState: { errors }
    } = useForm({
        defaultValues: {
            userEmail: '',
            password: '',
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    const onSubmit = data => {
        setLoading(true);
        let payload = new FormData()
        payload.append('userEmail', data.userEmail);
        payload.append('password', data.password);

        axiosInstance
            .post(ApiEndPoints.AUTH.login, payload)
            .then((response) => response.data)
            .then((response) => {
                console.log("response", response.data)
                toastSuccess(response.message);
                auth.login({ token: response.data.token, user: response.data.user, data: response.data });
                //console.log(response.data.token);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            })
    }

    const handleTogglePassword = () => {
        setShowPassword(!showPassword)
    }

    return (
        <>
            <Box
                sx={{
                    p: { md: 12, xs: 8 },
                    height: '100%',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    backgroundColor: 'background.paper',
                    borderRadius: '20px',
                }}
            >
                <BoxWrapper>
                    <Box sx={{ mb: 6 }}>
                        <Typography variant='fm-h3' color='neutral.90' fontWeight="medium">
                            <Translations text="Sign In" />
                        </Typography>
                        <Typography variant='fm-p2' sx={{ mt: 3, mb: 3 }} color='neutral.70' display="block">
                            <Translations text="Enter Your Account credentials" />
                        </Typography>
                    </Box>
                    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <FormControl fullWidth sx={{ mb: 4 }}>
                            <FormLabel htmlFor='userEmail'>Email Address</FormLabel>
                            <Controller
                                name="userEmail"
                                control={control}
                                render={({ field: { value, onChange } }) =>
                                    <TextField
                                        autoFocus
                                        onChange={onChange}
                                        id='userEmail'
                                        value={value}
                                        placeholder="Enter Email Address"
                                    />
                                }
                            />
                            {errors.userEmail && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.userEmail.message}
                                </FormHelperText>
                            )}
                        </FormControl>
                        <FormControl fullWidth sx={{ mb: 6 }}>
                            <FormLabel htmlFor='password' >{translation.translate("form.password.label")}</FormLabel>
                            <Controller
                                name='password'
                                control={control}
                                defaultValue=''
                                render={({ field: { value, onChange } }) => (
                                    <TextField
                                        id='password'
                                        placeholder="Enter Password"
                                        type={showPassword ? 'text' : 'password'}
                                        autoComplete='current-password'
                                        value={value}
                                        onChange={onChange}
                                        InputProps={{
                                            endAdornment: (
                                                <InputAdornment position='end'>
                                                    <IconButton onClick={handleTogglePassword} edge='start'>
                                                        {showPassword ? <Visibility fontSize='small' /> : <VisibilityOff fontSize='small' />}
                                                    </IconButton>
                                                </InputAdornment>
                                            )
                                        }}
                                    />
                                )}
                            />
                            {errors.password && (
                                <FormHelperText sx={{ color: "error.main" }}>
                                    {errors.password.message}
                                </FormHelperText>
                            )}
                        </FormControl>

                        {/* <FormControl fullWidth sx={{ mb: 6 }}>
                            <FormLabel required htmlFor='loginType'>Login Type</FormLabel>
                            <Controller
                                name="loginType"
                                control={control}
                                rules={{ required: 'At least one option must be selected.' }}
                                render={({ field: { value, onChange } }) => (
                                    <Select
                                        id='loginType'
                                        value={value}
                                        onChange={onChange}
                                        error={Boolean(errors.loginType)}
                                        helperText={errors.loginType ? errors.status.message : ''}
                                    >

                                        <MenuItem value={'college'}>College</MenuItem>
                                        <MenuItem value={'organisation'}>Organization</MenuItem>
                                    </Select>
                                )}
                            />
                            {errors.loginType && (
                                <FormHelperText sx={{ color: 'error.main' }}>
                                    {errors.loginType.message}
                                </FormHelperText>
                            )}
                        </FormControl> */}
                        <Box
                            sx={{ mb: 4, display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}
                        >
                            <LinkStyled to='/forgot-password'>Forgot Password?</LinkStyled>
                        </Box>
                        <LoadingButton fullWidth loading={loading} size='large' type='submit' variant='contained' >
                            <Translations text="Sign In" />
                        </LoadingButton>
                    </form>
                </BoxWrapper>
            </Box>
        </>
    )
}

export default LoginPage