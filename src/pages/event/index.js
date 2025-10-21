import { useEffect, useState, useRef, useCallback } from 'react'
import {
  Button,
  Chip,
  Fade,
  FormControl,
  FormControlLabel,
  Grid,
  InputBase,
  Menu,
  MenuItem,
  Radio,
  RadioGroup,
  Select,
  styled,
  Tab,
  TextField,
  Typography
} from '@mui/material'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Translations from 'src/layouts/components/Translations'
import PageHeader from 'src/@core/components/page-header'
import { DefaultPaginationSettings } from 'src/constants/general.const'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { toastError, toastSuccess } from 'src/utils/utils'
import { useNavigate } from 'react-router-dom'
import { useAuth } from 'src/hooks/useAuth'
import DialogStatus from 'src/views/dialog/DialogStatus'
import DialogApproveReject from 'src/views/dialog/DialogApproveReject'
import DialogConfirmation from 'src/views/dialog/DialogConfirmation'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import DialogRejectReason from 'src/views/dialog/DialogRejectRequest'
import TableEvent from 'src/views/tables/TableEvent'
import EventsList from './eventListing'
import SearchIcon from '@mui/icons-material/Search'
import Filter from '../../../src/assets/images/filter.svg'
import AddIcon from '@mui/icons-material/Add'
import Datepicker from 'src/views/common/CustomDatepicker'

const ChipSelect = styled(InputBase)(({ theme }) => ({
  borderRadius: '20px',
  padding: '4px 12px',
  backgroundColor: theme.palette.grey[200],
  fontSize: 14,
  '& .MuiSelect-select': {
    paddingRight: '24px !important'
  }
}))

