import React, { useEffect, useState } from 'react'
import Dialog from '@mui/material/Dialog'
import DialogTitle from '@mui/material/DialogTitle'
import DialogContent from '@mui/material/DialogContent'
import {
    Typography,
    Box,
    Button,
    InputLabel,
    FormControl,
} from '@mui/material'
import IconButton from '@mui/material/IconButton'
import Close from 'mdi-material-ui/Close'
import * as yup from 'yup';
import { Controller, useForm } from 'react-hook-form'
import { yupResolver } from '@hookform/resolvers/yup'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import toast from 'react-hot-toast'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { LoadingButton } from "@mui/lab";

const validationSchema = yup.object({
    content: yup.string().required("content is required"),
});

export default function DialogPrivacyPolicy(props) {

    const [loading, setLoading] = useState(false)
    const { open, toggle, operationMode, dataToEdit, onSuccess } = props;
    const [dialogTitle, setDialogTitle] = useState("")
    const {
        reset,
        control,
        handleSubmit,
        setValue,
        formState: { errors },
    } = useForm({
        defaultValues: {
            content: "",
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    });


    const onSubmit = (data) => {
        const payload = {
            content: data.content || '',
        };

        setLoading(true);

        let apiCall;
        if (operationMode === "add") {
            apiCall = axiosInstance.post(ApiEndPoints.PRIVACY_POLICY.edit, payload);
        } else {
            apiCall = axiosInstance.patch(ApiEndPoints.PRIVACY_POLICY.edit, payload);
        }

        apiCall
            .then((response) => {
                if (operationMode === "add") {
                    toast.success(response.data.message || "Services cost added successfully");
                } else {
                    toast.success(response.data.message);
                }
                toggle();
                onSuccess();
            })
            .catch((error) => {
                // Handle errors here
            })
            .finally(() => {
                setLoading(false);
            });
    };


    useEffect(() => {
        if (open) {
            setDialogTitle(operationMode === "add" ? "Add Privacy Policy " : "Edit Privacy Policy")
            reset(operationMode === "add" ? {
                content: "",

            } : {
                content: dataToEdit?.content || "",
            })
        }
    }, [dataToEdit, open, operationMode, reset])

    return (
        <Dialog open={open} maxWidth="sm" fullWidth>
            <DialogTitle>
                <Typography variant='h6' component='span' sx={{
                    textTransform: "uppercase",
                }}>
                    {dialogTitle}
                </Typography>

                <IconButton
                    onClick={toggle}
                    sx={{ top: 10, right: 10, position: 'absolute', color: 'grey.500' }}
                >
                    <Close />
                </IconButton>
            </DialogTitle>
            <form onSubmit={handleSubmit(onSubmit)} className='auth__form'>
                <DialogContent dividers sx={{ display: "flex", flexDirection: "column", gap: 2 }}>

                    <Box>
                        <InputLabel>Content</InputLabel>
                        <FormControl fullWidth>
                            <Controller
                                name='content'
                                control={control}
                                defaultValue=''
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
                        </FormControl>
                    </Box>

                    <Box sx={{
                        display: 'flex',
                        justifyContent: 'center', my: 4, gap: 2
                    }}>
                        <LoadingButton
                            size="large"
                            type="submit"
                            variant="contained"
                            loading={loading}
                        >
                            Submit
                        </LoadingButton>
                        <Button size="large" variant="outlined" onClick={toggle}>
                            Cancel
                        </Button>
                    </Box>
                </DialogContent>
            </form>
        </Dialog >

    )
}