import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, MenuItem, Radio, RadioGroup, Select, TextField } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";

const validationSchema = yup.object().shape({
    title: yup.string().trim().required('Please add a title.'),
    description: yup.string().trim().required('Please add a description'),
})

const DialogReferFriend = (props) => {
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
            title: '',
            subTitle: '',
            code: '',
            description: '',
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Refer Friend" : "Edit Refer Friend");
            reset({
                title: dataToEdit?.title || '',
                subTitle: dataToEdit?.subTitle || '',
                code: dataToEdit?.code || '',
                description: dataToEdit?.description || '',
            });
        }
    }, [dataToEdit, mode, open, reset]);




    const onSubmit = (data) => {
        let payload = {
            title: data.title,
            subTitle: data.subTitle,
            code: data.code,
            description: data.description,
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.REFER_FRIEND.edit(dataToEdit.type), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.REFER_FRIEND.create, payload, {
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
                <form id="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
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
                                <FormLabel required htmlFor='subTitle' error={Boolean(errors.subTitle)}>Sub Title</FormLabel>
                                <Controller
                                    name="subTitle"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Sub Title'
                                            onChange={onChange}
                                            id='subTitle'
                                            value={value}
                                            error={Boolean(errors.subTitle)}
                                        />
                                    }
                                />
                                {errors.subTitle && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.subTitle.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='code' error={Boolean(errors.code)}>Code</FormLabel>
                                <Controller
                                    name="code"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Code'
                                            onChange={onChange}
                                            id='code'
                                            value={value}
                                            error={Boolean(errors.code)}
                                        />
                                    }
                                />
                                {errors.code && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.code.message}
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
                                            multiline
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

                    </Grid>
                </form>
            </DialogContent>
            <DialogActions>
                <LoadingButton
                    size="large"
                    type="submit"
                    form="form"
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

export default DialogReferFriend