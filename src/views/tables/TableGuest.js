import Typography from '@mui/material/Typography'
import EditIcon from '@mui/icons-material/Edit'
import Box from '@mui/material/Box'
import IconButton from '@mui/material/IconButton'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import CustomDataGrid from 'src/@core/components/data-grid'
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { Avatar, Button, Dialog, DialogActions, DialogContent, DialogTitle } from '@mui/material'
import DeleteIcon from '@mui/icons-material/Delete'
import moment from 'moment'
import VisibilityIcon from '@mui/icons-material/Visibility'
import QrCodeIcon from '@mui/icons-material/QrCode'
import { useEffect, useState } from 'react'
import { useAuth } from 'src/hooks/useAuth'
import Checkbox from '@mui/material/Checkbox'
import Switch from 'react-switch'
import toast from 'react-hot-toast'
function TableGuest({
  rows,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  loading,
  toggleStates,
  eventName,
  rolePremission,
  isMasterAdmin,
  toggleStatus,
  toggleDelete,
  handleSwitchToggleAll, // Add this prop
  eventId // Add this prop for the event ID
}) {
  const [openDialog, setOpenDialog] = useState(false)
  const [selectedQrCode, setSelectedQrCode] = useState(null)
  const [selectedIds, setSelectedIds] = useState([])
  const [selectedRowData, setSelectedRowData] = useState([])

  const { user } = useAuth()

  const handleOpenDialog = (qrCodeImage, row) => {
    setSelectedQrCode(qrCodeImage)
    setSelectedRowData(row)
    setOpenDialog(true)
  }

  const handleCloseDialog = () => {
    setOpenDialog(false)
    setSelectedQrCode(null)
  }
  const navigate = useNavigate()
  const handleCellClick = ({ row, field }) => {
    if (field !== 'Actions' && field !== 'status') {
      navigate(`/event-detail/${row?.eventId}`)
    }
  }
  const mappedRows = rows.map((row, index) => ({
    ...row,
    id: row.eventGuestId,
    index: index + 1
  }))

  const allIds = mappedRows.map(row => row.id)

  const handleSelectAll = event => {
    if (event.target.checked) {
      setSelectedIds(allIds)
    } else {
      setSelectedIds([])
    }
  }

  const handleSelectRow = (event, id) => {
    if (event.target.checked) {
      setSelectedIds(prev => [...prev, id])
    } else {
      setSelectedIds(prev => prev.filter(rowId => rowId !== id))
    }
  }

  const handleDownloadQrCode = () => {
    if (selectedQrCode) {
      fetch(selectedQrCode)
        .then(response => response.blob())
        .then(blob => {
          const url = URL.createObjectURL(blob)
          const link = document.createElement('a')
          link.href = url
          link.download = 'QRCode.png'
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
          URL.revokeObjectURL(url) // Free memory
        })
        .catch(error => console.error('Error downloading QR code:', error))
    }
  }

  const handleSwitchToggle = row => {
    // Create payload with selected IDs
    if (row?.isGuestQrScanned) {
      toast.error('This ticket is already scanned')
      return
    }
    const payload = {
      eventGuestIds: selectedIds.length > 0 ? selectedIds : [row.id],
      eventId: eventId
    }

    // Call the handleSwitchToggleAll function with the payload
    handleSwitchToggleAll(payload)
  }

  const shouldShowDepartmentColumn =
    user?.orgDetails.orgType === 'college' && rows.some(row => row?.isAddedByAdmin === true)
  console.log('tableData', eventName)
  return (
    <>
      <CustomDataGrid
        // handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        getRowId={row => row.id}
        hideToolBarEvent={true}
        columns={[
          {
            field: 'checkbox',
            headerName: (
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                <Checkbox
                  checked={selectedIds.length === allIds.length && allIds.length > 0}
                  indeterminate={selectedIds.length > 0 && selectedIds.length < allIds.length}
                  onChange={handleSelectAll}
                  sx={{
                    color: '#1e3a8a',
                    '&.Mui-checked': {
                      color: '#1e3a8a'
                    }
                  }}
                />
                <Typography sx={{ fontSize: '15px', fontWeight: 500, color: '#000000' }}>All</Typography>
                {selectedIds.length > 0 && (
                  <Button
                    variant='contained'
                    size='small'
                    onClick={() => {
                      const payload = {
                        eventGuestIds: selectedIds,
                        eventId: eventId
                      }
                      handleSwitchToggleAll(payload)
                      setSelectedIds([])
                    }}
                    sx={{
                      ml: 2,
                      bgcolor: '#1e3a8a',
                      '&:hover': { bgcolor: '#1e40af' },
                      textTransform: 'none',
                      fontSize: '12px',
                      height: '24px',
                      borderRadius: '20px',
                      py: 1.5,
                      px: 1.5
                    }}
                  >
                    Scan {selectedIds.length}
                  </Button>
                )}
              </Box>
            ),
            width: selectedIds.length > 0 ? 180 : 100,
            sortable: false,
            disableColumnMenu: true,
            filterable: false,
            renderCell: ({ row }) => (
              <Checkbox
                checked={selectedIds.includes(row.id)}
                onChange={e => handleSelectRow(e, row.id)}
                sx={{
                  color: '#1e3a8a',
                  '&.Mui-checked': {
                    color: '#1e3a8a'
                  }
                }}
              />
            )
          },

          {
            field: 'toggleSwitch',
            headerName: 'Active',
            width: 100,
            sortable: false,
            filterable: false,
            disableColumnMenu: true,
            renderCell: ({ row }) => (
              <Switch
                checked={row?.isGuestQrScanned}
                onChange={() => handleSwitchToggle(row)}
                checkedIcon={false}
                uncheckedIcon={false}
                size='small'
                offColor='#D0D5DD'
                onColor='#1e3a8a'
                activeBoxShadow='none'
                height={20}
                width={36}
                boxShadow='0 0 2px 3px rgba(30, 58, 138, 0.5)'
                sx={{
                  width: 36, // Controls overall width
                  height: 20, // Controls overall height
                  padding: 0,
                  '& .MuiSwitch-thumb': {
                    width: 8, // Reduce the circle size
                    height: 8 // Reduce the circle size
                  },
                  '& .MuiSwitch-track': {
                    backgroundColor: row.switchState ? '#1e3a8a' : '#D0D5DD',
                    opacity: 1,
                    borderRadius: 20
                  }
                }}
              />
            )
          },

          // {
          //     field: 'id',
          //     minWidth: 100,
          //     flex: 0.1,
          //     sortable: true,
          //     headerName: 'ID',
          //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.index}>
          //         {row?.index}
          //     </Typography>
          // },
          {
            field: 'name',
            minWidth: 150,
            flex: 0.1,
            sortable: true,
            headerName: 'Name',
            renderCell: ({ row }) => (
              <Typography noWrap variant='body2' title={row?.firstName}>
                {`${row?.firstName} ${row?.lastName}`}
              </Typography>
            )
          },
          {
            field: 'userEmail',
            minWidth: 200,
            flex: 0.1,
            sortable: true,
            headerName: 'Email',
            renderCell: ({ row }) => (
              <Typography noWrap variant='body2' title={row?.userEmail}>
                {row?.userEmail || '-'}
              </Typography>
            )
          },
          {
            field: 'phone',
            minWidth: 200,
            flex: 0.1,
            sortable: true,
            headerName: 'Phone No.',
            renderCell: ({ row }) => (
              <Typography noWrap variant='body2' title={row?.phone}>
                {`${row?.phoneCountry} ${row?.phone}` || '-'}
              </Typography>
            )
          },
          {
            field: 'jobTitle',
            minWidth: 200,
            flex: 0.1,
            sortable: true,
            headerName: 'Job Title',
            renderCell: ({ row }) => (
              <Typography noWrap variant='body2' title={row?.jobTitle}>
                {row?.jobTitle || '-'}
              </Typography>
            )
          },
          {
            field: 'companyName',
            minWidth: 200,
            flex: 0.1,
            sortable: true,
            headerName: 'Company Name',
            renderCell: ({ row }) => (
              <Typography noWrap variant='body2' title={row?.companyName}>
                {row?.companyName || '-'}
              </Typography>
            )
          },
          ...(user?.orgDetails.orgType === 'college'
            ? [
                {
                  field: 'department',
                  minWidth: 200,
                  flex: 0.1,
                  sortable: true,
                  headerName: 'Department',
                  renderCell: ({ row }) => (
                    <Typography noWrap variant='body2' title={row?.addedByCollegeUser?.department?.deptName}>
                      {row?.addedByCollegeUser?.department?.deptName || '-'}
                    </Typography>
                  )
                }
              ]
            : []),
          ...(user?.orgDetails.orgType === 'college'
            ? [
                {
                  field: 'degree',
                  minWidth: 100,
                  flex: 0.1,
                  sortable: true,
                  headerName: 'Degree',
                  renderCell: ({ row }) => (
                    <Typography noWrap variant='body2' title={row?.addedByCollegeUser?.degree?.degreeName}>
                      {row?.addedByCollegeUser?.degree?.degreeName || '-'}
                    </Typography>
                  )
                }
              ]
            : []),
          {
            field: 'personId',
            minWidth: 150,
            flex: 0.1,
            sortable: true,
            headerName: 'User type',
            renderCell: ({ row }) => (
              <Typography noWrap variant='body2'>
                {row?.personId === null ? 'Guest User' : 'Main User'}
              </Typography>
            )
          },
          {
            field: 'ticketPrice',
            minWidth: 150,
            flex: 0.1,
            sortable: true,
            headerName: 'Ticket Price',
            renderCell: ({ row }) => (
              <Typography noWrap variant='body2'>
                ${row?.ticketPrice || '-'}
              </Typography>
            )
          },
          {
            field: 'addedBy',
            minWidth: 200,
            flex: 0.1,
            sortable: true,
            headerName: 'Added By',
            renderCell: ({ row }) => {
              const adminName = row?.adminData?.firstName
                ? `${row.adminData.firstName} ${row.adminData.lastName}`
                : null
              const adminType = row?.isAddedByAdmin === true && 'Admin'
              const collegeUserName = row?.addedByCollegeUser?.appUser?.firstName
                ? `${row.addedByCollegeUser.appUser.firstName} ${row.addedByCollegeUser.appUser.lastName}`
                : null
              const collegeUserType = row?.addedByCollegeUser ? row?.addedByCollegeUser?.userType : null
              const orgUserName = row?.addedByOrgUser?.appUser?.firstName
                ? `${row.addedByOrgUser.appUser.firstName} ${row.addedByOrgUser.appUser.lastName}`
                : null
              const orgUserType = row?.addedByOrgUser ? row?.addedByOrgUser?.userType : null

              const addedBy = adminName || collegeUserName || orgUserName || '-'
              const addedType = adminType || collegeUserType || orgUserType || '-'

              return (
                <Typography noWrap variant='body2'>
                  {`${addedBy} (${addedType})`}
                </Typography>
              )
            }
          },

          // {
          //     field: 'qrCode',
          //     flex: 0.5,
          //     minWidth: 100,
          //     sortable: false,
          //     headerName: 'QR code',
          //     renderCell: ({ row }) =>
          //         <IconButton onClick={() => handleOpenDialog(row.qrCodeImage)}>
          //             <QrCodeIcon sx={{ fill: "#000000" }} />
          //         </IconButton>
          // },
          {
            field: 'ticket',
            minWidth: 100,
            flex: 0.1,
            sortable: false,
            headerName: '',
            renderCell: ({ row }) => (
              <Link
                onClick={() => handleOpenDialog(row.qrCodeImage, row)}
                style={{ fontStyle: 'italic', color: 'blue' }}
              >
                Ticket
              </Link>
            )
          },
          {
            field: 'isGuestQrScanned',
            minWidth: 200,
            flex: 0.1,
            sortable: true,
            headerName: 'Is Ticket Scanned',
            renderCell: ({ row }) => (
              <Typography noWrap variant='body2'>
                {row?.isGuestQrScanned === true ? 'Yes' : 'No'}
              </Typography>
            )
          }

          // {
          //     field: 'isEventAllTicketSold',
          //     flex: 0.5,
          //     minWidth: 200,
          //     sortable: false,
          //     headerName: 'Ticket Availability',
          //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.isEventAllTicketSold}>
          //         <Chip
          //             label={row.isEventAllTicketSold === true ? "Sold Out" : "Available"}
          //             sx={{
          //                 fontSize: "14px",
          //                 fontWeight: 500,
          //                 lineHeight: "14px",
          //                 color:
          //                     row?.isEventAllTicketSold === false
          //                         ? "#009727"
          //                         : "#FF0000",
          //                 backgroundColor:
          //                     row?.isEventAllTicketSold === false
          //                         ? "#ECF8F4"
          //                         : "#FEF3F2",
          //             }}
          //         />
          //     </Typography>
          // },
        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
      />

      <Dialog open={openDialog} onClose={handleCloseDialog} maxWidth='xs' fullWidth>
        <DialogContent
          sx={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            p: 3,
            flexDirection: 'column',
            gap: 10
          }}
        >
          <Box>
            <Typography variant='fm-p1' color='#000000' sx={{ textAlign: 'center', fontWeight: 'bold' }}>
              Ticket-{selectedRowData?.ticket?.category?.name}
            </Typography>
          </Box>
          {selectedQrCode ? (
            <img
              src={selectedQrCode}
              alt='QR Code'
              style={{
                maxWidth: '80%',
                borderRadius: '8px',
                boxShadow: '0px 4px 10px rgba(0, 0, 0, 0.1)'
              }}
            />
          ) : (
            <Typography variant='body2' color='textSecondary'>
              No QR Code Available
            </Typography>
          )}
          <Box sx={{ display: 'flex', gap: 5, flexDirection: 'column' }}>
            <Typography variant='fm-p1' color='#000000' sx={{ textAlign: 'center', fontWeight: 400 }}>
              {' '}
              {`${selectedRowData?.firstName} ${selectedRowData?.lastName}`}
            </Typography>
            <Typography variant='fm-p1' color='#000000' sx={{ textAlign: 'center', fontWeight: 400 }}>
              Registered Date - {moment(selectedRowData?.createdAt).format('L')}
            </Typography>
            <Typography variant='fm-p1' color='#000000' sx={{ textAlign: 'center', fontWeight: 600 }}>
              {`We are delighted to welcome you to the ${eventName} event!`}
            </Typography>
          </Box>
        </DialogContent>
        <DialogActions sx={{ justifyContent: 'center', mt: 3 }}>
          {selectedQrCode && (
            <Button onClick={handleDownloadQrCode} variant='contained' color='secondary'>
              Download QR Code
            </Button>
          )}
          <Button onClick={handleCloseDialog} variant='outlined' color='primary'>
            Close
          </Button>
        </DialogActions>
      </Dialog>
    </>
  )
}

export default TableGuest
