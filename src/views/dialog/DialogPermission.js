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
    FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    TextField
} from '@mui/material'
import CloseIcon from 'mdi-material-ui/Close'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import * as yup from 'yup'
import { toastError, toastSuccess } from 'src/utils/utils'

const validationSchema = yup.object().shape({
    name: yup.string().trim().required('Permissions name is required')
})

const DialogPermission = props => {
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
            name: ''
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })
    const onSubmit = data => {
        toggle()
        // setLoading(true)
        // let payload = {
        //   name: data.name
        // }
        // let apiInstance = null
        // if (mode === 'edit') {
        //   apiInstance = axiosInstance.patch(ApiEndPoints.LANGUAGE.edit(dataToEdit.id), payload)
        // } else {
        //   apiInstance = axiosInstance.post(ApiEndPoints.LANGUAGE.create, payload)
        // }
        // apiInstance
        //   .then(response => response.data)
        //   .then(response => {
        //     onSuccess()
        //     toastSuccess(response.message)
        //     toggle()
        //   })
        //   .catch(error => {
        //     toastError(error)
        //   })
        //   .finally(() => {
        //     setLoading(false)
        //   })
    }

    useEffect(() => {
        if (open) {
            setLoading(false)
            reset({
                name: dataToEdit?.name || ''
            })
        }
        setDialogTitle(mode === 'add' ? 'Add Permissions' : 'Edit Permissions')
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
                    <form id='language-form' onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='name' error={Boolean(errors.name)}>
                                        Permissions
                                    </FormLabel>
                                    <Controller
                                        name='name'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                onChange={onChange}
                                                placeholder='Enter Permissions Name'
                                                error={Boolean(errors.name)}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        )}
                                    />
                                    {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <LoadingButton size='large' type='submit' form='language-form' variant='contained' loading={loading}>
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

export default DialogPermission
