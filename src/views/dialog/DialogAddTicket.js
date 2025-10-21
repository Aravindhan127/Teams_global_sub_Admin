import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormControlLabel, FormHelperText, FormLabel, Grid, IconButton, MenuItem, Radio, RadioGroup, Select, TextField, Typography } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";
import { CleaveNumberInput } from "src/@core/components/cleave-components";
import DatePicker from 'react-datepicker'
import "react-datepicker/dist/react-datepicker.css";

const validationSchema = yup.object().shape({
    // userEmail: yup
    //     .string()
    //     .required("Email is required")
    //     .max(50, "The email should have at most 50 characters")
    //     .matches(
    //         /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
    //         "Email address must be a valid address"
    //     ),
    // firstName: yup.string().trim().required('First name is required'),
    // lastName: yup.string().trim().required('Last name is required'),
    // password: yup.string().trim().required('Password is required'),
    // roleId: yup.string().trim().required('Role Id is required'),
})

const DialogAddTicket = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess, role, setAddedTickets } = props;

    console.log("role", role);
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [categoryData, setCategoryData] = useState([])

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            categoryId: '',
            description: '',
            price: '',
            quantity: ''

        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    const fetchCategoryData = () => {
        setLoading(true);
        axiosInstance
            .get(ApiEndPoints?.EVENT_CATEGORY?.list)
            .then((response) => {
                setCategoryData(response?.data?.data?.eventCategoryList);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Add Ticket" : "Edit Ticket");
            reset({
                description: dataToEdit?.description || '',
                price: dataToEdit?.price || '',
                quantity: dataToEdit?.quantity || '',
            });
        }

    }, [dataToEdit, mode, open, reset]);

    useEffect(() => {
        fetchCategoryData();
    }, [])

    const onSubmit = (data) => {
        console.log("data", data)
        setAddedTickets((prevTickets) => [...prevTickets, data]);
        toggle();
    }


    return <>
        <Dialog open={open} fullWidth maxWidth='sm' scroll="paper">
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                {dialogTitle}
                <IconButton aria-label='close' onClick={toggle} sx={{ color: theme => theme.palette.grey[500] }}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>
            <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
                <form id="form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>

                        <Grid item xs={12}>
                            <FormControl component="fieldset" fullWidth>
                                <FormLabel component="legend" error={Boolean(errors.paymentType)}>
                                    Payment Type
                                </FormLabel>
                                <Controller
                                    name="paymentType"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <RadioGroup
                                            value={value}
                                            onChange={(e) => {
                                                onChange(e);
                                                // Optionally, handle additional logic when payment type changes
                                            }}
                                            row
                                        >
                                            <FormControlLabel value="free" control={<Radio />} label="Free" />
                                            <FormControlLabel value="paid" control={<Radio />} label="Paid" />
                                        </RadioGroup>
                                    )}
                                />
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='categoryId' error={Boolean(errors.categoryId)}>Category</FormLabel>
                                <Controller
                                    name='categoryId'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Select
                                            id="categoryId"
                                            value={value}
                                            onChange={onChange}
                                            error={Boolean(errors.categoryId)}
                                        >
                                            <MenuItem disabled>
                                                Select Category
                                            </MenuItem>
                                            {categoryData.map((item) => (
                                                <MenuItem key={item.categoryId} value={`${item.categoryId}-${item.name}`}>
                                                    {item.name}
                                                </MenuItem>
                                            ))}

                                        </Select>
                                    )}
                                />
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='description' error={Boolean(errors.description)}>Description</FormLabel>
                                <Controller
                                    name='description'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="description"
                                            value={value}
                                            onChange={onChange}
                                            placeholder='Enter Description'
                                            error={Boolean(errors.description)}
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
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="price" error={Boolean(errors.price)}>
                                    Price
                                </FormLabel>
                                <Controller
                                    name="price"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="price"
                                            value={value}
                                            onChange={onChange}
                                            placeholder="Enter Price"
                                            error={Boolean(errors.price)}
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                inputComponent: CleaveNumberInput,
                                            }}
                                        />
                                    )}
                                />
                                {errors.price && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.price.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="quantity" error={Boolean(errors.quantity)}>
                                    Quantity
                                </FormLabel>
                                <Controller
                                    name="quantity"
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            id="quantity"
                                            value={value}
                                            onChange={onChange}
                                            placeholder="Enter quantity"
                                            error={Boolean(errors.quantity)}
                                            fullWidth
                                            variant="outlined"
                                            InputProps={{
                                                inputComponent: CleaveNumberInput,
                                            }}
                                        />
                                    )}
                                />
                                {errors.quantity && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.quantity.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                    </Grid>
                </form>
            </DialogContent>
            {/* {mode !== 'view' && ( */}
            <DialogActions>
                <LoadingButton
                    size="large"
                    type="submit"
                    form="form"
                    variant="contained"
                    loading={loading}
                >
                    {mode === 'edit' ? 'Update' : 'Add'}
                </LoadingButton>
                <Button size="large" variant="outlined" onClick={toggle}>
                    Cancel
                </Button>
            </DialogActions>
            {/* )} */}

        </Dialog >
    </>
}

export default DialogAddTicket
