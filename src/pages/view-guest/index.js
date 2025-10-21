import { useEffect, useState, useRef, useCallback } from 'react'
import { Button, Grid, IconButton, Tooltip, Typography, TextField, Select } from '@mui/material'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Translations from 'src/layouts/components/Translations'
import PageHeader from 'src/@core/components/page-header'
import { DefaultPaginationSettings } from 'src/constants/general.const'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { toastError, toastSuccess } from 'src/utils/utils'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useAuth } from 'src/hooks/useAuth'
import Dialogguests from 'src/views/dialog/DialogLounge'
import DialogConfirmation from 'src/views/dialog/DialogConfirmation'
import TableGuest from 'src/views/tables/TableGuest'
import SearchIcon from '@mui/icons-material/Search'
import Filter from '../../../src/assets/images/filter.svg'
import toast from 'react-hot-toast'

const ViewGuest = () => {
  const [loading, setLoading] = useState(false)
  const { rolePremission, isMasterAdmin } = useAuth()
  const location = useLocation()
  const dataToEdit = location?.state?.dataToEdit
  const searchTimeoutRef = useRef(null)
  const { id } = useParams()
  console.log('hh', id)
  // Confirmation
  const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [guestToDelete, setGuestToDelete] = useState(null)

  const toggleConfirmationDialog = (e, guestToDelete = null) => {
    setConfirmationDialogOpen(prev => !prev)
    setGuestToDelete(guestToDelete)
  }
  //pagination
  const [search, setSearch] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [toggleStates, setToggleStates] = useState(false)
  const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
  const navigate = useNavigate()
  // Testimonials for guest
  const [guestData, setGuestData] = useState([])
  const [eventName, setEventName] = useState('')
  const [listType, setListType] = useState('all')

  const handleAddguest = () => {
    navigate(`/guest-form/${id}`, { state: { mode: 'add' } })
  }
  const fetchGuestData = () => {
    setLoading(true)
    let params = {
      listType: listType,
      page: currentPage,
      limit: pageSize
    }
    if (search) {
      params.search = search
    }
    axiosInstance
      .get(ApiEndPoints?.GUEST?.list(id), { params })
      .then(response => {
        setGuestData(response?.data?.data?.eventCategoryList)
        setEventName(response?.data?.data?.eventData?.name)
        setTotalCount(response?.data.data.total)
        console.log('eventname', response?.data?.data?.total)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // const handleSwitchToggle = (row) => {
  //     console.log("myrow", row)
  //     if (row.isGuestQrScanned === true) {
  //         return;
  //     }
  //     else {
  //         setLoading(true);
  //         axiosInstance
  //             .get(ApiEndPoints?.GUEST?.qrCode, {
  //                 params: { qrCode: row.qrCode }
  //             })
  //             .then((response) => {
  //                 toast.success("Ticket scanned successfully");
  //                 fetchGuestData({
  //                     currentPage: currentPage,
  //                     pageSize: pageSize,
  //                     search: search,
  //                     listType: listType
  //                 });
  //             })
  //             .catch((error) => {
  //                 toastError(error);
  //             })
  //             .finally(() => {
  //                 setLoading(false);
  //             });
  //     }

  // };

  const handleSwitchToggleAll = payload => {
    setLoading(true)
    axiosInstance
      .post(ApiEndPoints.GUEST.multipleScan, payload)
      .then(response => {
        fetchGuestData({
          currentPage: currentPage,
          limit: pageSize,
          search: search,
          listType: listType
        })
        toastSuccess(response.data.message)
        // toggle(); // close main dialog
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchGuestData({
      currentPage: currentPage,
      limit: pageSize,
      search: search,
      listType: listType
    })
  }, [currentPage, pageSize, search, listType])

  const onConfirmDeleteguest = useCallback(
    e => {
      e?.preventDefault()
      setConfirmationDialogLoading(true)
      axiosInstance
        .delete(ApiEndPoints.guest.delete(guestToDelete?.id))
        .then(response => response.data)
        .then(response => {
          fetchGuestData({
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
    [currentPage, guestToDelete, pageSize, search]
  )
  const handleSearchChange = e => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(e.target.value)
    }, 500)
  }
  return (
    <Grid container spacing={4} className='match-height'>
      <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Box display='flex' alignItems='center' gap={2}>
          <Tooltip title='Back to events'>
            <IconButton onClick={() => navigate('/event')}>
              <ArrowBackIcon color='primary' />
            </IconButton>
          </Tooltip>
          <Typography variant='h5'>Attendees List</Typography>
        </Box>
        <Box display='flex' alignItems='center'>
          <Button variant='contained' onClick={handleAddguest}>
            Add Guest
          </Button>
        </Box>
      </Grid>

      <Grid item xs={12} sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
        <Box sx={{ display: 'flex', gap: 4 }}>
          <Box
            sx={{
              bgcolor: listType === 'all' ? '#1e3a8a' : '#D9D9D9',
              width: '100px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setListType('all')}
          >
            <Typography
              variant='fm-p4'
              sx={{
                color: listType === 'all' ? '#fff' : '#656565',
                fontWeight: listType === 'all' ? 600 : 400
              }}
            >
              All
            </Typography>
          </Box>

          <Box
            sx={{
              bgcolor: listType === 'scanned' ? '#1e3a8a' : '#D9D9D9',
              width: '100px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setListType('scanned')}
          >
            <Typography
              variant='fm-p4'
              sx={{
                color: listType === 'scanned' ? '#fff' : '#656565',
                fontWeight: listType === 'scanned' ? 600 : 400
              }}
            >
              Checked In
            </Typography>
          </Box>
          <Box
            sx={{
              bgcolor: listType === 'notScanned' ? '#1e3a8a' : '#D9D9D9',
              width: '100px',
              height: '40px',
              borderRadius: '10px',
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              cursor: 'pointer'
            }}
            onClick={() => setListType('notScanned')}
          >
            <Typography
              variant='fm-p4'
              sx={{
                color: listType === 'notScanned' ? '#fff' : '#656565',
                fontWeight: listType === 'notScanned' ? 600 : 400
              }}
            >
              Left the Event
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
        {/* <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                    <img src={Filter} alt="filter" style={{ width: "24px", height: "28px" }} />
                </Box> */}
      </Grid>

      <Grid item xs={12} sx={{ p: 5 }}>
        <TableGuest
          search={search}
          loading={loading}
          rows={guestData}
          totalCount={totalCount}
          setCurrentPage={setCurrentPage}
          currentPage={currentPage}
          setPageSize={setPageSize}
          pageSize={pageSize}
          rolePremission={rolePremission}
          isMasterAdmin={isMasterAdmin}
          toggleDelete={toggleConfirmationDialog}
          eventName={eventName}
          toggleStates={toggleStates}
          handleSwitchToggleAll={handleSwitchToggleAll}
          eventId={id}
        />
      </Grid>

      <DialogConfirmation
        loading={confirmationDialogLoading}
        title='Delete guest'
        subtitle='Are you sure you want to delete this guest?'
        open={confirmationDialogOpen}
        toggle={toggleConfirmationDialog}
        onConfirm={onConfirmDeleteguest}
      />
    </Grid>
  )
}
export default ViewGuest
