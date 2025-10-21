


import React from 'react';
import { useEffect, useState } from 'react'
import { Box, Typography, FormControl, Grid, FormLabel, FormHelperText, IconButton, TextField, Card, Button, CardContent, Select, MenuItem, RadioGroup, FormControlLabel, Radio, Checkbox, InputAdornment, Autocomplete } from '@mui/material'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate, useParams } from 'react-router-dom';
import { LoadingButton } from '@mui/lab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/bootstrap.css'
import { toastError, toastSuccess } from 'src/utils/utils';
import { ApiEndPoints } from 'src/network/endpoints';
import { axiosInstance } from 'src/network/adapter';
import CloseIcon from '@mui/icons-material/Close';
import toast from 'react-hot-toast';

const validationSchema = yup.object({
    firstName: yup.string().required('First name is required'),
    lastName: yup.string().required('Last name is required'),
    userEmail: yup.string().email('Invalid email').required('Email is required'),
    phone: yup.string().required('Phone number is required'),
    companyName: yup.string().required('Company name is required'),
    jobTitle: yup.string().required('Job title is required'),
    ticketId: yup.string().required('Ticket category is required'),
});

const GuestForm = () => {
    const navigate = useNavigate()
    const location = useLocation()
    const { id } = useParams()
    const dataToEdit = location?.state?.dataToEdit
    const eventName = location?.state?.eventName
    console.log("eventName", eventName)
    const locationMode = location?.state?.mode
    const [mode, setMode] = useState('add')
    const [loading, setLoading] = useState(false)
    const [phone, setPhone] = useState('')
    const [phoneDialCode, setPhoneDialCode] = useState('')
    const [addedGuest, setAddedGuest] = useState([])
    const [companyList, setCompanyList] = useState([])
    const [jobList, setJobList] = useState([])
    const [ticketsList, setTicketList] = useState([])
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        watch,
        formState: { errors },
        getValues,
        setError,
        clearErrors
    } = useForm({
        defaultValues: {
            firstName: '',
            lastName: '',
            userEmail: '',
            phoneCountry: '',
            phone: '',
            companyName: '',
            jobTitle: '',
        },
        resolver: yupResolver(validationSchema),
        mode: 'onChange',
    })

    const fetchEditData = async () => {
        setLoading(false);
        setMode(locationMode);
        reset({
            firstName: '',
            lastName: '',
            userEmail: '',
            phone: '',
            companyName: '',
            jobTitle: '',
            phoneCountry: '',
        });
    };

    useEffect(() => {
        fetchEditData();
    }, [dataToEdit, mode, reset]);

    const handlePhoneChange = (value, country) => {
        setPhone(value)
        setValue('phone', value)
        if (country) {
            clearErrors('phone')
            const { country: countryCode, dialCode, name } = country
            setPhoneDialCode(dialCode)
        }
    }

    const fetchCompanyList = () => {
        setLoading(true);
        let params = {
            listType: 'company',
        };
        axiosInstance
            .get(ApiEndPoints.COMMON.get, { params })
            .then((response) => {
                const companies = response.data.listData.map((item, index) => ({
                    id: index + 1,
                    name: item.filterValue,
                }));
                setCompanyList(companies);
                console.log("company response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    const fetchJobList = () => {
        setLoading(true);
        let params = {
            listType: 'job',
        };
        axiosInstance
            .get(ApiEndPoints.COMMON.get, { params })
            .then((response) => {
                const jobs = response.data.listData.map((item, index) => ({
                    id: index + 1,
                    name: item.filterValue,
                }));
                setJobList(jobs);
                console.log("job response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };
    const fetchTickets = () => {
        setLoading(true);
        axiosInstance
            .get(ApiEndPoints.EVENT.getEventTickets(id))
            .then((response) => {
                const tickets = response.data.data.eventTicketList.map((item) => ({
                    ticketId: item.ticketId,
                    name: item?.category?.name,
                    price: item.price,
                    remainingQuantity: item.remainingQuantity,
                }));
                setTicketList(tickets);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCompanyList()
    }, [])
    useEffect(() => {
        fetchTickets()
    }, [])

    useEffect(() => {
        fetchJobList()
    }, [])

    // const handleAddGuest = async () => {
    //     const values = getValues();
    //     const emailToCheck = values.userEmail?.trim().toLowerCase();

    //     // 1. Check in local list first
    //     const isDuplicateLocally = addedGuest.some(
    //         (guest) => guest.userEmail?.trim().toLowerCase() === emailToCheck
    //     );

    //     if (isDuplicateLocally) {
    //         setError('userEmail', {
    //             type: 'manual',
    //             message: 'This email is already added as a guest.',
    //         });
    //         return;
    //     }

    //     // 2. Check via API if email already exists for event
    //     const emailExists = await checkGuestExists(id, emailToCheck);
    //     if (emailExists) {
    //         setError('userEmail', {
    //             type: 'manual',
    //             message: 'This email is already registered for this event.',
    //         });
    //         return;
    //     }

    //     clearErrors('userEmail'); // Clear any existing error if it's fixed

    //     const newGuest = {
    //         ...values,
    //         phoneCountry: '+' + phoneDialCode,
    //         phone: '+' + phone,
    //         name: ticketsList.find(t => t.ticketId === values.ticketId)?.name || '', // 👈 get ticket name
    //     };

    //     handleSubmit(() => {
    //         setAddedGuest((prev) => [...prev, newGuest]);
    //         reset(); // Clear form
    //         setPhone('');
    //         setPhoneDialCode('');
    //     })();
    // };

    const handleAddGuest = handleSubmit(async (values) => {
        const emailToCheck = values.userEmail?.trim().toLowerCase();

        // Check in local list first
        const isDuplicateLocally = addedGuest.some(
            (guest) => guest.userEmail?.trim().toLowerCase() === emailToCheck
        );

        if (isDuplicateLocally) {
            setError('userEmail', {
                type: 'manual',
                message: 'This email is already added as a guest.',
            });
            return;
        }

        // Check via API if email already exists
        const emailExists = await checkGuestExists(id, emailToCheck);
        if (emailExists) {
            setError('userEmail', {
                type: 'manual',
                message: 'This email is already registered for this event.',
            });
            return;
        }

        clearErrors('userEmail');

        const newGuest = {
            ...values,
            phoneCountry: '+' + phoneDialCode,
            phone: '+' + phone,
            name: ticketsList.find(t => t.ticketId === Number(values.ticketId))?.name || '',
        };

        setAddedGuest((prev) => [...prev, newGuest]);
        reset(); // Clear form
        setPhone('');
        setPhoneDialCode('');
    });

    const handleRemoveGuest = (indexToRemove) => {
        setAddedGuest((prev) => prev.filter((_, i) => i !== indexToRemove));
    };


    const checkGuestExists = async (eventId, email) => {
        setLoading(true);

        try {
            const response = await axiosInstance.get(
                ApiEndPoints.GUEST.checkExistUser(eventId),
                {
                    params: {
                        userEmail: email,
                    },
                }
            );
            return response.data.guestExists;
        } catch (error) {
            console.error('Error checking guest existence:', error);
            toastError(error);
            return false;
        } finally {
            setLoading(false);
        }
    };

    console.log("addedGuest", addedGuest)
    const onSubmit = () => {
        if (addedGuest.length === 0) {
            toast.error('Please add at least one guest before submitting');
            return;
        }

        console.log('Submitting guest array:', addedGuest);

        // Clean and transform guest list:
        const cleanedGuests = addedGuest.map(({ name, guest, phone, phoneCountry, ...rest }) => {
            // Remove country code from phone
            const phoneWithoutCode = phone?.replace(phoneCountry, '') || '';
            return {
                ...rest,
                phone: phoneWithoutCode,
                phoneCountry,
            };
        });

        const payload = {
            guests: cleanedGuests,
            eventId: id,
        };

        console.log('Final payload:', payload);

        setLoading(true);

        axiosInstance
            .post(ApiEndPoints.GUEST.add, payload, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            })
            .then((response) => response.data)
            .then((response) => {
                toastSuccess(response.message);
                navigate(-1);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    return (
        <>
            <form noValidate autoComplete='off'
                onSubmit={(e) => {
                    e.preventDefault();
                    onSubmit();
                }}>

                <Card sx={{ p: 10 }}>
                    <Box display='flex' flexDirection='column' gap={2} mb={5}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <ArrowBackIcon onClick={() => navigate(-1)} />
                            <Typography variant='h6' fontWeight={600} color='primary'>
                                Add Guests for {eventName} Event
                            </Typography>
                        </Box>
                    </Box>
                    <Card sx={{ overflow: 'visible' }}>
                        <CardContent>
                            <Grid container spacing={4}>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <FormLabel htmlFor='firstName'>First Name</FormLabel>
                                        <Controller
                                            name='firstName'
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    id="firstName"
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder='Enter First Name'
                                                    inputProps={{ maxLength: 100 }}
                                                />
                                            )}
                                        />
                                        {errors.firstName && (
                                            <FormHelperText sx={{ color: 'error.main' }}>
                                                {errors.firstName.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <FormLabel htmlFor='lastName'>Last Name</FormLabel>
                                        <Controller
                                            name='lastName'
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    id="lastName"
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder='Enter Last Name'
                                                    inputProps={{ maxLength: 100 }}
                                                />
                                            )}
                                        />
                                        {errors.lastName && (
                                            <FormHelperText sx={{ color: 'error.main' }}>
                                                {errors.lastName.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <FormLabel htmlFor='userEmail'>User Email</FormLabel>
                                        <Controller
                                            name='userEmail'
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <TextField
                                                    id="userEmail"
                                                    value={value}
                                                    onChange={onChange}
                                                    placeholder='Enter Email'
                                                />
                                            )}
                                        />
                                        {errors.userEmail && (
                                            <FormHelperText sx={{ color: 'error.main' }}>
                                                {errors.userEmail.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={6}>
                                    <FormControl fullWidth>
                                        <FormLabel htmlFor='phone'>
                                            Phone No
                                        </FormLabel>
                                        <Controller
                                            name='phone'
                                            control={control}
                                            render={({ field: { value, onChange } }) => (
                                                <PhoneInput
                                                    country={'us'}
                                                    error={Boolean(errors.phone)}
                                                    inputStyle={{
                                                        width: '100%',
                                                        height: '100%',
                                                        // border: Boolean(errors.organiserPhone) ? '1px solid red' : '1px solid #ccc',
                                                        borderRadius: '10px'
                                                    }}
                                                    enableSearch={true}
                                                    PhoneInputCountryFlag-borderColor='red'
                                                    placeholder='Phone number'
                                                    value={value}
                                                    onChange={handlePhoneChange}
                                                />
                                            )}
                                        />
                                        {errors.phone && (
                                            <FormHelperText sx={{ color: 'error.main' }}>{errors.phone.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <FormLabel htmlFor="companyName">Company Name</FormLabel>
                                        <Controller
                                            name="companyName"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Autocomplete
                                                    freeSolo // ✅ allows manual input
                                                    options={companyList}
                                                    getOptionLabel={(option) =>
                                                        typeof option === 'string' ? option : option.name
                                                    }
                                                    value={
                                                        // Allow string input or selected object from options
                                                        typeof value === 'string'
                                                            ? value
                                                            : companyList.find((option) => option.name === value) || ''
                                                    }
                                                    onChange={(e, newValue) => {
                                                        console.log('Selected or Entered Company:', newValue);
                                                        if (typeof newValue === 'string') {
                                                            onChange(newValue);
                                                        } else if (newValue && typeof newValue === 'object') {
                                                            onChange(newValue.name);
                                                        } else {
                                                            onChange('');
                                                        }
                                                    }}
                                                    onInputChange={(e, newInputValue, reason) => {
                                                        if (reason === 'input') {
                                                            onChange(newInputValue); // for manual typing
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} placeholder="Select or enter company" />
                                                    )}
                                                />
                                            )}
                                        />
                                        {errors.companyName && (
                                            <FormHelperText sx={{ color: 'error.main' }}>
                                                {errors.companyName.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>

                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <FormLabel htmlFor="jobTitle">Job Title</FormLabel>
                                        <Controller
                                            name="jobTitle"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Autocomplete
                                                    freeSolo // ✅ allows manual input
                                                    options={jobList}
                                                    getOptionLabel={(option) =>
                                                        typeof option === 'string' ? option : option.name
                                                    }
                                                    value={
                                                        typeof value === 'string'
                                                            ? value
                                                            : jobList.find((option) => option.name === value) || ''
                                                    }
                                                    onChange={(e, newValue) => {
                                                        console.log('Selected or Entered Job Title:', newValue);
                                                        if (typeof newValue === 'string') {
                                                            onChange(newValue);
                                                        } else if (newValue && typeof newValue === 'object') {
                                                            onChange(newValue.name);
                                                        } else {
                                                            onChange('');
                                                        }
                                                    }}
                                                    onInputChange={(e, newInputValue, reason) => {
                                                        if (reason === 'input') {
                                                            onChange(newInputValue); // update form value as user types
                                                        }
                                                    }}
                                                    renderInput={(params) => (
                                                        <TextField {...params} placeholder="Select or enter job title" />
                                                    )}
                                                />
                                            )}
                                        />
                                        {errors.jobTitle && (
                                            <FormHelperText sx={{ color: 'error.main' }}>
                                                {errors.jobTitle.message}
                                            </FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>


                                <Grid item xs={4}>
                                    <FormControl fullWidth>
                                        <FormLabel htmlFor="ticketId">Ticket Category</FormLabel>

                                        <Controller
                                            name="ticketId"
                                            control={control}
                                            render={({ field: { onChange, value } }) => (
                                                <Autocomplete
                                                    options={ticketsList}
                                                    getOptionLabel={(option) =>
                                                        typeof option === 'string' ? option : option.name
                                                    }
                                                    isOptionEqualToValue={(option, value) =>
                                                        option.ticketId === value
                                                    }
                                                    onChange={(e, newValue) => {
                                                        onChange(newValue?.ticketId || '');
                                                    }}
                                                    getOptionDisabled={(option) => option.remainingQuantity === 0}
                                                    renderOption={(props, option) => (
                                                        <li {...props}>
                                                            {option.name} - ₹{option.price} -{' '}
                                                            {option.remainingQuantity === 0 ? 'Sold out' : `${option.remainingQuantity} left`}
                                                        </li>
                                                    )}
                                                    value={
                                                        ticketsList.find((option) => option.ticketId === value) || null
                                                    }
                                                    renderInput={(params) => (
                                                        <TextField
                                                            {...params}
                                                            placeholder="Select ticket category"
                                                        />
                                                    )}
                                                />


                                                // <Autocomplete
                                                //     options={ticketsList}
                                                //     getOptionLabel={(option) =>
                                                //         `${option.name} - ₹${option.price} - ${option.remainingQuantity === 0 ? 'Sold out' : `${option.remainingQuantity} left`}`
                                                //     }
                                                //     isOptionEqualToValue={(option, val) => option.name === val}
                                                //     onChange={(e, newValue) => {
                                                //         onChange(newValue?.name || '');
                                                //     }}
                                                //     value={ticketsList.find((option) => option.ticketId === value) || null}
                                                //     getOptionDisabled={(option) => option.remainingQuantity === 0}
                                                //     renderOption={(props, option) => (
                                                //         <li {...props}>
                                                //             {option.name} - ₹{option.price} -{' '}
                                                //             {option.remainingQuantity === 0 ? 'Sold out' : `${option.remainingQuantity} left`}
                                                //         </li>
                                                //     )}
                                                //     renderInput={(params) => (
                                                //         <TextField
                                                //             {...params}
                                                //             placeholder="Select ticket category"
                                                //             value={value} // 👈 show only the name in input
                                                //         />
                                                //     )}
                                                //     renderTags={() => null} // 👈 prevents tag rendering if it's a multi-select
                                                // />
                                            )}
                                        />

                                        {errors.ticketId && (
                                            <FormHelperText sx={{ color: 'error.main' }}>{errors.ticketId.message}</FormHelperText>
                                        )}
                                    </FormControl>
                                </Grid>
                                <Grid item xs={12} display='flex' justifyContent={'center'}>
                                    <Button variant='outlined' onClick={handleAddGuest}>Add Guest</Button>
                                </Grid>
                            </Grid>

                        </CardContent>
                    </Card>
                    <Box display='flex' alignItems='end' justifyContent={'space-between'} gap={2} mt={5}>
                        <Button
                            onClick={() => navigate('/event')}
                            size='large'
                            variant='outlined'
                        >
                            Cancel
                        </Button>
                        <LoadingButton
                            type='submit'
                            variant='contained'
                            size='large'
                            loading={loading}
                        >
                            {mode === 'edit' ? 'Update' : 'Submit'}
                        </LoadingButton>

                    </Box>
                </Card>


                <Card sx={{ mt: 5 }}>
                    <CardContent>
                        <Box>
                            <Typography variant="h6">Added Guests</Typography>
                            <Grid container spacing={2}>
                                {addedGuest.map((guest, index) => (
                                    <Grid item xs={12} md={6} key={index}>
                                        <Card variant="outlined" sx={{ position: 'relative' }}>
                                            <IconButton
                                                size="small"
                                                onClick={() => handleRemoveGuest(index)}
                                                sx={{
                                                    position: 'absolute',
                                                    top: 8,
                                                    right: 8,
                                                    zIndex: 1
                                                }}
                                            >
                                                <CloseIcon fontSize="small" />
                                            </IconButton>
                                            <CardContent>
                                                <Typography><strong>Name:</strong> {guest.firstName} {guest.lastName}</Typography>
                                                <Typography><strong>Email:</strong> {guest.userEmail}</Typography>
                                                <Typography><strong>Phone:</strong> {guest.phone}</Typography>
                                                <Typography><strong>Company:</strong> {guest.companyName}</Typography>
                                                <Typography><strong>Job Title:</strong> {guest.jobTitle}</Typography>
                                                <Typography><strong>Ticket:</strong> {guest.name}</Typography>
                                            </CardContent>
                                        </Card>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </CardContent>
                </Card>


            </form>

        </>
    )
}
export default GuestForm;