const categories = ['All Category']
const Event = () => {
  const navigate = useNavigate()
  const searchTimeoutRef = useRef(null)
  const [loading, setLoading] = useState(false)
  const { rolePremission, isMasterAdmin } = useAuth()
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('')
  const [selectedDate, setSelectedDate] = useState(null)
  const [category, setCategory] = useState('All Category')
  const [status, setStatus] = useState('all')
  const handleChange = event => {
    setCategory(event.target.value)
  }
  // status dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [statusToUpdate, setStatusToUpdate] = useState(null)

  const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
    setStatusDialogOpen(prev => !prev)
    setStatusToUpdate(statusToUpdate)
  }

  const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [eventToDelete, setEventToDelete] = useState(null)

  const toggleConfirmationDialog = (e, eventToDelete = null) => {
    setConfirmationDialogOpen(prev => !prev)
    setEventToDelete(eventToDelete)
  }
  //pagination
  const [search, setSearch] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)

  // Testimonials for Event
  const [eventData, setEventData] = useState([])

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectId, setRejectId] = useState(null)
  const [typee, setTypee] = useState('')

  const toggleRejectReq = (id, typee) => {
    setRejectDialogOpen(prev => !prev)
    setRejectId(id)
    setTypee(typee)
  }

  const handleCreateEvent = () => {
    navigate('/create-event', { state: { mode: 'add' } })
  }
  const fetchEventData = ({ search, currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE }) => {
    setLoading(true)

    let params = {
      page: currentPage,
      limit: pageSize,
      status: status
    }

    if (search) {
      params.search = search
    }
    if (selectedFilter === 'free' || selectedFilter === 'paid') {
      params.ticketType = selectedFilter
    } else {
      params.ticketType = 'both' // default when date is selected
    }

    if (selectedDate instanceof Date && !isNaN(selectedDate)) {
      params.filterDate = formatDateLocal(selectedDate)
    }

    axiosInstance
      .get(ApiEndPoints?.EVENT?.list, { params })
      .then(response => {
        setEventData(response?.data?.data?.eventList)
        setTotalCount(response?.data.data.total)
        console.log('Event response--------------------', response?.data.data.total)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchEventData({
      currentPage: currentPage,
      pageSize: pageSize,
      search: search,
      status: status,
      ticketType: selectedFilter
    })
  }, [currentPage, pageSize, search, status, selectedFilter, selectedDate])

  console.log('selectedFilter', selectedFilter)
  // const handleAction = (e, type, item) => {
  //     e.stopPropagation();
  //     if (type === 'approved') {
  //         const payload = { EventId: item.EventId, status: 'approved' };

  //         setLoading(true);
  //         axiosInstance
  //             .post(ApiEndPoints.Event.approve_reject, payload)
  //             .then((response) => {
  //                 toastSuccess(response.data.message);
  //                 fetchEventData({
  //                     currentPage: currentPage,
  //                     EventType: value,
  //                     pageSize: pageSize,
  //                     search: search,
  //                 });
  //             })
  //             .catch((error) => {
  //                 toastError(error.message || 'Something went wrong');
  //             })
  //             .finally(() => setLoading(false));
  //     } else if (type === 'rejected') {
  //         // Open the dialog and set the ID for rejection
  //         setRejectId(item.EventId);
  //         setRejectDialogOpen(true);
  //         setTypee('Event')
  //     }
  // };

  const onConfirmDeleteEvent = useCallback(
    e => {
      e?.preventDefault()
      setConfirmationDialogLoading(true)
      axiosInstance
        .delete(ApiEndPoints.EVENT.delete(eventToDelete?.id))
        .then(response => response.data)
        .then(response => {
          fetchEventData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search
          })
          toggleConfirmationDialog()
          toastSuccess(response.message)
          console.log('response', response)
        })
        .catch(error => {
          toastError(error)
        })
        .finally(() => {
          setConfirmationDialogLoading(false)
        })
    },
    [currentPage, eventToDelete, pageSize, search]
  )
  const handleSearchChange = e => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(e.target.value)
    }, 500)
  }

  const filterOptions = [
    { label: 'Free', value: 'free' },
    { label: 'Paid', value: 'paid' }
    // { label: "Date", value: "date" }
  ]

  const handleFilterClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setAnchorEl(null)
  }

  const handleFilterChange = event => {
    const value = event.target.value

    if (value === 'date') {
      setSelectedFilter('date') // Show datepicker
    } else {
      setSelectedFilter(value) // "free" or "paid"
      setSelectedDate(null) // Clear previous date
      handleFilterClose() // Close menu immediately
    }
  }

  console.log('selectedDate', selectedDate)

  const formatDateLocal = date =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
          2,
          '0'
        )}`
      : null

  return (
    <>
      <Grid container spacing={4} className='match-height'>
        {/* <PageHeader
                    title={
                        <Typography variant="h5">
                            <Translations text="Events" />
                        </Typography>
                    }
                action={
                    // (rolePremission?.permissions?.some(
                    //     item => item.permissionName === 'event.create'
                    // ) || isMasterAdmin === true) ? (

                    // ) : null
                }
                /> */}
        <Grid item xs={12} sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          <Box sx={{ display: 'flex', gap: 4 }}>
            <Box
              sx={{
                bgcolor: status === 'all' ? '#1e3a8a' : '#D9D9D9',
                width: '100px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setStatus('all')}
            >
              <Typography
                variant='fm-p4'
                sx={{
                  color: status === 'all' ? '#fff' : '#656565',
                  fontWeight: status === 'all' ? 600 : 400
                }}
              >
                All
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: status === 'current' ? '#1e3a8a' : '#D9D9D9',
                width: '100px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setStatus('current')}
            >
              <Typography
                variant='fm-p4'
                sx={{
                  color: status === 'current' ? '#fff' : '#656565',
                  fontWeight: status === 'current' ? 600 : 400
                }}
              >
                Active
              </Typography>
            </Box>

            {/* Past Button */}
            <Box
              sx={{
                bgcolor: status === 'past' ? '#1e3a8a' : '#D9D9D9',
                width: '100px',
                height: '40px',
                borderRadius: '10px',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                cursor: 'pointer'
              }}
              onClick={() => setStatus('past')}
            >
              <Typography
                variant='fm-p4'
                sx={{
                  color: status === 'past' ? '#fff' : '#656565',
                  fontWeight: status === 'past' ? 600 : 400
                }}
              >
                Past
              </Typography>
            </Box>
          </Box>
          <Box sx={{ width: '100%' }}>
            <TextField
              placeholder='Search Anything...'
              variant='standard'
              size='medium'
              type='search'
              InputProps={{
                disableUnderline: true,
                startAdornment: <SearchIcon sx={{ color: '#888', mr: 1, fontSize: '30px' }} />,
                sx: { fontSize: '14px' }
              }}
              sx={{ bgcolor: '#FFFFFF', borderRadius: '10px', py: 2, px: 1 }}
              fullWidth
              onChange={handleSearchChange}
            />
          </Box>
          <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
            <Menu
              anchorEl={anchorEl}
              open={Boolean(anchorEl)}
              onClose={handleFilterClose}
              anchorOrigin={{
                vertical: 'bottom',
                horizontal: 'right'
              }}
              transformOrigin={{
                vertical: 'top',
                horizontal: 'right'
              }}
            >
              <Box sx={{ px: 4, py: 2, overflow: 'visible' }}>
                <FormControl component='fieldset'>
                  <RadioGroup value={selectedFilter} onChange={handleFilterChange}>
                    {filterOptions.map(option => (
                      <FormControlLabel
                        key={option.value}
                        value={option.value}
                        control={
                          <Radio
                            sx={{
                              '&.Mui-checked': {
                                color: '#1e3a8a'
                              }
                            }}
                          />
                        }
                        label={
                          <Typography variant='fm-p4' sx={{ fontWeight: 500, color: '#000000' }}>
                            {option.label}
                          </Typography>
                        }
                      />
                    ))}
                  </RadioGroup>
                </FormControl>

                {/* Clear Filter Button */}
                <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
                  <Button
                    onClick={() => {
                      setSelectedFilter('')
                      setSelectedDate(null)
                      handleFilterClose()
                    }}
                    variant='contained'
                    size='small'
                    sx={{ textTransform: 'none', color: '#ffffff', borderRadius: '5px' }}
                  >
                    Clear Filter
                  </Button>
                </Box>
              </Box>
              {/* {selectedFilter === "date" && ( */}

              {/* )} */}
            </Menu>

            {/* <Select
                            value={category}
                            onChange={handleChange}
                            input={<ChipSelect />}
                            variant="standard"
                            disableUnderline
                        >
                            {categories.map((cat) => (
                                <MenuItem key={cat} value={cat}>
                                    {cat}
                                </MenuItem>
                            ))}
                        </Select> */}
          </Box>

          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            {/* Filter Icon */}
            <img
              src={Filter}
              alt='filter'
              style={{ width: '24px', height: '28px', cursor: 'pointer' }}
              onClick={handleFilterClick}
            />

            {/* Date Picker */}
            <Datepicker
              value={selectedDate}
              selected={selectedDate}
              onChange={date => setSelectedDate(date)}
              size='small'
              placeholder='Created Date'
              width='170px'
              height='40px'
              padding='10px'
            />
          </Box>
          <Box sx={{ width: '150px' }}>
            {rolePremission?.permissions?.some(item => item.permissionName === 'event.create') ||
            isMasterAdmin === true ? (
              <Button
                variant='contained'
                sx={{
                  borderRadius: '5px',
                  backgroundColor: '#1976d2', // default background
                  '&:hover': {
                    backgroundColor: '#1565c0' // hover background
                  }
                }}
                size='large'
                fullWidth
                startIcon={<AddIcon />}
                onClick={handleCreateEvent}
              >
                <Typography variant='fm-p3' sx={{ fontWeight: 600, color: '#fff' }}>
                  Create
                </Typography>
              </Button>
            ) : null}
          </Box>

          {/* <TableEvent
                                search={search}
                                loading={loading}
                                rows={eventData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                rolePremission={rolePremission}
                                isMasterAdmin={isMasterAdmin}
                                toggleDelete={toggleConfirmationDialog}
                            /> */}
        </Grid>
        <Grid item sx={{ p: 5 }} xs={12}>
          {loading ? (
            <Typography>Loading...</Typography>
          ) : eventData && eventData.length > 0 ? (
            <EventsList
              search={search}
              loading={loading}
              rows={eventData}
              totalCount={totalCount}
              setCurrentPage={setCurrentPage}
              currentPage={currentPage}
              setPageSize={setPageSize}
              pageSize={pageSize}
              rolePremission={rolePremission}
              isMasterAdmin={isMasterAdmin}
              toggleDelete={toggleConfirmationDialog}
            />
          ) : (
            <Box sx={{ textAlign: 'center', py: 10 }}>
              <Typography variant='h6' color='text.secondary'>
                No Events Found
              </Typography>
            </Box>
          )}
        </Grid>
      </Grid>

      <DialogApproveReject
        open={statusDialogOpen}
        toggle={toggleChangeStatusDialog}
        dataToEdit={statusToUpdate}
        type='Event'
        onSuccess={() => {
          fetchEventData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search
          })
        }}
      />

      <DialogConfirmation
        loading={confirmationDialogLoading}
        title='Delete Event'
        subtitle='Are you sure you want to delete this Event?'
        open={confirmationDialogOpen}
        toggle={toggleConfirmationDialog}
        onConfirm={onConfirmDeleteEvent}
      />

      <DialogRejectReason
        open={rejectDialogOpen}
        toggle={toggleRejectReq}
        id={rejectId}
        type={typee}
        onSuccess={() => {
          fetchEventData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search
          })
        }}
      />
    </>
  )
}
export default Event
