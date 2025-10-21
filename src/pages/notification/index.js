import { useEffect, useState, useRef } from 'react'
import {
  Chip,
  Divider,
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  styled,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableRow,
  Typography
} from '@mui/material'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import PageHeader from 'src/@core/components/page-header'
import Translations from 'src/layouts/components/Translations'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { DefaultPaginationSettings } from 'src/constants/general.const'
import { toastError } from 'src/utils/utils'
import TableNotification from 'src/views/tables/TableNotification'
import axios from 'axios'
import authConfig from '../../configs/auth'
import moment from 'moment'
import { Pagination, PaginationItem } from '@mui/material'

const BoldTypo = styled(Typography)({
  fontWeight: 'bold',
  fontSize: '18px',
  textTransform: 'capitalize'
})
const SimpleTypo = styled(Typography)({
  marginTop: '5px',
  fontSize: '14px'
})

moment.locale('en', {
  relativeTime: {
    future: 'in %s',
    past: '%s ago',
    s: 'seconds',
    ss: '%ss',
    m: 'a minute',
    mm: '%d minutes',
    h: 'an hour',
    hh: '%d hours',
    d: 'a day',
    dd: '%d days',
    M: 'a month',
    MM: '%d months',
    y: 'a year',
    yy: '%d years'
  }
})

