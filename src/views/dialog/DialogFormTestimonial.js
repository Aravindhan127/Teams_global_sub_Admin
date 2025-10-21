import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, Radio, RadioGroup, TextField } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";
import UploadIcon from '@mui/icons-material/Upload'

const validationSchema = yup.object().shape({
    name: yup.string().trim().required('Please enter your name.'),
    description: yup.string().trim().required('Please enter a description.').max(250, 'Description must be at most 250 characters.'),
    image: yup.mixed().required('Please upload an image.'),
    status: yup.string().trim().required('Please select a status'),
})

const FileInput = ({ inputId, accept, onChange, selectedFileName, error }) => (
    <>
        <Button
            startIcon={<UploadIcon />}
            variant='contained'
            sx={{ bgcolor: '#fff', border: '1px solid #6B6B6B', color: '#000' }}
            onClick={() => document.getElementById(inputId).click()}
        >
            Choose File
        </Button>
        <input
            id={inputId}
            name={inputId}
            type='file'
            accept={accept}
            onChange={onChange}
            style={{ display: 'none' }}
        />
        <FormHelperText variant='body2' sx={{ color: '#6B6B6B', marginBottom: '8px' }}>
            {selectedFileName || 'No file chosen'}
        </FormHelperText>
        <FormHelperText variant='body2' sx={{ color: '#6B6B6B', marginBottom: '8px' }}>
            {error && error.message}
        </FormHelperText>
    </>
);


const DialogFormTestimonial = (props) => {

    const { mode, open, toggle, dataToEdit, onSuccess } = props;

    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            description: '',
            status: '',
            image: ''
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })


    const [selectedFileNames, setSelectedFileNames] = useState({
        image: '',
    })
    const [ImageFile, setImageFile] = useState()
    const handleFileChange = (inputName, e) => {
        const selectedFile = e.target.files[0]
        if (selectedFile) {
            switch (inputName) {
                case 'image':
                    setImageFile(selectedFile)
                    setSelectedFileNames({ ...selectedFileNames, image: selectedFile.name })
                    break
                default:
                    break
            }
        }
    }

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Testimonials" : "Edit Testimonials");

            if (mode === "edit" && dataToEdit) {
                setSelectedFileNames({ image: dataToEdit.image || '' });
                setImageFile(dataToEdit.image || null);
            } else {
                setSelectedFileNames({ image: '' });
                setImageFile(null);
            }

            reset({
                name: dataToEdit?.name || '',
                description: dataToEdit?.description || '',
                status: dataToEdit?.status || '',
                image: '', // Reset image input value
            });
        }
    }, [dataToEdit, mode, open, reset]);

    const onSubmit = (data) => {

        const payload = new FormData();
        payload.append('name', data.name)
        payload.append('description', data.description)
        payload.append('image', ImageFile);
        payload.append('status', data.status)

        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.Testimonials.edit(dataToEdit._id), payload, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.Testimonials.create, payload, {
                    headers: {
                        'Content-Type': 'multipart/form-data'
                    }
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
        <Dialog open={open} onClose={toggle} fullWidth maxWidth='sm' scroll="paper">
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
                <form id="plan-service-form" onSubmit={handleSubmit(onSubmit)}>
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
                                            autoFocus
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
                                <FormLabel required htmlFor='description' error={Boolean(errors.description)}>Description</FormLabel>
                                <Controller
                                    name="description"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Description'
                                            multiline
                                            rows={4}
                                            autoFocus
                                            onChange={onChange}
                                            id='description'
                                            value={value}
                                            error={Boolean(errors.description)}
                                            maxLength={250}
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
                                <FormLabel required htmlFor='image'>Image</FormLabel>
                                <FileInput
                                    inputId='image'
                                    accept='.jpg, .jpeg, .png,.pdf'
                                    onChange={e => handleFileChange('image', e)}
                                    selectedFileName={selectedFileNames.image}
                                    error={Boolean(errors.image)}
                                />
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
                    form="plan-service-form"
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

export default DialogFormTestimonial