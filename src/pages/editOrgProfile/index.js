import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  InputAdornment,
  ListItemText,
  MenuItem,
  Select,
  TextField,
  Typography,
  useTheme
} from '@mui/material'
import CloseIcon from 'mdi-material-ui/Close'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import * as yup from 'yup'
import { toastError, toastSuccess } from 'src/utils/utils'
import toast from 'react-hot-toast'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { CleaveNumberInput, TextOnlyInput } from 'src/@core/components/cleave-components'
import { DefaultPaginationSettings } from 'src/constants/general.const'
import { useAuth } from 'src/hooks/useAuth'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import CustomFileUploads from 'src/views/common/CustomFileUploads'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'

const validationSchema = yup.object().shape({
  orgName: yup.string().trim().required('Name is required'),

  adminFirstName: yup.string().trim().required('Administrator First Name is required'),
  adminLastName: yup.string().trim().required('Administrator Last Name is required'),
  adminPhone: yup.string().required('Contact number is required').max(15, 'Contact Number at most 10 characters'),
  // streetAddress: yup.string().trim().required('Address is required'),
  postalCode: yup
    .number()
    .typeError('Postal Code must be a number') // Error when the value cannot be cast to a number
    .transform((value, originalValue) => (originalValue === '' ? undefined : value)) // Convert empty string to undefined
    .required('Postal Code is required'),
  websiteUrl: yup.string().trim().url('Enter a valid URL').required('Url is required'),
  city: yup.string().trim().required('City is required'),
  state: yup.string().trim().required('State is required'),
  country: yup.string().trim().required('Country is required'),
  contactNumber: yup
    .string()
    .trim()
    .required('Contact number is required')
    .matches(/^\+?[1-9]\d{1,14}$/, 'Invalid phone number.')
    .min(10, 'Phone number must be at least 10 digits.')
    .max(15, 'Phone number must be at most 15 digits.'),

  yearEstablished: yup.string().trim().required('Year is required'),
  logo: yup
    .mixed()
    .notRequired()
    .test('fileSize', 'File size should be less than 3MB', value => {
      if (typeof value === 'string') return true
      return !value || value.size <= 1024 * 1024 * 3 // 3MB
    })
    .test('fileType', 'Unsupported file format', value => {
      if (typeof value === 'string') return true
      return !value || /image\/(jpeg|jpg|png|pdf)/.test(value.type) // No SVG allowed
    }),
  // totalAlumniCount: yup.string().trim().required('Total Count is required'),
  // isActiveAlumniAssociations: yup.boolean().required('Active Alumni Associations is required'),
  // preferredFeatures: yup
  //     .array()
  //     .of(yup.string().trim().required('Feature is required'))
  //     .min(1, 'At least one feature is required')
  //     .required('Preferred features are required'),
  // integrationNeeds: yup
  //     .array()
  //     .of(yup.string().trim().required('Feature is required'))
  //     .min(1, 'At least one feature is required')
  //     .required('This field is required'),
  isDataPrivacyAgreement: yup.boolean().oneOf([true], 'Data Privacy Agreement must be accepted'),
  isTermsAndConditions: yup.boolean().oneOf([true], 'Terms and Conditions must be accepted')
  // social_media_links: yup.object().shape({
  //     linkedin: yup
  //         .string()
  //         .url('Enter a valid URL')
  //         .required('URL is required'),
  //     twitter: yup
  //         .string()
  //         .url('Enter a valid URL')
  //         .required('URL is required'),
  //     facebook: yup
  //         .string()
  //         .url('Enter a valid URL')
  //         .required('URL is required'),
  //     instagram: yup
  //         .string()
  //         .url('Enter a valid URL')
  //         .required('URL is required'),
  // }),
  // additionalComments: yup.string().trim().required('Additional Comment is required'),
  // submittedBy: yup.string().trim().required('Confirmation Name is required'),

  // logo: yup.mixed().required("Logo is required")
  //     .test("fileSize", "Logo is required", (value) => {
  //         if (typeof value === "string") return true;
  //         return !value || value.size <= 1024 * 1024 * 3; // 5MB
  //     })
  //     .test("fileType", "Unsupported file format", (value) => {
  //         if (typeof value === "string") return true;
  //         return !value || /image\/(jpeg|jpg|png|pdf)/.test(value.type);
  //     }),
  // brandingFile: yup.mixed().required("File is required")
  //     .test("fileSize", "File is required", (value) => {
  //         if (typeof value === "string") return true;
  //         return !value || value.size <= 1024 * 1024 * 3; // 5MB
  //     })
  //     .test("fileType", "Unsupported file format", (value) => {
  //         if (typeof value === "string") return true;
  //         return !value || /image\/(jpeg|jpg|png|pdf)/.test(value.type);
  //     }),
})

