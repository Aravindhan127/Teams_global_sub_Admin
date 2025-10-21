import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
  Autocomplete,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  FormLabel,
  Grid,
  IconButton,
  MenuItem,
  Select,
  TextField,
  Typography
} from '@mui/material'
import CloseIcon from 'mdi-material-ui/Close'
import { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import * as yup from 'yup'
import { toastError, toastSuccess } from 'src/utils/utils'
import { CleaveNumberInput } from 'src/@core/components/cleave-components'
import CustomFileUploads from '../common/CustomFileUploads'
import ReactQuill from 'react-quill'
import Switch from 'react-switch'
import add from '../../../src/assets/images/add.svg'
import ClearIcon from '@mui/icons-material/Clear'

// const validationSchema = yup.object().shape({
//     longueType: yup.bool().default(false).notRequired(),

//     title: yup.string().trim().when("longueType", {
//         is: false,
//         then: (schema) => schema.required("Title is required"),
//         otherwise: (schema) => schema.notRequired(),
//     }),

//     description: yup.string().trim().nullable(),
//     post: yup.mixed().nullable()
//         .test("fileSize", "File size must be 50MB or less", (value) => {
//             if (!value || typeof value === "string") return true;
//             return value.size <= 1024 * 1024 * 50; // 50MB
//         })
//         .test("fileType", "Unsupported file format. Only PDFs and images (JPG, PNG) are allowed.", (value) => {
//             if (!value || typeof value === "string") return true;
//             return /(image\/(jpeg|jpg|png)|application\/pdf)/.test(value.type);
//         }),

//     pollQuestion: yup.string().trim().when("longueType", {
//         is: true,
//         then: (schema) => schema.required("Question is required"),
//         otherwise: (schema) => schema.notRequired(),
//     }),

//     pollOptions: yup.array().when("longueType", {
//         is: true,
//         then: (schema) =>
//             schema
//                 .of(yup.string().trim().required("Each option is required"))
//                 .min(2, "At least two options are required")
//                 .max(12, "Max 12 options are allowed")
//                 .required("Option is required"),
//         otherwise: (schema) => schema.notRequired(),
//     }),

// }).test("description-or-post", function (values) {
//     const { description, post, longueType } = values;

//     if (longueType) {
//         if (!post) {
//             return this.createError({
//                 path: "post",
//                 message: "Media is required",
//             });
//         }
//     } else {
//         if (!(description && description.trim() !== "") && !post) {
//             return this.createError({
//                 path: "post",
//                 message: "Either Description or Media is required",
//             });
//         }
//     }

//     return true;
// });

const validationSchema = yup
  .object()
  .shape({
    longueType: yup.bool().default(false).notRequired(),

    title: yup
      .string()
      .trim()
      .when('longueType', {
        is: false,
        then: schema => schema.required('Title is required'),
        otherwise: schema => schema.notRequired()
      }),

    description: yup.string().trim().nullable(),

    post: yup.mixed().when('longueType', {
      is: false, // When longueType is FALSE, validate post
      then: schema =>
        schema
          .nullable()
          .test('fileSize', 'File size must be 50MB or less', value => {
            if (!value || typeof value === 'string') return true
            return value.size <= 1024 * 1024 * 50 // 50MB
          })
          .test('fileType', 'Unsupported file format. Only JPG and PNG images are allowed.', value => {
            if (!value || typeof value === 'string') return true
            return /(image\/(jpeg|jpg|png))/.test(value.type) // Only images allowed
          }),
      otherwise: schema => schema.notRequired() // When longueType is TRUE, post is not required
    }),

    pollQuestion: yup
      .string()
      .trim()
      .when('longueType', {
        is: true,
        then: schema => schema.required('Question is required'),
        otherwise: schema => schema.notRequired()
      }),

    pollOptions: yup.array().when('longueType', {
      is: true,
      then: schema =>
        schema
          .of(yup.string().trim().required('Each option is required'))
          .min(2, 'At least two options are required')
          .max(12, 'Max 12 options are allowed')
          .required('Option is required'),
      otherwise: schema => schema.notRequired()
    })
  })
  .test('description-or-post', function (values) {
    const { description, post, longueType } = values

    if (!longueType) {
      // If `longueType` is FALSE, require either `description` or `post`
      if (!(description && description.trim() !== '') && !post) {
        return this.createError({
          path: 'post',
          message: 'Description or Media is required'
        })
      }
    }

    return true
  })

const Dialoglounge = props => {
  const { mode, open, toggle, dataToEdit, onSuccess, role } = props

  console.log('role', role)
  const [loading, setLoading] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [options, setOptions] = useState([])
  const [currentOption, setCurrentOption] = useState('')
  const {
    control,
    handleSubmit,
    reset,
    setValue,
    watch,
    setError,
    clearErrors,
    formState: { errors }
  } = useForm({
    defaultValues: {
      title: '',
      description: '',
      pollQuestion: '',
      post: null,
      pollOptions: [],
      longueType: false,
      isMediaDelete: false
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  })

  const longueType = watch('longueType')
  const description = watch('description')
  const post = watch('post')

  // Clear error when either field has a value
  useEffect(() => {
    if (description || post) {
      clearErrors('post') // Clear the error attached to description
    }
  }, [description, post, clearErrors, longueType])

  useEffect(() => {
    if (open) {
      setLoading(false)
      setDialogTitle(mode === 'add' ? 'Create Lounge' : 'Edit Lounge')
      const existingOptions = dataToEdit?.options?.map(option => option.optionTag) || []
      reset({
        title: dataToEdit?.title || '',
        description: dataToEdit?.description || '',
        post: dataToEdit?.media[0]?.mediaPath || null,
        pollQuestion: dataToEdit?.pollQuestion || '',
        pollOptions: existingOptions || [],
        longueType: dataToEdit?.longueType === 'poll' ? true : false
      })

      setOptions(existingOptions)
    } else {
      setOptions([])
      setCurrentOption('')
    }
  }, [dataToEdit, mode, open, reset])

  const handleAddOption = () => {
    const trimmedOption = currentOption.trim()

    if (options.length >= 12) {
      setError('pollOptions', {
        type: 'max',
        message: 'Max 12 options are allowed'
      })
      return
    }

    if (!trimmedOption) {
      setError('pollOptions', {
        type: 'required',
        message: 'Option cannot be empty'
      })
      return
    }

    if (options.includes(trimmedOption)) {
      setError('pollOptions', {
        type: 'duplicate',
        message: 'Option already exists'
      })
      return
    }

    const updatedOptions = [...options, trimmedOption]
    setOptions(updatedOptions)
    setValue('pollOptions', updatedOptions, { shouldValidate: true })

    if (updatedOptions.length >= 2) {
      clearErrors('pollOptions')
    }

    setCurrentOption('')
  }

  const handleRemoveOption = index => {
    const updatedOptions = options.filter((_, i) => i !== index)
    setOptions(updatedOptions)
    setValue('pollOptions', updatedOptions, { shouldValidate: true })
  }

  console.log('loungeToEdit', dataToEdit)
  const onSubmit = data => {
    console.log('LoungeData', data)
    let payload = new FormData()
    if (data.title) payload.append('title', data.title)
    if (data.description) payload.append('description', data.description)
    if (data.pollQuestion) payload.append('pollQuestion', data.pollQuestion)
    if (mode === 'add') {
      payload.append('longueType', data.longueType === true ? 'poll' : 'post')
    }
    if (Array.isArray(options) && options.length > 0) {
      options.forEach((option, index) => {
        payload.append(`pollOptions[${index}]`, option)
      })
    }
    if (data.post && data.post instanceof File) {
      payload.append('post', data.post)
    }
    if (mode === 'edit') {
      payload.append('isMediaDelete', true)
    }
    for (let [key, value] of payload.entries()) {
      console.log(key, value)
    }
    if (mode === 'edit' && dataToEdit?.loungeId) {
      payload.append('loungeId', dataToEdit.loungeId)
    }

    setLoading(true)
    let apiInstance = null

    if (mode === 'edit') {
      apiInstance = axiosInstance.post(ApiEndPoints.LOUNGE.edit, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    } else {
      apiInstance = axiosInstance.post(ApiEndPoints.LOUNGE.create, payload, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      })
    }
    apiInstance
      .then(response => response.data)
      .then(response => {
        onSuccess()
        toastSuccess(response.message)
        toggle()
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
      <Dialog open={open} fullWidth maxWidth='sm' scroll='paper'>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          {dialogTitle}
          <IconButton aria-label='close' onClick={toggle} sx={{ color: theme => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
          <form id='form' onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={4}>
              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControl fullWidth>
                  {/* <FormLabel htmlFor="longueType">Poll Mode</FormLabel> */}
                  <Controller
                    name='longueType'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Box display='flex' alignItems='center' justifyContent='flex-end' gap={2}>
                        <Typography variant='subtitle1' sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                          Poll Mode
                        </Typography>
                        <Switch
                          id='longueType'
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
                        {errors.longueType && (
                          <FormHelperText sx={{ color: 'error.main' }}>{errors.longueType.message}</FormHelperText>
                        )}
                      </Box>
                    )}
                  />
                </FormControl>
              </Grid>

              {!longueType && (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor='title'>Title</FormLabel>
                      <Controller
                        name='title'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <TextField
                            id='title'
                            value={value}
                            onChange={onChange}
                            placeholder='Enter Title'
                            error={Boolean(errors.title)}
                          />
                        )}
                      />
                      {errors.title && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.title.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor='description'>Description</FormLabel>
                      <Controller
                        name='description'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Box sx={{ position: 'relative', width: '100%' }}>
                            <TextField
                              id='description'
                              value={value}
                              onChange={onChange}
                              placeholder='Enter description'
                              error={Boolean(errors.description)}
                              multiline
                              rows={5}
                              variant='outlined'
                              fullWidth
                              inputProps={{ maxLength: 200 }} // Limit to 350 characters
                              sx={{
                                '& .MuiInputBase-root': {
                                  paddingBottom: '25px' // Space for counter
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

                      {errors.description && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.description.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>
                </>
              )}
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel htmlFor='post' required>
                    Media
                  </FormLabel>
                  <Controller
                    name='post'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomFileUploads
                        multiple={false}
                        minHeight='0px'
                        subtitle='(Max file size 3mb)'
                        files={value}
                        onChange={onChange}
                        title={'Upload Image'}
                        // MediaUrl="http://103.204.189.64:4003"
                      />
                    )}
                  />
                  {errors.post && <FormHelperText sx={{ color: 'error.main' }}>{errors.post.message}</FormHelperText>}
                </FormControl>
              </Grid>

              {longueType && (
                <>
                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor='pollQuestion'>Question</FormLabel>
                      <Controller
                        name='pollQuestion'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            {...field}
                            id='pollQuestion'
                            placeholder='Enter Question'
                            error={Boolean(errors.pollQuestion)}
                          />
                        )}
                      />
                      {errors.pollQuestion && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors.pollQuestion.message}</FormHelperText>
                      )}
                    </FormControl>
                  </Grid>

                  <Grid item xs={12} sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <FormControl fullWidth>
                      <FormLabel htmlFor='pollOptions'>Option</FormLabel>
                      <Controller
                        name='pollOptions'
                        control={control}
                        render={({ field }) => (
                          <TextField
                            id='pollOptions'
                            value={currentOption}
                            onChange={e => setCurrentOption(e.target.value)}
                            placeholder='Enter option'
                          />
                        )}
                      />
                      {errors?.pollOptions && (
                        <FormHelperText sx={{ color: 'error.main' }}>{errors?.pollOptions?.message}</FormHelperText>
                      )}
                    </FormControl>
                    <IconButton
                      sx={{ mt: 6, p: 1, borderRadius: 1 }}
                      onClick={handleAddOption}
                      disabled={mode === 'edit'}
                    >
                      <img
                        src={add}
                        alt='Add'
                        style={{ width: '25px', height: '25px', opacity: mode === 'edit' ? 0.5 : 1 }}
                      />
                    </IconButton>
                  </Grid>

                  {/* Show added options */}
                  {options.length > 0 && (
                    <Grid item xs={12}>
                      <Typography variant='subtitle1' sx={{ mb: 1 }}>
                        Added Options:
                      </Typography>
                      {options.map((option, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                          <TextField
                            variant='standard'
                            sx={{ flexGrow: 1 }}
                            value={option}
                            InputProps={{
                              readOnly: true // Make it non-editable
                            }}
                          />
                          <IconButton
                            onClick={() => handleRemoveOption(index)}
                            disabled={mode === 'edit'} // Disable in edit mode
                          >
                            <ClearIcon />
                          </IconButton>
                        </Box>
                      ))}
                    </Grid>
                  )}

                  <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                    <FormControl fullWidth>
                      {/* <FormLabel htmlFor="longueType">Poll Mode</FormLabel> */}
                      <Controller
                        name='isPollAllowMultipleAns'
                        control={control}
                        render={({ field: { value, onChange } }) => (
                          <Box display='flex' alignItems='center' justifyContent='space-between'>
                            <Typography variant='subtitle1' sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                              Allow Multiple Answers
                            </Typography>
                            <Switch
                              id='isPollAllowMultipleAns'
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
                            {errors.isPollAllowMultipleAns && (
                              <FormHelperText sx={{ color: 'error.main' }}>
                                {errors.isPollAllowMultipleAns.message}
                              </FormHelperText>
                            )}
                          </Box>
                        )}
                      />
                    </FormControl>
                  </Grid>
                </>
              )}
            </Grid>
          </form>
        </DialogContent>
        {/* {mode !== 'view' && ( */}
        <DialogActions>
          <LoadingButton size='large' type='submit' form='form' variant='contained' loading={loading}>
            {mode === 'edit' ? 'Update' : 'Add'}
          </LoadingButton>
          <Button size='large' variant='outlined' onClick={toggle}>
            Cancel
          </Button>
        </DialogActions>
        {/* )} */}
      </Dialog>
    </>
  )
}

export default Dialoglounge
