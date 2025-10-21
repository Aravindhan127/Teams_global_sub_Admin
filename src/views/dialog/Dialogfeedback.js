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

const validationSchema = yup.object().shape({
    questions: yup.string().trim().required('Please enter your questions.'),
});

const Dialogfeedback = (props) => {
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
            questions: '',
            keywords: '',
            status: ''
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    });

    const [keywords, setKeyword] = useState([])
    const [search, setSearch] = useState(null)
    const searchTimeoutRef = useRef()

    const getfeedback = ({ search }) => {
        //setLoading(true)
        axiosInstance
            .get(ApiEndPoints.FEEDBACK_CATEGORY.list, {
                params: {
                    search: search,
                }
            })
            .then(response => {
                setKeyword(response.data.data.category)
            })
            .catch(error => {
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        if (open) {
            getfeedback({
                search: search
            })
        }
    }, [open, search])
    const handleSearchChange = e => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Feddback" : "Edit Feddback");
            reset({
                questions: dataToEdit?.questions || '',
                keywords: dataToEdit?.keywords || [],
                status: dataToEdit?.status || '',
            });
        }
    }, [dataToEdit, mode, open, reset]);

    const onSubmit = (data) => {
        let payload = {
            questions: data.questions,
            keywords: data.keywords?.map(item => ({
                _id: item._id,
            })),
            status: data.status
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.FEEDBACK.edit(dataToEdit._id), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.FEEDBACK.create, payload, {
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
                                    <FormLabel required htmlFor='questions' error={Boolean(errors.title)}>Question</FormLabel>
                                    <Controller
                                        name="questions"
                                        control={control}
                                        render={({ field: { value, onChange } }) =>
                                            <TextField
                                                placeholder='Enter questions'
                                                onChange={onChange}
                                                id='questions'
                                                value={value}
                                                error={Boolean(errors.questions)}
                                            />
                                        }
                                    />
                                    {errors.questions && (
                                        <FormHelperText sx={{ color: 'error.main' }}>
                                            {errors.questions.message}
                                        </FormHelperText>
                                    )}
                                </FormControl>
                            </Grid>
                            <Grid item xs={12}>
                                <FormControl fullWidth>
                                    <FormLabel htmlFor="keywords" error={Boolean(errors.keywords)}>Keywords</FormLabel>
                                    <Controller
                                        name='keywords'
                                        control={control}
                                        render={({ field: { value, onChange } }) => (
                                            <Autocomplete
                                                multiple
                                                options={keywords}
                                                onChange={(e, newValue) => {
                                                    onChange(newValue)
                                                }}
                                                value={value || []}
                                                filterSelectedOptions
                                                getOptionLabel={option => option.name || null}
                                                isOptionEqualToValue={(option, value) => option._id === value._id}
                                                renderInput={params => (
                                                    <TextField
                                                        placeholder='Select Feedback Category'
                                                        error={Boolean(errors.keywords)}
                                                        {...params}
                                                        onChange={handleSearchChange}
                                                    />
                                                )}
                                            />
                                        )}
                                    />
                                    {errors.keywords && (
                                        <FormHelperText sx={{ color: 'error.main' }}>{errors.keywords.message}</FormHelperText>
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

export default Dialogfeedback;
