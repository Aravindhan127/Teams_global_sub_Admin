import React, { useState } from 'react'
import { Box, Typography, IconButton, Paper, Stack, Avatar, Card, CardContent } from '@mui/material'
import leftIcon from 'src/assets/images/leftIcon.svg'
import rightIcon from 'src/assets/images/rightIcon.svg'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'

const daysShort = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

function getStartOfWeek(date) {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day
  return new Date(d.setDate(diff))
}

function getTwoWeeksDates(date) {
  const startOfWeek = getStartOfWeek(date)
  return Array.from({ length: 14 }, (_, i) => {
    const d = new Date(startOfWeek)
    d.setDate(startOfWeek.getDate() + i)
    return d
  })
}

const UpcomingEventCard = ({ upcomingEventData }) => {
  // Set current date
  const navigate = useNavigate()
  const currentDate = new Date()
  const [selectedDate, setSelectedDate] = useState(currentDate)
  console.log('upcomingEventData', upcomingEventData)
  // For week navigation, start from one week before current date
  const getStartOfTwoWeekView = date => {
    const startOfCurrentWeek = getStartOfWeek(date)
    const startOfPrevWeek = new Date(startOfCurrentWeek)
    startOfPrevWeek.setDate(startOfCurrentWeek.getDate() - 7)
    return startOfPrevWeek
  }
  const [weekStartDate, setWeekStartDate] = useState(getStartOfTwoWeekView(currentDate))
  const twoWeeksDates = getTwoWeeksDates(weekStartDate)

  const handlePrevWeek = () => {
    const prev = new Date(weekStartDate)
    prev.setDate(prev.getDate() - 14)
    setWeekStartDate(prev)
    setSelectedDate(new Date(prev))
  }
  const handleNextWeek = () => {
    const next = new Date(weekStartDate)
    next.setDate(next.getDate() + 14)
    setWeekStartDate(next)
    setSelectedDate(new Date(next))
  }
  const handleSelectDate = date => {
    setSelectedDate(date)
  }

  return (
    <Card variant='outlined' sx={{ minHeight: '500px', bgcolor: '#FFEEFE', borderRadius: '20px' }}>
      <CardContent>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
          <Typography variant='subtitle1' color='text.secondary' gutterBottom>
            {selectedDate.toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' })}
          </Typography>
          <Box>
            <IconButton size='small' onClick={handlePrevWeek}>
              <img src={leftIcon} alt='Previous' style={{ width: '36px', height: '36px' }} />
            </IconButton>
            <IconButton size='small' onClick={handleNextWeek}>
              <img src={rightIcon} alt='Next' style={{ width: '36px', height: '36px' }} />
            </IconButton>
          </Box>
        </Box>
        <Box sx={{ display: 'flex' }}>
          <Typography variant='fm-h7' color={'#000000'}>
            {selectedDate.toDateString() === new Date().toDateString() ? 'Today' : daysShort[selectedDate.getDay()]}
          </Typography>
        </Box>

        {/* Custom two-week-view calendar */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            mt: 5,
            border: '0.1px solid #0000004d',
            borderRadius: '10px',
            p: '16px'
          }}
        >
          <Box sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: 3 }}>
            {daysShort.map((day, idx) => {
              const today = new Date()
              const isToday = day === daysShort[today.getDay()]
              return (
                <Typography key={day} variant='fm-p1' fontWeight={isToday ? 700 : 400} color={'#272727'}>
                  {day}
                </Typography>
              )
            })}
          </Box>
          {[0, 1].map(row => (
            <Box
              key={row}
              sx={{ display: 'flex', width: '100%', justifyContent: 'space-between', mb: row === 0 ? 0.5 : 0 }}
            >
              {twoWeeksDates.slice(row * 7, (row + 1) * 7).map((date, idx) => {
                const isSelected = date.toDateString() === selectedDate.toDateString()
                const isToday = date.toDateString() === new Date().toDateString()
                return (
                  <Box
                    key={idx}
                    onClick={() => handleSelectDate(date)}
                    sx={{
                      width: 32,
                      height: 32,
                      borderRadius: '50%',
                      backgroundColor: isSelected ? '#1e3a8a' : 'transparent',
                      color: isSelected ? '#ffffff' : '#000000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      fontWeight: isSelected ? 700 : 400,
                      transition: 'background-color 0.3s, color 0.3s',
                      '&:hover': {
                        backgroundColor: isSelected ? '#1e40af' : '#f0f0f0'
                      }
                    }}
                  >
                    <Typography
                      variant='fm-p1'
                      fontWeight={isToday ? 700 : 400}
                      color={
                        isSelected ? '#ffffff' : date.getMonth() !== currentDate.getMonth() ? '#B0B0B0' : '#000000'
                      }
                    >
                      {date.getDate()}
                    </Typography>
                  </Box>
                )
              })}
            </Box>
          ))}
        </Box>
        {upcomingEventData && upcomingEventData.length > 0 && (
          <Box sx={{ display: 'flex', mt: 5 }}>
            <Typography variant='fm-h7' color={'#000000'}>
              Upcoming Events
            </Typography>
          </Box>
        )}

        {(upcomingEventData || []).slice(0, 2).map((event, index) => (
          <Paper
            key={event.eventId || index}
            elevation={3}
            onClick={() => {
              navigate(`/event-detail/${event.eventId}`)
            }}
            sx={{
              borderRadius: 2,
              p: 5,
              mt: 5,
              background: '#1e3a8a',
              display: 'flex',
              flexDirection: 'column',
              color: 'white'
            }}
          >
            <Typography variant='fm-h6' fontWeight={500} color={'#ffffff'}>
              {event.name}
            </Typography>
            <Typography variant='fm-p7' mt={0.5} color={'#ffffff'} fontWeight={400}>
              {event.description}
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'space-between', mt: 5 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                <Typography variant='fm-p6' color={'#ffffff'} fontWeight={400}>
                  {event.organizeBy || 'Organizer'}
                </Typography>
                <Stack direction='row' spacing={-0.8}>
                  <Avatar
                    src={event.eventImage || undefined}
                    sx={{ width: '40px', height: '40px', border: '2px solid white' }}
                  />
                </Stack>
              </Box>
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  flex: 1
                }}
              >
                <Typography variant='fm-p2' color={'#ffffff'} fontWeight={400}>
                  {event.eventSchedule && event.eventSchedule[0] ? event.eventSchedule[0].startTime : ''}
                </Typography>
                <Typography variant='fm-h7' color={'#ffffff'} fontWeight={500}>
                  {event.eventSchedule && event.eventSchedule[0] && event.eventSchedule[0].eventDate
                    ? moment(event.eventSchedule[0].eventDate).format('MMM DD-YYYY')
                    : ''}
                </Typography>
              </Box>
            </Box>
          </Paper>
        ))}
      </CardContent>
    </Card>
  )
}

export default UpcomingEventCard