const NotificationPage = () => {
  const searchTimeoutRef = useRef()

  const [loading, setLoading] = useState(false)
  const [status, setStatus] = useState('')
  const [notificationData, setNotificationData] = useState([])
  const [search, setSearch] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
  const type = window.localStorage.getItem('loginType')
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName)

  // const fetchData = async () => {
  //     setLoading(true);
  //     let params = {
  //         page: currentPage,
  //     };
  //     try {
  //         const headers = {
  //             Authorization: `Bearer ${storedToken}`,
  //         };
  //         let response;
  //         if (type === "organisation") {
  //             response = await axios.get(ApiEndPoints.ORGANIZATION_USER.get_notification, { params, headers });
  //         } else {
  //             response = await axios.get(ApiEndPoints.COLLEGE_USER.get_notification, { params, headers });
  //         }
  //         setNotificationData(response?.data?.data);
  //     } catch (error) {
  //         toastError(error);
  //     } finally {
  //         setLoading(false);
  //     }
  // };
  // useEffect(() => {
  //     fetchData();
  // }, []);

  const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search, status }) => {
    setLoading(true)
    let params = {
      page: currentPage,
      limit: pageSize,
      search: search,
      status: status
    }

    axiosInstance
      .get(ApiEndPoints.NOTIFICATION.list, { params })
      .then(response => {
        console.log('response', response?.data?.data)
        setNotificationData(response?.data?.data)
        setTotalCount(response?.data?.total)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchData({
      currentPage: currentPage
    })
  }, [currentPage])

  const handleSearchChange = e => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current)
    }

    searchTimeoutRef.current = setTimeout(() => {
      setSearch(e.target.value)
    }, 500)
  }
  console.log('notificationssss', notificationData)
  return (
    <>
      {/* <Grid container spacing={4} className="match-height">
            <PageHeader
                title={
                    <Typography variant="h5">
                        <Translations text="Notification" />
                    </Typography>
                }
            action={
                <Button variant="contained" >
                    
                </Button>
            }
            />
            <Grid item xs={12}>
                <Card>

                    <Box sx={{ p: 5 }}>
                        <TableNotification
                            search={search}
                            loading={loading}
                            rows={notificationData}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                        />
                    </Box>
                </Card>
            </Grid>
        </Grid> */}

      <Grid container>
        <Grid item xs={12}>
          {/* <Typography variant="h5">Notifications</Typography> */}
          <Card
            sx={{
              mt: '5px',
              width: '100%',
              mt: 5,
              bgcolor: '#FFFFFF',
              boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)'
            }}
          >
            {/* <CardHeader title='Event List' titleTypographyProps={{ variant: 'h6' }} /> */}
            <Divider sx={{ m: 0 }} />
            <TableContainer>
              <Table>
                <TableBody>
                  {notificationData && notificationData.length > 0 ? (
                    notificationData
                      // .filter(
                      //     (item) =>
                      //         item?.notificationType !== "loungeCreated" ||
                      //         (item?.longueData && (item?.longueData?.title || item?.longueData?.description))
                      // )
                      .map((item, index) => (
                        <TableRow hover key={index}>
                          <TableCell sx={{ p: 2 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                              <Box>
                                <BoldTypo>
                                  {item?.userData?.appUser?.firstName} {item?.userData?.appUser?.lastName}
                                  {item?.notificationType === 'pollcreated' && item?.longueData?.pollQuestion
                                    ? ` ${item?.longueData?.pollQuestion}`
                                    : ''}
                                  {item?.notificationType === 'termsPolicyUpdate' ? 'Terms and Policy Updated' : ''}
                                  {item?.notificationType === 'privacyUpdate' ? 'Privacy and Policy Updated' : ''}
                                  {item?.notificationType === 'followLounge'
                                    ? ` ${
                                        item?.notificationData?.collegeUser?.appUser?.firstName ||
                                        item?.notificationData?.orgUser?.appUser?.firstName
                                      } started following your Lounge!`
                                    : ''}
                                  {item?.notificationType === 'closedLounge' ? `This Lounge has been closed!` : ''}
                                  {item?.notificationType === 'eventBookByUser' ? `This Event has been booked!` : ''}
                                  {item?.notificationType === 'addedCommentInYourLounge'
                                    ? ` ${
                                        item?.notificationData?.collegeUser?.appUser?.firstName || ''
                                      } commented on your lounge!`
                                    : ''}
                                  {item?.notificationType === 'loungeAddedToFavList'
                                    ? ` ${
                                        item?.notificationData?.collegeUser?.appUser?.firstName || ''
                                      } added your lounge to favourites!`
                                    : ''}
                                  {item?.notificationType === 'loungeCreated'
                                    ? ` ${
                                        item?.notificationData?.collegeUser?.appUser?.firstName || ''
                                      } Created Lounge!`
                                    : ''}
                                  {item?.notificationType === 'pollcreated'
                                    ? ` ${
                                        item?.notificationData?.collegeUser?.appUser?.firstName || ''
                                      } created poll lounge!`
                                    : ''}
                                  {item?.notificationType === 'collegeUserRegister' ||
                                  item?.notificationType === 'organisationUserRegister'
                                    ? '  User has been registered successfully'
                                    : null}
                                </BoldTypo>
                              </Box>
                              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
                                <Chip
                                  label={moment(new Date(item.createdAt)).fromNow()}
                                  color={item.badgeColor || 'primary'}
                                  sx={{
                                    height: '25px',
                                    fontSize: '12px',
                                    backgroundImage: '#1e3a8a',
                                    fontWeight: 700,
                                    '& .MuiChip-label': { px: 1.5, textTransform: 'capitalize' }
                                  }}
                                />
                              </Box>
                            </Box>
                            <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                              <Typography variant='fm-p6' sx={{ fontWeight: 600, color: '#1e3a8a' }}>
                                {item?.notificationType === 'loungeCreated'
                                  ? 'Lounge Created'
                                  : item?.notificationType === 'collegeUserRegister' ||
                                    item?.notificationType === 'organisationUserRegister'
                                  ? 'User Registration'
                                  : 'Other Notification'}
                              </Typography>
                            </Box>
                          </TableCell>
                        </TableRow>
                      ))
                  ) : (
                    <TableRow>
                      <TableCell colSpan={5} align='center'>
                        No data found.
                      </TableCell>
                    </TableRow>
                  )}
                </TableBody>
              </Table>
            </TableContainer>
          </Card>
        </Grid>
      </Grid>

      <Grid container justifyContent='center' sx={{ mt: 2 }}>
        <Pagination
          count={Math.ceil(totalCount / pageSize)}
          page={currentPage}
          onChange={(event, newPage) => setCurrentPage(newPage)}
          color='primary'
          shape='rounded'
          showFirstButton
          showLastButton
          renderItem={item => (
            <PaginationItem
              {...item}
              sx={{
                fontWeight: 600,
                bgcolor: item.selected ? 'primary.main' : 'transparent',
                color: item.selected ? 'white' : 'primary.main'
              }}
            />
          )}
        />
      </Grid>
    </>
  )
}

export default NotificationPage
