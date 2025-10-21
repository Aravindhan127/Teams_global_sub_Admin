import React, { useEffect, useState } from 'react'
import {
  Box,
  Typography,
  FormControl,
  Grid,
  FormLabel,
  FormHelperText,
  IconButton,
  TextField,
  Card,
  Button,
  CardContent,
  Select,
  MenuItem,
  RadioGroup,
  FormControlLabel,
  Radio,
  Checkbox,
  InputAdornment,
  Autocomplete
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useLocation, useNavigate } from 'react-router-dom'
import { yupResolver } from '@hookform/resolvers/yup'
import * as yup from 'yup'
import { LoadingButton } from '@mui/lab'
import Accordion from '@mui/material/Accordion'
import AccordionSummary from '@mui/material/AccordionSummary'
import AccordionDetails from '@mui/material/AccordionDetails'
import ExpandMoreIcon from '@mui/icons-material/ExpandMore'
import ReactQuill from 'react-quill'
import 'react-quill/dist/quill.snow.css'
import { useDropzone } from 'react-dropzone'
import Translations from 'src/layouts/components/Translations'
import useCustomTranslation from 'src/@core/hooks/useCustomTranslation'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { toastError, toastSuccess } from 'src/utils/utils'
import DialogConfirmation from 'src/views/dialog/DialogConfirmation'
import CustomFileUploads from 'src/views/common/CustomFileUploads'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import DatePicker from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import { CleaveNumberInput } from 'src/@core/components/cleave-components'
import Switch from 'react-switch'
import moment from 'moment'
import DialogAddTicket from 'src/views/dialog/DialogAddTicket'
import { formatDate } from 'src/@core/utils/format'
import Datepicker from 'src/views/common/CustomDatepicker'
import { Edit, Close } from '@mui/icons-material'
import { useAuth } from 'src/hooks/useAuth'
import PhoneInput from 'react-phone-input-2'
import 'react-phone-input-2/lib/bootstrap.css'

const validationSchema = yup.object({
  name: yup.string().required('Event name is required'),
  organizeBy: yup.string().required("Host's name is required"),
  isVirtualEvent: yup.boolean().required('Please select event type'),

  country: yup.string().when('isVirtualEvent', {
    is: false,
    then: schema => schema.required('Country is required'),
    otherwise: schema => schema.notRequired()
  }),
  state: yup.string().when('isVirtualEvent', {
    is: false,
    then: schema => schema.required('State is required'),
    otherwise: schema => schema.notRequired()
  }),
  city: yup.string().when('isVirtualEvent', {
    is: false,
    then: schema => schema.required('City is required'),
    otherwise: schema => schema.notRequired()
  }),
  address: yup
    .string()
    .trim()
    .when('isVirtualEvent', {
      is: false,
      then: schema => schema.required('Venue is required'),
      otherwise: schema => schema.notRequired()
    }),
  eventDescription: yup.string().required('Description is required'),
  maxParticipants: yup.string().trim().required('Seat allocation is required'),
  // discountValue: yup.string().trim().required('Discount Value is required'),
  // expireDate: yup.string().trim().required('Expire Date is required'),
  eventImage: yup
    .mixed()
    .required('Image is required')
    .test('fileSize', 'Image is required', value => {
      if (typeof value === 'string') return true
      return !value || value.size <= 1024 * 1024 * 10
    })
    .test('fileType', 'Unsupported file format. Only JPEG/JPG images are allowed.', value => {
      if (typeof value === 'string') return true // Allow URLs in edit mode
      return value && /(image\/jpeg|image\/jpg)/.test(value.type)
    }),
  agenda: yup
    .mixed()
    .nullable()
    .notRequired()
    .test('fileSize', 'File size should be 50MB or less', value => {
      if (typeof value === 'string') return true // Allow URLs in edit mode
      return !value || value.size <= 1024 * 1024 * 50 // 50MB limit
    })
    .test('fileType', 'Unsupported file format. Only PDF, JPEG, and JPG are allowed.', value => {
      if (typeof value === 'string') return true // Allow URLs in edit mode
      return !value || /(application\/pdf|image\/jpeg|image\/jpg)/.test(value.type)
    }),
  privacyPolicyDoc: yup
    .mixed()
    .nullable()
    .required('Terms & Condition is required')
    .test('fileSize', 'File size should be 50MB or less', value => {
      if (typeof value === 'string') return true // Allow URLs in edit mode
      return !value || value.size <= 1024 * 1024 * 50 // 50MB limit
    })
    .test('fileType', 'Unsupported file format. Only PDF, JPEG, and JPG are allowed.', value => {
      if (typeof value === 'string') return true // Allow URLs in edit mode
      return !value || /(application\/pdf|image\/jpeg|image\/jpg)/.test(value.type)
    }),

  eventSchedules: yup
    .array()
    .of(
      yup.object().shape({
        startTime: yup.string().required('Start time is required'),
        endTime: yup
          .string()
          .required('End time is required')
          .test('is-after-start', 'End time must be after start time', function (endTime) {
            const { startTime } = this.parent
            if (!startTime || !endTime) return true
            return moment(endTime, 'HH:mm').isAfter(moment(startTime, 'HH:mm'))
          })
      })
    )
    .min(1, 'At least one event schedule is required'),
  tickets: yup.array().min(1, 'At least one ticket must be added.').required('Ticket is required.'),
  isOneDayEvent: yup.boolean().required('Please select event type'), // Ensuring user selects an event type
  eventDateRange: yup
    .array()
    .of(yup.date().typeError('Invalid date')) // Ensure valid dates
    .test('required-dates', 'Event date is required', function (value) {
      if (!Array.isArray(value) || value.length < 2) return false
      return !!value[0] && !!value[1] // Ensure both dates exist
    })
    .test('date-order', 'Start date must be before the end date', function (value) {
      const isOneDay = this.parent.isOneDayEvent
      if (!Array.isArray(value) || value.length < 2 || !value[0] || !value[1]) return true
      return isOneDay || new Date(value[0]) < new Date(value[1]) // Skip this check for single-day events
    })
    .test('single-day-check', 'Start and end date must be the same for single-day events', function (value) {
      const isOneDay = this.parent.isOneDayEvent
      if (!Array.isArray(value) || value.length < 2 || !value[0] || !value[1]) return true
      return isOneDay ? new Date(value[0]).toDateString() === new Date(value[1]).toDateString() : true
    }),
  eventUrl: yup.string().url('Invalid URL format').notRequired(),
  zoomUrl: yup.string().url('Invalid URL format').notRequired()

  // eventDateRange: yup
  //     .array()
  //     .of(yup.date().typeError('Invalid date')) // Ensure valid dates
  //     .test('required-dates', 'Event date range is required', (value) => {
  //         return value && value.length === 2 && value[0] && value[1];
  //     })
  //     .test('date-order', 'Start date must be before the end date', function (value) {
  //         if (!value || value.length !== 2 || !value[0] || !value[1]) return true;
  //         return new Date(value[0]) < new Date(value[1]);
  //     }),
  // Validation for tickets array
  // tickets: yup.array().of(
  //     yup.object().shape({
  //         description: yup.string().required('Ticket description is required'),
  //         price: yup.number().required('Price is required').positive('Price must be a positive number'),
  //         quantity: yup.number().required('Quantity is required').integer('Quantity must be an integer').min(1, 'Quantity must be at least 1'),
  //         categoryId: yup.string().required('Ticket category is required'),
  //     })
  // ).min(1, 'At least one ticket is required')
})

