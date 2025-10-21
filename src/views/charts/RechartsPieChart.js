// ** MUI Imports
import Box from '@mui/material/Box'
import Card from '@mui/material/Card'
import CardHeader from '@mui/material/CardHeader'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'

// ** Third Party Imports
import { Tooltip, PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

// ** Icons Imports
import Circle from 'mdi-material-ui/Circle'
import { LinearProgress } from '@mui/material'

const RADIAN = Math.PI / 180

const renderCustomizedLabel = props => {
  // ** Props
  const { cx, cy, midAngle, innerRadius, outerRadius, percent } = props
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5
  const x = cx + radius * Math.cos(-midAngle * RADIAN)
  const y = cy + radius * Math.sin(-midAngle * RADIAN)

  return (
    <text x={x} y={y} fill='#fff' textAnchor='middle' dominantBaseline='central'>
      {`${(percent * 100).toFixed(0)}%`}
    </text>
  )
}
const RechartsPieChart = ({ eventData }) => {
  const event = eventData
  console.log('eventData', event)
  // Extract counts from event
  const studentCount = event?.colgStudentCount || 0
  const facultyCount = event?.colgFacultyCount || 0
  const alumniCount = event?.colgAlumCount || 0
  const userGuestCount = event?.totalAttendeesCount - (studentCount + facultyCount + alumniCount)
  const guestCount = Math.max(userGuestCount ?? 0)

  // Calculate total to compute percentages (if needed)
  const total = studentCount + facultyCount + alumniCount + guestCount

  const chartData = [
    { name: 'Student', value: studentCount, color: '#1e3a8a' },
    { name: 'Faculty', value: facultyCount, color: '#3b82f6' },
    { name: 'Alumni', value: alumniCount, color: '#FF361F' },
    { name: 'Guest', value: guestCount, color: '#3D42DF' }
  ]

  return (
    <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
      <CardHeader title='' titleTypographyProps={{ variant: 'h6' }} />
      <CardContent sx={{ width: '100%' }}>
        <Box sx={{ height: 350, minWidth: 300, flex: 1 }}>
          <ResponsiveContainer width='100%' height='100%'>
            <PieChart height={300}>
              <Pie
                data={chartData}
                innerRadius={80}
                outerRadius={100}
                dataKey='value'
                // label={renderCustomizedLabel}
                labelLine={false}
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Pie>
              <text x='50%' y='43%' textAnchor='middle' dominantBaseline='middle' fontSize={14} fill='#888'>
                Total Booking
              </text>

              <text x='50%' y='50%' textAnchor='middle' dominantBaseline='middle' fontSize={20} fontWeight='bold'>
                <Typography variant='body2'>Total Booking</Typography>
                {total}
              </text>
              <Tooltip />
            </PieChart>
          </ResponsiveContainer>
        </Box>

        <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, mt: 4 }}>
          {chartData.map((item, index) => {
            const percentage = total > 0 ? (item.value / total) * 100 : 0

            return (
              <Box key={index}>
                <Typography variant='body2' fontWeight={600} sx={{ mb: 1, color: '#000000' }}>
                  {item.name}
                  <span style={{ color: '#A2A2A2', fontWeight: 500, marginLeft: 6 }}>
                    {`(${percentage.toFixed(1)}%)`}{' '}
                  </span>
                </Typography>

                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <LinearProgress
                    variant='determinate'
                    value={percentage}
                    sx={{
                      flexGrow: 1,
                      height: 10,
                      borderRadius: 5,
                      backgroundColor: '#f5f5f5',
                      '& .MuiLinearProgress-bar': {
                        backgroundColor: item.color
                      }
                    }}
                  />
                  <Typography variant='body2' fontWeight={500}>
                    {item.value}
                  </Typography>
                </Box>
              </Box>
            )
          })}
        </Box>
      </CardContent>
    </Card>
  )
}

export default RechartsPieChart
