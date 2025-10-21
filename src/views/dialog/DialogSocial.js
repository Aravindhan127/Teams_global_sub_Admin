import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
    Box,
    Button,
    Dialog,
    DialogActions,
    DialogContent,
    DialogTitle,
    FormControl,
    FormControlLabel,
    FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    Radio,
    RadioGroup,
    TextField
} from '@mui/material'
import CloseIcon from 'mdi-material-ui/Close'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import * as yup from 'yup'
import { toastError, toastSuccess } from 'src/utils/utils'
import { CleaveNumberInput } from 'src/@core/components/cleave-components'

const validationSchema = yup.object().shape({

})

const DialogSocial = props => {
    const { open, toggle, dataToEdit, onSuccess, mode } = props
    const [loading, setLoading] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {

        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })
    const onSubmit = data => {
        setLoading(true)
        let payload = {
            name: data.name,
            link: data.link,
            status: data.status,
        }
        let apiInstance = null
        if (mode === 'edit') {
            apiInstance = axiosInstance.patch(ApiEndPoints.FOOTER.edit(dataToEdit._id), payload)
        } else {
            apiInstance = axiosInstance.post(ApiEndPoints.FOOTER.create, payload)
        }
        apiInstance
            .then(response => response.data)
            .then(response => {
                onSuccess()
                toastSuccess(response.message)
                toggle()
            })
            .catch(error => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        if (open) {
            setLoading(false)
            reset({
                name: dataToEdit?.name || '',
                link: dataToEdit?.link || '',
                status: dataToEdit?.status || ''
            })
        }
        setDialogTitle(mode === 'add' ? 'Add Social Media' : 'Edit Social Media')
    }, [dataToEdit, mode, open, reset])

    return (
        <>
            <Dialog open={open} onClose={toggle} fullWidth maxWidth='sm' scroll='paper'>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>{dialogTitle}</Box>
                    <IconButton aria-label='close' onClick={toggle} sx={{ color: theme => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                    <form id='faq-form' onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='name' error={Boolean(errors.name)}>
                                        Title
                                    </FormLabel>
                                    <Controller
                                        name='name'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                multiline
                                                value={value}
                                                disabled={mode === 'edit'}
                                                onChange={onChange}
                                                error={Boolean(errors.name)}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        )}
                                    />
                                    {errors.name && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='link' error={Boolean(errors.link)}>
                                        Link
                                    </FormLabel>
                                    <Controller
                                        name='link'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                multiline
                                                value={value}
                                                onChange={onChange}
                                                error={Boolean(errors.link)}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        )}
                                    />
                                    {errors.link && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.link.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel required htmlFor='status' error={Boolean(errors.status)}>
                                        Status
                                    </FormLabel>
                                    <Controller
                                        name='status'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <RadioGroup row name='status' onChange={onChange} value={value}>
                                                <FormControlLabel value={'active'} control={<Radio />} label='Active' />
                                                <FormControlLabel value={'inactive'} control={<Radio />} label='Inactive' />
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.status && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.status.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <LoadingButton size='large' type='submit' form='faq-form' variant='contained' loading={loading}>
                        Submit
                    </LoadingButton>
                    <Button size='large' variant='outlined' onClick={toggle}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    )
}

export default DialogSocial
