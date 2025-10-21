import { useEffect, useState, useRef, useCallback } from 'react'
import {
  Button,
  CardContent,
  Fade,
  Grid,
  Tab,
  Typography,
  TextField,
  Menu,
  FormControl,
  RadioGroup,
  FormControlLabel,
  Radio
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
import TableLounge from 'src/views/tables/TableLounge'
import DialogStatus from 'src/views/dialog/DialogStatus'
import DialogApproveReject from 'src/views/dialog/DialogApproveReject'
import Dialoglounge from 'src/views/dialog/DialogLounge'
import DialogConfirmation from 'src/views/dialog/DialogConfirmation'
import { TabContext, TabList, TabPanel } from '@mui/lab'
import DialogRejectReason from 'src/views/dialog/DialogRejectRequest'
import Filter from '../../../src/assets/images/filter.svg'
import AddIcon from '@mui/icons-material/Add'
import SearchIcon from '@mui/icons-material/Search'
import Datepicker from 'src/views/common/CustomDatepicker'

const Lounge = () => {
  const navigate = useNavigate()
  const [loading, setLoading] = useState(false)
  const { rolePremission, isMasterAdmin, user } = useAuth()
  const searchTimeoutRef = useRef(null)
  const orgType = user?.orgDetails.orgType
  // Add sorting state
  const [sortBy, setSortBy] = useState('loungeId')
  const [sortOrder, setSortOrder] = useState('DESC')

  // status dialog
  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [statusToUpdate, setStatusToUpdate] = useState(null)

  const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
    setStatusDialogOpen(prev => !prev)
    setStatusToUpdate(statusToUpdate)
  }

  const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
  const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
  const [loungeToDelete, setLoungeToDelete] = useState(null)

  const toggleConfirmationDialog = (e, loungeToDelete = null) => {
    setConfirmationDialogOpen(prev => !prev)
    setLoungeToDelete(loungeToDelete)
  }
  //pagination
  const [search, setSearch] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)

  // Testimonials for lounge
  const [loungeData, setLoungeData] = useState([])
  const [loungeDialogOpen, setLoungeDialogOpen] = useState(false)
  const [loungeDialogMode, setLoungeDialogMode] = useState('add')
  const [loungeToEdit, setLoungeToEdit] = useState(null)

  const [role, setRole] = useState([])
  const [value, setValue] = useState('all')

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectId, setRejectId] = useState(null)
  const [typee, setTypee] = useState('')
  const [anchorEl, setAnchorEl] = useState(null)
  const [selectedFilter, setSelectedFilter] = useState('all')
  const [selectedStatus, setSelectedStatus] = useState('all')
  const [selectedDate, setSelectedDate] = useState(null)

  const toggleRejectReq = (id, typee) => {
    setRejectDialogOpen(prev => !prev)
    setRejectId(id)
    setTypee(typee)
  }

  const handleChange = (event, newValue) => {
    setValue(newValue) // Update selected tab
    setSelectedFilter('all') // Clear user type filter
    setSelectedStatus('all') // Clear status filter
    fetchLoungeData({
      currentPage,
      pageSize,
      loungeType: newValue,
      search, // retain search if needed
      sortBy,
      sortOrder
    })
  }

  const toggleLoungeDialog = (e, mode = 'add', loungeToEdit = null) => {
    setLoungeDialogOpen(prev => !prev)
    setLoungeDialogMode(mode)
    setLoungeToEdit(loungeToEdit)
  }

  const fetchLoungeData = useCallback(
    ({
      search,
      currentPage,
      pageSize = DefaultPaginationSettings.ROWS_PER_PAGE,
      loungeType = 'all',
      sortBy = 'loungeId',
      sortOrder = 'DESC',
      filterDate = null
    }) => {
      setLoading(true)
      let params = {
        page: currentPage,
        limit: pageSize,
        longueType: loungeType,
        userType: selectedFilter,
        sortBy,
        sortOrder
      }
      if (search) {
        params.search = search
      }
      if (filterDate) {
        params.filterDate = filterDate
      }
      if (loungeType === 'all') {
        if (selectedStatus !== 'all') {
          params.status = selectedStatus
        } else {
          params.status = 'pending, approved'
        }
      } else if (loungeType === 'poll' || loungeType === 'post') {
        if (selectedStatus !== 'all') {
          params.status = selectedStatus
        } else {
          params.status = 'all'
        }
      }
      axiosInstance
        .get(ApiEndPoints?.LOUNGE?.list, { params })
        .then(response => {
          console.log('Lounge data', response.data?.data?.loungeList)
          setLoungeData(response?.data?.data?.loungeList)
          setTotalCount(response?.data.data.total)
        })
        .catch(error => {
          toastError(error)
        })
        .finally(() => {
          setLoading(false)
        })
    },
    [selectedFilter, selectedStatus]
  )

  // Utility to format date as YYYY-MM-DD in local time
  const formatDateLocal = date =>
    date
      ? `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(
          2,
          '0'
        )}`
      : null

  useEffect(() => {
    console.log('Fetching data with:', { currentPage })
    fetchLoungeData({
      currentPage,
      loungeType: value,
      pageSize,
      search,
      sortBy,
      sortOrder,
      filterDate: formatDateLocal(selectedDate)
    })
  }, [
    currentPage,
    pageSize,
    search,
    value,
    selectedFilter,
    selectedStatus,
    sortBy,
    sortOrder,
    selectedDate,
    fetchLoungeData
  ])

  const filterOptions = [
    { label: 'Student', value: 'student' },
    { label: 'Faculty', value: 'faculty' },
    { label: 'Alumni', value: 'alum' }
  ]
  const statusOptions = ['all', 'approved', 'pending', 'rejected', 'closed']

  const handleFilterClick = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleFilterClose = () => {
    setAnchorEl(null)
  }

  const handleFilterChange = event => {
    setSelectedFilter(event.target.value)
    handleFilterClose() // Close after selection
  }

  const handleStatusChange = event => {
    setSelectedStatus(event.target.value)
    handleFilterClose() // Close after selection
  }

  const handleAction = (e, type, item) => {
    e.stopPropagation()
    if (type === 'approved') {
      const payload = { loungeId: item.loungeId, status: 'approved' }

      setLoading(true)
      axiosInstance
        .post(ApiEndPoints.LOUNGE.approve_reject, payload)
        .then(response => {
          toastSuccess(response.data.message)
          fetchLoungeData({
            currentPage: currentPage,
            loungeType: value,
            pageSize: pageSize,
            search: search
          })
        })
        .catch(error => {
          toastError(error.message || 'Something went wrong')
        })
        .finally(() => setLoading(false))
    } else if (type === 'rejected') {
      // Open the dialog and set the ID for rejection
      setRejectId(item.loungeId)
      setRejectDialogOpen(true)
      setTypee('lounge')
    }
  }

  const handleCloseUndoStatus = (e, type, item) => {
    e.stopPropagation()

    const payload = {
      loungeId: item.loungeId
    }

    const endpoint = type === 'close' ? ApiEndPoints.LOUNGE.close : ApiEndPoints.LOUNGE.undoClose

    setLoading(true)
    axiosInstance
      .post(endpoint, payload)
      .then(response => {
        toastSuccess(response.data.message)
        fetchLoungeData({
          currentPage,
          pageSize,
          search
        })
      })
      .catch(error => {
        toastError(error.message || 'Something went wrong')
      })
      .finally(() => setLoading(false))
  }

  const onConfirmDeleteLounge = useCallback(
    e => {
      e?.preventDefault()
      setConfirmationDialogLoading(true)
      axiosInstance
        .delete(ApiEndPoints.LOUNGE.delete(loungeToDelete?.id))
        .then(response => response.data)
        .then(response => {
          fetchLoungeData({
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
    [currentPage, loungeToDelete, pageSize, search]
  )

  const handleSearchChange = e => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }
    searchTimeoutRef.current = setTimeout(() => {
      setSearch(e.target.value)
    }, 500)
  }

  // Add sort handler
  const handleSort = (field, order) => {
    setSortBy(field)
    setSortOrder(order)
    fetchLoungeData({
      currentPage,
      pageSize,
      search,
      loungeType: value,
      sortBy: field,
      sortOrder: order
    })
  }

  return (
    <>
      <Grid container spacing={4} className='match-height'>
        {/* <PageHeader
                    title={
                        <Typography variant="h5">
                            <Translations text="Lounge" />
                        </Typography>
                    }
                action={
                    (rolePremission?.permissions?.some(
                        item => item.permissionName === 'lounge.create''
                    ) || isMasterAdmin === true) ? (
                        <Button variant="contained"
                            onClick={toggleLoungeDialog}
                        >
                            Create lounge
                        </Button>
                    ) : null
                }

                /> */}
        <Grid item xs={12}>
          <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
            <CardContent>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={12} sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
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
                      sx={{ bgcolor: '#FAFAFA', borderRadius: '10px', py: 2, px: 1 }}
                      fullWidth
                      onChange={handleSearchChange}
                    />
                  </Box>
                  <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                    <img
                      src={Filter}
                      alt='filter'
                      style={{ width: '24px', height: '28px', cursor: 'pointer' }}
                      onClick={handleFilterClick}
                    />
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
                      PaperProps={{
                        sx: {
                          minWidth: 260,
                          p: 2,
                          borderRadius: 3
                        }
                      }}
                    >
                      <FormControl component='fieldset' sx={{ width: '100%' }}>
                        <Typography variant='fm-p4' sx={{ fontWeight: 700, color: '#222', mb: 1, ml: 0.5 }}>
                          User Type
                        </Typography>
                        <RadioGroup value={selectedFilter} onChange={handleFilterChange} sx={{ gap: 0.5 }}>
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
                              sx={{ ml: 1, my: 0.2 }}
                            />
                          ))}
                        </RadioGroup>
                        <Box my={1.5}>
                          <hr style={{ border: 'none', borderTop: '1px solid #eee' }} />
                        </Box>
                        <Typography variant='fm-p4' sx={{ fontWeight: 700, color: '#222', mb: 1, ml: 0.5 }}>
                          Status
                        </Typography>
                        <RadioGroup value={selectedStatus} onChange={handleStatusChange} sx={{ gap: 0.5 }}>
                          {statusOptions.map(status => (
                            <FormControlLabel
                              key={status}
                              value={status}
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
                                  {status.charAt(0).toUpperCase() + status.slice(1)}
                                </Typography>
                              }
                              sx={{ ml: 1, my: 0.2 }}
                            />
                          ))}
                        </RadioGroup>
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                          <Button
                            onClick={() => {
                              setSelectedFilter('all')
                              setSelectedStatus('all')
                              handleFilterClose()
                            }}
                            variant='contained'
                            size='small'
                            sx={{ textTransform: 'none', color: '#ffffff', borderRadius: '5px' }}
                          >
                            Clear Filter
                          </Button>
                        </Box>
                      </FormControl>
                    </Menu>
                  </Box>
                  <Box sx={{ width: '150px' }}>
                    {rolePremission?.permissions?.some(item => item.permissionName === 'lounge.create') ||
                    isMasterAdmin === true ? (
                      <Button
                        variant='contained'
                        sx={{ borderRadius: '5px' }}
                        size='large'
                        fullWidth
                        startIcon={<AddIcon />}
                        onClick={toggleLoungeDialog}
                      >
                        <Typography variant='fm-p3' sx={{ fontWeight: 600, color: '#fff' }}>
                          Create
                        </Typography>
                      </Button>
                    ) : null}
                  </Box>
                </Grid>
              </Grid>
              <TabContext value={value}>
                <Box>
                  <TabList
                    onChange={handleChange}
                    aria-label='lab API tabs example'
                    sx={{
                      display: 'flex',
                      borderBottom: 'none',
                      borderRadius: '4px',
                      gap: 5,
                      '& .MuiTabs-indicator': {
                        bgcolor: '#1e3a8a'
                      }
                    }}
                  >
                    {['all', 'poll', 'post'].map(tab => (
                      <Tab
                        key={tab}
                        label={
                          tab === 'all'
                            ? 'Pending Approvals'
                            : tab === 'poll'
                            ? 'Poll'
                            : tab === 'post'
                            ? 'Post'
                            : // : tab === "active"
                              //     ? "Active"
                              //     : tab === "pending"
                              //         ? "Pending"
                              //         : tab === "rejected"
                              //             ? "Rejected"
                              //             : tab === "closed"
                              null
                        }
                        value={tab}
                        sx={{
                          textTransform: 'none',
                          transition: 'all 0.2s ease-in-out',
                          fontSize: '12px !important',
                          fontWeight: '600!important',
                          color: '#111111',
                          '&.Mui-selected': {
                            // bgcolor: "#9c27b026",
                            color: '#1e3a8a',
                            fontWeight: 600,
                            fontSize: '14px !important'
                            // borderRadius: "8px",
                          }
                        }}
                      />
                    ))}
                  </TabList>
                </Box>
                <Box>
                  <Box mt={3}>
                    {value === 'all' && (
                      <Fade in={value === 'all'} timeout={500}>
                        <TabPanel value='all'>
                          <TableLounge
                            search={search}
                            loading={loading}
                            rows={loungeData}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                            toggleEdit={toggleLoungeDialog}
                            toggleStatus={handleCloseUndoStatus}
                            handleAction={handleAction}
                            loungeType={value}
                            rolePremission={rolePremission}
                            isMasterAdmin={isMasterAdmin}
                            toggleDelete={toggleConfirmationDialog}
                            onSort={handleSort}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            orgType={orgType}
                          />
                        </TabPanel>
                      </Fade>
                    )}

                    {value === 'poll' && (
                      <Fade in={value === 'poll'} timeout={500}>
                        <TabPanel value='poll'>
                          <TableLounge
                            search={search}
                            loading={loading}
                            rows={loungeData}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                            toggleEdit={toggleLoungeDialog}
                            toggleStatus={handleCloseUndoStatus}
                            handleAction={handleAction}
                            loungeType={value}
                            rolePremission={rolePremission}
                            isMasterAdmin={isMasterAdmin}
                            toggleDelete={toggleConfirmationDialog}
                            onSort={handleSort}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            orgType={orgType}
                          />
                        </TabPanel>
                      </Fade>
                    )}
                    {value === 'post' && (
                      <Fade in={value === 'post'} timeout={500}>
                        <TabPanel value='post'>
                          <TableLounge
                            search={search}
                            loading={loading}
                            rows={loungeData}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                            toggleEdit={toggleLoungeDialog}
                            toggleStatus={handleCloseUndoStatus}
                            handleAction={handleAction}
                            loungeType={value}
                            rolePremission={rolePremission}
                            isMasterAdmin={isMasterAdmin}
                            toggleDelete={toggleConfirmationDialog}
                            onSort={handleSort}
                            sortBy={sortBy}
                            sortOrder={sortOrder}
                            orgType={orgType}
                          />
                        </TabPanel>
                      </Fade>
                    )}
                  </Box>
                </Box>
              </TabContext>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Dialoglounge
        open={loungeDialogOpen}
        toggle={toggleLoungeDialog}
        mode={loungeDialogMode}
        dataToEdit={loungeToEdit}
        role={role}
        onSuccess={() => {
          fetchLoungeData({
            currentPage: currentPage,
            pageSize: pageSize,
            loungeType: value
          })
        }}
      />

      <DialogApproveReject
        open={statusDialogOpen}
        toggle={toggleChangeStatusDialog}
        dataToEdit={statusToUpdate}
        type='lounge'
        onSuccess={() => {
          fetchLoungeData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search
          })
        }}
      />

      <DialogConfirmation
        loading={confirmationDialogLoading}
        title='Delete Lounge'
        subtitle='Are you sure you want to delete this Lounge?'
        open={confirmationDialogOpen}
        toggle={toggleConfirmationDialog}
        onConfirm={onConfirmDeleteLounge}
      />

      <DialogRejectReason
        open={rejectDialogOpen}
        toggle={toggleRejectReq}
        id={rejectId}
        type={typee}
        onSuccess={() => {
          fetchLoungeData({
            currentPage: currentPage,
            loungeType: value,
            pageSize: pageSize,
            search: search
          })
        }}
      />
    </>
  )
}
export default Lounge
