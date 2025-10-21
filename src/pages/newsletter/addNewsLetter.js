import React, { useEffect, useState } from 'react'
import { Box, Typography, FormControl, Grid, FormLabel, FormHelperText, TextField, Card } from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useDropzone } from 'react-dropzone'
import * as yup from 'yup'
import Translations from 'src/layouts/components/Translations'
import useCustomTranslation from 'src/@core/hooks/useCustomTranslation'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { toastError, toastSuccess } from 'src/utils/utils'
import DialogConfirmation from 'src/views/dialog/DialogConfirmation'
import CustomFileUploads from 'src/views/common/CustomFileUploads'
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const validationSchema = yup.object({
    title: yup.string().required('Title is required'),
    content: yup.string().required('content is required'),
    category: yup.string().trim().required('Category is required'),
    author: yup.string().trim().required('Author is required'),
    newMedia: yup.mixed()
        .required("Media is required")
        .test("fileSize", "File size must be 50MB or less for images and 250MB or less for PDFs", (value) => {
            if (typeof value === "string") return true;
            if (!value) return true;

            const isPDF = value.type === "application/pdf";
            const maxSize = isPDF ? 250 * 1024 * 1024 : 50 * 1024 * 1024; // 250MB for PDFs, 50MB for images

            return value.size <= maxSize;
        })
        .test("fileType", "Unsupported file format. Only PDFs and images (JPG, PNG) are allowed.", (value) => {
            if (typeof value === "string") return true;
            return !value || /(image\/(jpeg|jpg|png)|application\/pdf)/.test(value.type);
        }),

})

function AddNewsLetterPage() {
    const [loading, setLoading] = useState(false)
    const [file, setFile] = useState(null)
    const location = useLocation()
    const dataToEdit = location?.state?.dataToEdit
    console.log("dataToEdit", dataToEdit)
    const translation = useCustomTranslation()
    const [open, setOpen] = useState(false)
    const [mode, setMode] = useState('add')

    const navigate = useNavigate()
    const toggleDialog = () => {
        setOpen(prev => !prev)
    }

    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })


    useEffect(() => {
        setLoading(false);
        setMode(location?.state?.mode)

        reset({
            title: dataToEdit?.title || '',
            content: dataToEdit?.content || '',
            category: dataToEdit?.category || '',
            author: dataToEdit?.author || '',
            newMedia: mode === "edit" ? dataToEdit?.newsMediaUrl || '' : '',
            ...(mode === "edit" && { newsLetterId: dataToEdit?.newsletterId || '' })

        });
    }, [dataToEdit, mode, reset]);


    //   const onSubmit = data => {
    //     const payload = new FormData()
    //     if (file) {
    //       payload.append('images', file)
    //     }
    //     payload.append('title', data?.title)
    //     payload.append('content', data?.content)

    //     setLoading(true)
    //     axiosInstance
    //       .post(ApiEndPoints.NEWS.create('news'), payload, {
    //         headers: {
    //           'Content-Type': 'multipart/form-data'
    //         }
    //       })
    //       .then(response => response.data)
    //       .then(response => {
    //         // toastSuccess(response.message)
    //         toggleDialog()
    //       })
    //       .catch(error => {
    //         toastError(error)
    //       })
    //       .finally(() => {
    //         setLoading(false)
    //       })
    //   }
    const onSubmit = (data) => {
        console.log("data", data)
        let payload = new FormData();
        payload.append('title', data.title);
        payload.append('content', data.content);
        payload.append('category', data.category);
        payload.append('author', data.author);

        if (typeof data.newMedia !== "string" && data.newMedia) {
            payload.append('newMedia', data.newMedia);
        }
        if (mode === "edit") {
            payload.append('newsLetterId', dataToEdit.newsletterId);
        }

        setLoading(true);
        let apiInstance = null;
        if (mode === "edit") {
            apiInstance = axiosInstance
                .post(ApiEndPoints.NEWSLETTER.edit, payload,
                    {
                        headers: { 'Content-Type': 'multipart/form-data' }
                    })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.NEWSLETTER.create, payload, {
                    headers: { 'Content-Type': 'multipart/form-data' }
                })
        }
        apiInstance
            .then((response) => response.data)
            .then((response) => {
                // onSuccess();
                toastSuccess(response.message);
                navigate('/newsletter')
                // toggle();
            })
            .catch((error) => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false);
            })
    }
    const accordionStyle = {
        borderRadius: '10px',
        marginBottom: 5,
        border: '1px solid #DFDFE3'
    }
    console.log("mode", mode)
    return (
        <>
            <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                <Card sx={{ p: 10 }}>

                    <Box display='flex' flexDirection='column' gap={2} mb={5}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <ArrowBackIcon onClick={() => navigate('/newsletter')} />
                            <Typography variant='h6' fontWeight={600}>
                                News
                            </Typography>
                        </Box>

                        <Typography variant='body2' color='textSecondary'>
                            Please Provide News Content Below.
                        </Typography>
                    </Box>

                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='title' error={Boolean(errors.title)}>Title</FormLabel>
                                <Controller
                                    name='title'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="title"
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Enter Title'
                                            error={Boolean(errors.title)}
                                        />
                                    )}
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
                                <FormLabel htmlFor='content' error={Boolean(errors.content)}>Content</FormLabel>
                                <Controller
                                    name='content'
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
                                                    // ['link', 'image', 'video'],
                                                    ['clean'],
                                                ],
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
                                                // 'image',
                                                // 'video',
                                                'color',
                                                'background',
                                            ]}
                                            onChange={(value) => {
                                                setValue('content', value, { shouldValidate: true });
                                                field.onChange(value);
                                            }}
                                        />
                                    )}
                                />
                                {errors.content && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.content.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='category' error={Boolean(errors.category)}>Category</FormLabel>
                                <Controller
                                    name='category'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="category"
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Enter Category'
                                            error={Boolean(errors.category)}
                                        />
                                    )}
                                />
                                {errors.category && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.category.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='author' error={Boolean(errors.author)}>Author</FormLabel>
                                <Controller
                                    name='author'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="author"
                                            value={value}
                                            onChange={onChange}

                                            placeholder='Enter Author'
                                            error={Boolean(errors.author)}
                                        />
                                    )}
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
                                <FormLabel>Media</FormLabel>
                                <Controller
                                    name="newMedia"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <CustomFileUploads
                                            multiple={false}
                                            subtitle="(Max file size 3mb)"
                                            minHeight="100px"
                                            files={value}
                                            onChange={onChange}
                                            title={"Add Image"}
                                            MediaUrl='http://103.204.189.64:4003'
                                        />
                                    )}
                                />
                                {errors?.newMedia && (
                                    <FormHelperText sx={{ color: "error.main" }}>
                                        {errors?.newMedia?.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                    </Grid>

                    <Box display='flex' alignItems='end' justifyContent='end' gap={2} mt={5}>
                        <LoadingButton
                            onClick={() => navigate('/newsletter')}
                            size='large'
                            variant='outlined'

                        >
                            Cancel
                        </LoadingButton>

                        <LoadingButton
                            type='submit'
                            variant='contained'
                            size='large'
                            loading={loading}
                        >
                            {mode === 'edit' ? 'Update' : 'Add'}
                        </LoadingButton>
                    </Box>

                </Card>
            </form>
            <DialogConfirmation
                open={open}
                title='Added Successfully.'
                subtitle='You have added  news successfully.'
                buttonTilte='Okay'
                buttonClick='/news'
            />
        </>
    )
}

export default AddNewsLetterPage