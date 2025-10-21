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

const validationSchema = yup.object().shape({
    title: yup.string().trim().required('Please add a question.'),
    subTitle: yup.string().trim().required('Please enter an answer.'),
    status: yup.string().trim().required('Please select a status'),
})



const DialogFormHelp = (props) => {
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
            status: '',
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })



    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Helps" : "Edit Helps");
            reset({
                title: dataToEdit?.title || '',
                subTitle: dataToEdit?.subTitle || '',
                status: dataToEdit?.status || '',
            });
        }
    }, [dataToEdit, mode, open, reset]);




    const onSubmit = (data) => {
        let payload = {
            title: data.title,
            subTitle: data.subTitle,
            status: data.status
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.HELP.edit(dataToEdit._id), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.HELP.create, payload, {
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
                <form id="hub-address-form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='title' error={Boolean(errors.question)}>Question</FormLabel>
                                <Controller
                                    name="title"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Question'
                                            multiline
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
                                <FormLabel required htmlFor='subTitle' error={Boolean(errors.subTitle)}>Answer</FormLabel>
                                <Controller
                                    name="subTitle"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Answer'
                                            multiline
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
                    form="hub-address-form"
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

export default DialogFormHelp