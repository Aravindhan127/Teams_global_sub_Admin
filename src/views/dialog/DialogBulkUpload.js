import { yupResolver } from '@hookform/resolvers/yup'
import { LoadingButton } from '@mui/lab'
import {
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
import UploadIcon from '@mui/icons-material/Upload'
import CustomFileUploads from '../common/CustomFileUploads'
import Switch from 'react-switch'
import DialogConfirmation from './DialogConfirmation'
const validationSchema = yup.object().shape({
  csv: yup
    .mixed()
    .required('.csv file is required')
    .test('fileSize', 'File size must not exceed 3MB', value => {
      if (typeof value === 'string') return true // Allow existing values in edit mode
      return !value || value.size <= 1024 * 1024 * 3 // 3MB
    })
    .test('fileType', 'Only .csv files are supported', value => {
      if (typeof value === 'string') return true // Allow existing values in edit mode
      return !value || value.type === 'text/csv' // Validate .csv MIME type
    })
})

const DialogBulkUpload = props => {
  const { mode, open, toggle, onSuccess, isClg } = props

  const [loading, setLoading] = useState(false)
  const [dialogTitle, setDialogTitle] = useState('')
  const [selectedFile, setSelectedFile] = useState(null)

  // Confirmation
  const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [pendingFormData, setPendingFormData] = useState(null)

  const toggleConfirmationDialog = (e, formData = null) => {
    if (formData) {
      setPendingFormData(formData)
      setConfirmationDialogOpen(true) // explicitly open
      toggle() // close main dialog
    } else {
      setConfirmationDialogOpen(false) // explicitly close
    }
  }

  const {
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors }
  } = useForm({
    defaultValues: {
      csv: '',
      isMailNotificationSend: false
    },
    resolver: yupResolver(validationSchema),
    mode: 'onChange'
  })

  useEffect(() => {
    if (open) {
      setLoading(false)
      setDialogTitle(mode === 'add' ? 'Upload Csv' : ' ')
    }
  }, [mode, open, reset])

  useEffect(() => {
    if (open) {
      reset({ csv: '', isMailNotificationSend: false })
      setSelectedFile(null)
    }
  }, [open, reset])

  const handleConfirmUpload = () => {
    if (!pendingFormData) return

    const formData = new FormData()
    formData.append('csv', pendingFormData.csv)
    formData.append('isMailNotificationSend', pendingFormData.isMailNotificationSend)

    const endpoint = isClg ? ApiEndPoints.BULK_UPLOAD.upload_doc : ApiEndPoints.BULK_UPLOAD.upload_doc_for_org

    setConfirmationDialogLoading(true)

    axiosInstance
      .post(endpoint, formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      .then(response => {
        onSuccess()
        toastSuccess(response.data.message)
        // toggle(); // close main dialog
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setConfirmationDialogLoading(false)
        setConfirmationDialogOpen(false) // close confirmation dialog
      })
  }

  return (
    <>
      <Dialog open={open} onClose={toggle} fullWidth maxWidth='sm' scroll='paper'>
        <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Box>{dialogTitle}</Box>
          <IconButton aria-label='close' onClick={toggle} sx={{ color: theme => theme.palette.grey[500] }}>
            <CloseIcon />
          </IconButton>
        </DialogTitle>
        <DialogContent sx={{ pb: 8, px: { sx: 8, sm: 15 }, pt: { xs: 8, sm: 12.5 } }}>
          <form id='form' onSubmit={handleSubmit(data => toggleConfirmationDialog(null, data))}>
            <Grid container spacing={4}>
              <Grid item xs={12}>
                <FormControl fullWidth>
                  <FormLabel required htmlFor='csv' error={Boolean(errors.csv)}>
                    Upload Document
                  </FormLabel>
                  <Controller
                    name='csv'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <CustomFileUploads
                        multiple={false}
                        subtitle='(Max file size 3mb)'
                        minHeight='100px'
                        files={value}
                        onChange={files => {
                          onChange(files)
                          setSelectedFile(files)
                        }}
                        title={'Add csv'}
                      />
                    )}
                  />
                  {errors?.csv && <FormHelperText sx={{ color: 'error.main' }}>{errors?.csv?.message}</FormHelperText>}
                </FormControl>
              </Grid>

              <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <FormControl fullWidth>
                  <Controller
                    name='isMailNotificationSend'
                    control={control}
                    render={({ field: { value, onChange } }) => (
                      <Box display='flex' alignItems='center' justifyContent='space-between'>
                        <Typography variant='subtitle1' sx={{ color: '#1e3a8a', fontWeight: 600 }}>
                          Send Mail Notification
                        </Typography>
                        <Switch
                          id='isMailNotificationSend'
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
                        {errors.isMailNotificationSend && (
                          <FormHelperText sx={{ color: 'error.main' }}>
                            {errors.isMailNotificationSend.message}
                          </FormHelperText>
                        )}
                      </Box>
                    )}
                  />
                </FormControl>
              </Grid>
            </Grid>
          </form>
        </DialogContent>
        <DialogActions>
          <LoadingButton size='large' type='submit' form='form' variant='contained' loading={loading}>
            Submit
          </LoadingButton>
          <Button size='large' variant='outlined' onClick={toggle}>
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
      <DialogConfirmation
        loading={confirmationDialogLoading}
        title='Upload Document'
        subtitle='Are you sure you want to Upload Document?'
        open={confirmationDialogOpen}
        toggle={toggleConfirmationDialog}
        onConfirm={handleConfirmUpload}
      />
    </>
  )
}

export default DialogBulkUpload
