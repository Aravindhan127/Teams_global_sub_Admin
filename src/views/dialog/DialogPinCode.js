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
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import * as yup from 'yup'
import { toastError, toastSuccess } from 'src/utils/utils'
import { Link } from 'react-router-dom'

const validationSchema = yup.object().shape({
    postcodeStart: yup.string().trim().required('Postcode Start is required'),
    postcodeEnd: yup.string().trim().required('postcode End is Required')
    // country: yup.string().required('Country is Required')
})

const DialogPinCode = props => {
    const { open, toggle, dataToEdit, onSuccess, mode } = props
    const [loading, setLoading] = useState(false)
    const [countryLoading, setCountryLoading] = useState(false)
    const [countryList, setCountryList] = useState([])
    const [dialogTitle, setDialogTitle] = useState('')
    const [documentsData, setDocumentsData] = useState([])
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            postcodeStart: '',
            postcodeEnd: '',
            country: '',
            documents: []
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })
    const onSubmit = data => {
        setLoading(true)
        const doc = data.documents?.map(item => item._id) || []
        let payload = {

            country: data.country,
            documents: doc
        }

        let apiInstance = null
        if (mode === 'edit') {
            apiInstance = axiosInstance.patch(ApiEndPoints.PINCODE.edit(dataToEdit._id), payload)
        } else {
            apiInstance = axiosInstance.post(ApiEndPoints.PINCODE.create, payload)
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
    const getCountryList = () => {
        setCountryLoading(true)
        axiosInstance
            .get(`${ApiEndPoints.GET_REGION.country}`, {
                headers: {
                    'X-CSCAPI-KEY': 'RmYyOHVGMnBSS0VoRUc5cTRMMmhnc2UwdE1WdVZqaHRicnhMbzJ6eA=='
                }
            })
            .then(response => response.data)
            .then(response => {
                setCountryList(response)
            })
            .catch(error => {
                toastError(error)
            })
            .finally(() => {
                setCountryLoading(false)
            })
    }

    const fetchData = ({ required }) => {
        setLoading(true);
        let params = {
            required: 'notrequired',
        };

        axiosInstance
            .get(ApiEndPoints.DOCUMENT.list, { params })
            .then((response) => {
                setDocumentsData(response.data.data.documents)
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };
    useEffect(() => {
        if (open) {
            setLoading(false)
            reset({
                country: dataToEdit?.country || '',
                documents: dataToEdit?.documents || []
            })
        }
        fetchData({
            required: 'required',
        });
        getCountryList()
        setDialogTitle(mode === 'add' ? 'Add Pin Code' : 'Edit Pin Code')
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
                    <form id='pincode-form' onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={4}>

                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='country' error={Boolean(errors.country)}>
                                        Country
                                    </FormLabel>
                                    <Controller
                                        name='country'
                                        control={control}
                                        render={({ field: { onChange, value } }) => (
                                            <Autocomplete
                                                options={countryList}
                                                onChange={(e, newValue) => {
                                                    onChange(newValue ? newValue.name : '')
                                                }}
                                                value={countryList.find(option => option.name === value) || null}
                                                getOptionLabel={option => option.name}
                                                renderInput={params => (
                                                    <TextField {...params} placeholder='Select Country' error={Boolean(errors.country)} />
                                                )}
                                            />
                                        )}
                                    />
                                    {errors.country && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.country.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='documents' error={Boolean(errors.documents)}>
                                        Documents
                                    </FormLabel>
                                    <Controller
                                        name='documents'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <Autocomplete
                                                multiple
                                                options={documentsData}
                                                error={Boolean(errors.documents)}
                                                onChange={(e, newValue) => {
                                                    onChange(newValue)
                                                }}
                                                value={value || []}
                                                filterSelectedOptions
                                                getOptionLabel={option => option?.title}
                                                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                                renderInput={params => (
                                                    <TextField placeholder='Select Documents' error={Boolean(errors.documents)} {...params} />
                                                )}
                                            />
                                        )}
                                    />
                                    {errors.documents && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.documents.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='status' error={Boolean(errors.status)}>
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
                                    {errors.nightCharges && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.nightCharges.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <LoadingButton size='large' type='submit' form='pincode-form' variant='contained' loading={loading}>
                        Submit
                    </LoadingButton>
                    <Button size='large' variant='outlined' onClick={toggle}>
                        Cancel
                    </Button>
                </DialogActions>
                <Box sx={{ display: 'flex', justifyContent: 'end', m: 4 }}>
                    <Button size='small' variant='outlined' as={Link} to='/document' sx={{ textDecoration: 'none' }}>
                        Add Documents
                    </Button>
                </Box>
            </Dialog>
        </>
    )
}

export default DialogPinCode
