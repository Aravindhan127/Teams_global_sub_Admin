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
import ReactQuill from "react-quill";
import 'react-quill/dist/quill.snow.css'

const validationSchema = yup.object().shape({
    title: yup.string().trim().required('Please enter your title.').max(25, 'Title must be at most 25 characters.'),
    subtitle: yup.string().trim().required('Please enter your subtitle.').max(80, 'Subtitle must be at most 80 characters.'),
    description: yup.string().trim().required('Please enter a description.'),
    status: yup.string().trim().required('Please select a status'),
});


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

const Dialogblog = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess } = props;

    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            author: '',
            title: '',
            subtitle: '',
            description: '',
            status: '',
            image: ''
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    });

    const [selectedFileNames, setSelectedFileNames] = useState({
        image: '',
        author_image: ''
    });

    const [ImageFile, setImageFile] = useState(null);
    const [AuthorImage, setAuthorImage] = useState(null);

    const handleFileChange = (inputName, e) => {
        const selectedFile = e.target.files[0];
        if (selectedFile) {
            switch (inputName) {
                case 'image':
                    setImageFile(selectedFile);
                    setSelectedFileNames({ ...selectedFileNames, image: selectedFile.name });
                    break;
                case 'author_image':
                    setAuthorImage(selectedFile);
                    setSelectedFileNames({ ...selectedFileNames, author_image: selectedFile.name });
                    break;
                default:
                    break;
            }
        }
    };

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Blog" : "Edit Blog");

            if (mode === "edit" && dataToEdit) {
                setSelectedFileNames({
                    image: dataToEdit?.image || '',
                    author_image: dataToEdit?.author_image || ''
                });
                setImageFile(null); // Set to null or initial value
                setAuthorImage(null); // Set to null or initial value
            } else {
                setSelectedFileNames({ image: '', author_image: '' });
                setImageFile(null);
                setAuthorImage(null);
            }

            reset({
                author: dataToEdit?.author || '',
                title: dataToEdit?.title || '',
                subtitle: dataToEdit?.subtitle || '',
                description: dataToEdit?.description || '',
                status: dataToEdit?.status || '',
            });
        }
    }, [dataToEdit, mode, open, reset]);

    const onSubmit = (data) => {
        const payload = new FormData();
        payload.append('author', data.author);
        payload.append('title', data.title);
        payload.append('subtitle', data.subtitle);
        payload.append('description', data.description);
        payload.append('status', data.status);

        if (ImageFile) {
            payload.append('image', ImageFile);
        }

        if (AuthorImage) {
            payload.append('author_image', AuthorImage);
        }

        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance.patch(ApiEndPoints.BLOG.edit(dataToEdit._id), payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        } else {
            apiInstance = axiosInstance.post(ApiEndPoints.BLOG.create, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data'
                }
            });
        }

        apiInstance
            .then((response) => response.data)
            .then((response) => {
                onSuccess();
                toastSuccess(response.message);
                toggle();
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
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
                    <form id="blog-form" onSubmit={handleSubmit(onSubmit)}>
                        <Grid container spacing={4}>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel required htmlFor='author' error={Boolean(errors.author)}>Author</FormLabel>
                                    <Controller
                                        name="author"
                                        control={control}
                                        render={({ field: { value, onChange } }) =>
                                            <TextField
                                                placeholder='Enter Author Name'
                                                onChange={onChange}
                                                id='author'
                                                value={value}
                                                error={Boolean(errors.author)}
                                            />
                                        }
                                    />
                                    {errors.author && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.author.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel required htmlFor='author_image'>Author Image</FormLabel>
                                    <FileInput
                                        inputId='author_image' // Corrected inputId to 'author_image'
                                        accept='.jpg, .jpeg, .png, .pdf'
                                        onChange={e => handleFileChange('author_image', e)}
                                        selectedFileName={selectedFileNames.author_image}
                                        error={Boolean(errors.author_image)}
                                    />
                                    {errors.author_image && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.author_image.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth >
                                    <FormLabel required htmlFor='title' error={Boolean(errors.title)}>Title</FormLabel>
                                    <Controller
                                        name="title"
                                        control={control}
                                        render={({ field: { value, onChange } }) =>
                                            <TextField
                                                placeholder='Enter Title'
                                                onChange={onChange}
                                                id='title'
                                                value={value}
                                                error={Boolean(errors.title)}
                                            />
                                        }
                                    />
                                    {errors.title && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.title.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel required htmlFor='subtitle' error={Boolean(errors.subtitle)}>Sub Title</FormLabel>
                                    <Controller
                                        name="subtitle"
                                        control={control}
                                        render={({ field: { value, onChange } }) =>
                                            <TextField
                                                multiline
                                                placeholder='Enter subtitle'
                                                onChange={onChange}
                                                id='subtitle'
                                                value={value}
                                                error={Boolean(errors.subtitle)}
                                            />
                                        }
                                    />
                                    {errors.subtitle && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.subtitle.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel required htmlFor='image'>Image</FormLabel>
                                    <FileInput
                                        inputId='image' // Corrected inputId to 'image'
                                        accept='.jpg, .jpeg, .png, .pdf'
                                        onChange={e => handleFileChange('image', e)}
                                        selectedFileName={selectedFileNames.image}
                                        error={Boolean(errors.image)}
                                    />
                                    {errors.image && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.image.message}
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
                                                    setValue('description', value, { shouldValidate: true });
                                                    field.onChange(value);
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.description && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.description.message}
                                        </FormHelperText>
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
                        form="blog-form"
                        variant="contained"
                        loading={loading}
                    >
                        Submit
                    </LoadingButton>
                    <Button size="large" variant="outlined" onClick={toggle}>
                        Cancel
                    </Button>
                </DialogActions>
            </Dialog>
        </>
    );
};

export default Dialogblog;
