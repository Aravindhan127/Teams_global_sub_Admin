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
import { CleaveNumberInput } from "src/@core/components/cleave-components";
const validationSchema = yup.object().shape({
    //vehicleType: yup.string().trim().required('Please select a  vehicleType.'),
    //city: yup.string().trim().required('Please select a city.'),
    pricePerKg: yup.string().trim().required('Please enter pricePerKg .'),
    pricePerKm: yup.string().trim().required('Please enter pricePerKm .'),
    pricePerMin: yup.string().trim().required('Please enter pricePerMin .'),
    expressCharge: yup.string().trim().required('Please enter expressCharge.'),
    minimumFareUSD: yup.string().trim().required('Please enter minimumFareUSD.'),
    baseFareUSD: yup.string().trim().required('Please enter baseFareUSD.'),
    commissionPercentage: yup.string().trim().required('Please enter commissionPercentage.'),
    waitingTimeLimit: yup.string().trim().required('Please enter waitingTimeLimit.'),
    nightCharges: yup.string().trim().required('Please enter nightCharges.'),
    userCancellationTimeLimit: yup.string().trim().required('Please enter userCancellationTimeLimit.'),
    priceNightCharges: yup.string().trim().required('Please enter priceNightCharges.'),
    userCancellationCharges: yup.string().trim().required('Please enter userCancellationCharges.'),
    waitingChargesUSD: yup.string().trim().required('Please enter waitingChargesUSD.'),
    status: yup.string().trim().required('Please select a status'),
})
const DialogPriceManagement = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess } = props;
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const searchTimeoutRef = useRef()
    const [search, setSearch] = useState(null)
    const [city, setCity] = useState([])

    const {
        control,
        handleSubmit,
        reset,
        formState: { errors }
    } = useForm({
        defaultValues: {
            vehicleType: '',
            city: '',
            pricePerKg: '',
            pricePerKm: '',
            pricePerMin: '',
            minimumFareUSD: '',
            baseFareUSD: '',
            commissionPercentage: '',
            userCancellationTimeLimit: '',
            waitingTimeLimit: '',
            nightCharges: '',
            priceNightCharges: '',
            expressCharge: '',
            status: ''
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Price" : "Edit Price");
            reset({
                vehicleType: dataToEdit?.vehicleType || '',
                city: dataToEdit?.city || '',
                pricePerKg: dataToEdit?.pricePerKg,
                pricePerKm: dataToEdit?.pricePerKm,
                pricePerMin: dataToEdit?.pricePerMin,
                minimumFareUSD: dataToEdit?.minimumFareUSD,
                baseFareUSD: dataToEdit?.baseFareUSD,
                waitingChargesUSD: dataToEdit?.waitingChargesUSD,
                commissionPercentage: dataToEdit?.commissionPercentage,
                userCancellationCharges: dataToEdit?.userCancellationCharges,
                userCancellationTimeLimit: dataToEdit?.userCancellationTimeLimit,
                waitingTimeLimit: dataToEdit?.waitingTimeLimit,
                nightCharges: dataToEdit?.nightCharges,
                priceNightCharges: dataToEdit?.priceNightCharges,
                expressCharge: dataToEdit?.expressCharge,
                status: dataToEdit?.status
            });
        }
    }, [dataToEdit, mode, open, reset]);

    const [vehicle, setVehicle] = useState([])
    const handleSearchChange = e => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }
    const getVehicelType = ({ search }) => {
        //setLoading(true)
        axiosInstance
            .get(ApiEndPoints.VEHICLE_TYPE.list, {
                params: {
                    search: search,
                }
            })
            .then(response => {
                setVehicle(response.data.data.vehicletype)
            })
            .catch(error => {
            })
            .finally(() => {
                setLoading(false)
            })
    }
    const getCity = ({ search }) => {
        //setLoading(true)
        axiosInstance
            .get(ApiEndPoints.CITY_MANAGEMENT.list, {
                params: {
                    search: search,
                }
            })
            .then(response => {
                setCity(response.data.data.city)
            })
            .catch(error => {
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        if (open) {
            getVehicelType({
                search: search
            })
            getCity({
                search: search
            })
        }
    }, [open, search])


    const onSubmit = (data) => {
        let payload = {
            vehicleType: data.vehicleType?._id,
            city: data.city?.map(item => ({
                _id: item._id,
            })),
            // city: data.city?._id,
            pricePerKg: data.pricePerKg,
            pricePerKm: data.pricePerKm,
            pricePerMin: data.pricePerMin,
            minimumFareUSD: data.minimumFareUSD,
            baseFareUSD: data.baseFareUSD,
            commissionPercentage: data.commissionPercentage,
            userCancellationTimeLimit: data.userCancellationTimeLimit,
            userCancellationCharges: data.userCancellationCharges,
            waitingTimeLimit: data.waitingTimeLimit,
            waitingChargesUSD: data.waitingChargesUSD,
            nightCharges: data.nightCharges,
            priceNightCharges: data.priceNightCharges,
            expressCharge: data.expressCharge,
            status: data.status
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.PRICE_MANAGEMENT.edit(dataToEdit._id), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.PRICE_MANAGEMENT.create, payload, {
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
                <form id="price-form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="vehicleType" error={Boolean(errors.vehicleType)}>Vehicle Type</FormLabel>
                                <Controller
                                    name='vehicleType'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Autocomplete
                                            options={vehicle || []}
                                            value={value || null}
                                            onChange={(e, newValue) => {
                                                onChange(newValue)
                                            }}
                                            getOptionLabel={option => option?.name || null}
                                            renderInput={params => (
                                                <TextField
                                                    placeholder='Select Vehicle Type'
                                                    error={Boolean(errors.vehicleType)}
                                                    {...params}
                                                    onChange={handleSearchChange}
                                                />
                                            )}
                                        />
                                    )}
                                />
                                {errors.vehicleType && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.vehicleType.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="city" error={Boolean(errors.city)}>Select City</FormLabel>
                                <Controller
                                    name='city'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Autocomplete
                                            multiple
                                            options={city}
                                            error={Boolean(errors.city)}
                                            onChange={(e, newValue) => {
                                                onChange(newValue)
                                            }}
                                            value={value || []}
                                            filterSelectedOptions
                                            getOptionLabel={option => option.city || null}
                                            isOptionEqualToValue={(option, value) => option._id === value._id}
                                            renderInput={params => (
                                                <TextField
                                                    placeholder='Select City'
                                                    error={Boolean(errors.city)}
                                                    {...params}
                                                    onChange={handleSearchChange}
                                                />
                                            )}
                                        />
                                    )}
                                />
                                {/* <Controller
                                    name='city'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Autocomplete
                                            options={city || []}
                                            value={value || null}
                                            onChange={(e, newValue) => {
                                                onChange(newValue)
                                            }}
                                            getOptionLabel={option => option?.city || null}
                                            renderInput={params => (
                                                <TextField
                                                    placeholder='Select City'
                                                    error={Boolean(errors.city)}
                                                    {...params}
                                                    onChange={handleSearchChange}
                                                />
                                            )}
                                        />
                                    )}
                                /> */}
                                {errors.city && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='pricePerKg' error={Boolean(errors.pricePerKg)}>PricePerKg</FormLabel>
                                <Controller
                                    name="pricePerKg"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='pricePerKg'
                                            value={value}
                                            error={Boolean(errors.pricePerKg)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.pricePerKg && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.pricePerKg.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='pricePerKm' error={Boolean(errors.pricePerKm)}>PricePerKm</FormLabel>
                                <Controller
                                    name="pricePerKm"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='pricePerKm'
                                            value={value}
                                            error={Boolean(errors.pricePerKm)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.pricePerKm && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.pricePerKm.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='pricePerMin' error={Boolean(errors.pricePerMin)}>PricePerMin</FormLabel>
                                <Controller
                                    name="pricePerMin"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='pricePerMin'
                                            value={value}
                                            error={Boolean(errors.pricePerMin)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.pricePerMin && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.pricePerMin.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='minimumFareUSD' error={Boolean(errors.minimumFareUSD)}>MinimumFareUSD</FormLabel>
                                <Controller
                                    name="minimumFareUSD"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='minimumFareUSD'
                                            value={value}
                                            error={Boolean(errors.minimumFareUSD)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.minimumFareUSD && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.minimumFareUSD.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='baseFareUSD' error={Boolean(errors.baseFareUSD)}>BaseFareUSD</FormLabel>
                                <Controller
                                    name="baseFareUSD"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='baseFareUSD'
                                            value={value}
                                            error={Boolean(errors.baseFareUSD)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.baseFareUSD && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.baseFareUSD.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='commissionPercentage' error={Boolean(errors.commissionPercentage)}>
                                    CommissionPercentage
                                </FormLabel>
                                <Controller
                                    name="commissionPercentage"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='commissionPercentage'
                                            value={value}
                                            error={Boolean(errors.commissionPercentage)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.commissionPercentage && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.commissionPercentage.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='userCancellationTimeLimit' error={Boolean(errors.userCancellationTimeLimit)}>
                                    UserCancellationTimeLimit
                                </FormLabel>
                                <Controller
                                    name="userCancellationTimeLimit"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='userCancellationTimeLimit'
                                            value={value}
                                            error={Boolean(errors.userCancellationTimeLimit)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.userCancellationTimeLimit && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.userCancellationTimeLimit.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='userCancellationCharges' error={Boolean(errors.userCancellationCharges)}>
                                    UserCancellationCharges
                                </FormLabel>
                                <Controller
                                    name="userCancellationCharges"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='userCancellationCharges'
                                            value={value}
                                            error={Boolean(errors.userCancellationCharges)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.userCancellationCharges && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.userCancellationCharges.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='waitingTimeLimit' error={Boolean(errors.waitingTimeLimit)}>
                                    WaitingTimeLimit
                                </FormLabel>
                                <Controller
                                    name="waitingTimeLimit"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="waitingTimeLimit"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='waitingTimeLimit'
                                            value={value}
                                            error={Boolean(errors.waitingTimeLimit)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.waitingTimeLimit && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.waitingTimeLimit.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='waitingChargesUSD' error={Boolean(errors.waitingChargesUSD)}>
                                    WaitingChargesUSD
                                </FormLabel>
                                <Controller
                                    name="waitingChargesUSD"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='waitingChargesUSD'
                                            value={value}
                                            error={Boolean(errors.waitingChargesUSD)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.waitingChargesUSD && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.waitingChargesUSD.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='nightCharges' error={Boolean(errors.nightCharges)}>
                                    Night Charges
                                </FormLabel>
                                <Controller
                                    name='nightCharges'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <RadioGroup row name='nightCharges' onChange={onChange} value={value}>
                                            <FormControlLabel value={true} control={<Radio />} label='Yes' />
                                            <FormControlLabel value={false} control={<Radio />} label='No' />
                                        </RadioGroup>
                                    )}
                                />
                                {errors.nightCharges && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.nightCharges.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='expressCharge' error={Boolean(errors.expressCharge)}>
                                    ExpressCharge
                                </FormLabel>
                                <Controller
                                    name="expressCharge"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='expressCharge'
                                            value={value}
                                            error={Boolean(errors.expressCharge)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.expressCharge && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.expressCharge.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='priceNightCharges' error={Boolean(errors.priceNightCharges)}>
                                    priceNightCharges
                                </FormLabel>
                                <Controller
                                    name="priceNightCharges"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='priceNightCharges'
                                            value={value}
                                            error={Boolean(errors.priceNightCharges)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.priceNightCharges && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.priceNightCharges.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='status' error={Boolean(errors.status)}>
                                    Status
                                </FormLabel>
                                <Controller
                                    name='status'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <RadioGroup row name='status' onChange={onChange} value={value}>
                                            <FormControlLabel sx={errors.status ? { color: 'error.main' } : null} value={'active'} control={<Radio sx={errors.status ? { color: 'error.main' } : null} />} label='Active' />
                                            <FormControlLabel sx={errors.status ? { color: 'error.main' } : null} value={'inactive'} control={<Radio sx={errors.status ? { color: 'error.main' } : null} />} label='Inactive' />
                                        </RadioGroup>
                                    )}
                                />
                                {errors.status && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.status.message}</FormHelperText>
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
                    form="price-form"
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

export default DialogPriceManagement