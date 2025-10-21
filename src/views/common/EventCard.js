import CardMedia from '@mui/material/CardMedia'
import CardContent from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import CardActions from '@mui/material/CardActions'
import event from '../../../src/assets/images/event.png'
import LocationOnIcon from '@mui/icons-material/LocationOn'
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos'
import { Link, useNavigate } from 'react-router-dom'
import moment from 'moment'
import { Swiper, SwiperSlide } from 'swiper/react'
import { Autoplay, FreeMode, Navigation, Pagination } from 'swiper/modules'
import { Avatar, AvatarGroup, Grid, styled } from '@mui/material'
import { CardDark } from './CardDark'
import 'swiper/css'
import EventIcon from '@mui/icons-material/Event'
import AccesssTimeIcon from '@mui/icons-material/AccessTime'
import EditIcon from '@mui/icons-material/Edit'

const CardTitleTypo = styled(Typography)`
  font-size: 18px;
  color: #ddd5ec;
  font-style: normal;
  font-weight: 600;
  line-height: 26px;
  z-index: 2;
`
const CardContentTypo = styled(Typography)`
  color: #aa97cf;
  font-size: 14px;
  font-style: normal;
  font-weight: 500;
  line-height: 22px;
`

const CardTop = styled(Box)`
  position: relative;
  height: 190px;
`

const CardTopMedia = styled(CardMedia)`
  width: 100%;
  height: 190px;
`

const CardTopOverlay = styled('div')`
  height: 190px;
  width: 100%;
  position: absolute;
  z-index: 1;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
`

const CardChip = styled(Box)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: #fff;
  height: fit-content;
`

const CardChipDark = styled(Box)`
  display: inline-flex;
  justify-content: center;
  align-items: center;
  border-radius: 10px;
  background: #2d2245;
  height: fit-content;
`
const DateLabel = styled(Box)`
  position: absolute;
  top: 0px;
  //   left:400px;
  right: 0px;
  background: #1e3a8a;
  color: white;
  font-size: 12px;
  font-weight: 600;
  padding: 4px 8px;
  border-top-left-radius: 0px;
  border-top-right-radius: 0px;
  border-bottom-left-radius: 8px;
  border-bottom-right-radius: 0px;
`
const CustomCardActions = styled(CardActions)`
  padding: 0 16px 16px;
`

function EventCard({ data }) {
  const navigate = useNavigate()

  const daysAgo = moment().diff(moment(data?.eventStartDate, 'DD MMM'), 'days')
  return (
    <CardDark
      sx={{
        height: '190px',
        width: '100%',
        position: 'relative'
      }}
      // onClick={()=> navigate(`/events/${id}/detail`)}
    >
      <DateLabel>
        {daysAgo} {daysAgo === 1 ? 'day' : 'days'} ago
      </DateLabel>
      <CardContent sx={{ mt: 2 }}>
        <Grid container spacing={2} sx={{ display: 'flex', justifyContent: 'space-between', padding: 0 }}>
          <Grid item xs={3} sx={{ display: 'flex' }}>
            <Box sx={{ borderRadius: '16px' }}>
              <img src={event} style={{ width: '100px', height: '100%' }} />
            </Box>
          </Grid>
          <Grid item xs={9} sx={{ display: 'flex', alignItems: 'flex-start', flexDirection: 'column', gap: '10px' }}>
            {/* <Box sx={{ display: "flex", flexDirection: "column", gap: "10px", maxWidth: "250px" }}> */}
            <Typography variant='fm-p2' sx={{ color: '#ffffff', fontWeight: 700 }}>
              {data?.name} by{' '}
              <span style={{ fontSize: '12px', fontWeight: 500, color: '#ffffff' }}>{data?.authorName}</span>
            </Typography>
            <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
              <AvatarGroup>
                <Avatar alt='Remy Sharp' src={event} sx={{ width: '20px', height: '20px' }} />
                <Avatar alt='Travis Howard' src={event} sx={{ width: '20px', height: '20px' }} />
                <Avatar alt='Agnes Walker' src={event} sx={{ width: '20px', height: '20px' }} />
                <Avatar alt='Trevor Henderson' src={event} sx={{ width: '20px', height: '20px' }} />
              </AvatarGroup>
              <Typography variant='fm-p5' color='#ffffff'>
                +25 more
              </Typography>
            </Box>

            <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Box
                sx={{
                  display: 'flex',
                  bgcolor: '#ffffff',
                  borderRadius: '8px',
                  width: '80%',
                  justifyContent: 'space-evenly',
                  padding: '10px'
                }}
              >
                <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <EventIcon fontSize='14px' sx={{ fill: '#000000B2' }} />
                  <Typography variant='fm-p4' color={'#000000B2'}>
                    {moment(data?.eventStartDate).format('MMM Do')}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <AccesssTimeIcon fontSize='14px' sx={{ fill: '#000000B2' }} />
                  <Typography variant='fm-p4' color={'#000000B2'}>
                    {data?.startTime}-{data?.endTime}
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', gap: '5px', alignItems: 'center' }}>
                  <LocationOnIcon fontSize='14px' sx={{ fill: '#000000B2' }} />
                  <Typography variant='fm-p4' color={'#000000B2'}>
                    {data?.address.country}
                  </Typography>
                </Box>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                <EditIcon
                  sx={{ fill: '#ffffff' }}
                  onClick={() => navigate('/create-event', { state: { mode: 'edit', dataToEdit: data } })}
                />
              </Box>
            </Box>

            {/* </Box> */}
          </Grid>
        </Grid>
      </CardContent>
    </CardDark>
  )
}

export default EventCard
