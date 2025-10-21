import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Grid, IconButton, TextField } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";
import { CleaveNumberInput, CleaveNumberInputPhone } from "src/@core/components/cleave-components";
import toast from "react-hot-toast";

const validationSchema = yup.object().shape({
    name: yup.string().trim().required('name is required'),
    address: yup.string().trim().required('address is required'),
    city: yup.string().trim().required('city is required'),
    pincode: yup
        .number('Must be positive number only')
        .positive('Must be positive number only')
        .typeError('Must be positive number only')
        .nullable()
        .transform((curr, orig) => (orig === '' ? null : curr))
        .default(0) // Set a default value to avoid unnecessary nullable logic
        .required('Pincode is Required'),
    state: yup.string().trim().required('state is required'),
    country: yup.string().trim().required('country is required'),
    phoneNumber: yup.string()
        .required('Mobile number is required').max(15, 'Mobile Number at most 10 characters'),
})



const DialogFormHubAddress = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess } = props;
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const [stateLoading, setStateLoading] = useState(false);
    const [countryLoading, setCountryLoading] = useState(false)
    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [countryIso, setCountryIso] = useState('')
    const [cityLoading, setCityLoading] = useState(false); // State for city loading

    const {
        control,
        handleSubmit,
        reset,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            name: '',
            address: '',
            pincode: '',
            city: dataToEdit?.city,
            state: dataToEdit?.state,
            country: '',
            phoneNumber: dataToEdit?.phoneNumber || ''
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })
    const getCountryList = async () => {
        setCountryLoading(true)
        axiosInstance
            .get(`${ApiEndPoints.GET_REGION.country}`, {
                headers: {
                    'X-CSCAPI-KEY': 'RmYyOHVGMnBSS0VoRUc5cTRMMmhnc2UwdE1WdVZqaHRicnhMbzJ6eA=='
                }
            })
            .then((response) => response?.data)
            .then((response) => {
                setCountryList(response);
            })
            .catch((error) => {
                // toast.error(error?.response);
            })
            .finally(() => {
                setCountryLoading(false);
            });
    };
    useEffect(() => {
        getCountryList()
    }, [])
    const getStateList = async (val) => {
        setStateLoading(true);
        return axiosInstance
            .get(`${ApiEndPoints.GET_REGION.state}${val}/states`, {
                headers: {
                    'X-CSCAPI-KEY': 'RmYyOHVGMnBSS0VoRUc5cTRMMmhnc2UwdE1WdVZqaHRicnhMbzJ6eA=='
                }
            })
            .then((response) => {
                setStateList(response.data);
                return response.data;
            })
            .catch((error) => {
                toast.error(error.response.data.message);
            })
            .finally(() => {
                setStateLoading(false);
            });
    };
    const getCityList = (country, state) => {
        setCityLoading(true);
        axiosInstance
            .get(`${ApiEndPoints.GET_REGION.city}${country}/states/${state}/cities`, {
                headers: {
                    "X-CSCAPI-KEY":
                        "RmYyOHVGMnBSS0VoRUc5cTRMMmhnc2UwdE1WdVZqaHRicnhMbzJ6eA==",
                },
            })
            .then((response) => {
                setCityList(response.data);
                //console.log("response: ", JSON.stringify(response.data))
                return response.data;
            })
            .catch((error) => {
                toastError(error.response.data.message);
            })
            .finally(() => {
                setCityLoading(false);
            });
    };

    const fetchEditData = async () => {
        reset({
            city: dataToEdit?.city || '',
            name: dataToEdit?.name || '',
            address: dataToEdit?.address || '',
            pincode: dataToEdit?.pincode || '',
            phoneNumber: dataToEdit?.phoneNumber || '',
        });

        const selectedCountry = countryList.find(
            (country) =>
                country.name.toLowerCase() === dataToEdit?.country.toLowerCase().trim()
        );
        if (selectedCountry) {
            setValue("country", selectedCountry.name);
            const states = await getStateList(selectedCountry.iso2);
            const selectedState = states.find(
                (state) =>
                    state.name.toLowerCase() === dataToEdit?.state.toLowerCase().trim()
            );

            if (selectedState) {
                setValue("state", selectedState.name);

                const city = getCityList(
                    selectedCountry?.iso2,
                    selectedState?.iso2
                );
                console.log("Cities:", city);

                const selectedCity = city?.find(
                    (city) =>
                        city.name.toLowerCase() === dataToEdit?.city.toLowerCase().trim()
                );
                console.log("Cities selectedCity:", city);


                if (selectedCity) {
                    // Ensure the selected city is available in the cityList
                    const cityOption = cityList.find(
                        (option) => option.name === selectedCity.name
                    );
                    if (cityOption) {
                        // console.log("City:", cityOption);
                        setValue("city", selectedCity.name);
                    }
                }
            }
        }
    };

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === "add" ? "Create Hub Address" : "Edit Hub Address");
            fetchEditData()
        }
        getCountryList()
        // if (dataToEdit?.country) {
        //     getStateList()
        // }
    }, [dataToEdit, mode, open, reset]);

    const onSubmit = (data) => {
        const pincode = data.pincode.toString();

        let payload = {
            name: data.name,
            address: data.address,
            pincode: pincode,
            city: data.city,
            state: data.state,
            country: data.country,
            phoneNumber: data.phoneNumber
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.HUB_ADDRESS.edit(dataToEdit._id), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.HUB_ADDRESS.create, payload, {
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
                                <FormLabel required htmlFor='name' error={Boolean(errors.name)}>Name</FormLabel>
                                <Controller
                                    name="name"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Name'
                                            onChange={onChange}
                                            id='name'
                                            value={value}
                                            error={Boolean(errors.name)}
                                        />
                                    }
                                />
                                {errors.name && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.name.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='phoneNumber' error={Boolean(errors.phoneNumber)}>Phone Number</FormLabel>
                                <Controller
                                    name="phoneNumber"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Phone Number'
                                            options={{
                                                phone: true,
                                                phoneRegionCode: 'IN', // Adjust as necessary or make dynamic based on selected country
                                                prefix: '+',
                                                noImmediatePrefix: true,
                                                rawValueTrimPrefix: true
                                            }}
                                            onChange={onChange}
                                            id='phoneNumber'
                                            value={value}
                                            error={Boolean(errors.phoneNumber)}
                                        />
                                    }
                                />
                                {errors.phoneNumber && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.phoneNumber.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='address' error={Boolean(errors.address)}>Address</FormLabel>
                                <Controller
                                    name="address"
                                    control={control}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Address'
                                            multiline
                                            onChange={onChange}
                                            id='address'
                                            value={value}
                                            error={Boolean(errors.address)}
                                        />
                                    }
                                />
                                {errors.address && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.address.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='country' error={Boolean(errors.country)}>
                                    Country
                                </FormLabel>
                                <Controller
                                    name='country'
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            options={countryList}
                                            onChange={(e, newValue) => {
                                                onChange(newValue ? newValue.name : '')
                                                getStateList(newValue.iso2)
                                                setCountryIso(newValue.iso2)
                                            }}
                                            value={countryList.find(option => option.name === value) || null}
                                            getOptionLabel={option => option.name}
                                            renderInput={params => (
                                                <TextField {...params} placeholder='Select Country' error={Boolean(errors.country)} />
                                            )}
                                            loading={countryLoading}
                                        />
                                    )}
                                />
                                {errors.country && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.country.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='state' error={Boolean(errors.state)}>
                                    State
                                </FormLabel>
                                <Controller
                                    name='state'
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            options={stateList}
                                            onChange={(e, newValue) => {
                                                onChange(newValue ? newValue.name : '')
                                                getCityList(countryIso, newValue.iso2)
                                            }}
                                            value={stateList.find(option => option.name === value) || null}
                                            //value={stateList.find(option => option.name === dataToEdit?.state) || null}
                                            getOptionLabel={option => option.name}
                                            renderInput={params => (
                                                <TextField {...params} placeholder='Select state' error={Boolean(errors.state)} />
                                            )}
                                            loading={stateLoading}
                                        />
                                    )}
                                />
                                {errors.state && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.state.message}</FormHelperText>
                                )}
                            </FormControl>

                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='city' error={Boolean(errors.city)}>
                                    City
                                </FormLabel>
                                <Controller
                                    name='city'
                                    control={control}
                                    render={({ field: { onChange, value } }) => (
                                        <Autocomplete
                                            options={cityList}
                                            onChange={(e, newValue) => {
                                                onChange(newValue ? newValue.name : '')

                                            }}
                                            value={cityList.find(option => option.name === value) || null}
                                            //value={cityList.find(option => option.name === dataToEdit?.city) || null}
                                            getOptionLabel={option => option.name}
                                            renderInput={params => (
                                                <TextField {...params} placeholder='Select city' error={Boolean(errors.city)} />
                                            )}
                                            loading={cityLoading}
                                        />
                                    )}
                                />
                                {errors.city && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='pincode' error={Boolean(errors.pincode)}>Post Code</FormLabel>
                                <Controller
                                    name="pincode"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            placeholder='Enter Pincode Number'
                                            type="text"
                                            inputMode="numeric"
                                            onChange={onChange}
                                            id='pincode'
                                            value={value}
                                            error={Boolean(errors.pincode)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInputPhone
                                            }}
                                        />
                                    }
                                />
                                {errors.pincode && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.pincode.message}
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

export default DialogFormHubAddress
