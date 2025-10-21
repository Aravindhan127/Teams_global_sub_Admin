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
import { CleaveNumberInput } from "src/@core/components/cleave-components";

const validationSchema = yup.object().shape({
    question: yup.string().trim().required('Please add a question.'),
    answer: yup.string().trim().required('Please enter an answer.'),
    status: yup.string().trim().required('Please select a status'),
    serial_number: yup
        .number('Must be positive number only')
        .positive('Must be positive number only')
        .typeError('Must be positive number only')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .default(0) // Set a default value to avoid unnecessary nullable logic
        .required('Serial Number is Required'),
})



const DialogFormFaqs = (props) => {
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
            question: '',
            answer: '',
            serial_number: '',
            status: '',
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })



    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create FAQS" : "Edit FAQS");
            reset({
                serial_number: dataToEdit?.serial_number || '',
                question: dataToEdit?.question || '',
                answer: dataToEdit?.answer || '',
                status: dataToEdit?.status || '',
            });
        }
    }, [dataToEdit, mode, open, reset]);




    const onSubmit = (data) => {
        let payload = {
            serial_number: data.serial_number,
            question: data.question,
            answer: data.answer,
            status: data.status
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.FAQ.edit(dataToEdit._id), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.FAQ.create, payload, {
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
                                <FormLabel required htmlFor='serial_number' error={Boolean(errors.serial_number)}>Serial Number</FormLabel>
                                <Controller
                                    name="serial_number"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Serial Number'
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='serial_number'
                                            value={value}
                                            error={Boolean(errors.serial_number)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.serial_number && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.serial_number.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='question' error={Boolean(errors.question)}>Question</FormLabel>
                                <Controller
                                    name="question"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Question'
                                            multiline
                                            rows={2}
                                            onChange={onChange}
                                            id='question'
                                            value={value}
                                            error={Boolean(errors.question)}
                                        />
                                    }
                                />
                                {errors.question && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.question.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='answer' error={Boolean(errors.answer)}>Answer</FormLabel>
                                <Controller
                                    name="answer"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Answer'
                                            multiline
                                            rows={4}
                                            onChange={onChange}
                                            id='answer'
                                            value={value}
                                            error={Boolean(errors.answer)}
                                        />
                                    }
                                />
                                {errors.answer && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.answer.message}
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

export default DialogFormFaqs