function CreateEvent() {
  const [loading, setLoading] = useState(false)
  const { user } = useAuth()
  console.log('user', user)
  const location = useLocation()
  const dataToEdit = location?.state?.dataToEdit
  const locationMode = location?.state?.mode
  const [mode, setMode] = useState('add')
  console.log('dataToEdit', dataToEdit)
  const translation = useCustomTranslation()
  const [open, setOpen] = useState(false)
  const [showTicketForm, setShowTicketForm] = useState(false)
  const [showCard, setShowCard] = useState(false)
  const [dateRange, setDateRange] = useState([null, null])
  const [daysInRange, setDaysInRange] = useState([])
  const [addedTickets, setAddedTickets] = useState([])
  const [categoryData, setCategoryData] = useState([])
  const [promoCodee, setPromoCode] = useState('')

  const navigate = useNavigate()

  const [inputValue, setInputValue] = useState('')
  const [stateLoading, setStateLoading] = useState(false)
  const [countryLoading, setCountryLoading] = useState(false)
  const [countryList, setCountryList] = useState([])
  const [stateList, setStateList] = useState([])
  const [cityList, setCityList] = useState([])
  const [cityLoading, setCityLoading] = useState(false) // State for city loading
  const [selectedCountry, setselectedCountry] = useState('')
  const [phone, setPhone] = useState('')
  const [phoneDialCode, setPhoneDialCode] = useState('')

  // const [addTicketDialogOpen, setAddTicketDialogOpen] = useState(false)
  // const [addTicketDialogMode, setAddTicketDialogMode] = useState("add");
  // const [tickeToEdit, setTicketToEdit] = useState(null);

  // const toggleAddTicketDialog = (e, mode = 'add', tickeToEdit = null) => {
  //     setAddTicketDialogOpen(prev => !prev)
  //     setAddTicketDialogMode(mode);
  //     setTicketToEdit(tickeToEdit);
  // }

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
      // isPaid: "free",
      tickets: [
        {
          description: '',
          isPaid: 'free',
          price: '',
          quantity: '',
          categoryId: ''
        }
      ],
      city: null,
      state: null,
      country: null,
      discountValue: 0,
      eventImage: null,
      expireDate: '',
      isOneDayEvent: undefined
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  })

  const isPaid = watch('isPaid')
  const isDiscountInPercentage = watch('isDiscountInPercentage')
  console.log('errors', errors)

  // const handlePhoneChange = (value, country) => {
  //     setPhone(value)
  //     setValue('phone', value)
  //     if (country) {
  //         clearErrors('phone')
  //         const { country: countryCode, dialCode, name } = country
  //         setPhoneDialCode(dialCode)
  //     }
  // }

  const handlePhoneChange = (value, country) => {
    if (country) {
      const { dialCode } = country
      setPhoneDialCode(dialCode)

      // Remove the dial code from the value
      const nationalNumber = value.startsWith(dialCode)
        ? value.slice(dialCode.length)
        : value.replace(`+${dialCode}`, '').trim()

      // Optional: remove any leading zeros or spaces
      const cleanedNumber = nationalNumber.replace(/^0+/, '').replace(/\s+/g, '')

      setPhone(cleanedNumber)
      setValue('phone', cleanedNumber)
      clearErrors('phone')
    } else {
      setPhone(value)
      setValue('phone', value)
    }
  }
  useEffect(() => {
    if (dataToEdit?.organiserPhone && dataToEdit?.organiserPhoneCountryCd) {
      setPhone(dataToEdit.organiserPhone)
      setPhoneDialCode(dataToEdit.organiserPhoneCountryCd.replace('+', '')) // clean + sign
    }
  }, [dataToEdit])

  const fetchCountryStateCityData = () => {
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
    console.log('my country', countryName)
    setStateLoading(true)
    let params = {
      listType: 'state',
      country: countryName
    }
    axiosInstance
      .get(ApiEndPoints.COUNTRY_STATE_CITY.get, { params })
      .then(response => {
        const states = response.data.listData.map((item, index) => ({
          id: index + 1,
          name: item.state
        }))
        setStateList(states)
        setCityList([])
      })
      .catch(error => {
        console.error('Error fetching states:', error)
      })
      .finally(() => setStateLoading(false))
  }

  const fetchCityData = async (stateName, countryName) => {
    setStateLoading(true)
    let params = {
      listType: 'city',
      country: countryName,
      state: stateName
    }
    axiosInstance
      .get(ApiEndPoints.COUNTRY_STATE_CITY.get, { params })
      .then(response => {
        const cities = response.data.listData.map((item, index) => ({
          id: index + 1,
          name: item.city
        }))

        setCityList(cities)
      })
      .catch(error => {
        console.error('Error fetching states:', error)
      })
      .finally(() => setStateLoading(false))
  }

  console.log('cities', cityList)
  useEffect(() => {
    fetchCountryStateCityData()
  }, [])

  useEffect(() => {
    if (countryList.length > 0 && dataToEdit) {
      fetchData()
    }
  }, [countryList])

  const fetchCategoryData = () => {
    setLoading(true)
    axiosInstance
      .get(ApiEndPoints?.EVENT_CATEGORY?.list)
      .then(response => {
        setCategoryData(response?.data?.data?.eventCategoryList)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  useEffect(() => {
    fetchCategoryData()
  }, [])

  useEffect(() => {
    setValue('tickets', addedTickets, { shouldValidate: true })
    if (addedTickets.length > 0) {
      clearErrors('tickets')
    }
  }, [addedTickets, setValue, clearErrors])

  const fetchData = async () => {
    setLoading(false)
    setMode(locationMode)

    reset({
      name: dataToEdit?.name || '',
      organizeBy: dataToEdit?.organizeBy || '',
      organiserEmail: dataToEdit?.organiserEmail || '',
      organiserPhone:
        dataToEdit?.organiserPhoneCountryCd && dataToEdit?.organiserPhone
          ? `${dataToEdit.organiserPhoneCountryCd}${dataToEdit.organiserPhone}`
          : '',
      organiserPhoneCountryCd: dataToEdit?.organiserPhoneCountryCd || '',
      eventDescription: dataToEdit?.description || '',
      address: dataToEdit?.address || '',

      zoomUrl: dataToEdit?.zoomUrl || '',
      eventImage: dataToEdit?.eventImage || null,
      agenda: dataToEdit?.agenda || null,
      privacyPolicyDoc: dataToEdit?.privacyPolicyDoc || null,
      eventUrl: dataToEdit?.eventUrl || '',
      eventDateRange:
        dataToEdit?.startDate && dataToEdit?.endDate
          ? [new Date(dataToEdit.startDate), new Date(dataToEdit.endDate)]
          : [null, null],

      startTime: dataToEdit?.startTime || '',
      endTime: dataToEdit?.endTime || '',
      maxParticipants: dataToEdit?.maxParticipants || '',
      country: dataToEdit?.country || null,
      state: dataToEdit?.state || null,
      city: dataToEdit?.city || null,
      promoCode: dataToEdit?.promoCode || '',
      discountValue: dataToEdit?.discountValue || 0,
      expireDate: dataToEdit?.expireDate || '',
      isDiscountInPercentage: dataToEdit?.isDiscountInPercentage || false,
      isOneDayEvent: dataToEdit?.isOneDayEvent || false,
      isVirtualEvent: dataToEdit?.isVirtualEvent ?? null,

      isReusable: dataToEdit?.isReusable || false,
      eventSchedules:
        dataToEdit?.eventSchedule?.map(schedule => ({
          eventDate: schedule.eventDate,
          startTime: schedule.startTime,
          endTime: schedule.endTime
        })) || [],

      tickets:
        dataToEdit?.tickets?.map(ticket => ({
          description: ticket.description || '',
          quantity: ticket.quantity || '',
          price: ticket.price || '',
          categoryId: ticket.categoryId || '',
          categoryName: ticket.category?.name || '',
          isPaid: ticket.price > 0 ? 'paid' : 'free' // Determine payment type
        })) || []
    })

    if (dataToEdit?.country) {
      await fetchStateData(dataToEdit.country) // Fetch states for the selected country
    }
    if (dataToEdit?.state) {
      await fetchCityData(dataToEdit.state, dataToEdit.country) // Fetch cities for the selected state
    }
    setPhone(dataToEdit?.organiserPhone || '')
    setPhoneDialCode((dataToEdit?.organiserPhoneCountryCd || '').replace('+', '') || '91')

    setAddedTickets(dataToEdit?.tickets || [])
    // setDaysInRange(dataToEdit?.eventSchedule || []);
    setDaysInRange(dataToEdit?.eventSchedule?.map(s => new Date(s.eventDate)) || [])

    setPromoCode(dataToEdit?.promoCode || '')
  }

  useEffect(() => {
    fetchData()
  }, [dataToEdit, mode, reset])

  useEffect(() => {
    // Initially hide price field if "free" is selected
    if (watch('isPaid') === 'free') {
      setValue('price', '') // Reset the price field when "free" is selected
      clearErrors('price')
    }
  }, [watch('isPaid'), setValue, clearErrors])

  const handleAddCategory = () => {
    if (!inputValue.trim()) return

    setLoading(true)
    let payload = new FormData()
    payload.append('name', inputValue)

    axiosInstance
      .post(ApiEndPoints.EVENT_CATEGORY.create, payload)
      .then(response => {
        const newCategory = response.data

        // Update category list
        setCategoryData(prevCategories => [...prevCategories, newCategory])
        fetchCategoryData()
        // Set the new category as selected
        setValue('categoryId', newCategory.categoryId, { shouldValidate: true })
        toastSuccess(response.data.message)
        // Clear input field
        setInputValue('')
        clearErrors('categoryId') // Clear validation error
      })
      .catch(error => {
        console.error('Error adding category', error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleAddTickets = () => {
    const isPaid = getValues('isPaid')
    const categoryId = getValues('categoryId')
    const description = getValues('description')
    const price = getValues('price')
    const quantity = getValues('quantity')

    let isValid = true

    // Validation
    if (!isPaid) {
      setError('isPaid', { type: 'manual', message: 'Event Type is required' })
      isValid = false
    }
    if (!categoryId) {
      setError('categoryId', { type: 'manual', message: 'Category is required' })
      isValid = false
    } else {
      clearErrors('categoryId')
    }
    if (!description) {
      setError('description', { type: 'manual', message: 'Description is required' })
      isValid = false
    }
    if (isPaid === 'paid' && !price) {
      setError('price', { type: 'manual', message: 'Price is required' })
      isValid = false
    } else if (isPaid === 'free') {
      clearErrors('price')
    }
    if (!quantity) {
      setError('quantity', { type: 'manual', message: 'Quantity is required' })
      isValid = false
    }
    if (!isValid) return

    // Find the category name from categoryData
    const category = categoryData.find(cat => cat.categoryId === categoryId)
    const categoryName = category ? category.name : 'Unknown'

    // Create new ticket
    const newTicket = {
      isPaid,
      categoryId,
      categoryName, // Store category name for display
      description,
      price: isPaid === 'free' ? 0 : price,
      quantity
    }

    // Check if there's an existing ticket type
    if (addedTickets.length > 0) {
      const existingType = addedTickets[0].isPaid
      if (existingType !== isPaid) {
        // If the new ticket type is different, remove all existing tickets
        setAddedTickets([newTicket])
      } else {
        // Otherwise, add the ticket normally
        setAddedTickets([...addedTickets, newTicket])
      }
    } else {
      // If no tickets exist, simply add the new one
      setAddedTickets([newTicket])
    }

    setValue('tickets', addedTickets, { shouldValidate: true })

    if (addedTickets.length > 0) {
      clearErrors('tickets')
    }

    // Reset form fields
    setValue('categoryId', '')
    setValue('description', '')
    setValue('price', '')
    setValue('quantity', '')
    setInputValue('')
    clearErrors()
  }

  const handleDeleteTicket = index => {
    const filteredTickets = addedTickets?.filter((_, i) => i !== index)
    setAddedTickets(filteredTickets)
  }

  console.log('daysInRange', daysInRange)
  console.log('isPaid', isPaid)
  const generatePromoCode = () => {
    setLoading(true)
    axiosInstance
      .get(ApiEndPoints?.EVENT?.generatePromoCode)
      .then(response => {
        setPromoCode(response?.data?.data?.promoCode)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }
  const handleGetPromocode = () => {
    setShowCard(!showCard)
    generatePromoCode()
  }
  const isVirtualEvent = watch('isVirtualEvent')

  const onSubmit = data => {
    console.log('data', data)

    if (addedTickets.length === 0) {
      setError('tickets', { type: 'manual', message: 'At least one ticket must be added.' })
      return
    }
    clearErrors('tickets')
    setValue('tickets', addedTickets)
    let startDate = ''
    let endDate = ''

    if (data.isOneDayEvent) {
      const singleDate = moment(data.eventDateRange[0]).format('YYYY-MM-DD')
      startDate = singleDate
      endDate = singleDate
    } else {
      startDate = moment(data.eventDateRange[0]).format('YYYY-MM-DD')
      endDate = moment(data.eventDateRange[1]).format('YYYY-MM-DD')
    }

    let payload = new FormData()
    payload.append('name', data.name)
    payload.append('organizeBy', data?.organizeBy)
    payload.append('organiserEmail', data?.organiserEmail)
    payload.append('organiserPhoneCountryCd', '+' + phoneDialCode) // Append the country code
    payload.append('organiserPhone', phone)
    payload.append('description', data.eventDescription)
    payload.append('address', data.address)

    payload.append('zoomUrl', data.zoomUrl)
    payload.append('maxParticipants', data.maxParticipants)
    payload.append('eventUrl', data.eventUrl)
    if (mode === 'edit') {
      if (promoCodee !== data.promoCode && data.promoCode) {
        payload.append('promoCode', data.promoCode)
      }
    } else if (mode !== 'edit' && data.promoCode) {
      payload.append('promoCode', data.promoCode)
    }
    payload.append('isDiscountInPercentage', data.isDiscountInPercentage)
    payload.append('isReusable', data.isReusable)
    payload.append('discountValue', data.discountValue)
    payload.append('isOneDayEvent', data.isOneDayEvent)
    payload.append('isVirtualEvent', data.isVirtualEvent)
    if (data.expireDate) payload.append('expireDate', data.expireDate)
    if (data.city) payload.append('city', data.city)
    if (data.state) payload.append('state', data.state)
    if (data.country) payload.append('country', data.country)
    // payload.append('isPaid', false);
    payload.append('isCloseRegistration', false)
    payload.append('isStripeAllowed', false)
    payload.append('isRazorpayAllowed', false)
    payload.append('isPaypalAllowed', false)
    payload.append('startDate', startDate) // Pass the formatted startDate
    payload.append('endDate', endDate)

    addedTickets.forEach((item, index) => {
      payload.append(`tickets[${index}][description]`, item.description)
      payload.append(`tickets[${index}][price]`, item.price)
      payload.append(`tickets[${index}][quantity]`, item.quantity)
      payload.append(`tickets[${index}][categoryId]`, item.categoryId)
      payload.append(`tickets[${index}][isPaid]`, item.isPaid === 'free' ? false : true)
    })

    if (data.eventSchedules && data.eventSchedules.length > 0) {
      daysInRange.forEach((day, index) => {
        const eventDate = moment(day).format('YYYY-MM-DD') // Convert to required date format

        if (data.eventSchedules[index]) {
          // Ensure index exists in eventSchedules
          payload.append(`eventSchedules[${index}][eventDate]`, eventDate)
          payload.append(`eventSchedules[${index}][startTime]`, data.eventSchedules[index].startTime)
          payload.append(`eventSchedules[${index}][endTime]`, data.eventSchedules[index].endTime)
        }
      })
    }

    if (data.eventImage && data.eventImage instanceof File) {
      payload.append('eventImage', data.eventImage)
    }
    if (data.agenda && data.agenda instanceof File) {
      payload.append('agenda', data.agenda)
    }
    if (data.privacyPolicyDoc && data.privacyPolicyDoc instanceof File) {
      payload.append('privacyPolicyDoc', data.privacyPolicyDoc)
    }

    console.log([...payload])
    if (mode === 'edit') {
      payload.append('eventId', dataToEdit.eventId)
    }

    setLoading(true)
    let apiInstance = null
    if (mode === 'edit') {
      apiInstance = axiosInstance.post(ApiEndPoints.EVENT.edit, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } else {
      apiInstance = axiosInstance.post(ApiEndPoints.EVENT.create, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
    apiInstance
      .then(response => response.data)
      .then(response => {
        // onSuccess();
        toastSuccess(response.message)
        navigate('/event')
        // toggle();
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    const [startDate, endDate] = dateRange
    if (startDate && endDate) {
      let tempDays = []
      let currentDate = new Date(startDate)
      while (currentDate <= endDate) {
        tempDays.push(new Date(currentDate))
        currentDate.setDate(currentDate.getDate() + 1)
      }
      setDaysInRange(tempDays)
    } else {
      setDaysInRange([])
    }
  }, [dateRange])

  console.log('addedtickets', addedTickets)
  return (
    <>
      <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
        <Box sx={{ p: 10, bgcolor: '#F7F7F7', borderRadius: '20px' }}>
          <Box display='flex' flexDirection='column' gap={2} mb={5}>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <ArrowBackIcon onClick={() => navigate('/event')} />
              <Typography variant='h6' fontWeight={600}>
                Event
              </Typography>
            </Box>
          </Box>

          <Grid container spacing={4}>
            <Grid item xs={8}>
              <FormControl fullWidth>
                <FormLabel htmlFor='name' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Event Name
                </FormLabel>
                <Controller
                  name='name'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      id='name'
                      value={value}
                      onChange={onChange}
                      inputProps={{ maxLength: 100 }}
                      variant='outlined' // or "standard" if you want no border at all
                      sx={{
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: 'none' } // remove border
                        }
                      }}
                    />
                  )}
                />
                {errors.name && <FormHelperText sx={{ color: 'error.main' }}>{errors.name.message}</FormHelperText>}
              </FormControl>
            </Grid>
            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel htmlFor='eventImage' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Event Image
                </FormLabel>
                <Controller
                  name='eventImage'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomFileUploads
                      multiple={false}
                      subeventName='(Max file size 3mb)'
                      minHeight='100px'
                      files={value}
                      onChange={onChange}
                      title={'Add Image'}
                      customize={'customize'}
                      // MediaUrl='http://103.204.189.64:4003'
                    />
                  )}
                />
                {errors?.eventImage && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors?.eventImage?.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl component='fieldset' fullWidth>
                <Controller
                  name='isOneDayEvent'
                  control={control}
                  defaultValue={dataToEdit?.isOneDayEvent}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      row
                      value={value}
                      onChange={e => {
                        const isSingleDay = e.target.value === 'true' // Convert string to boolean
                        onChange(isSingleDay) // Update form state

                        // Ensure correct date values
                        if (isSingleDay) {
                          setValue('eventDateRange', [null, null]) // Do not set today's date
                        } else {
                          setValue('eventDateRange', [null, null]) // Multi-day -> Empty range
                        }
                      }}
                    >
                      <FormControlLabel value={true} control={<Radio />} label='Single Day Event' />
                      <FormControlLabel value={false} control={<Radio />} label='Multiple Day Event' />
                    </RadioGroup>
                  )}
                />
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel
                  required
                  htmlFor='eventDateRange'
                  style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}
                >
                  Event Date
                </FormLabel>
                <Controller
                  name='eventDateRange'
                  control={control}
                  render={({ field: { value, onChange } }) =>
                    watch('isOneDayEvent') ? (
                      // Single Day Event Picker
                      <DatePicker
                        selected={value?.[0] || null} // Use null if no date is selected
                        onChange={date => {
                          const newDateRange = date ? [date, date] : [null, null] // Handle case when no date is selected
                          onChange(newDateRange)
                          setDateRange(newDateRange) // Update the date range state
                        }}
                        minDate={new Date().setDate(new Date().getDate() + 1)}
                        customInput={
                          <TextField
                            fullWidth
                            variant='outlined'
                            placeholder='dd/mm/yyyy'
                            InputProps={{ readOnly: true }}
                            sx={{
                              backgroundColor: '#fff',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' } // remove border
                              }
                            }}
                          />
                        }
                      />
                    ) : (
                      // Multiple Day Event Picker
                      <DatePicker
                        selectsRange
                        monthsShown={2}
                        startDate={value?.[0] || null}
                        endDate={value?.[1] || null}
                        onChange={dates => {
                          onChange(dates)
                          setDateRange(dates)
                        }}
                        shouldCloseOnSelect={false}
                        minDate={new Date().setDate(new Date().getDate() + 1)}
                        customInput={
                          <TextField
                            fullWidth
                            variant='outlined'
                            placeholder='dd/mm/yyyy'
                            InputProps={{ readOnly: true }}
                            sx={{
                              backgroundColor: '#fff',
                              '& .MuiOutlinedInput-root': {
                                '& fieldset': { border: 'none' } // remove border
                              }
                            }}
                          />
                        }
                      />
                    )
                  }
                />
                {errors.eventDateRange && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.eventDateRange.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {daysInRange?.map((day, index) => (
              <Grid item container spacing={2} key={index}>
                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor={`startTime-${index}`}>
                      Start Time for{' '}
                      {mode === 'edit' && day?.eventDate
                        ? new Date(day.eventDate).toLocaleDateString() // Ensure eventDate is converted to a Date object
                        : day instanceof Date
                        ? day.toLocaleDateString() // Call only if day is a Date
                        : 'Invalid Date'}
                    </FormLabel>

                    <Controller
                      name={`eventSchedules[${index}].startTime`} // Correctly reference field name
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <DatePicker
                            selected={value ? moment(value, 'hh:mm A').toDate() : null}
                            onChange={date => {
                              const timeString = date ? moment(date).format('hh:mm A') : null // 12-hour format
                              onChange(timeString)
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption='Time'
                            dateFormat='hh:mm aa'
                            placeholderText='Select Start Time'
                            customInput={
                              <TextField
                                fullWidth
                                InputProps={{ readOnly: true }}
                                variant='outlined'
                                sx={{
                                  backgroundColor: '#fff',
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': { border: 'none' } // remove border
                                  }
                                }}
                              />
                            }
                          />
                        )
                      }}
                    />
                    {errors.eventSchedules?.[index]?.startTime && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.eventSchedules[index].startTime.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={6}>
                  <FormControl fullWidth>
                    <FormLabel htmlFor={`endTime-${index}`}>
                      End Time for{' '}
                      {mode === 'edit' && day?.eventDate
                        ? new Date(day.eventDate).toLocaleDateString() // Convert to Date object
                        : day instanceof Date
                        ? day.toLocaleDateString()
                        : 'Invalid Date'}
                    </FormLabel>
                    <Controller
                      name={`eventSchedules[${index}].endTime`} // Correctly reference field name
                      control={control}
                      render={({ field: { value, onChange } }) => {
                        return (
                          <DatePicker
                            selected={value ? moment(value, 'hh:mm A').toDate() : null}
                            onChange={date => {
                              const timeString = date ? moment(date).format('hh:mm A') : null // 12-hour format
                              onChange(timeString)
                            }}
                            showTimeSelect
                            showTimeSelectOnly
                            timeIntervals={15}
                            timeCaption='Time'
                            dateFormat='hh:mm aa'
                            placeholderText='Select End Time'
                            customInput={
                              <TextField
                                fullWidth
                                InputProps={{ readOnly: true }}
                                variant='outlined'
                                sx={{
                                  backgroundColor: '#fff',
                                  '& .MuiOutlinedInput-root': {
                                    '& fieldset': { border: 'none' } // remove border
                                  }
                                }}
                              />
                            }
                          />
                        )
                      }}
                    />
                    {errors.eventSchedules?.[index]?.endTime && (
                      <FormHelperText sx={{ color: 'error.main' }}>
                        {errors.eventSchedules[index].endTime.message}
                      </FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            ))}

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor='eventDescription' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Event Description
                </FormLabel>
                <Controller
                  name='eventDescription'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <Box sx={{ position: 'relative', width: '100%' }}>
                      <TextField
                        id='eventDescription'
                        value={value}
                        onChange={onChange}
                        multiline
                        rows={2}
                        variant='outlined'
                        fullWidth
                        inputProps={{ maxLength: 200 }}
                        sx={{
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { border: 'none' } // remove border
                          }
                        }}
                      />
                      <Typography
                        variant='caption'
                        sx={{
                          position: 'absolute',
                          bottom: 8,
                          right: 10,
                          color: 'gray'
                        }}
                      >
                        {value?.length || 0}/200
                      </Typography>
                    </Box>
                  )}
                />
                {errors.eventDescription && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.eventDescription.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl component='fieldset' fullWidth>
                <FormLabel style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>Is Virtual Event?</FormLabel>
                <Controller
                  name='isVirtualEvent'
                  control={control}
                  defaultValue={null}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      row
                      value={value === null ? '' : String(value)} // fallback to '' when null
                      onChange={e => onChange(e.target.value === 'true')}
                    >
                      <FormControlLabel value='true' control={<Radio />} label='Yes' />
                      <FormControlLabel value='false' control={<Radio />} label='No' />
                    </RadioGroup>
                  )}
                />

                {errors?.isVirtualEvent && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors?.isVirtualEvent?.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            {isVirtualEvent && (
              <Grid item xs={8}>
                <FormControl fullWidth>
                  <FormLabel htmlFor='zoomUrl' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                    Zoom URL
                  </FormLabel>
                  <Controller
                    name='zoomUrl'
                    control={control}
                    defaultValue={dataToEdit?.zoomUrl || ''}
                    render={({ field: { value, onChange } }) => (
                      <TextField
                        id='zoomUrl'
                        value={value}
                        onChange={onChange}
                        placeholder='Enter Zoom link'
                        variant='outlined'
                        sx={{
                          backgroundColor: '#fff',
                          '& .MuiOutlinedInput-root': {
                            '& fieldset': { border: 'none' }
                          }
                        }}
                      />
                    )}
                  />
                  {errors?.zoomUrl && (
                    <FormHelperText sx={{ color: 'error.main' }}>{errors.zoomUrl.message}</FormHelperText>
                  )}
                </FormControl>
              </Grid>
            )}

            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor='address' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Event Venue
                </FormLabel>
                <Controller
                  name='address'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      id='address'
                      value={value}
                      multiline
                      onChange={onChange}
                      variant='outlined'
                      sx={{
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: 'none' } // remove border
                        }
                      }}
                    />
                  )}
                />
                {errors.address && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.address.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={4}>
              <FormControl fullWidth>
                <FormLabel htmlFor='country' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Country
                </FormLabel>
                <Controller
                  name='country'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      defaultValue={dataToEdit?.country}
                      options={countryList}
                      freeSolo // Allows custom input
                      onInputChange={(e, newInputValue) => {
                        // Set the input as the selected value if it's not in the list
                        if (!countryList.some(option => option.name === newInputValue)) {
                          onChange(newInputValue) // Set custom input
                          setselectedCountry(newInputValue)
                        }
                      }}
                      onChange={(e, newValue) => {
                        console.log('Selected Country:', newValue)
                        if (newValue && typeof newValue === 'object') {
                          onChange(newValue.name) // Pass country name
                          fetchStateData(newValue.name) // Fetch states by country name
                          setselectedCountry(newValue.name)
                        }
                      }}
                      value={countryList.find(option => option.name === value) || value || null}
                      getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Select Country'
                          variant='outlined'
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { border: 'none' } // remove border
                            }
                          }}
                        />
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
                <FormLabel htmlFor='state' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  State/Province
                </FormLabel>
                <Controller
                  name='state'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      defaultValue={dataToEdit?.state}
                      options={stateList}
                      freeSolo // Allows custom input
                      onInputChange={(e, newInputValue) => {
                        if (!stateList.some(option => option.name === newInputValue)) {
                          onChange(newInputValue) // Set custom input
                        }
                      }}
                      onChange={(e, newValue) => {
                        console.log('Selected State:', newValue?.name)
                        if (newValue && typeof newValue === 'object') {
                          onChange(newValue.name) // Pass state name
                          fetchCityData(newValue.name, selectedCountry) // Fetch cities by state name
                        }
                      }}
                      value={stateList.find(option => option.name === value) || value || null}
                      getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Select state'
                          variant='outlined'
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { border: 'none' } // remove border
                            }
                          }}
                        />
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
                <FormLabel htmlFor='city' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  City
                </FormLabel>
                <Controller
                  name='city'
                  control={control}
                  render={({ field: { onChange, value } }) => (
                    <Autocomplete
                      defaultValue={dataToEdit?.city}
                      options={cityList}
                      freeSolo // Allows custom input
                      onInputChange={(e, newInputValue) => {
                        if (!cityList.some(option => option.name === newInputValue)) {
                          onChange(newInputValue) // Set custom input
                        }
                      }}
                      onChange={(e, newValue) => {
                        console.log('Selected city:', newValue?.name)
                        if (newValue && typeof newValue === 'object') {
                          onChange(newValue.name) // Pass city name
                        }
                      }}
                      value={cityList.find(option => option.name === value) || value || null}
                      getOptionLabel={option => (typeof option === 'string' ? option : option.name)}
                      renderInput={params => (
                        <TextField
                          {...params}
                          placeholder='Select city'
                          variant='outlined'
                          sx={{
                            backgroundColor: '#fff',
                            '& .MuiOutlinedInput-root': {
                              '& fieldset': { border: 'none' } // remove border
                            }
                          }}
                        />
                      )}
                      loading={cityLoading}
                    />
                  )}
                />
                {errors.city && <FormHelperText sx={{ color: 'error.main' }}>{errors.city.message}</FormHelperText>}
              </FormControl>
            </Grid>

            {/* <Grid item xs={12}>
                            <FormControl fullWidth>
                                <FormLabel required htmlFor='eventDateRange'>Event Start date</FormLabel>
                                <Controller
                                    name='eventDateRange'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <DatePicker
                                            selectsRange
                                            monthsShown={2}
                                            startDate={value ? value[0] : null}
                                            endDate={value ? value[1] : null}
                                            selected={value ? value[0] : null}
                                            onChange={(dates) => {
                                                onChange(dates);
                                                setDateRange(dates);
                                            }}
                                            shouldCloseOnSelect={false}
                                            id='date-range-picker-months'
                                            minDate={new Date()}
                                            customInput={
                                                <TextField
                                                    fullWidth
                                                    variant="outlined"
                                                    placeholder="dd/mm/yyyy"
                                                />
                                            }
                                        />
                                    )}
                                />
                                {errors.eventDateRange && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.eventDateRange.message}
                                    </FormHelperText>
                                )}
                            </FormControl>
                        </Grid> */}

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor='agenda' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Agenda For Event
                </FormLabel>
                <Controller
                  name='agenda'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomFileUploads
                      multiple={false}
                      subeventName='(Max file size 3mb)'
                      minHeight='100px'
                      files={value}
                      onChange={onChange}
                      title={'Add Image/Pdf'}
                      customize={'customize'}
                      // MediaUrl='http://103.204.189.64:4003'
                    />
                  )}
                />
                {errors?.agenda && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors?.agenda?.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor='eventUrl' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Event Url
                </FormLabel>
                <Controller
                  name='eventUrl'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      id='eventUrl'
                      value={value}
                      onChange={onChange}
                      placeholder='Enter Event Url'
                      variant='outlined'
                      sx={{
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: 'none' } // remove border
                        }
                      }}
                    />
                  )}
                />
                {errors.eventUrl && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.eventUrl.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='fm-p2' sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                  Organizer Details
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor='organizeBy' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Hosted By
                </FormLabel>
                <Controller
                  name='organizeBy'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      id='organizeBy'
                      value={value}
                      onChange={onChange}
                      // placeholder="Enter the host's name"
                      variant='outlined' // or "standard" if you want no border at all
                      sx={{
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: 'none' } // remove border
                        }
                      }}
                    />
                  )}
                />
                {errors.organizeBy && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.organizeBy.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor='maxParticipants' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Alloted Seats
                </FormLabel>
                <Controller
                  name='maxParticipants'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      id='maxParticipants'
                      value={value}
                      onChange={onChange}
                      fullWidth
                      variant='outlined'
                      sx={{
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: 'none' } // remove border
                        }
                      }}
                      InputProps={{
                        inputComponent: CleaveNumberInput
                      }}
                    />
                  )}
                />
                {errors.maxParticipants && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.maxParticipants.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor='organiserEmail' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Organizer Mail Id
                </FormLabel>
                <Controller
                  name='organiserEmail'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <TextField
                      id='organiserEmail'
                      value={value}
                      onChange={onChange}
                      // placeholder='Enter Organizer Email'
                      variant='outlined'
                      sx={{
                        backgroundColor: '#fff',
                        '& .MuiOutlinedInput-root': {
                          '& fieldset': { border: 'none' } // remove border
                        }
                      }}
                    />
                  )}
                />
                {errors.organiserEmail && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.organiserEmail.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={6}>
              <FormControl fullWidth>
                <FormLabel htmlFor='organiserPhone' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Organiser Phone Number
                </FormLabel>
                <Controller
                  name='organiserPhone'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <PhoneInput
                      error={Boolean(errors.organiserPhone)}
                      inputStyle={{
                        width: '100%',
                        height: '100%',
                        // border: Boolean(errors.organiserPhone) ? '1px solid red' : '1px solid #ccc',
                        border: 'none'
                      }}
                      enableSearch={true}
                      PhoneInputCountryFlag-borderColor='red'
                      // placeholder='Phone number'
                      value={value}
                      onChange={handlePhoneChange}
                    />
                  )}
                />
                {errors.organiserPhone && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors.organiserPhone.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth>
                <FormLabel htmlFor='privacyPolicyDoc' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Terms & Condition
                </FormLabel>
                <Controller
                  name='privacyPolicyDoc'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <CustomFileUploads
                      multiple={false}
                      subeventName='(Max file size 3mb)'
                      minHeight='100px'
                      files={value}
                      onChange={onChange}
                      title={'Add Image/Pdf'}
                      customize={'customize'}
                      // MediaUrl='http://103.204.189.64:4003'
                    />
                  )}
                />
                {errors?.privacyPolicyDoc && (
                  <FormHelperText sx={{ color: 'error.main' }}>{errors?.privacyPolicyDoc?.message}</FormHelperText>
                )}
              </FormControl>
            </Grid>

            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <Typography variant='fm-p2' sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                  Ticket Details
                </Typography>
                {/* <Button
                                    variant="contained"
                                    color="primary"
                                    size='small'
                                    onClick={() => setShowTicketForm(true)}
                                >
                                    Add Tickets
                                </Button> */}
              </Box>

              {errors.tickets && (
                <FormHelperText sx={{ color: 'error.main', mt: 1 }}>{errors.tickets.message}</FormHelperText>
              )}
            </Grid>

            <Grid item xs={12}>
              <FormControl component='fieldset' fullWidth>
                <FormLabel component='legend' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                  Event Type
                </FormLabel>
                <Controller
                  name='isPaid'
                  control={control}
                  render={({ field: { value, onChange } }) => (
                    <RadioGroup
                      value={value} // No need to use fallback ('free') here
                      onChange={e => {
                        onChange(e)
                        if (e.target.value === 'free') {
                          setValue('price', '') // Reset price when Free is selected
                          clearErrors('price') // Clear validation errors for price
                        }
                      }}
                      row
                    >
                      <FormControlLabel
                        value='free'
                        control={<Radio />}
                        label='Free'
                        // defaultChecked={true}
                      />
                      <FormControlLabel value='paid' control={<Radio />} label='Paid' />
                    </RadioGroup>
                  )}
                />
                {errors.isPaid && <FormHelperText sx={{ color: 'error.main' }}>{errors.isPaid.message}</FormHelperText>}
              </FormControl>
            </Grid>

            <Grid item xs={12}>
              <Card sx={{ border: "1px solid '#8080805c" }}>
                <CardContent>
                  <Grid container spacing={3} alignItems='center'>
                    {/* <Grid item xs={12} md={4}>
                                            <FormControl fullWidth>
                                                <FormLabel htmlFor='categoryId'>Category</FormLabel>
                                                <Controller
                                                    name='categoryId'
                                                    control={control}
                                                    render={({ field: { value, onChange } }) => (
                                                        <Select
                                                            id="categoryId"
                                                            defaultValue={""}
                                                            displayEmpty
                                                            value={value || ""}
                                                            onChange={onChange}
                                                        >
                                                            <MenuItem disabled value={""}>
                                                                Select Category
                                                            </MenuItem>
                                                            {categoryData.map((item) => (
                                                                <MenuItem key={item.categoryId} value={item.categoryId}>
                                                                    {item.name}
                                                                </MenuItem>
                                                            ))}

                                                        </Select>
                                                    )}
                                                />
                                                {errors.categoryId && (
                                                    <FormHelperText sx={{ color: 'error.main' }}>
                                                        {errors.categoryId.message}
                                                    </FormHelperText>
                                                )}
                                            </FormControl>
                                        </Grid> */}
                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <FormLabel htmlFor='categoryId' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                          Category
                        </FormLabel>
                        <Controller
                          name='categoryId'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <Autocomplete
                              freeSolo
                              options={categoryData}
                              getOptionLabel={option => option?.name || ''}
                              value={categoryData?.find(cat => cat.categoryId === value) || ''}
                              onChange={(event, newValue) => {
                                if (newValue) {
                                  onChange(newValue?.categoryId) // Set the categoryId
                                }
                              }}
                              onInputChange={(event, newValue, reason) => {
                                if (reason === 'input') {
                                  setInputValue(newValue)
                                }
                              }}
                              renderInput={params => {
                                const inputTrimmed = inputValue.trim().toLowerCase()
                                const isNewValue =
                                  inputTrimmed && !categoryData.some(cat => cat.name.toLowerCase() === inputTrimmed)

                                return (
                                  <TextField
                                    {...params}
                                    variant='outlined'
                                    placeholder='Select or add category'
                                    InputProps={{
                                      ...params.InputProps,
                                      endAdornment: (
                                        <>
                                          {params.InputProps.endAdornment}
                                          {isNewValue && (
                                            <Box sx={{ ml: 1, display: 'flex', alignItems: 'center' }}>
                                              <Button variant='outlined' size='small' onClick={handleAddCategory}>
                                                Add
                                              </Button>
                                            </Box>
                                          )}
                                        </>
                                      )
                                    }}
                                  />
                                )
                              }}
                            />
                          )}
                        />

                        {errors.categoryId && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.categoryId.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    <Grid item xs={12} md={4}>
                      <FormControl fullWidth>
                        <FormLabel
                          htmlFor='description'
                          style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}
                        >
                          Description
                        </FormLabel>
                        <Controller
                          name='description'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              id='description'
                              value={value}
                              onChange={onChange}
                              // placeholder='Enter Description'
                              inputProps={{ maxLength: 15 }}
                            />
                          )}
                        />
                        {errors.description && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>

                    {watch('isPaid') === 'paid' && (
                      <Grid item xs={12} md={2}>
                        <FormControl fullWidth>
                          <FormLabel htmlFor='price' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                            Price
                          </FormLabel>
                          <Controller
                            name='price'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                id='price'
                                value={value}
                                onChange={onChange}
                                // placeholder="Enter Price"
                                fullWidth
                                variant='outlined'
                                InputProps={{
                                  inputComponent: CleaveNumberInput
                                }}
                              />
                            )}
                          />
                          {errors.price && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.price.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    )}

                    <Grid item xs={12} md={2}>
                      <FormControl fullWidth>
                        <FormLabel htmlFor='quantity' style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}>
                          Quantity
                        </FormLabel>
                        <Controller
                          name='quantity'
                          control={control}
                          render={({ field: { value, onChange } }) => (
                            <TextField
                              id='quantity'
                              value={value}
                              onChange={onChange}
                              // placeholder="Enter quantity"
                              fullWidth
                              variant='outlined'
                              InputProps={{
                                inputComponent: CleaveNumberInput
                              }}
                            />
                          )}
                        />
                        {errors.quantity && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.quantity.message}</FormHelperText>
                        )}
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                      <Box width='100px' mt={{ xs: 2, md: 2 }}>
                        <Button variant='contained' color='primary' size='small' onClick={handleAddTickets}>
                          Add tickets
                        </Button>
                      </Box>
                    </Grid>

                    <Grid item container spacing={2}>
                      {addedTickets.map((item, index) => (
                        <Grid item xs={12} sm={6} md={4} key={index}>
                          <Card sx={{ borderRadius: 2, height: '100% !important' }}>
                            <Box sx={{ px: 2, display: 'flex', justifyContent: 'flex-end' }}>
                              <IconButton size='small' onClick={() => handleDeleteTicket(index)}>
                                <Close fontSize='small' />
                              </IconButton>
                            </Box>
                            <CardContent sx={{ py: 0 }}>
                              <Typography sx={{ fontSize: 14, color: '#555', mb: 0.5 }}>
                                {/* <strong>Ticket Category:</strong> {item.categoryId.split('-')[1]} */}
                                <strong>Ticket Category:</strong>{' '}
                                {categoryData.find(cat => cat.categoryId === item.categoryId)?.name || 'Unknown'}
                              </Typography>

                              <Typography sx={{ fontSize: 14, color: '#555', mb: 0.5 }}>
                                <strong>Ticket Description:</strong> {item.description}
                              </Typography>
                              <Typography sx={{ fontSize: 14, color: '#555', mb: 0.5 }}>
                                <strong>Ticket Quantity:</strong> {item.quantity}
                              </Typography>
                              {item.price ? (
                                <Typography sx={{ fontSize: 14, color: '#555', mb: 0.5 }}>
                                  <strong>Ticket Price:</strong> {item?.price}$
                                </Typography>
                              ) : null}

                              <Typography sx={{ fontSize: 14, color: '#555', mb: 0.5, textTransform: 'capitalize' }}>
                                <strong>Payment Type:</strong>{' '}
                                {mode === 'edit' ? (item?.isPaid === false ? 'free' : 'paid') : item?.isPaid}
                              </Typography>
                            </CardContent>
                          </Card>
                        </Grid>
                      ))}
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>

            {watch('isPaid') === 'paid' && (
              <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <Typography variant='fm-p2' sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                    Promo Code
                  </Typography>
                  <Switch
                    id='toggle_promo'
                    checked={showCard}
                    checkedIcon={false}
                    uncheckedIcon={false}
                    size='small'
                    offColor='#D0D5DD'
                    onColor='#1e3a8a'
                    activeBoxShadow='none'
                    height={20}
                    width={36}
                    // onChange={() => setShowCard(!showCard)}
                    onChange={handleGetPromocode}
                    boxShadow='0 0 2px 3px rgba(104, 44, 139, 0.5)'
                    sx={{
                      width: 36, // Controls overall width
                      height: 20, // Controls overall height
                      padding: 0,
                      '& .MuiSwitch-thumb': {
                        width: 8, // Reduce the circle size
                        height: 8 // Reduce the circle size
                      },
                      '& .MuiSwitch-track': {
                        backgroundColor: showCard ? '#1e3a8a' : '#D0D5DD',
                        opacity: 1,
                        borderRadius: 20
                      }
                    }}
                  />
                </Box>
              </Grid>
            )}
            {showCard && (
              <Grid item xs={12} sx={{ overflow: 'visible' }}>
                <Card sx={{ border: "1px solid '#8080805c" }}>
                  <CardContent
                    sx={{
                      maxHeight: '400px', // Adjust the height as needed
                      overflowY: 'auto',
                      scrollbarWidth: 'none', // For Firefox
                      '&::-webkit-scrollbar': {
                        display: 'none' // Hide scrollbar for Webkit (Chrome, Safari)
                      }
                    }}
                  >
                    <Grid container spacing={3} alignItems='center'>
                      <Grid
                        item
                        xs={12}
                        md={6}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <FormControl fullWidth>
                          <FormLabel
                            required
                            htmlFor='promoCode'
                            style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}
                          >
                            Promo Code
                          </FormLabel>
                          <Controller
                            name='promoCode'
                            control={control}
                            render={({ field }) => (
                              <TextField
                                id='promoCode'
                                {...field}
                                // placeholder="Enter Promo Code"
                                fullWidth
                                readOnly
                                variant='outlined'
                                value={promoCodee}
                              />
                            )}
                          />
                        </FormControl>
                      </Grid>
                      <Grid item xs={12} md={6}>
                        <FormControl fullWidth>
                          <FormLabel
                            required
                            htmlFor='expireDate'
                            style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}
                          >
                            Expire Date
                          </FormLabel>
                          <Controller
                            name='expireDate'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <Box
                                sx={{
                                  borderRadius: '11px',
                                  border: `1px solid ${errors.expireDate ? '#FF4C51' : 'rgba(58, 53, 65, 0.22)'}`
                                }}
                              >
                                {' '}
                                <Datepicker
                                  value={formatDate(value)}
                                  selected={value}
                                  // minDate={new Date().setDate(new Date().getDate() + 1)}
                                  minDate={true}
                                  onChange={date => {
                                    onChange(date)
                                  }}
                                  height='54px'
                                  padding='7px'
                                  onDateChange={() => {}}
                                  inputComponent={CleaveNumberInput}
                                />
                              </Box>
                            )}
                          />

                          {errors.expireDate && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.expireDate.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        md={3}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <FormControl fullWidth>
                          <FormLabel
                            htmlFor='isDiscountInPercentage'
                            style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}
                          >
                            Discount Type
                          </FormLabel>
                          <Controller
                            name='isDiscountInPercentage'
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={<Checkbox {...field} checked={field.value} />}
                                label='Discount in Percentage'
                              />
                            )}
                          />
                          {errors?.isDiscountInPercentage && (
                            <FormHelperText sx={{ color: 'error.main' }}>
                              {errors.isDiscountInPercentage.message}
                            </FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid item xs={12} md={9}>
                        <FormControl fullWidth>
                          <FormLabel
                            htmlFor='discountValue'
                            style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}
                          >
                            Discount Value
                          </FormLabel>
                          <Controller
                            name='discountValue'
                            control={control}
                            render={({ field: { value, onChange } }) => (
                              <TextField
                                id='discountValue'
                                value={value}
                                onChange={onChange}
                                // placeholder="Enter Discount Value"
                                fullWidth
                                variant='outlined'
                                InputProps={{
                                  inputComponent: CleaveNumberInput,
                                  endAdornment: (
                                    <InputAdornment position='end'>
                                      {isDiscountInPercentage === true ? '%' : '$'}
                                    </InputAdornment>
                                  )
                                }}
                              />
                            )}
                          />
                          {errors.discountValue && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.discountValue.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>

                      <Grid
                        item
                        xs={12}
                        sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}
                      >
                        <FormControl fullWidth>
                          <FormLabel
                            htmlFor='isReusable'
                            style={{ fontSize: '14px', fontWeight: 500, color: '#000000' }}
                          >
                            Mark as Reusable
                          </FormLabel>
                          <Controller
                            name='isReusable'
                            control={control}
                            render={({ field }) => (
                              <FormControlLabel
                                control={<Checkbox {...field} checked={field.value} />}
                                label='Is this item reusable?'
                              />
                            )}
                          />
                          {errors?.isReusable && (
                            <FormHelperText sx={{ color: 'error.main' }}>{errors.isReusable.message}</FormHelperText>
                          )}
                        </FormControl>
                      </Grid>
                    </Grid>
                  </CardContent>
                </Card>
              </Grid>
            )}

            {mode === 'edit' && (
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControl fullWidth>
                  {/* <FormLabel htmlFor="longueType">Poll Mode</FormLabel> */}
                  <Controller
                    name='close_register'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Box display='flex' alignItems='center' justifyContent='space-between'>
                        <Typography variant='subtitle1' sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                          Close Registration
                        </Typography>
                        <Switch
                          id='close_register'
                          checked={value}
                          checkedIcon={false}
                          uncheckedIcon={false}
                          size='small'
                          offColor='#D0D5DD'
                          onColor='#1e3a8a'
                          activeBoxShadow='none'
                          height={20}
                          width={36}
                          onChange={onChange}
                          boxShadow='0 0 2px 3px rgba(104, 44, 139, 0.5)'
                        />
                        {errors.close_register && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.close_register.message}</FormHelperText>
                        )}
                      </Box>
                    )}
                  />
                </FormControl>
              </Grid>
            )}
          </Grid>

          <Box display='flex' alignItems='end' justifyContent={'space-between'} gap={2} mt={5}>
            <Button onClick={() => navigate('/event')} size='large' variant='outlined'>
              Cancel
            </Button>

            <LoadingButton type='submit' variant='contained' size='large' loading={loading}>
              {mode === 'edit' ? 'Update' : 'Create'}
            </LoadingButton>
          </Box>
        </Box>
      </form>

      <DialogConfirmation
        open={open}
        eventName='Added Successfully.'
        subeventName='You have added event successfully.'
        buttonTilte='Okay'
        buttonClick='/event'
      />
    </>
  )
}

export default CreateEvent
