import { yupResolver } from "@hookform/resolvers/yup";
import { LoadingButton } from "@mui/lab";
import { Autocomplete, Box, Button, Dialog, DialogActions, DialogContent, DialogTitle, FormControl, FormHelperText, FormLabel, Grid, IconButton, TextField } from "@mui/material"
import CloseIcon from "mdi-material-ui/Close";
import { useEffect, useRef, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import * as yup from 'yup'
import { toastError, toastSuccess } from "src/utils/utils";
import { CleaveNumberInput } from "src/@core/components/cleave-components";
import toast from "react-hot-toast";

const validationSchema = yup.object().shape({
    country: yup.string().trim().required('Please select a country.'),
    city: yup.string().trim().required('Please select a city.'),
    radiusInKm: yup.number().required('Please enter a number'),
})

const DialogFormCity = (props) => {
    const { mode, open, toggle, dataToEdit, onSuccess } = props;
    const [loading, setLoading] = useState(false);
    const [dialogTitle, setDialogTitle] = useState('');
    const searchTimeoutRef = useRef()
    const [search, setSearch] = useState(null)
    const [countryList, setCountryList] = useState([])
    const [stateList, setStateList] = useState([])
    const [cityList, setCityList] = useState([])
    const [countryIso, setCountryIso] = useState('')
    const [stateLoading, setStateLoading] = useState(false);
    const [countryLoading, setCountryLoading] = useState(false)
    const [cityLoading, setCityLoading] = useState(false);
    const [name, setName] = useState('')
    const [currency, setCurrency] = useState([])
    const [selectedCountry, setSelectedCountry] = useState('')

    const handleSearchChange = e => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }
    const [documentsData, setDocumentsData] = useState([])
    const fetchData = ({ required }) => {
        //setLoading(true);
        let params = {
            required: 'notrequired',
        };

        axiosInstance
            .get(ApiEndPoints.DOCUMENT.list, { params })
            .then((response) => {
                setDocumentsData(response.data.data.documents)
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                //setLoading(false);
            });

    };
    const {
        control,
        handleSubmit,
        reset,
        watch,
        setValue,
        formState: { errors }
    } = useForm({
        defaultValues: {
            city: '',
            state: '',
            country: '',
            currency: '',
            code: '',
            symbol: '',
            documents: '',
            radiusInKm: ''

        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })

    let iso = watch('country', '')
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
    const Document = ({ required }) => {
        setLoading(true);
        let params = {
            required: 'notrequired'
        }
        axiosInstance
            .get(ApiEndPoints.DOCUMENT.list, { params })
            .then(response => {
                setDocumentsData(response.data.data.documents)
            })
            .catch(error => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false);
            })
    }

    useEffect(() => {
        Document({
            required: 'notrequired'
        })
    }, [])
    const getCurrency = ({ name }) => {
        //setLoading(true)
        axiosInstance
            .get(ApiEndPoints.COUNTRY.list, {
                params: {
                    name: iso,
                }
            })
            .then(response => {
                setCurrency(response.data.data.country)
            })
            .catch(error => {
            })
            .finally(() => {
                setLoading(false)
            })
    }
    const [vehicle, setVehicle] = useState([])
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

    useEffect(() => {
        if (open) {
            getVehicelType({
                search: search
            })
        }
    }, [open, search])
    const fetchEditData = async () => {
        reset({
            city: dataToEdit?.city || '',
            currency: dataToEdit?.currency || '',
            code: dataToEdit?.code || '',
            symbol: dataToEdit?.symbol || '',
            vehicleTypes: dataToEdit?.vehicleTypes || [],
            documents: dataToEdit?.documents || [],
            radiusInKm: dataToEdit?.radiusInKm || ''
        });

        const selectedCountry = countryList.find(
            (country) =>
                country.name.toLowerCase() === dataToEdit?.country.toLowerCase().trim()
        );
        if (selectedCountry) {
            setValue("country", selectedCountry.name);
            setSelectedCountry(selectedCountry.name)
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
        setValue("currency", {
            currencyName: dataToEdit?.currency || '',
        });
        console.log("currency selected:", dataToEdit?.currency);
        setValue("code", {
            currencyCode: dataToEdit?.code || '',
        });
        setValue("symbol", {
            currencySymbol: dataToEdit?.symbol || ''
        });
    };

    useEffect(() => {
        if (open) {
            setLoading(false);
            setDialogTitle(mode === 'add' ? 'Create City' : 'Edit City');
            fetchEditData()
        }
    }, [dataToEdit, mode, open, reset]);

    useEffect(() => {
        if (open && countryIso) { // Ensure countryIso is not empty
            getCurrency({ name }); // Call getCurrency only if countryIso is available
        }
    }, [countryIso, open]);
    useEffect(() => {
        if (open && selectedCountry) {
            getCurrency({ name: selectedCountry })
        }
    }, [open, selectedCountry])
    const onSubmit = (data) => {
        const doc = data.documents?.map(item => item._id) || []
        let payload = {
            city: data.city,
            state: data.state,
            country: data.country,
            currency: data.code?.currency?.currencyName[0],
            code: data.code?.currency?.currencyCode[0],
            symbol: data.symbol,
            vehicleTypes: data.vehicleTypes?.map(item => ({
                _id: item._id,
            })),
            documents: doc,
            radiusInKm: data.radiusInKm
        }
        setLoading(true);

        let apiInstance = null;

        if (mode === "edit") {
            apiInstance = axiosInstance
                .patch(ApiEndPoints.CITY_MANAGEMENT.edit(dataToEdit._id), payload, {
                })
        } else {
            apiInstance = axiosInstance
                .post(ApiEndPoints.CITY_MANAGEMENT.create, payload, {
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
                <form id="category-form" onSubmit={handleSubmit(onSubmit)}>
                    <Grid container spacing={4}>

                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='country' error={Boolean(errors.country)}>
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
                                                getStateList(newValue?.iso2)
                                                setCountryIso(newValue?.iso2)
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
                                <FormLabel htmlFor='state' error={Boolean(errors.state)}>
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
                                <FormLabel htmlFor='city' error={Boolean(errors.city)}>
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
                                <FormLabel htmlFor='currency' error={Boolean(errors.currency)}>
                                    Currency Name
                                </FormLabel>
                                <Controller
                                    name='currency'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <>
                                            <Autocomplete
                                                options={currency || []}
                                                getOptionLabel={option => option?.currency?.currencyName || []}
                                                filterSelectedOptions
                                                value={value || []}
                                                onChange={(e, newValue) => onChange(newValue)}
                                                renderInput={params => (
                                                    <TextField {...params} placeholder='Select Currency' error={Boolean(errors.currency)} />
                                                )}
                                            />
                                        </>
                                    )}
                                />
                                {errors.currency && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.currency.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='code' error={Boolean(errors.code)}>

                                    Code
                                </FormLabel>
                                <Controller
                                    name='code'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <>
                                            <Autocomplete
                                                options={currency || []}
                                                value={value}
                                                onChange={(e, newValue) => {
                                                    onChange(newValue)
                                                }}
                                                getOptionLabel={option => option?.currency?.currencyCode || []}
                                                renderInput={params => (
                                                    <TextField
                                                        placeholder='Select Code'
                                                        error={Boolean(errors.code)}
                                                        {...params}
                                                        onChange={handleSearchChange}
                                                    />
                                                )}
                                            />
                                        </>
                                    )}
                                />
                                {errors.code && <FormHelperText sx={{ color: 'error.main' }}>{errors.code.message}</FormHelperText>}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='symbol' error={Boolean(errors.symbol)}>
                                    Symbol
                                </FormLabel>
                                <Controller
                                    name='symbol'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <>
                                            <Autocomplete
                                                options={currency || []}
                                                value={value}
                                                onChange={(e, newValue) => {
                                                    onChange(newValue)
                                                }}
                                                getOptionLabel={option => option?.symbol || ''}
                                                renderOption={(props, option) => (
                                                    <li {...props}>
                                                        <span dangerouslySetInnerHTML={{ __html: option?.symbol || '' }} />
                                                    </li>
                                                )}
                                                renderInput={params => (
                                                    <TextField
                                                        placeholder='Select symbol'
                                                        error={Boolean(errors.symbol)}
                                                        {...params}
                                                        onChange={handleSearchChange}
                                                    />
                                                )}
                                            />
                                        </>
                                    )}
                                />
                                {errors.symbol && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.symbol.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor="vehicleTypes" error={Boolean(errors.vehicleTypes)}>Vehicle Type</FormLabel>
                                <Controller
                                    name='vehicleTypes'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Autocomplete
                                            multiple
                                            options={vehicle}
                                            error={Boolean(errors._id)}
                                            onChange={(e, newValue) => {
                                                onChange(newValue)
                                            }}
                                            value={value || []}
                                            filterSelectedOptions
                                            getOptionLabel={option => option.name || null}
                                            isOptionEqualToValue={(option, value) => option._id === value._id}
                                            renderInput={params => (
                                                <TextField
                                                    placeholder='Select Vehicle Type'
                                                    error={Boolean(errors.vehicleTypes)}
                                                    {...params}
                                                    onChange={handleSearchChange}
                                                />
                                            )}
                                        />
                                    )}
                                />
                                {errors.vehicleTypes && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.vehicleTypes.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='documents' error={Boolean(errors.documents)}>
                                    Documents
                                </FormLabel>
                                <Controller
                                    name='documents'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <Autocomplete
                                            multiple
                                            options={documentsData}
                                            error={Boolean(errors.documents)}
                                            onChange={(e, newValue) => {
                                                onChange(newValue)
                                            }}
                                            value={value || []}
                                            filterSelectedOptions
                                            getOptionLabel={option => option?.title}
                                            isOptionEqualToValue={(option, value) => option?._id === value?._id}
                                            renderInput={params => (
                                                <TextField placeholder='Select Documents' error={Boolean(errors.documents)} {...params} />
                                            )}
                                        />
                                    )}
                                />
                                {errors.documents && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.documents.message}</FormHelperText>
                                )}
                            </FormControl>
                        </Grid>
                        <Grid item xs={6}>
                            <FormControl fullWidth>
                                <FormLabel htmlFor='radiusInKm' error={Boolean(errors.radiusInKm)}>Radius In Km</FormLabel>
                                <Controller
                                    name="radiusInKm"
                                    control={control}
                                    rules={{ required: true, pattern: /^[0-9]+$/ }}
                                    render={({ field: { value, onChange } }) =>
                                        <TextField
                                            type="text"
                                            inputMode="numeric"
                                            onChange={(e, newValue) => onChange(newValue)}
                                            id='radiusInKm'
                                            value={value}
                                            error={Boolean(errors.radiusInKm)}
                                            InputProps={{
                                                inputComponent: CleaveNumberInput
                                            }}
                                        />
                                    }
                                />
                                {errors.radiusInKm && (
                                    <FormHelperText sx={{ color: 'error.main' }}>{errors.radiusInKm.message}</FormHelperText>
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
                    form="category-form"
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

export default DialogFormCity