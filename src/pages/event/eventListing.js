import {
  Container,
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  IconButton,
  LinearProgress,
  Pagination,
  Divider
} from '@mui/material'
import { useNavigate } from 'react-router-dom'
import PlaceIcon from '@mui/icons-material/LocationOnOutlined'
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined'
import moment from 'moment'
import ticket from '../../../src/assets/images/ticket.png'
import VisibilityIcon from '@mui/icons-material/Visibility'
import { useCallback, useRef } from 'react'
import VideoCameraFrontOutlinedIcon from '@mui/icons-material/VideoCameraFrontOutlined'
const EventsList = ({
  rows,
  totalCount,
  setCurrentPage,
  currentPage,
  setPageSize,
  pageSize,
  loading,
  rolePremission,
  isMasterAdmin,
  toggleStatus,
  toggleDelete
}) => {
  const navigate = useNavigate()
  const observer = useRef()
  const sentinelRef = useRef()
  const handleCellClick = row => {
    console.log('row', row)
    navigate(`/event-detail/${row?.eventId}`)
  }

  const lastElementRef = useCallback(
    node => {
      if (loading) return

      if (observer.current) observer.current.disconnect()

      observer.current = new IntersectionObserver(entries => {
        if (entries[0].isIntersecting && rows.length < totalCount) {
          setCurrentPage(prev => prev + 1)
        }
      })

      if (node) observer.current.observe(node)
    },
    [loading, rows, totalCount]
  )

  const hasViewAttendeePermission =
    rolePremission?.permissions?.some(item => item.permissionName === 'event.showAttendees') || isMasterAdmin === true
  const hasAddGuestPermission =
    rolePremission?.permissions?.some(item => item.permissionName === 'event.addGuest') || isMasterAdmin === true
  return (
    // <Container>
    <Grid container spacing={2} sx={{ mt: 2 }}>
      {rows?.map((row, index) => (
        <Grid item xs={12} key={index}>
          <Card
            onClick={() => handleCellClick(row)}
            sx={{
              transition: 'transform 0.3s, box-shadow 0.3s',
              '&:hover': {
                transform: 'scale(1.02)',
                boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.1)',
                cursor: 'pointer'
              }
            }}
          >
            <CardContent sx={{ display: 'flex', gap: 12, alignItems: 'center' }}>
              <Grid container spacing={2}>
                <Grid item xs={12} md={4.3} sx={{ display: 'flex', gap: 3, alignItems: 'center' }}>
                  <Box sx={{ width: '180px', height: '110px', minWidth: '180px' }}>
                    <img
                      src={row.eventImage}
                      alt={row.name}
                      style={{ width: '100%', height: '100%', borderRadius: '20px', objectFit: 'fill' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                    <Typography
                      variant='fm-p4'
                      fontWeight={600}
                      gutterBottom
                      color={'#000000'}
                      sx={{ lineHeight: '15px' }}
                    >
                      {row.name.length > 25 ? `${row.name.slice(0, 22)}...` : row.name}
                    </Typography>
                    <Typography
                      variant='fm-p5'
                      fontWeight={400}
                      gutterBottom
                      color={'#000000'}
                      sx={{ wordBreak: 'break-word', lineHeight: '18px', whiteSpace: 'break-spaces' }}
                    >
                      {row.description.length > 50 ? `${row.description.slice(0, 47)}...` : row.description}
                    </Typography>

                    <Box sx={{ bgcolor: '#f0f4ff', width: 'fit-content', padding: '5px 10px', borderRadius: '6px' }}>
                      <Typography variant='fm-p6' fontWeight={600} gutterBottom color={'#000000'}>
                        {row?.tickets[0]?.isPaid === false ? 'Free' : 'Paid'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={3.2}
                  sx={{ display: 'flex', flexDirection: { xs: 'column', sm: 'row' }, alignItems: 'center' }}
                >
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {row?.isVirtualEvent ? (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'center' }}>
                        <VideoCameraFrontOutlinedIcon />
                        <Typography variant='fm-p5' color='#A2A2A2'>
                          Virtual Event
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
                        <PlaceIcon sx={{ fill: '#A2A2A2' }} />
                        <Typography
                          variant='fm-p5'
                          color='#A2A2A2'
                          sx={{
                            whiteSpace: 'break-spaces',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            lineHeight: '18px',
                            maxWidth: { xs: '100%', sm: '250px' }
                          }}
                        >
                          {(() => {
                            const fullAddress = [row.address, row.city, row.state, row.country]
                              .filter(Boolean)
                              .join(', ')
                            return fullAddress.length > 70 ? `${fullAddress.slice(0, 60)}...` : fullAddress || '-'
                          })()}
                        </Typography>
                      </Box>
                    )}

                    <Box sx={{ display: 'flex', gap: 1, alignItems: 'start' }}>
                      <CalendarMonthOutlinedIcon sx={{ fill: '#A2A2A2', mt: 0.5 }} />
                      <Box>
                        {row.eventSchedule.map((schedule, index) => (
                          <Box key={index} sx={{ marginBottom: 2 }}>
                            {/* Date */}
                            <Typography
                              variant='fm-p5'
                              color='#A2A2A2'
                              sx={{
                                display: 'block', // ensures it’s on its own line
                                lineHeight: '18px',
                                maxWidth: '250px'
                              }}
                            >
                              {moment(schedule.eventDate).format('MMMM Do, YYYY')}
                            </Typography>

                            {/* Time */}
                            <Typography
                              variant='fm-p5'
                              color='#A2A2A2'
                              sx={{
                                display: 'block',
                                lineHeight: '18px',
                                maxWidth: '250px'
                              }}
                            >
                              {moment(schedule.startTime, 'HH:mm').format('hh:mm A')} -{' '}
                              {moment(schedule.endTime, 'HH:mm').format('hh:mm A')}
                            </Typography>
                          </Box>
                        ))}
                      </Box>
                    </Box>
                  </Box>
                </Grid>

                <Grid
                  item
                  xs={12}
                  md={1.2}
                  sx={{ display: 'flex', justifyContent: { xs: 'flex-start', md: 'center' }, alignItems: 'center' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      width: { xs: '100%', sm: 120 }
                    }}
                  >
                    {(() => {
                      const total = row.totalTicketQuantity || 0
                      const remaining = row.totalRemainingQuantity || 0
                      const soldPercentage = total ? Math.round(((total - remaining) / total) * 100) : 0

                      return (
                        <>
                          <LinearProgress
                            variant='determinate'
                            value={soldPercentage}
                            sx={{
                              height: 10,
                              borderRadius: 5,
                              backgroundColor: '#f0f4ff',
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: '#1e3a8a'
                              }
                            }}
                          />
                          <Typography fontSize={{ xs: '9px', lg: '12px' }} fontWeight={600} color='#000000' mt={1}>
                            {soldPercentage}%{' '}
                            <span
                              style={{
                                fontSize: { xs: '9px', lg: '12px' },
                                color: '#A2A2A2',
                                fontWeight: 400,
                                lineHeight: '15px'
                              }}
                            >
                              {' '}
                              Tickets Sold
                            </span>
                          </Typography>
                        </>
                      )
                    })()}
                  </Box>
                </Grid>
                <Grid
                  item
                  xs={12}
                  md={1.6}
                  sx={{ display: 'flex', gap: 3, alignItems: 'center', justifyContent: 'center' }}
                >
                  <Box
                    sx={{
                      display: 'flex',
                      bgcolor: '#f0f4ff',
                      width: 'fit-content',
                      padding: '5px 10px',
                      borderRadius: '6px',
                      alignItems: 'center'
                    }}
                  >
                    <img src={ticket} />
                  </Box>
                  <Box
                    sx={{
                      display: 'flex',
                      flexDirection: 'column',
                      gap: 1,
                      justifyContent: 'center',
                      alignItems: 'center'
                    }}
                  >
                    <Typography variant='fm-p2' fontWeight={600} color='#000000'>
                      {row.totalRemainingQuantity}
                    </Typography>
                    <Typography variant='fm-p5' color='#A2A2A2'>
                      Ticket Left
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12} md={1.7} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    {hasViewAttendeePermission && (
                      <Button
                        variant='outlined'
                        color='primary'
                        size='small'
                        onClick={e => {
                          e.stopPropagation()
                          navigate(`/view-guest/${row.eventId}`, {
                            state: { mode: 'edit', dataToEdit: row, eventName: row.name }
                          })
                        }}
                      >
                        View Attendees
                      </Button>
                    )}

                    {hasAddGuestPermission && (
                      <Button
                        variant='contained'
                        color='primary'
                        size='small'
                        onClick={e => {
                          e.stopPropagation()
                          navigate(`/guest-form/${row.eventId}`, {
                            state: { eventName: row.name }
                          })
                        }}
                      >
                        Add Guest
                      </Button>
                    )}
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      ))}
      <Grid item xs={12}>
        <div ref={lastElementRef} />
        {loading && <LinearProgress />}
      </Grid>
    </Grid>
    // </Container>
  )
}

export default EventsList
