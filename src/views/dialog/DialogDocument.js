import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
    Autocomplete,
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
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import * as yup from 'yup'
import { toastError, toastSuccess } from 'src/utils/utils'
import { CleaveNumberInput } from 'src/@core/components/cleave-components'

const validationSchema = yup.object().shape({
    title: yup.string().trim().required('Title is required'),
    key: yup.string().trim().required('Key is Required'),
    status: yup.string().trim().required('Status is Required'),
    maxFileCounts: yup
        .number('Must be positive number only')
        .positive('Must be positive number only')
        .typeError('Must be positive number only')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .default(0) // Set a default value to avoid unnecessary nullable logic
        .required('Max File Counts is Required'),
    maxSize: yup
        .number('Must be positive number only')
        .positive('Must be positive number only')
        .typeError('Must be positive number only')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .default(0) // Set a default value to avoid unnecessary nullable logic
        .required('Max Size is Required'),

})

const DialogDocument = props => {
    const { open, toggle, dataToEdit, onSuccess, mode } = props
    const [loading, setLoading] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const [search, setSearch] = useState(null)
    const [vehicle, setVehicle] = useState([])
    const searchTimeoutRef = useRef()

    const handleSearchChange = e => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }
    const getVehicelType = ({ search }) => {
        //setLoading(true)
        axiosInstance
            .get(ApiEndPoints.VEHICLE_TYPE.list, {
                params: {
                    search: search,
                }
            })
            .then(response => {
                setVehicle(response.data.data.vehicletype)
            })
            .catch(error => {
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        if (open) {
            getVehicelType({
                search: search
            })
        }
    }, [open, search])
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            title: '',
            key: '',
            maxFileCounts: '',
            maxSize: '',
            description: '',
            required: '',
            status: '',
            vehicleType: []
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })
    const onSubmit = data => {
        setLoading(true)
        let payload = {
            title: data.title,
            key: data.key,
            maxFileCounts: data.maxFileCounts,
            maxSize: data.maxSize,
            description: data.description,
            required: data.required,
            status: data.status,
            vehicleType: data.vehicleType?.map(item => ({
                _id: item._id,
            })),
        }
        let apiInstance = null
        if (mode === 'edit') {
            apiInstance = axiosInstance.patch(ApiEndPoints.DOCUMENT.edit(dataToEdit._id), payload)
        } else {
            apiInstance = axiosInstance.post(ApiEndPoints.DOCUMENT.create, payload)
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
                title: dataToEdit?.title || '',
                key: dataToEdit?.key || '',
                maxFileCounts: dataToEdit?.maxFileCounts || '',
                maxSize: dataToEdit?.maxSize || '',
                description: dataToEdit?.description || '',
                required: dataToEdit?.required,
                status: dataToEdit?.status || '',
                vehicleType: dataToEdit?.vehicleType || []
            })
        }
        setDialogTitle(mode === 'add' ? 'Add Document' : 'Edit Document')
    }, [dataToEdit, mode, open, reset])

    return (
        <>
            <Dialog open={open} fullWidth maxWidth='sm' scroll='paper'>
                <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box>{dialogTitle}</Box>
                    <IconButton aria-label='close' onClick={toggle} sx={{ color: theme => theme.palette.grey[500] }}>
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                    <form id='document-form' onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor="vehicleType" error={Boolean(errors.vehicleType)}>Vehicle Type</FormLabel>
                                    <Controller
                                        name='vehicleType'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <Autocomplete
                                                multiple
                                                options={vehicle}
                                                error={Boolean(errors._id)}
                                                onChange={(e, newValue) => {
                                                    onChange(newValue)
                                                }}
                                                value={value || []}
                                                filterSelectedOptions
                                                getOptionLabel={option => option.name || null}
                                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                                renderInput={params => (
                                                    <TextField
                                                        placeholder='Select Vehicle Type'
                                                        error={Boolean(errors.vehicleType)}
                                                        {...params}
                                                        onChange={handleSearchChange}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                    {errors.vehicleType && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.vehicleType.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='title' error={Boolean(errors.title)}>
                                        Title
                                    </FormLabel>
                                    <Controller
                                        name='title'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                onChange={onChange}
                                                placeholder='Enter Tilte'
                                                error={Boolean(errors.title)}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        )}
                                    />
                                    {errors.title && <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='key' error={Boolean(errors.key)}>
                                        Key
                                    </FormLabel>
                                    <Controller
                                        name='key'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                onChange={onChange}
                                                placeholder='Enter Key'
                                                error={Boolean(errors.key)}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        )}
                                    />
                                    {errors.key && <FormHelperText sx={{ color: 'error.main' }}>{errors.key.message}</FormHelperText>}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='maxFileCounts' error={Boolean(errors.maxFileCounts)}>
                                        Max File Counts
                                    </FormLabel>
                                    <Controller
                                        name="maxFileCounts"
                                        control={control}
                                        rules={{ required: true, pattern: /^[0-9]+$/ }}
                                        render={({ field: { value, onChange } }) =>
                                            <TextField
                                                type="text"
                                                inputMode="numeric"
                                                onChange={(e, newValue) => onChange(newValue)}
                                                id='maxFileCounts'
                                                value={value}
                                                error={Boolean(errors.maxFileCounts)}
                                                InputProps={{
                                                    inputComponent: CleaveNumberInput
                                                }}
                                            />
                                        }
                                    />
                                    {errors.maxFileCounts && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.maxFileCounts.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='maxSize' error={Boolean(errors.maxSize)}>
                                        Max Size
                                    </FormLabel>
                                    <Controller
                                        name='maxSize'
                                        control={control}
                                        rules={{ required: true, pattern: /^[0-9]+$/ }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                onChange={(e, newValue) => onChange(newValue)}
                                                type="text"
                                                inputMode="numeric"
                                                id='maxSize'
                                                placeholder='Enter Max Size in MB '
                                                error={Boolean(errors.maxSize)}
                                                InputProps={{
                                                    inputComponent: CleaveNumberInput
                                                }} />
                                        )}
                                    />
                                    {errors.maxSize && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.maxSize.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='description' error={Boolean(errors.description)}>
                                        Description
                                    </FormLabel>
                                    <Controller
                                        name='description'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                multiline
                                                value={value}
                                                onChange={onChange}
                                                type='text'
                                                placeholder='Enter Description'
                                                error={Boolean(errors.description)}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        )}
                                    />
                                    {errors.description && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={6}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='required' error={Boolean(errors.required)}>
                                        File Required
                                    </FormLabel>
                                    <Controller
                                        name='required'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <RadioGroup row name='required' onChange={onChange} value={value}>
                                                <FormControlLabel sx={errors.required ? { color: 'error.main' } : null} value={true} control={<Radio sx={errors.required ? { color: 'error.main' } : null} />} label='Yes' />
                                                <FormControlLabel sx={errors.required ? { color: 'error.main' } : null} value={false} control={<Radio sx={errors.required ? { color: 'error.main' } : null} />} label='No' />
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.required && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.required.message}</FormHelperText>
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
                                            <RadioGroup row name='status' onChange={onChange} value={value} >
                                                <FormControlLabel sx={errors.status ? { color: 'error.main' } : null} value={'active'} control={<Radio sx={errors.status ? { color: 'error.main' } : null} />} label='Active' />
                                                <FormControlLabel sx={errors.status ? { color: 'error.main' } : null} value={'inactive'} control={<Radio sx={errors.status ? { color: 'error.main' } : null} />} label='Inactive' />
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.nightCharges && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.nightCharges.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <LoadingButton size='large' type='submit' form='document-form' variant='contained' loading={loading}>
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

export default DialogDocument
