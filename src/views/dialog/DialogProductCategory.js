import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, Radio, RadioGroup, TextField } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";

const validationSchema = yup.object().shape({
    name: yup.string().trim().required('Please add a name.'),
    businessCategory: yup.string().trim().required('Please add a business category'),
    description: yup.string().trim().required('Please add a description'),
    status: yup.string().trim().required('Please select a status'),
})

const DialogProductCategory = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess } = props;
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const searchTimeoutRef = useRef()
    const [search, setSearch] = useState(null)
    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            businessCategory: '',
            description: '',
            status: ''
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Product Category" : "Edit Product Category");
            reset({
                name: dataToEdit?.name || '',
                businessCategory: dataToEdit?.businessCategory || '',
                description: dataToEdit?.description || '',
                status: dataToEdit?.status || ''
            });
        }

    }, [dataToEdit, mode, open, reset]);

    const [category, setCategory] = useState([])
    const handleSearchChange = e => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }
    const getBusinessCategory = ({ search }) => {
        //setLoading(true)
        axiosInstance
            .get(ApiEndPoints.BUSINESS_CATEGORY.list, {
                params: {
                    search: search,
                }
            })
            .then(response => {
                setCategory(response.data.data.category)
            })
            .catch(error => {
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        if (open) {
            getBusinessCategory({
                search: search
            })
        }
    }, [open, search])


    const onSubmit = (data) => {
        let payload = {
            name: data.name,
            businessCategory: data.businessCategory?._id,
            description: data.description,
            status: data.status
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.PRODUCT_CATEGORY.edit(dataToEdit._id), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.PRODUCT_CATEGORY.create, payload, {
                })
        }
        apiInstance
            .then((response) => response.data)
            .then((response) => {
                onSuccess();
                toastSuccess(response.message);
                toggle();
            })
            .catch((error) => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false);
            })
    }

    return <>
        <Dialog open={open} fullWidth maxWidth='sm' scroll="paper">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Box>{dialogTitle}</Box>
                <IconButton
                    aria-label="close"
                    onClick={toggle}
                    sx={{ color: (theme) => theme.palette.grey[500] }}
                >
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                <form id="category-form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='name' error={Boolean(errors.name)}>Name</FormLabel>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Name'
                                            onChange={onChange}
                                            id='name'
                                            value={value}
                                            error={Boolean(errors.name)}
                                        />
                                    }
                                />
                                {errors.name && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.name.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor="businessCategory" error={Boolean(errors.businessCategory)}>Business Category</FormLabel>
                                <Controller
                                    name='businessCategory'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <>
                                            <Autocomplete
                                                options={category || []}
                                                value={value || null}
                                                onChange={(e, newValue) => {
                                                    onChange(newValue)
                                                }}
                                                getOptionLabel={option => option?.name || null}
                                                renderInput={params => (
                                                    <TextField
                                                        placeholder='Select Business Category'
                                                        error={Boolean(errors.businessCategory)}
                                                        {...params}
                                                        onChange={handleSearchChange}
                                                    />
                                                )}
                                            />
                                            {/* <Autocomplete
                                                //multiple
                                                options={category || []}
                                                error={Boolean(errors._id)}
                                                onChange={(e, newValue) => {
                                                    // Extracting _id from newValue and passing only _id to onChange
                                                    onChange(newValue.map(option => option._id));
                                                }}
                                                value={value || []}
                                                filterSelectedOptions
                                                getOptionLabel={option => option?.name || null}
                                                isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                                renderInput={params => (
                                                    <TextField
                                                        placeholder='Select Business Category'
                                                        error={Boolean(errors._id)}
                                                        {...params}
                                                        onChange={handleSearchChange}
                                                    />
                                                )}
                                            /> */}
                                        </>
                                    )}
                                />
                                {errors.businessCategory && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.businessCategory.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='description' error={Boolean(errors.description)}>Description</FormLabel>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            multiline
                                            rows={3}
                                            placeholder='Enter description'
                                            onChange={onChange}
                                            id='description'
                                            value={value}
                                            error={Boolean(errors.description)}
                                        />
                                    }
                                />
                                {errors.description && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.description.message}
                                    </FormHelperText>
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
                <LoadingButton
                    size="large"
                    type="submit"
                    form="category-form"
                    variant="contained"
                    loading={loading}
                >
                    Submit
                </LoadingButton>
                <Button size="large" variant="outlined" onClick={toggle}>
                    Cancel
                </Button>
            </DialogActions>
        </Dialog >
    </>
}

export default DialogProductCategory