const EditOrgProfile = () => {
  const { state } = useLocation()
  const { user } = state || {}
  const navigate = useNavigate()
  // const { user } = useAuth()
  // console.log("user", user)
  const userData = user
  console.log('my profile', userData)

  const { theme } = useTheme()
  const location = useLocation()
  const [loading, setLoading] = useState(false)
  const [title, setTitle] = useState('')
  const [stateLoading, setStateLoading] = useState(false)
  const [countryLoading, setCountryLoading] = useState(false)
  const [countryList, setCountryList] = useState([])
  const [stateList, setStateList] = useState([])
  const [cityList, setCityList] = useState([])
  const [selectedState, setSelectedState] = ''
  const [selectedCountry, setselectedCountry] = useState('')
  const [cityLoading, setCityLoading] = useState(false) // State for city loading

  //pagination
  const [search, setSearch] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    setError,
    clearErrors,
    trigger,
    formState: { errors }
  } = useForm({
    defaultValues: {
      orgName: null,
      orgEmail: null,
      streetAddress: null,
      postalCode: '',
      websiteUrl: '',
      contactNumber: null,
      city: null,
      state: null,
      country: null,
      adminFirstName: null,
      adminLastName: null,
      yearEstablished: '',
      preferredFeatures: [],
      integrationNeeds: [],
      isDataPrivacyAgreement: false,
      isTermsAndConditions: false,
      totalAlumniCount: 0,
      social_media_links: {
        linkedin: null,
        twitter: null,
        facebook: null,
        instagram: null
      },
      additionalComments: null,
      submittedBy: null,
      logo: null,
      brandingFile: null
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  })

  const fetchCountryData = () => {
    setLoading(true)
    let params = {
      listType: 'country'
    }
    axiosInstance
      .get(ApiEndPoints.COUNTRY_STATE_CITY.get, { params })
      .then(response => {
        const countries = response.data.listData.map((item, index) => ({
          id: index + 1, // Add unique ID for Autocomplete
          name: item.country
        }))
        setCountryList(countries)
        setTotalCount(response?.data?.dataCount)
        console.log('country_List response--------------------', response)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchStateData = async countryName => {
    setStateLoading(true)
    let params = {
      listType: 'state',
      country: countryName
    }

    try {
      const response = await axiosInstance.get(ApiEndPoints.COUNTRY_STATE_CITY.get, { params })

      const states = response.data.listData.map((item, index) => ({
        id: index + 1,
        name: item.state
      }))

      setStateList(states)
      setCityList([]) // Clear city list

      return states // Return the fetched states
    } catch (error) {
      console.error('Error fetching states:', error)
      return [] // Return an empty array in case of an error
    } finally {
      setStateLoading(false)
    }
  }

  const fetchCityData = async (countryName, stateName) => {
    setStateLoading(true)
    let params = {
      listType: 'city',
      country: countryName,
      state: stateName
    }

    try {
      const response = await axiosInstance.get(ApiEndPoints.COUNTRY_STATE_CITY.get, { params })

      if (response.data.status === false) {
        throw new Error('No data available for the requested city')
      }

      if (response.data && response.data.listData.length > 0) {
        const cities = response.data.listData.map((item, index) => ({
          id: index + 1,
          name: item.city
        }))

        setCityList(cities)
        return cities
      } else {
        console.log('No cities found')
        return []
      }
    } catch (error) {
      console.error('Error fetching cities:', error)
      return []
    } finally {
      setStateLoading(false)
    }
  }

  console.log('cities', cityList)
  useEffect(() => {
    fetchCountryData()
  }, [])

  const fetchEditData = async () => {
    console.log('userData', userData)
    if (!userData) return
    reset({
      orgName: userData?.orgDetails?.orgName || null,
      orgEmail: userData?.orgDetails?.orgEmail || null,
      streetAddress: userData?.orgDetails?.streetAddress || null,
      postalCode: userData?.orgDetails?.postalCode || '',
      websiteUrl: userData?.orgDetails?.websiteUrl || '',
      contactNumber: userData?.orgDetails?.contactNumber || null,
      city: userData?.orgDetails?.city || null,
      state: userData?.orgDetails?.state || null,
      country: userData?.orgDetails?.country || null,
      adminFirstName: userData?.orgDetails?.adminFirstName || null,
      adminLastName: userData?.orgDetails?.adminLastName || null,
      adminPhone: userData?.orgDetails?.adminPhone || '',
      yearEstablished: userData?.orgDetails?.yearEstablished || null,
      isActiveAlumniAssociations: userData?.orgDetails?.isActiveAlumniAssociations || false,
      totalAlumniCount: userData?.orgDetails?.totalAlumniCount || null,

      preferredFeatures: userData?.orgDetails?.preferredFeatures
        ? userData?.orgDetails?.preferredFeatures.split(',').map(item => item.trim()?.toLowerCase().replace(/ /g, '_'))
        : [],
      integrationNeeds: userData?.orgDetails?.integrationNeeds
        ? userData?.orgDetails?.integrationNeeds.split(',').map(item => item.trim()?.toLowerCase().replace(/ /g, '_'))
        : [],
      isDataPrivacyAgreement: userData?.orgDetails?.isDataPrivacyAgreement || false,
      isTermsAndConditions: userData?.orgDetails?.isTermsAndConditions || false,
      social_media_links: {
        linkedin: userData?.orgDetails?.linkedInUrl || null,
        twitter: userData?.orgDetails?.twitterUrl || null,
        facebook: userData?.orgDetails?.facebookUrl || null,
        instagram: userData?.orgDetails?.instagramUrl || null
      },
      additionalComments:
        userData?.orgDetails?.additionalComments && userData?.orgDetails?.additionalComments !== 'null'
          ? userData?.orgDetails?.additionalComments
          : null,

      submittedBy: userData?.orgDetails?.submittedBy || '',

      logo: userData?.orgDetails ? userData?.orgDetails?.logo : `${userData?.orgDetails?.logo}` || null,
      brandingFile: userData?.orgDetails
        ? userData?.orgDetails?.brandingFile
        : `${userData?.orgDetails?.brandingFile}` || null
    })
    const selectedCountry = countryList.find(
      country => country.name?.toLowerCase() === userData?.orgDetails?.country?.toLowerCase().trim()
    )

    if (selectedCountry) {
      setselectedCountry(selectedCountry)
      setValue('country', selectedCountry?.name)
      try {
        const states = await fetchStateData(selectedCountry.name)

        if (Array.isArray(states)) {
          const selectedState = states.find(
            state => state.name?.toLowerCase() === userData?.orgDetails?.state?.toLowerCase().trim()
          )
          if (selectedState) {
            setValue('state', selectedState.name)
            const cities = await fetchCityData(selectedCountry.name, selectedState.name) // Ensure cities are resolved
            if (Array.isArray(cities)) {
              const selectedCity = cities.find(
                city => city.name?.toLowerCase() === userData?.orgDetails?.city?.toLowerCase().trim()
              )
              if (selectedCity) {
                const cityOption = cityList.find(option => option.name === selectedCity.name)
                if (cityOption) {
                  setValue('city', selectedCity.name)
                }
              }
            }
          }
        }
      } catch (error) {
        console.error('Error fetching states or cities:', error)
      }
    }
  }

  useEffect(() => {
    setLoading(false)
    if (countryList.length > 0 && userData) {
      fetchEditData()
    }
  }, [userData, reset, countryList])

  // const fetchFile = async (url) => {
  //     const response = await fetch(url);
  //     const blob = await response.blob();
  //     return new File([blob], "file", { type: blob.type });
  // };

  const handlePhoneChange = (value, country, field) => {
    setValue(field, value) // React Hook Form field value
    clearErrors(field)
  }

  const handleFormCancel = () => {
    reset()
    navigate('/profile')
  }
  const onSubmit = async data => {
    console.log('data', data)
    const postalCode = data.postalCode?.toString()
    let payload = new FormData()

    // Append common fields to payload
    payload.append('orgName', data.orgName)
    payload.append('streetAddress', data.streetAddress)
    payload.append('postalCode', postalCode)
    payload.append('websiteUrl', data.websiteUrl)
    payload.append('contactNumber', data.contactNumber)
    payload.append('city', data.city)
    payload.append('state', data.state)
    payload.append('country', data.country)
    payload.append('adminFirstName', data.adminFirstName)
    payload.append('adminLastName', data.adminLastName)
    payload.append('adminPhone', data.adminPhone)
    if (data.yearEstablished) payload.append('yearEstablished', data.yearEstablished)
    if (data.totalAlumniCount) payload.append('totalAlumniCount', userData?.orgDetails?.totalAlumniCount || 0)
    if (data.preferredFeatures) payload.append('preferredFeatures', data.preferredFeatures.join(','))
    if (data.integrationNeeds) payload.append('integrationNeeds', data.integrationNeeds.join(','))
    if (data.isActiveAlumniAssociations) payload.append('isActiveAlumniAssociations', data.isActiveAlumniAssociations)
    payload.append('isDataPrivacyAgreement', data.isDataPrivacyAgreement)
    payload.append('isTermsAndConditions', data.isTermsAndConditions)
    if (data?.social_media_links?.linkedin) {
      payload.append('linkedInUrl', data.social_media_links.linkedin)
    }
    if (data?.social_media_links?.twitter) {
      payload.append('twitterUrl', data.social_media_links.twitter)
    }
    if (data?.social_media_links?.facebook) {
      payload.append('facebookUrl', data.social_media_links.facebook)
    }
    if (data?.social_media_links?.instagram) {
      payload.append('instagramUrl', data.social_media_links.instagram)
    }
    if (data.additionalComments) payload.append('additionalComments', data.additionalComments)
    if (data.submittedBy) payload.append('submittedBy', data.submittedBy)

    // Add files to payload
    if (data.logo instanceof File) {
      payload.append('logo', data.logo) // Append the file directly
    } else if (typeof data.logo === 'string') {
      // Check if logo is a URL and fetch it as a binary file
      const response = await fetch(data.logo)
      const blob = await response.blob()
      const file = new File([blob], 'logo.png', { type: blob.type })
      payload.append('logo', file)
    }

    if (data.brandingFile instanceof File) {
      payload.append('brandingFile', data.brandingFile) // Append the file directly
    } else if (typeof data.brandingFile === 'string') {
      // Check if brandingFile is a URL and fetch it as a binary file
      const response = await fetch(data.brandingFile)
      const blob = await response.blob()
      const file = new File([blob], 'brandingFile.jpeg', { type: blob.type })
      payload.append('brandingFile', file)
    }

    // Check orgType and modify payload & endpoint accordingly
    let endpoint = ApiEndPoints.AUTH.edit_org_profile

    // Log payload for debugging
    for (let [key, value] of payload.entries()) {
      console.log(`${key}: ${value}`)
    }

    // Submit API request
    setLoading(true)
    axiosInstance
      .post(endpoint, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
      .then(response => response.data)
      .then(response => {
        toastSuccess(response.message)
        reset({
          isDataPrivacyAgreement: false,
          isTermsAndConditions: false
        })
        navigate('/profile')
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  return (
    <>
      <Box
        sx={{
          p: 3,
          mb: 5,
          background: '#1e3a8a',
          borderRadius: '12px',
          boxShadow: '0 4px 20px rgba(30, 58, 138, 0.3)'
        }}
      >
        <Typography
          variant='h4'
          fontWeight={800}
          sx={{
            color: 'white',
            textAlign: 'center',
            textShadow: '0 2px 4px rgba(0,0,0,0.3)'
          }}
        >
          Edit Organization
        </Typography>
      </Box>
      <Grid
        container
        sx={{
          display: 'flex',
          flexDirection: 'column',
          p: { xs: 2, md: 10 },
          background: '#f8fafc',
          borderRadius: '12px',
          boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
        }}
        spacing={6}
      >
        <form id='org-form' onSubmit={handleSubmit(onSubmit)}>
          <Grid container spacing={4}>
            <Grid item xs={12}>
              <Typography
                variant='fm-p1'
                fontWeight={600}
                sx={{
                  color: '#1e3a8a',
                  fontSize: '1.25rem',
                  borderBottom: '2px solid #3b82f6',
                  paddingBottom: '8px',
                  display: 'inline-block'
                }}
              >
                Basic Details
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel
                  required
                  htmlFor='orgName'
                  sx={{
                    color: '#1e3a8a',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    mb: 1
                  }}
                >
                  Organization Name
                </FormLabel>
                <Controller
                  name='orgName'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder='Enter Organization Name'
                      onChange={onChange}
                      id='orgName'
                      value={value}
                      error={Boolean(errors.orgName)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3b82f6'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3b82f6',
                            borderWidth: '2px'
                          }
                        }
                      }}
                    />
                  )}
                />
                {errors.orgName && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.orgName.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel
                  required
                  htmlFor='websiteUrl'
                  sx={{
                    color: '#1e3a8a',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    mb: 1
                  }}
                >
                  Website Url
                </FormLabel>
                <Controller
                  name='websiteUrl'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder='Enter Website Url'
                      multiline
                      onChange={onChange}
                      id='websiteUrl'
                      value={value}
                      error={Boolean(errors.websiteUrl)}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '8px',
                          backgroundColor: 'white',
                          '&:hover .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3b82f6'
                          },
                          '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                            borderColor: '#3b82f6',
                            borderWidth: '2px'
                          }
                        }
                      }}
                    />
                  )}
                />
                {errors.websiteUrl && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.websiteUrl.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel
                  required
                  htmlFor='orgEmail'
                  sx={{
                    color: '#1e3a8a',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    mb: 1
                  }}
                >
                  Email Address (Official Contact Email)
                </FormLabel>
                <Controller
                  name='orgEmail'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder='Enter email'
                      multiline
                      onChange={onChange}
                      id='orgEmail'
                      value={value}
                      error={Boolean(errors.orgEmail)}
                    />
                  )}
                />
                {errors.orgEmail && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.orgEmail.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel
                  required
                  htmlFor='contactNumber'
                  sx={{
                    color: '#1e3a8a',
                    fontWeight: 600,
                    fontSize: '0.95rem',
                    mb: 1
                  }}
                >
                  Contact Number (Office Phone)
                </FormLabel>
                <Controller
                  name='contactNumber'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <PhoneInput
                      inputStyle={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '10px',
                        backgroundColor: 'transparent'
                      }}
                      enableSearch={true}
                      placeholder='Contact number'
                      value={value}
                      country={'us'} // Set default country
                      onChange={(value, country) => {
                        handlePhoneChange(value, country, 'contactNumber')
                      }}
                    />
                  )}
                />
                {errors.contactNumber && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.contactNumber.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='streetAddress'>
                  Street Address
                </FormLabel>
                <Controller
                  name='streetAddress'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder='Enter Street Address'
                      multiline
                      onChange={onChange}
                      id='streetAddress'
                      value={value}
                      error={Boolean(errors.streetAddress)}
                    />
                  )}
                />
                {errors.streetAddress && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.streetAddress.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='country'>
                  Country
                </FormLabel>
                <Controller
                  name='country'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      options={countryList}
                      onChange={(e, newValue) => {
                        console.log('Selected Country:', newValue)
                        onChange(newValue ? newValue.name : '') // Pass country name
                        fetchStateData(newValue?.name) // Fetch states by country name
                        setselectedCountry(newValue?.name)
                      }}
                      value={countryList.find(option => option?.name === value) || null}
                      getOptionLabel={option => option?.name}
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

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='state'>
                  State/Province
                </FormLabel>
                <Controller
                  name='state'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      options={stateList}
                      onChange={(e, newValue) => {
                        console.log('Selected State:', newValue?.name)
                        onChange(newValue ? newValue.name : '') // Pass state name to form
                        fetchCityData(selectedCountry, newValue?.name) // Fetch cities by state name
                      }}
                      value={stateList.find(option => option?.name === value) || null}
                      getOptionLabel={option => option?.name || ''}
                      renderInput={params => (
                        <TextField {...params} placeholder='Select state' error={Boolean(errors.state)} />
                      )}
                      loading={stateLoading}
                    />
                  )}
                />
                {errors.state && <FormHelperText sx={{ color: 'error.main' }}>{errors.state.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='city'>
                  City
                </FormLabel>
                <Controller
                  name='city'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      options={cityList}
                      onChange={(e, newValue) => {
                        console.log('Selected city:', newValue?.name)
                        onChange(newValue ? newValue.name : '') // Pass state name to form
                      }}
                      value={cityList.find(option => option?.name === value) || null} // Match the selected city by its name
                      getOptionLabel={option => option?.name || ''} // Safeguard against undefined names
                      renderInput={params => (
                        <TextField {...params} placeholder='Select city' error={Boolean(errors.city)} />
                      )}
                      loading={cityLoading}
                    />
                  )}
                />
                {errors.city && <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='postalCode'>
                  Postal Code
                </FormLabel>
                <Controller
                  name='postalCode'
                  control={control}
                  rules={{ required: true, pattern: /^[0-9]+$/ }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder='Enter Postal Code Number'
                      type='text'
                      inputMode='numeric'
                      onChange={onChange}
                      id='postalCode'
                      value={value}
                      error={Boolean(errors.postalCode)}
                      InputProps={{
                        inputComponent: CleaveNumberInput
                      }}
                    />
                  )}
                />
                {errors.postalCode && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.postalCode.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel>Logo (File Upload)</FormLabel>
                <Controller
                  name='logo'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomFileUploads
                      multiple={false}
                      subtitle='(Max file size 3mb)'
                      minHeight='100px'
                      files={value}
                      onChange={onChange}
                      title={'Add Image'}
                      // MediaUrl={MEDIA_URL}
                    />
                  )}
                />
                {errors?.logo && <FormHelperText sx={{ color: 'error.main' }}>{errors?.logo?.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={12} mt={3}>
              <Typography
                variant='fm-p1'
                fontWeight={600}
                sx={{
                  color: '#1e3a8a',
                  fontSize: '1.25rem',
                  borderBottom: '2px solid #3b82f6',
                  paddingBottom: '8px',
                  display: 'inline-block'
                }}
              >
                Administrator/Point of Contact
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='adminFirstName'>
                  Admin First Name
                </FormLabel>
                <Controller
                  name='adminFirstName'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder='Enter Admin First Name'
                      onChange={onChange}
                      id='adminFirstName'
                      value={value}
                      error={Boolean(errors.adminFirstName)}
                      InputProps={{
                        inputComponent: TextOnlyInput
                      }}
                    />
                  )}
                />
                {errors.adminFirstName && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.adminFirstName.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='adminLastName'>
                  Admin Last Name
                </FormLabel>
                <Controller
                  name='adminLastName'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder='Enter Admin Last Name'
                      onChange={onChange}
                      id='adminLastName'
                      value={value}
                      error={Boolean(errors.adminLastName)}
                      InputProps={{
                        inputComponent: TextOnlyInput
                      }}
                    />
                  )}
                />
                {errors.adminLastName && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.adminLastName.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='adminPhone'>
                  Administrator Phone Number
                </FormLabel>
                <Controller
                  name='adminPhone'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <PhoneInput
                      inputStyle={{
                        width: '100%',
                        height: '100%',
                        borderRadius: '10px',
                        backgroundColor: 'transparent'
                      }}
                      enableSearch={true}
                      placeholder='Enter Phone Number'
                      value={value}
                      country={'us'} // Set default country
                      onChange={(value, country) => {
                        handlePhoneChange(value, country, 'adminPhone')
                      }}
                    />
                  )}
                />
                {errors.adminPhone && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.adminPhone.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} mt={3}>
              <Typography
                variant='fm-p1'
                fontWeight={600}
                sx={{
                  color: '#1e3a8a',
                  fontSize: '1.25rem',
                  borderBottom: '2px solid #3b82f6',
                  paddingBottom: '8px',
                  display: 'inline-block'
                }}
              >
                Program and Alumni Information
              </Typography>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel required htmlFor='yearEstablished'>
                  Year Established
                </FormLabel>
                <Controller
                  name='yearEstablished'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <DatePicker
                      selected={value ? new Date(value, 0) : null}
                      onChange={date => onChange(date.getFullYear())}
                      showYearPicker
                      dateFormat='yyyy'
                      customInput={
                        <TextField
                          fullWidth
                          variant='outlined'
                          placeholder='yyyy'
                          InputProps={{
                            inputComponent: CleaveNumberInput
                          }}
                        />
                      }
                    />
                  )}
                />
                {errors.yearEstablished && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.yearEstablished.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel htmlFor='totalAlumniCount'>Total User Count</FormLabel>
                <Controller
                  name='totalAlumniCount'
                  defaultValue={0}
                  control={control}
                  rules={{ required: true, pattern: /^[0-9]+$/ }}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      type='text'
                      inputMode='numeric'
                      placeholder='Enter Total User Count'
                      onChange={onChange}
                      id='totalAlumniCount'
                      value={value}
                      disabled
                      error={Boolean(errors.totalAlumniCount)}
                      InputProps={{
                        inputComponent: CleaveNumberInput
                      }}
                    />
                  )}
                />
                {errors.totalAlumniCount && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.totalAlumniCount.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel htmlFor='isActiveAlumniAssociations'>Active Alumni Associations</FormLabel>
                <Controller
                  name='isActiveAlumniAssociations'
                  control={control}
                  defaultValue={userData?.orgDetails?.isActiveAlumniAssociations || false}
                  render={({ field: { value, onChange } }) => (
                    <Select
                      labelId='demo-simple-select-label'
                      id='demo-simple-select'
                      value={value}
                      onChange={onChange}
                      placeholder='Select Alumni Association'
                      error={Boolean(errors.isActiveAlumniAssociations)}
                    >
                      <MenuItem value={'true'}>True</MenuItem>
                      <MenuItem value={'false'}>False</MenuItem>
                    </Select>
                  )}
                />
                {errors.isActiveAlumniAssociations && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.isActiveAlumniAssociations.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} mt={3}>
              <Typography
                variant='fm-p1'
                fontWeight={600}
                sx={{
                  color: '#1e3a8a',
                  fontSize: '1.25rem',
                  borderBottom: '2px solid #3b82f6',
                  paddingBottom: '8px',
                  display: 'inline-block'
                }}
              >
                Engagement Features Setup
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor='preferredFeatures'>Preferred Features</FormLabel>
                <Controller
                  name='preferredFeatures'
                  control={control}
                  defaultValue={
                    userData?.orgDetails?.preferredFeatures
                      ? userData?.orgDetails?.preferredFeatures
                          .split(',')
                          .map(item => item.trim()?.toLowerCase().replace(/ /g, '_'))
                      : []
                  }
                  rules={{ required: 'At least one feature must be selected.' }}
                  render={({ field: { value = [], onChange } }) => (
                    <Select
                      labelId='demo-multi-select-label'
                      id='demo-multi-select'
                      multiple
                      value={Array.isArray(value) ? value : []} // Ensures value is always an array
                      onChange={event => onChange(event.target.value)} // Updates the selected values
                      renderValue={selected =>
                        selected
                          .map(item =>
                            item
                              .split('_')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1)) // Capitalize each word
                              .join(' ')
                          )
                          .join(', ')
                      }
                      error={Boolean(errors.preferredFeatures)}
                    >
                      {/* Menu Items */}
                      <MenuItem value='event_management'>
                        <Checkbox checked={value.includes('event_management')} />
                        <ListItemText primary='Event Management' />
                      </MenuItem>
                      <MenuItem value='fundraising'>
                        <Checkbox checked={value.includes('fundraising')} />
                        <ListItemText primary='Fundraising' />
                      </MenuItem>
                      <MenuItem value='mentorship_programs'>
                        <Checkbox checked={value.includes('mentorship_programs')} />
                        <ListItemText primary='Mentorship Programs' />
                      </MenuItem>
                      <MenuItem value='alumni_database'>
                        <Checkbox checked={value.includes('alumni_database')} />
                        <ListItemText primary='Alumni Database' />
                      </MenuItem>
                      <MenuItem value='networking_tool'>
                        <Checkbox checked={value.includes('networking_tool')} />
                        <ListItemText primary='Networking Tools' />
                      </MenuItem>
                      <MenuItem value='jobs_board'>
                        <Checkbox checked={value.includes('jobs_board')} />
                        <ListItemText primary='Jobs Board' />
                      </MenuItem>
                      <MenuItem value='email_campaign'>
                        <Checkbox checked={value?.includes('email_campaign')} />
                        <ListItemText primary='Email Campaign' />
                      </MenuItem>
                    </Select>
                  )}
                />

                {errors.preferredFeatures && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.preferredFeatures.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} mt={3}>
              <Typography
                variant='fm-p1'
                fontWeight={600}
                sx={{
                  color: '#1e3a8a',
                  fontSize: '1.25rem',
                  borderBottom: '2px solid #3b82f6',
                  paddingBottom: '8px',
                  display: 'inline-block'
                }}
              >
                Integration Options
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor='integrationNeeds'>Integration</FormLabel>
                <Controller
                  name='integrationNeeds'
                  control={control}
                  defaultValue={
                    userData?.orgDetails?.integrationNeeds
                      ? userData?.orgDetails?.integrationNeeds
                          .split(',')
                          .map(item => item.trim()?.toLowerCase().replace(/ /g, '_'))
                      : []
                  }
                  rules={{ required: 'At least one feature must be selected.' }}
                  render={({ field: { value = [], onChange } }) => (
                    <Select
                      labelId='demo-multi-select-label'
                      id='demo-multi-select'
                      multiple
                      error={Boolean(errors.integrationNeeds)}
                      value={Array.isArray(value) ? value : []} // Ensure value is always an array
                      onChange={event => onChange(event.target.value)}
                      renderValue={selected =>
                        selected
                          .map(item =>
                            item
                              .split('_')
                              .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                              .join(' ')
                          )
                          .join(', ')
                      }
                    >
                      <MenuItem value='crm'>
                        <Checkbox checked={value.includes('crm')} />
                        <ListItemText primary='CRM' />
                      </MenuItem>
                      <MenuItem value='payment_gateway'>
                        <Checkbox checked={value.includes('payment_gateway')} />
                        <ListItemText primary='Payment Gateway' />
                      </MenuItem>
                      <MenuItem value='facebook'>
                        <Checkbox checked={value.includes('facebook')} />
                        <ListItemText primary='Facebook' />
                      </MenuItem>
                      <MenuItem value='instagram'>
                        <Checkbox checked={value.includes('instagram')} />
                        <ListItemText primary='Instagram' />
                      </MenuItem>
                      <MenuItem value='linkedin'>
                        <Checkbox checked={value.includes('linkedin')} />
                        <ListItemText primary='Linkedin' />
                      </MenuItem>
                      <MenuItem value='twitter'>
                        <Checkbox checked={value.includes('twitter')} />
                        <ListItemText primary='Twitter' />
                      </MenuItem>
                    </Select>
                  )}
                />
                {errors.integrationNeeds && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.integrationNeeds.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor='brandingFile'>Custom Branding (Upload Branding Guidelines or Files)</FormLabel>
                <Controller
                  name='brandingFile'
                  control={control}
                  error={Boolean(errors.brandingFile)}
                  render={({ field: { value, onChange } }) => (
                    <CustomFileUploads
                      multiple={false}
                      subtitle='(Max file size 3mb)'
                      minHeight='100px'
                      files={value}
                      onChange={onChange}
                      title={'Upload'}
                      // MediaUrl={MEDIA_URL}
                    />
                  )}
                />
                {errors.brandingFile && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.brandingFile.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} mt={3}>
              <Typography
                variant='fm-p1'
                fontWeight={600}
                sx={{
                  color: '#1e3a8a',
                  fontSize: '1.25rem',
                  borderBottom: '2px solid #3b82f6',
                  paddingBottom: '8px',
                  display: 'inline-block'
                }}
              >
                Social Media Links
              </Typography>
            </Grid>

            {['LinkedIn', 'Facebook', 'Twitter', 'Instagram'].map(platform => (
              <Grid item xs={6} key={platform}>
                <FormControl fullWidth>
                  <FormLabel htmlFor={`social_media_links_${platform?.toLowerCase()}`} sx={{ fontWeight: 600 }}>
                    {platform} Link
                  </FormLabel>
                  <Controller
                    name={`social_media_links.${platform?.toLowerCase()}`}
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        type='url'
                        placeholder={`Enter ${platform} link`}
                        id={`social_media_links_${platform?.toLowerCase()}`}
                        value={value || ''}
                        onChange={onChange}
                        error={Boolean(errors?.social_media_links?.[platform?.toLowerCase()])}
                        helperText={
                          errors?.social_media_links?.[platform?.toLowerCase()]
                            ? errors.social_media_links[platform?.toLowerCase()].message
                            : ''
                        }
                      />
                    )}
                  />
                </FormControl>
              </Grid>
            ))}
            <Grid item xs={12} mt={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                variant='fm-p1'
                fontWeight={600}
                sx={{
                  color: '#1e3a8a',
                  fontSize: '1.25rem',
                  borderBottom: '2px solid #3b82f6',
                  paddingBottom: '8px',
                  display: 'inline-block'
                }}
              >
                Additional Comments/Requirements
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor='additionalComments'>Additional Comments/Requirements</FormLabel>
                <Controller
                  name='additionalComments'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder='Additional Comments/Requirements'
                      onChange={onChange}
                      multiline
                      id='additionalComments'
                      value={value}
                      error={Boolean(errors.additionalComments)}
                    />
                  )}
                />
                {errors.additionalComments && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.additionalComments.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} mt={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                variant='fm-p1'
                fontWeight={600}
                sx={{
                  color: '#1e3a8a',
                  fontSize: '1.25rem',
                  borderBottom: '2px solid #3b82f6',
                  paddingBottom: '8px',
                  display: 'inline-block'
                }}
              >
                Submission and Confirmation
              </Typography>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel htmlFor='submittedBy'>Full Name</FormLabel>
                <Controller
                  name='submittedBy'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      placeholder='Enter Full Name'
                      onChange={onChange}
                      id='submittedBy'
                      value={value}
                      error={Boolean(errors.submittedBy)}
                    />
                  )}
                />
                {errors.submittedBy && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.submittedBy.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} mt={3} sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Typography
                variant='fm-p1'
                fontWeight={600}
                sx={{
                  color: '#1e3a8a',
                  fontSize: '1.25rem',
                  borderBottom: '2px solid #3b82f6',
                  paddingBottom: '8px',
                  display: 'inline-block'
                }}
              >
                Declaration/Verification Checkbox
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <FormControl required fullWidth>
                <FormGroup row>
                  <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    By Continuing, you agree to our
                  </Typography>

                  <Controller
                    name='isTermsAndConditions'
                    control={control}
                    // defaultValue={data?.isTermsAndConditions ?? false}
                    rules={{ required: 'You must accept the Terms and Conditions' }}
                    render={({ field }) => (
                      <FormControlLabel
                        label={
                          <>
                            <Link
                              to='https://bizvalleyinnovations.com/hiqlynks/terms.php'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              Terms and Conditions
                            </Link>
                          </>
                        }
                        sx={errors.isTermsAndConditions ? { color: 'error.main' } : null}
                        control={
                          <Checkbox
                            checked={field.value || false}
                            {...field}
                            sx={errors.isTermsAndConditions ? { color: 'error.main' } : null}
                          />
                        }
                      />
                    )}
                  />

                  <Typography variant='body1' sx={{ display: 'flex', alignItems: 'center', mr: 2 }}>
                    And
                  </Typography>

                  <Controller
                    name='isDataPrivacyAgreement'
                    control={control}
                    // defaultValue={data?.isDataPrivacyAgreement ?? false}
                    rules={{ required: 'You must accept the Privacy Policy' }}
                    render={({ field }) => (
                      <FormControlLabel
                        label={
                          <>
                            <Link
                              to='https://bizvalleyinnovations.com/hiqlynks/privacypolicy.php'
                              target='_blank'
                              rel='noopener noreferrer'
                            >
                              Privacy Policy
                            </Link>
                          </>
                        }
                        sx={errors.isDataPrivacyAgreement ? { color: 'error.main' } : null}
                        control={
                          <Checkbox
                            checked={field.value || false}
                            {...field}
                            sx={errors.isDataPrivacyAgreement ? { color: 'error.main' } : null}
                          />
                        }
                      />
                    )}
                  />
                </FormGroup>

                {(errors.isDataPrivacyAgreement || errors.isTermsAndConditions) && (
                  <FormHelperText sx={{ color: 'error.main' }}>
                    {errors.isDataPrivacyAgreement?.message || errors.isTermsAndConditions?.message}
                  </FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', mt: 4 }}>
              <LoadingButton
                size='large'
                type='submit'
                form='org-form'
                variant='contained'
                loading={loading}
                sx={{
                  background: '#1e3a8a',
                  borderRadius: '8px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  boxShadow: '0 4px 15px rgba(30, 58, 138, 0.3)',
                  '&:hover': {
                    background: '#1e40af',
                    boxShadow: '0 6px 20px rgba(30, 58, 138, 0.4)'
                  },
                  '&:disabled': {
                    background: '#94a3b8',
                    color: 'white'
                  }
                }}
              >
                Update
              </LoadingButton>
              <Button
                size='large'
                variant='outlined'
                onClick={handleFormCancel}
                sx={{
                  borderColor: '#3b82f6',
                  color: '#3b82f6',
                  borderRadius: '8px',
                  px: 4,
                  py: 1.5,
                  fontSize: '1rem',
                  fontWeight: 600,
                  textTransform: 'none',
                  '&:hover': {
                    borderColor: '#1e3a8a',
                    color: '#1e3a8a',
                    backgroundColor: '#f1f5f9'
                  }
                }}
              >
                Cancel
              </Button>
            </Grid>
          </Grid>
        </form>
      </Grid>
    </>
  )
}
export default EditOrgProfile
