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
    FormHelperText,
    FormLabel,
    Grid,
    IconButton,
    TextField
} from '@mui/material'
import CloseIcon from 'mdi-material-ui/Close'
import { useEffect, useRef, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import * as yup from 'yup'
import { toastError, toastSuccess } from 'src/utils/utils'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import GooglePlacesAutocomplete from 'react-google-places-autocomplete'

const validationSchema = yup.object().shape({
    role: yup.string().required('Role is required'),
    description: yup.string().required('Description is required'),
})

const Dialogcareer = (props) => {
    const { open, toggle, dataToEdit, onSuccess, mode } = props
    const [loading, setLoading] = useState(false)
    const [dialogTitle, setDialogTitle] = useState('')
    const searchTimeoutRef = useRef()
    const [search, setSearch] = useState(null)

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            role: '',
            description: '',
            location: '',
            category: ''
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    const [career, setCareer] = useState([])
    const getCareer = ({ search }) => {
        axiosInstance
            .get(ApiEndPoints.CAREER_CATEGORY.list, {
                params: {
                    search: search,
                }
            })
            .then(response => {
                setCareer(response.data.data.category)
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
            getCareer({
                search: search
            })
        }
    }, [open, search])

    const onSubmit = (data) => {
        setLoading(true)
        let payload = {
            role: data.role,
            description: data.description,
            location: data.location.label,  // Extract the label value
            category: data.category?._id,
        }
        let apiInstance = null
        if (mode === 'edit') {
            apiInstance = axiosInstance.patch(ApiEndPoints.CAREER_SECTION.edit(dataToEdit._id), payload)
        } else {
            apiInstance = axiosInstance.post(ApiEndPoints.CAREER_SECTION.create, payload)
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
                role: dataToEdit?.role || '',
                description: dataToEdit?.description || '',
                location: dataToEdit?.location ? { label: dataToEdit.location } : '',
                category: career.find(cat => cat.name === dataToEdit?.category?.name) || '',
                //category: dataToEdit?.category?.name || ''
            })
        }
        setDialogTitle(mode === 'add' ? 'Add  Job Post' : 'Edit Job Post')
    }, [career, dataToEdit, mode, open, reset])

    const handleSearchChange = (e) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }

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
                    <form id='form' onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='role' error={Boolean(errors.role)}>
                                        Position
                                    </FormLabel>
                                    <Controller
                                        name='role'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                value={value}
                                                onChange={onChange}
                                                error={Boolean(errors.role)}
                                                InputLabelProps={{ shrink: true }}
                                            />
                                        )}
                                    />
                                    {errors.role && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.role.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='location' error={Boolean(errors.location)}>
                                        Location
                                    </FormLabel>
                                    <Controller
                                        name='location'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <div style={{ width: '100%' }}>
                                                <GooglePlacesAutocomplete
                                                    apiKey='AIzaSyBydxmR64ODpWEtho3aPfVb-f6yvSy7uxY'
                                                    selectProps={{
                                                        placeholder: 'Enter Location',
                                                        value,
                                                        onChange,
                                                        styles: {
                                                            container: provided => ({
                                                                ...provided,
                                                                width: '100%',
                                                            }),
                                                            input: provided => ({
                                                                ...provided,
                                                            }),
                                                        },
                                                        components: {
                                                            IndicatorsContainer: () => null
                                                        }
                                                    }}
                                                />
                                            </div>
                                        )}
                                    />
                                    {errors.location && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.location.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel required htmlFor="category" error={Boolean(errors.category)}>Business Category</FormLabel>
                                    <Controller
                                        name='category'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <>
                                                <Autocomplete
                                                    options={career || []}
                                                    value={value || null}
                                                    onChange={(e, newValue) => {
                                                        onChange(newValue)
                                                    }}
                                                    getOptionLabel={option => option?.name || null}
                                                    renderInput={params => (
                                                        <TextField
                                                            placeholder='Select Category'
                                                            error={Boolean(errors.category)}
                                                            {...params}
                                                            onChange={handleSearchChange}
                                                        />
                                                    )}
                                                />
                                            </>
                                        )}
                                    />
                                    {errors.category && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.category.message}</FormHelperText>
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
                                        render={({ field }) => (
                                            <ReactQuill
                                                theme='snow'
                                                {...field}
                                                modules={{
                                                    toolbar: [
                                                        [{ header: [1, 2, 3, 4, 5, 6, false] }],
                                                        ['bold', 'italic', 'underline', 'strike'],
                                                        ['blockquote', 'code-block'],
                                                        [{ list: 'ordered' }, { list: 'bullet' }],
                                                        [{ script: 'sub' }, { script: 'super' }],
                                                        [{ indent: '-1' }, { indent: '+1' }],
                                                        [{ direction: 'rtl' }],
                                                        [{ size: ['small', false, 'large', 'huge'] }],
                                                        [{ color: [] }, { background: [] }],
                                                        [{ font: [] }],
                                                        ['link'],
                                                        ['clean']
                                                    ]
                                                }}
                                                formats={[
                                                    'header',
                                                    'font',
                                                    'size',
                                                    'bold',
                                                    'italic',
                                                    'underline',
                                                    'strike',
                                                    'blockquote',
                                                    'list',
                                                    'bullet',
                                                    'indent',
                                                    'script',
                                                    'link',
                                                    'color',
                                                    'background'
                                                ]}
                                                onChange={value => {
                                                    setValue('description', value, { shouldValidate: true })
                                                    field.onChange(value)
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.description && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                        </Grid>
                    </form>
                </DialogContent>
                <DialogActions>
                    <LoadingButton size='large' type='submit' form='form' variant='contained' loading={loading}>
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

export default Dialogcareer
