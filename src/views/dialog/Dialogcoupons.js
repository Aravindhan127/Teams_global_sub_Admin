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
import 'react-quill/dist/quill.snow.css'
import { CleaveNumberInput } from "src/@core/components/cleave-components";
import Datepicker from "../common/CustomDatepicker";

const validationSchema = yup.object().shape({
    subTitle: yup.string().trim().required('Please enter your subTitle.'),
    title: yup.string().trim().required('Please enter your Title.'),
    maxDiscountAmount: yup.string().trim().required('Max Discount Amount is Required')
});

const Dialogcoupons = (props) => {
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
            status: ''
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    });


    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Coupons" : "Edit Coupons");
            reset({
                title: dataToEdit?.title || '',
                subTitle: dataToEdit?.subTitle || '',
                usage_limit: dataToEdit?.usage_limit || '',
                start_date: dataToEdit?.start_date || '',
                end_date: dataToEdit?.end_date || '',
                type: dataToEdit?.type || '',
                minPurchaseAmount: dataToEdit?.minPurchaseAmount || '',
                maxDiscountAmount: dataToEdit?.maxDiscountAmount || '',
                status: dataToEdit?.status || ''
            });
        }
    }, [dataToEdit, mode, open, reset]);

    const onSubmit = (data) => {
        let payload = {
            title: data.title,
            subTitle: data.subTitle,
            usage_limit: data.usage_limit,
            start_date: data.start_date,
            end_date: data.end_date,
            type: data.type,
            minPurchaseAmount: data.minPurchaseAmount,
            maxDiscountAmount: data.maxDiscountAmount,
            status: data.status
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.COUPONS.edit(dataToEdit._id), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.COUPONS.create, payload, {
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
                                    <FormLabel required htmlFor='title' error={Boolean(errors.title)}>Title</FormLabel>
                                    <Controller
                                        name="title"
                                        control={control}
                                        render={({ field: { value, onChange } }) =>
                                            <TextField
                                                placeholder='Enter title'
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
                                                multiline
                                                placeholder='Enter subTitle'
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
                                    <FormLabel htmlFor='usage_limit' error={Boolean(errors.usage_limit)}>
                                        Usage Limit
                                    </FormLabel>
                                    <Controller
                                        name='usage_limit'
                                        control={control}
                                        rules={{ required: true, pattern: /^[0-9]*$/ }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                type='text'
                                                inputMode='numeric'
                                                value={value}
                                                autoComplete='off'
                                                onChange={(e, newValue) => onChange(newValue)}
                                                error={Boolean(errors.usage_limit)}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    inputComponent: CleaveNumberInput
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.usage_limit && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.usage_limit.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>

                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor="start_date" error={Boolean(errors.start_date)}>Start Date </FormLabel>
                                    <Controller
                                        name="start_date"
                                        control={control}
                                        render={({ field }) => (
                                            <Datepicker
                                                error={Boolean(errors.start_date)}
                                                value={field.value}
                                                onChange={(value) => field.onChange(value)}
                                                onDateChange={() => { }}
                                            />

                                        )}
                                    />
                                    {errors.start_date && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.start_date.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor="end_date" error={Boolean(errors.end_date)}>End Date </FormLabel>
                                    <Controller
                                        name="end_date"
                                        control={control}
                                        render={({ field }) => (
                                            <Datepicker
                                                error={Boolean(errors.end_date)}
                                                value={field.value}
                                                onChange={(value) => field.onChange(value)}
                                                onDateChange={() => { }}
                                            />

                                        )}
                                    />
                                    {errors.end_date && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.end_date.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='minPurchaseAmount' error={Boolean(errors.minPurchaseAmount)}>
                                        Min Purchase Amount
                                    </FormLabel>
                                    <Controller
                                        name='minPurchaseAmount'
                                        control={control}
                                        rules={{ required: true, pattern: /^[0-9]*$/ }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                type='text'
                                                inputMode='numeric'
                                                value={value}
                                                autoComplete='off'
                                                onChange={(e, newValue) => onChange(newValue)}
                                                error={Boolean(errors.minPurchaseAmount)}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    inputComponent: CleaveNumberInput
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.minPurchaseAmount && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.minPurchaseAmount.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12} md={6}>
                                <FormControl fullWidth>
                                    <FormLabel required htmlFor='maxDiscountAmount' error={Boolean(errors.maxDiscountAmount)}>
                                        Max Discount Amount
                                    </FormLabel>
                                    <Controller
                                        name='maxDiscountAmount'
                                        control={control}
                                        rules={{ required: true, pattern: /^[0-9]*$/ }}
                                        render={({ field: { value, onChange } }) => (
                                            <TextField
                                                type='text'
                                                inputMode='numeric'
                                                value={value}
                                                autoComplete='off'
                                                onChange={(e, newValue) => onChange(newValue)}
                                                error={Boolean(errors.maxDiscountAmount)}
                                                InputLabelProps={{ shrink: true }}
                                                InputProps={{
                                                    inputComponent: CleaveNumberInput
                                                }}
                                            />
                                        )}
                                    />
                                    {errors.maxDiscountAmount && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.maxDiscountAmount.message}</FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor='type' error={Boolean(errors.type)}>
                                        Type
                                    </FormLabel>
                                    <Controller
                                        name='type'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <RadioGroup row name='type' onChange={onChange} value={value}>
                                                <FormControlLabel value={'percentage'} control={<Radio />} label='Percentage' />
                                                <FormControlLabel value={'fixed_money'} control={<Radio />} label='Fixed Money' />
                                            </RadioGroup>
                                        )}
                                    />
                                    {errors.type && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.type.message}
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

export default Dialogcoupons;
