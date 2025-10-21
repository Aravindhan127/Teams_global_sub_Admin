import {
  Avatar,
  Box,
  Card,
  CardContent,
  Grid,
  Typography,
  IconButton,
  Tooltip,
  ListItem,
  ListItemText,
  List,
  Button,
  Stack,
  Divider
} from '@mui/material'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import FallbackSpinner from 'src/@core/components/spinner'
import { toastError } from 'src/utils/utils'
import PlaceIcon from '@mui/icons-material/Place'
import EventIcon from '@mui/icons-material/Event'
import EditIcon from '@mui/icons-material/Edit'
import editPencil from 'src/assets/images/editPencil.svg'
import { LocalOffer, Percent, Event, PeopleAlt } from '@mui/icons-material'
import ticket from 'src/assets/images/ticket.png'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import MonetizationOnOutlinedIcon from '@mui/icons-material/MonetizationOnOutlined'
import moment from 'moment'
import RechartsPieChart from 'src/views/charts/RechartsPieChart'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import VideoCameraFrontOutlinedIcon from '@mui/icons-material/VideoCameraFrontOutlined'
const EventDetail = () => {
  const { eventId } = useParams()
  const navigate = useNavigate()
  const [eventData, setEventData] = useState(null)
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true)
      try {
        const response = await axiosInstance.get(ApiEndPoints.EVENT.getById(eventId))
        setEventData(response?.data?.data?.event)
      } catch (error) {
        toastError(error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [eventId])

  if (loading) return <FallbackSpinner />
  if (!eventData)
    return (
      <Typography variant='h6' align='center'>
        Event not found
      </Typography>
    )

  const uniqueDays = new Set(eventData.eventSchedule?.map(schedule => schedule.eventDate))
  const numberOfDays = uniqueDays.size
  const durationLabel = numberOfDays === 1 ? '1' : `${numberOfDays}`

  console.log('eventData', eventData)
  // Compute total earnings
  const totalEarnings =
    eventData?.tickets?.reduce((acc, ticket) => {
      const sold = ticket.quantity - ticket.remainingQuantity
      const price = parseFloat(ticket.price)
      return acc + sold * price
    }, 0) || 0
  const totalTicketsSold =
    eventData?.tickets?.reduce((acc, ticket) => {
      return acc + (ticket.quantity - ticket.remainingQuantity)
    }, 0) || 0

  const totalQuantity = eventData?.tickets?.reduce((acc, t) => acc + t.quantity, 0) || 0

  return (
    <>
      <Grid container spacing={2} sx={{ mb: 3 }}>
        <Grid item xs={12} md={8}>
          <Card
            sx={{
              width: '100%',
              mx: 'auto',
              p: 3,
              borderRadius: 2,
              bgcolor: '#FFFFFF',
              boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)',
              height: '100%'
            }}
          >
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} display='flex' alignItems='center' justifyContent={'space-between'}>
                  <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
                    <Tooltip title='Back to events'>
                      <IconButton onClick={() => navigate('/event')}>
                        <ArrowBackIcon color='primary' />
                      </IconButton>
                    </Tooltip>
                    <Typography variant='h5' fontWeight={700} color='primary' ml={1}>
                      Event Details
                    </Typography>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Box sx={{ width: '100%', textAlign: 'center' }}>
                    <img
                      src={eventData.eventImage}
                      alt={eventData.name}
                      style={{ width: '100%', height: '350px', borderRadius: '8px', objectFit: 'cover' }}
                    />
                  </Box>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                    <Typography variant='fm-h7' fontWeight={700} gutterBottom color={'#000000'}>
                      {eventData.name}{' '}
                      <span style={{ fontSize: '12px', fontWeight: 400, color: '#3a3541ad' }}>
                        {' '}
                        By {eventData.organizeBy || '-'}
                      </span>
                    </Typography>
                  </Box>

                  <Tooltip title='Edit event'>
                    <IconButton
                      onClick={() => navigate(`/create-event`, { state: { dataToEdit: eventData, mode: 'edit' } })}
                      sx={{
                        display: 'flex',
                        alignItems: 'center',
                        p: 4,
                        border: '1px solid #A2A2A2',
                        width: 18,
                        height: 18,
                        borderRadius: '50%'
                      }}
                    >
                      <Avatar src={editPencil} alt='Edit' sx={{ width: 18, height: 18 }} />
                    </IconButton>
                  </Tooltip>
                </Grid>

                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Box sx={{ display: 'flex', gap: 2, flexDirection: 'column', width: '50%' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                      {eventData?.isVirtualEvent ? (
                        <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                          <Avatar>
                            <VideoCameraFrontOutlinedIcon />
                          </Avatar>
                          <Typography variant='body1' color='text.secondary'>
                            Virtual Event
                          </Typography>
                        </Box>
                      ) : (
                        <Box sx={{ display: 'flex', gap: 2 }}>
                          <Avatar>
                            <IconButton sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                              <PlaceIcon />
                            </IconButton>
                          </Avatar>
                          <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                            <Typography variant='body1' color='text.secondary'>
                              {eventData.address || '-'}
                            </Typography>
                            <Typography variant='body2' color='text.secondary'>
                              {[eventData.city, eventData.state, eventData.country].filter(Boolean).join(', ') || '-'}
                            </Typography>
                          </Box>
                        </Box>
                      )}
                    </Box>

                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                        <Avatar>
                          <IconButton sx={{ display: 'flex', justifyContent: 'flex-start' }}>
                            <EventIcon />
                          </IconButton>
                        </Avatar>

                        <Box sx={{ display: 'flex', flexDirection: 'column' }}>
                          {eventData.eventSchedule && eventData.eventSchedule.length > 0 && (
                            <>
                              <Typography variant='body1' color='text.secondary' gutterBottom mt={1}>
                                <strong>Event Schedule:</strong>
                              </Typography>

                              {eventData.eventSchedule.map((schedule, index) => (
                                <Box key={index} sx={{ mb: 1 }}>
                                  <Typography variant='body2' color='text.primary'>
                                    {moment(schedule.eventDate).format('MMMM D, YYYY')}
                                  </Typography>
                                  <Typography variant='body2' color='text.secondary'>
                                    {`${moment(schedule.startTime, 'HH:mm').format('hh:mm A')} - ${moment(
                                      schedule.endTime,
                                      'HH:mm'
                                    ).format('hh:mm A')}`}
                                  </Typography>
                                </Box>
                              ))}
                            </>
                          )}
                        </Box>
                      </Box>
                    </Box>
                  </Box>

                  <Box sx={{ display: 'flex', gap: 10, width: '50%', justifyContent: 'flex-end' }}>
                    <Box item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant='body1' color='text.secondary'>
                        Duration
                      </Typography>
                      <Typography variant='body1' color='#000000' fontWeight={600}>
                        {durationLabel}
                      </Typography>
                    </Box>
                    <Box item xs={12} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                      <Typography variant='body1' color='text.secondary'>
                        Event Type
                      </Typography>
                      <Typography variant='body1' color='#000000' fontWeight={600} textTransform={'uppercase'}>
                        {eventData?.tickets?.[0]?.price > 0 ? 'Paid' : 'Free'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Divider orientation='vertical' flexItem sx={{ height: 2, backgroundColor: '#A2A2A2' }} />
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column' }}>
                  <Typography variant='fm-p1' fontWeight={700} gutterBottom color={'#000000'}>
                    About Event
                  </Typography>
                  <Typography
                    variant='fm-p3'
                    color='#000000ab'
                    fontWeight={400}
                    sx={{ wordBreak: 'break-word', overflowWrap: 'break-word' }}
                  >
                    {eventData.description || '-'}
                  </Typography>
                </Grid>

                {/* {eventData.tickets && eventData.tickets.length > 0 && (
                                    <Grid item xs={12}>
                                        <Box sx={{ display: "flex" }}>
                                            <Typography variant="fm-p1" fontWeight={700} gutterBottom color="#000000">
                                                Tickets
                                            </Typography>
                                        </Box>

                                        <Grid container spacing={2}>
                                            {eventData?.tickets.map((ticket, index) => (
                                                <Grid item xs={12} sm={6} md={4} key={index}>
                                                    <Card sx={{ p: 3, borderRadius: 3, boxShadow: 3, height: "100%", display: "flex", flexDirection: "column", gap: 1 }}>
                                                        <Typography variant="h6" fontWeight={700}>
                                                            {ticket.category.name}
                                                        </Typography>
                                                        <Typography variant="body2" color="text.secondary" sx={{ wordBreak: "break-word", overflowWrap: "break-word" }}>
                                                            {ticket.description}
                                                        </Typography>

                                                        <Typography variant="body2" fontWeight={500}>
                                                            <strong>Quantity: </strong> {ticket.quantity}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            <strong>Ticket Type: </strong>  {eventData.tickets.price > 0 ? "Paid" : "Free"}
                                                        </Typography>
                                                        <Typography variant="body2" fontWeight={500}>
                                                            <strong>Price: </strong>  ${ticket.price}
                                                        </Typography>
                                                    </Card>

                                                </Grid>
                                            ))}
                                        </Grid>
                                    </Grid>
                                )} */}

                {/* <Grid item xs={12}>
                        <Typography variant="fm-p1" fontWeight={700} gutterBottom sx={{ marginBottom: 2 }}>
                            Additional Information
                        </Typography>

                        <Card sx={{ p: 2, borderRadius: 3, boxShadow: 3, backgroundColor: "#f9f9f9", mt: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                            <Typography variant="body1" color="text.secondary">
                                <strong>Promo Code:</strong>  {eventData.promoCode || "N/A"}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                <strong> Discount:</strong>   {eventData.isDiscountInPercentage ? `${eventData.discountValue}%` : `$${eventData.discountValue}`}
                            </Typography>

                            <Typography variant="body1" color="text.secondary">
                                <strong> Expiry Date:</strong>    {eventData.expireDate || "N/A"}
                            </Typography>

                            <Typography variant="body1" color="text.secondary">
                                <strong>  Total Guest:</strong>     {eventData.maxParticipants || "-"}
                            </Typography>

                            <Typography variant="body1" color="text.secondary">
                                <strong>  Event Url:</strong>  {eventData.eventUrl || "N/A"}
                            </Typography>

                            <Typography variant="body1" color="text.secondary">
                                <strong> Organiser Email:</strong>  {eventData.organiserEmail || "N/A"}
                            </Typography>
                            <Typography variant="body1" color="text.secondary">
                                <strong> Organiser Phone:</strong>  {eventData.organiserPhone || "N/A"}
                            </Typography>
                            <Box>
                                <Typography variant="body1" color="text.secondary">
                                    <strong> Agenda:</strong>
                                </Typography>
                                <Box sx={{ width: "200px", overflow: "hidden", borderRadius: "8px", marginTop: "10px" }}>
                                    <img src={eventData.agenda} alt="Agenda" style={{ width: "100%", height: "auto", borderRadius: "8px", objectFit: "cover" }} />
                                </Box>
                            </Box>
                        </Card>
                    </Grid> */}
                <Grid item xs={12}>
                  {eventData?.isVirtualEvent === true && (
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'flex-start' }}>
                      <Typography variant='body1' fontWeight={700} color='#000000'>
                        Zoom URL
                      </Typography>
                      {eventData?.zoomUrl ? (
                        <Link to={eventData?.zoomUrl} target='_blank'>
                          <Typography variant='fm-p7' fontWeight={500}>
                            {eventData?.zoomUrl}
                          </Typography>
                        </Link>
                      ) : (
                        <Typography variant='body2' color='text.secondary'>
                          N/A
                        </Typography>
                      )}
                    </Box>
                  )}
                </Grid>
                <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between', gap: 10 }}>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <Typography variant='body1' fontWeight={700} color='#000000'>
                      Agenda
                    </Typography>
                    {eventData?.agenda ? (
                      <Link to={eventData.agenda} target='_blank' style={{ wordBreak: 'break-word' }}>
                        <Typography variant='fm-p7' fontWeight={500}>
                          {' '}
                          {eventData.agenda}
                        </Typography>
                      </Link>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        N/A
                      </Typography>
                    )}
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, justifyContent: 'flex-start' }}>
                    <Typography variant='body1' fontWeight={700} color='#000000'>
                      Event URL
                    </Typography>
                    {eventData?.eventUrl ? (
                      <Link to={eventData.eventUrl} target='_blank'>
                        <Typography variant='fm-p7' fontWeight={500}>
                          {eventData.eventUrl}
                        </Typography>
                      </Link>
                    ) : (
                      <Typography variant='body2' color='text.secondary'>
                        N/A
                      </Typography>
                    )}
                  </Box>
                </Grid>

                <Grid item xs={12}>
                  <Typography variant='fm-p1' fontWeight={400}>
                    Organizer Details
                  </Typography>
                  <Box mt={5} sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Typography variant='body1' fontWeight={700} color='#000000'>
                        Hosted By
                      </Typography>
                      <Typography variant='fm-p5' fontWeight={300} color='#000000'>
                        {eventData?.organizeBy || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
                      <Typography variant='body1' fontWeight={700} color='#000000'>
                        Organizer Mail Id
                      </Typography>
                      <Typography variant='fm-p5' fontWeight={300} color='#000000'>
                        {eventData.organiserEmail || 'N/A'}
                      </Typography>
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                      <Typography variant='body1' fontWeight={700} color='#000000'>
                        Organizer Phone No
                      </Typography>
                      <Typography variant='fm-p5' fontWeight={300} color='#000000'>
                        {eventData?.organiserPhoneCountryCd}
                        {eventData.organiserPhone || 'N/A'}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={12} md={4}>
          <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
            <CardContent>
              <Grid container spacing={6}>
                <Grid item xs={12} display='flex' alignItems='center' justifyContent='space-between'>
                  <Typography
                    variant='fm-h6'
                    fontWeight={600}
                    color='#000000'
                    sx={{
                      fontSize: {
                        xs: '1rem', // for mobile/small screens
                        md: '1.145rem', // for medium screens like 1366x768
                        lg: '1.25rem' // for large screens
                      }
                    }}
                  >
                    Registration Summary
                  </Typography>

                  {/* <Typography
                                        variant="fm-p3"
                                        fontWeight={500}
                                        color="#BF3131"
                                        sx={{
                                            lineHeight: "24px",
                                            fontSize: {
                                                xs: '0.875rem',
                                                md: '1.5rem',
                                                lg: '1.125rem',
                                            },
                                        }}
                                    >
                                        Close Event
                                    </Typography> */}
                </Grid>

                <Grid item xs={12} display='flex' alignItems='center' flexDirection={'column'} gap={2}>
                  <Card sx={{ bgcolor: '#FAFAFA', boxShadow: 'none', width: '100%' }}>
                    <CardContent sx={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          bgcolor: '#f0f4ff',
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <img src={ticket} />
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant='fm-p3' fontWeight={500} color='#A2A2A2'>
                          Total Tickets
                        </Typography>
                        <Typography variant='fm-h6' fontWeight={600} color='#000000'>
                          {totalQuantity}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>

                  <Card sx={{ bgcolor: '#FAFAFA', boxShadow: 'none', width: '100%' }}>
                    <CardContent sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Box
                          sx={{
                            display: 'flex',
                            bgcolor: '#f0f4ff',
                            width: '50px',
                            height: '50px',
                            borderRadius: '50%',
                            alignItems: 'center',
                            justifyContent: 'center'
                          }}
                        >
                          <CheckCircleOutlineOutlinedIcon sx={{ fill: '#1e3a8a' }} />
                        </Box>
                        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                          <Typography variant='fm-p3' fontWeight={500} color='#A2A2A2'>
                            Total Tickets Sold
                          </Typography>
                          <Typography variant='fm-h6' fontWeight={600} color='#000000'>
                            {eventData?.totalAttendeesCount || 'N/A'}
                          </Typography>
                        </Box>
                      </Box>
                      <Box
                        sx={{ cursor: 'pointer' }}
                        onClick={e => {
                          e.stopPropagation()
                          navigate(`/view-guest/${eventData.eventId}`)
                        }}
                      >
                        <ArrowForwardIosIcon sx={{ fontSize: '20px', fill: 'primary' }} />
                      </Box>
                    </CardContent>
                  </Card>
                  <Card sx={{ bgcolor: '#FAFAFA', boxShadow: 'none', width: '100%' }}>
                    <CardContent sx={{ display: 'flex', gap: 10, alignItems: 'center' }}>
                      <Box
                        sx={{
                          display: 'flex',
                          bgcolor: '#f0f4ff',
                          width: '50px',
                          height: '50px',
                          borderRadius: '50%',
                          alignItems: 'center',
                          justifyContent: 'center'
                        }}
                      >
                        <MonetizationOnOutlinedIcon sx={{ fill: '#1e3a8a' }} />
                      </Box>
                      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                        <Typography variant='fm-p3' fontWeight={500} color='#A2A2A2'>
                          Total Earnings
                        </Typography>
                        <Typography variant='fm-h6' fontWeight={600} color='#000000'>
                          ₹{totalEarnings.toFixed(2)}
                        </Typography>
                      </Box>
                    </CardContent>
                  </Card>
                  <Box sx={{ width: '100%' }}>
                    <RechartsPieChart eventData={eventData} />
                  </Box>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </Grid>
      </Grid>
    </>
  )
}

export default EventDetail
