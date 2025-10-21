import {
  Avatar,
  Box,
  Card,
  CardContent,
  Divider,
  IconButton,
  styled,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
  Menu,
  MenuItem,
  Chip,
  LinearProgress,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Stack,
  Tooltip,
  Button,
  Tabs,
  Tab,
  ListItemIcon,
  Grid,
  useTheme,
  useMediaQuery
} from '@mui/material'
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { Link, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import FallbackSpinner from 'src/@core/components/spinner'
import EditIcon from '@mui/icons-material/Edit'
import moment from 'moment'
import { toastError, toastSuccess } from 'src/utils/utils'
import DialogApproveReject from 'src/views/dialog/DialogApproveReject'
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined'
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import CommentSection from 'src/views/common/CommentSection'
import VoteList from 'src/views/common/VoteList'
import Followers from 'src/views/common/Followers'
import Favourite from 'src/views/common/Favourite'
import { DefaultPaginationSettings } from 'src/constants/general.const'
import { AccessTime, CalendarToday } from '@mui/icons-material'
import MoreVertIcon from '@mui/icons-material/MoreVert'
import ShareIcon from '@mui/icons-material/Share'
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder'
import FavoriteIcon from '@mui/icons-material/Favorite'
import DialogRejectReason from 'src/views/dialog/DialogRejectRequest'
import toast from 'react-hot-toast'
const LoungeDetail = () => {
  const params = useParams()
  const navigate = useNavigate()
  const { loungeId } = params
  const [loungeData, setLoungeData] = useState([])
  const theme = useTheme()
  const isSmallScreen = useMediaQuery(theme.breakpoints.down('sm'))
  const post = loungeData[0]
  const date = new Date(post?.createdAt)
  const formattedDate = date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
  const formattedTime = date.toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true
  })

  const [pollData, setPollData] = useState([])
  const [followersData, setFollowersData] = useState([])
  const [favouriteData, setFavouriteData] = useState([])
  const [comments, setComments] = useState([])
  const [loading, setLoading] = useState('')
  //pagination
  const [search, setSearch] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)

  const [statusDialogOpen, setStatusDialogOpen] = useState(false)
  const [statusToUpdate, setStatusToUpdate] = useState(null)
  const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
    setStatusDialogOpen(prev => !prev)
    setStatusToUpdate(statusToUpdate)
  }
  const [tabValue, setTabValue] = useState(0)

  const [rejectDialogOpen, setRejectDialogOpen] = useState(false)
  const [rejectId, setRejectId] = useState(null)
  const [typee, setTypee] = useState('')
  const toggleRejectReq = (id, typee) => {
    setRejectDialogOpen(prev => !prev)
    setRejectId(id)
    setTypee(typee)
  }
  const handleChange = (event, newValue) => {
    setTabValue(newValue)
  }

  const [anchorEl, setAnchorEl] = useState(null)
  const open = Boolean(anchorEl)

  const handleLoungesClick = (userSeqId, comment) => {
    if (comment?.orgUser) {
      navigate(`/organization-user/${userSeqId}`)
    } else {
      navigate(`/college-user/${userSeqId}`)
    }
  }
  const handleMenuOpen = event => {
    setAnchorEl(event.currentTarget)
  }

  const handleMenuClose = () => {
    setAnchorEl(null)
  }
  const handleUserProfileNavigate = (userType, item) => {
    console.log('userType', userType)
    if (userType) {
      navigate(`/college-user/${item?.collegeUser?.userSeqId}`)
    }
    //  else if (userType === 'faculty') {
    //     navigate(`/faculty/${loungeData?.collegeUser?.appUser?.userId}`);
    // } else if (userType === 'alumni') { // Corrected else-if syntax
    //     navigate(`/alumni/${loungeData?.collegeUser?.appUser?.userId}`);
    // }
  }

  const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE }) => {
    setLoading(true)
    let params = {
      page: currentPage,
      limit: pageSize,
      longueType: 'all'
    }
    axiosInstance
      .get(ApiEndPoints.LOUNGE.getById(loungeId), { params })
      .then(response => {
        console.log('response', response?.data?.data?.loungeList)
        setLoungeData(response?.data?.data?.loungeList)
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
      currentPage: currentPage,
      pageSize: pageSize
    })
  }, [currentPage, pageSize, loungeId])

  const fetchPollData = () => {
    setLoading(true)
    axiosInstance
      .get(ApiEndPoints.LOUNGE.getPoll(loungeId))
      .then(response => {
        console.log('response', response?.data?.data)
        setPollData(response?.data?.data)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchCommentData = () => {
    setLoading(true)
    // let params = {
    //     limit: 20,
    // }
    axiosInstance
      .get(ApiEndPoints.LOUNGE.getComments(loungeId))
      .then(response => {
        console.log('responseComments', response?.data?.data?.commentsList)
        setComments(response?.data?.data?.commentsList)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchFollowers = () => {
    setLoading(true)
    axiosInstance
      .get(ApiEndPoints.LOUNGE.getFollowers(loungeId))
      .then(response => {
        console.log('response', response?.data?.data)
        setFollowersData(response?.data?.data)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const fetchFavorites = () => {
    setLoading(true)
    axiosInstance
      .get(ApiEndPoints?.LOUNGE.getFavourites(loungeId))
      .then(response => {
        setFavouriteData(response?.data?.data)
        setTotalCount(response?.data.data.total)
        console.log('lounge response--------------------', response?.data.data.total)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleFollowUnfollow = () => {
    let payload = new FormData()
    payload.append('loungeId', loungeId)
    setLoading(true)
    let apiInstance = null
    apiInstance = axiosInstance.post(ApiEndPoints.LOUNGE.toggleFollow, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    apiInstance
      .then(response => response.data)
      .then(response => {
        toastSuccess(response.message)
        fetchFollowers()
        fetchData({
          currentPage: currentPage,
          pageSize: pageSize
        })
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleAddToFavourite = () => {
    let payload = new FormData()
    payload.append('loungeId', loungeId)
    setLoading(true)
    let apiInstance = null
    apiInstance = axiosInstance.post(ApiEndPoints.LOUNGE.addToFav, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    apiInstance
      .then(response => response.data)
      .then(response => {
        toastSuccess(response.message)
        handleMenuClose()
        fetchFavorites()
        fetchData({
          currentPage: currentPage,
          pageSize: pageSize
        })
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const handleRemoveFromFavourite = () => {
    let payload = new FormData()
    payload.append('loungeId', loungeId)
    setLoading(true)
    let apiInstance = null
    apiInstance = axiosInstance.post(ApiEndPoints.LOUNGE.removeFromFav, payload, {
      headers: { 'Content-Type': 'multipart/form-data' }
    })
    apiInstance
      .then(response => response.data)
      .then(response => {
        toastSuccess(response.message)
        handleMenuClose()
        fetchFavorites()
        fetchData({
          currentPage: currentPage,
          pageSize: pageSize
        })
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  useEffect(() => {
    fetchFavorites()
  }, [loungeId])

  useEffect(() => {
    fetchFollowers()
  }, [loungeId])

  useEffect(() => {
    fetchPollData()
  }, [loungeId])

  useEffect(() => {
    fetchCommentData()
  }, [loungeId])

  const handleAction = (e, type, item) => {
    e.stopPropagation()
    if (type === 'approved') {
      const payload = { loungeId: item.loungeId, status: 'approved' }

      setLoading(true)
      axiosInstance
        .post(ApiEndPoints.LOUNGE.approve_reject, payload)
        .then(response => {
          toastSuccess(response.data.message)
          fetchData({
            currentPage: currentPage,
            pageSize: pageSize
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

  const handleNavigateUser = (userSeqId, item) => {
    console.log('item', userSeqId)
    if (item?.orgUser) {
      navigate(`/organization-user/${userSeqId}`)
    } else if (item?.collegeUser) {
      navigate(`/college-user/${userSeqId}`)
    } else if (item?.adminData) {
      navigate('/profile')
    }
  }

  console.log('loungeData', post)
  if (loading) return <FallbackSpinner />

  return (
    <>
      <Card sx={{ bgcolor: '#FFFFFF', boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
        <CardContent sx={{ width: '100%' }}>
          <Grid container spacing={6}>
            <Grid item xs={12} sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-evenly' }}>
              <Box display='flex' justifyContent={'space-between'} gap={2} mb={5}>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                  <ArrowBackIcon onClick={() => navigate('/lounge')} />
                  <Typography variant='h6' sx={{ fontWeight: 700, color: 'primary.main' }}>
                    Lounge Details
                  </Typography>
                </Box>
              </Box>
              <Typography variant='fm-p3' color='#000000' fontWeight={600} gutterBottom>
                Posted By
              </Typography>
              <Box
                sx={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  bgcolor: '#fafafa',
                  p: 2
                }}
              >
                <Box sx={{ display: 'flex', gap: 5, borderRadius: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Avatar
                      alt={`${post?.collegeUser?.appUser?.firstName || post?.adminData?.firstName}`}
                      src={post?.collegeUser?.profileUrl || post?.adminData?.logo}
                      sx={{ width: '90px', height: '90px' }}
                    />
                  </Box>

                  <Box sx={{ display: 'flex', flexDirection: 'column', width: '100%' }}>
                    <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
                      <Typography
                        onClick={
                          post?.adminData
                            ? undefined
                            : () => handleNavigateUser(post?.collegeUser?.userSeqId || post?.orgUser?.userSeqId, post)
                        }
                        sx={{ fontSize: '21px', lineHeight: '23px', cursor: 'pointer' }}
                        fontWeight={600}
                        color='#000000'
                      >
                        {(() => {
                          const firstName =
                            post?.collegeUser?.appUser?.firstName ||
                            post?.adminData?.firstName ||
                            post?.orgUser?.appUser?.firstName ||
                            ''
                          const lastName =
                            post?.collegeUser?.appUser?.lastName ||
                            post?.adminData?.lastName ||
                            post?.orgUser?.appUser?.lastName ||
                            ''
                          return `${firstName} ${lastName}`.trim()
                        })()}
                        <span style={{ fontSize: '14px', fontWeight: 500, color: 'grey', marginLeft: '2px' }}>
                          {post?.adminData && '(Admin)'}
                        </span>
                      </Typography>
                      {loungeData[0]?.isFavourite === true ? (
                        <IconButton onClick={handleRemoveFromFavourite}>
                          <FavoriteIcon fontSize='medium' sx={{ fill: 'red' }} />
                        </IconButton>
                      ) : (
                        <IconButton onClick={handleAddToFavourite}>
                          <FavoriteBorderIcon fontSize='medium' />
                        </IconButton>
                      )}
                    </Box>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
                      <Typography
                        sx={{ fontSize: '14px', lineHeight: '23px', textTransform: 'capitalize' }}
                        color='#838181'
                      >
                        {loungeData[0]?.collegeUser?.userType}
                      </Typography>
                      {loungeData[0]?.collegeUser?.userType !== 'faculty' && (
                        <Typography sx={{ fontSize: '12px', lineHeight: '100%' }} color='#000000'>
                          Class of {loungeData[0]?.collegeUser?.passoutYear} -{' '}
                          {loungeData[0]?.collegeUser?.department?.deptName || 'N/A'}
                        </Typography>
                      )}

                      <Box display='flex' alignItems='center' gap={6}>
                        <Box display='flex' alignItems='center'>
                          <CalendarToday sx={{ mr: 0.5, fontSize: '12px', fill: '#1E1E1E' }} />
                          <Typography sx={{ fontSize: '12px', lineHeight: '23px' }} color='#000000'>
                            {formattedDate}
                          </Typography>
                        </Box>
                        <Box display='flex' alignItems='center'>
                          <AccessTime sx={{ mr: 0.5, fontSize: '12px', fill: '#1E1E1E' }} />
                          <Typography sx={{ fontSize: '12px', lineHeight: '23px' }} color='#000000'>
                            {formattedTime}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>
                  </Box>
                </Box>
                <Box sx={{ display: 'flex', gap: 2, alignItems: 'flex-start' }}>
                  <Button variant={loungeData[0]?.isFollowed ? 'outlined' : 'contained'} onClick={handleFollowUnfollow}>
                    {loungeData[0]?.isFollowed === true ? 'Following' : 'Follow'}
                  </Button>
                </Box>
              </Box>
            </Grid>

            <Grid item xs={12} sm={6}>
              <Box sx={{ display: 'flex', gap: 2, bgcolor: '#fafafa', p: 2, borderRadius: 2, flexDirection: 'column' }}>
                <Typography variant='fm-p3' color='#000000' fontWeight={600} gutterBottom>
                  Lounge Type:
                </Typography>
                <Typography variant='fm-p3' color='#000000' fontWeight={500} gutterBottom textTransform={'capitalize'}>
                  {post?.longueType}
                </Typography>
              </Box>
            </Grid>

            {loungeData[0]?.longueType === 'post' && (
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{ display: 'flex', gap: 2, bgcolor: '#fafafa', p: 2, borderRadius: 2, flexDirection: 'column' }}
                >
                  <Typography variant='fm-p3' color='#000000' fontWeight={600} gutterBottom>
                    Title
                  </Typography>
                  <Typography variant='fm-p3' color='#000000' fontWeight={500} gutterBottom>
                    {post?.title}
                  </Typography>
                </Box>
              </Grid>
            )}
            {loungeData[0]?.longueType === 'poll' && pollData.length > 0 && (
              <Grid item xs={12} sm={6}>
                <Box
                  sx={{ display: 'flex', gap: 2, bgcolor: '#fafafa', p: 2, borderRadius: 2, flexDirection: 'column' }}
                >
                  <Typography variant='fm-p3' color='#000000' fontWeight={600} gutterBottom>
                    Poll Question
                  </Typography>
                  <Typography variant='fm-p3' color='#000000' fontWeight={500} gutterBottom>
                    {post?.pollQuestion}
                  </Typography>
                </Box>
              </Grid>
            )}
            {loungeData[0]?.longueType === 'poll' && pollData.length > 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{ display: 'flex', gap: 2, bgcolor: '#fafafa', p: 5, borderRadius: 2, flexDirection: 'column' }}
                >
                  <Typography variant='fm-p3' color='#000000' fontWeight={600} gutterBottom>
                    Poll Options
                  </Typography>
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2, pt: 3, pl: 5 }}>
                    {pollData.map(option => (
                      <Box key={option.pollOptionId} sx={{ display: 'flex', alignItems: 'center', mb: 3, gap: 2 }}>
                        <Box
                          sx={{
                            width: '15px',
                            height: '15px',
                            borderRadius: '50%',
                            backgroundColor: '#D9D9D9'
                          }}
                        />
                        <Typography variant='fm-p3' fontWeight={500} sx={{ color: '#000000' }}>
                          {option.optionTag}
                        </Typography>
                      </Box>
                    ))}
                  </Box>
                </Box>
              </Grid>
            )}
            {loungeData[0]?.longueType === 'poll' && pollData.length > 0 && (
              <Grid item xs={12}>
                <Box
                  sx={{ display: 'flex', gap: 2, bgcolor: '#fafafa', p: 5, borderRadius: 2, flexDirection: 'column' }}
                >
                  <VoteList pollData={pollData} pollName={post?.pollQuestion} />
                </Box>
              </Grid>
            )}

            {loungeData[0]?.longueType === 'post' && (
              <Grid item xs={12}>
                <Box
                  sx={{ display: 'flex', gap: 2, bgcolor: '#fafafa', p: 2, borderRadius: 2, flexDirection: 'column' }}
                >
                  <Typography variant='fm-p3' color='#000000' fontWeight={600} gutterBottom>
                    Description:
                  </Typography>
                  <Typography variant='fm-p3' color='#000000' fontWeight={500} gutterBottom>
                    {post?.description ?? 'No description available'}
                  </Typography>
                </Box>
              </Grid>
            )}
            <Grid item xs={12}>
              <Typography variant='fm-p3' color='#000000' fontWeight={600} gutterBottom>
                Media:
              </Typography>
              <Box display='flex' overflow='auto'>
                <img
                  src={post?.media[0]?.mediaPath}
                  style={{
                    width: isSmallScreen ? '100%' : '200px',
                    height: 'auto',
                    marginRight: '10px',
                    borderRadius: '8px',
                    objectFit: 'cover'
                  }}
                />
              </Box>
            </Grid>

            <Grid item xs={12} display='flex' justifyContent='flex-end' sx={{ gap: 5 }}>
              <Button
                variant='contained'
                color='primary'
                disabled={post?.status !== 'pending'}
                sx={{
                  width: '130px',
                  borderRadius: '9px',
                  bgcolor: '#1e3a8a',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: post?.status !== 'pending' ? '#1e3a8a' : '#3b82f6' // keep it same if disabled
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#94a3b8', // light gray for disabled
                    color: '#ffffff',
                    opacity: 0.7
                  }
                }}
                onClick={e => post?.status === 'pending' && handleAction(e, 'approved', post)}
              >
                Approve
              </Button>

              <Button
                sx={{
                  width: '130px',
                  borderRadius: '9px',
                  bgcolor: '#888888',
                  color: '#ffffff',
                  '&:hover': {
                    bgcolor: post?.status !== 'pending' ? '#888888' : '#8888887d'
                  },
                  '&.Mui-disabled': {
                    bgcolor: '#cccccc', // lighter grey for disabled state
                    color: '#ffffff',
                    opacity: 0.7
                  }
                }}
                onClick={e => post?.status === 'pending' && handleAction(e, 'rejected', post)}
                disabled={post?.status !== 'pending'}
              >
                Reject
              </Button>
            </Grid>
            <Grid item xs={12}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={tabValue} onChange={handleChange} aria-label='lounge detail tabs'>
                  {loungeData[0]?.longueType === 'post' && (
                    <Tab label='Comments' sx={{ textTransform: 'capitalize', fontWeight: 600 }} />
                  )}
                  <Tab label='Followers' sx={{ textTransform: 'capitalize', fontWeight: 600 }} />
                  <Tab label='Favourites' sx={{ textTransform: 'capitalize', fontWeight: 600 }} />
                </Tabs>
              </Box>

              {/* Adjust tab content mapping according to which tabs are shown */}
              {loungeData[0]?.longueType === 'post' ? (
                <>
                  {tabValue === 0 && (
                    <Box sx={{ mt: 3 }}>
                      <CommentSection
                        comments={comments}
                        loungeId={loungeId}
                        setComments={setComments}
                        onSuccess={fetchCommentData}
                      />
                    </Box>
                  )}
                  {tabValue === 1 && (
                    <Box sx={{ mt: 3 }}>
                      <Followers followersData={followersData} />
                    </Box>
                  )}
                  {tabValue === 2 && (
                    <Box sx={{ mt: 3 }}>
                      <Favourite favouriteData={favouriteData} />
                    </Box>
                  )}
                </>
              ) : (
                <>
                  {tabValue === 0 && (
                    <Box sx={{ mt: 3 }}>
                      <Followers followersData={followersData} />
                    </Box>
                  )}
                  {tabValue === 1 && (
                    <Box sx={{ mt: 3 }}>
                      <Favourite favouriteData={favouriteData} />
                    </Box>
                  )}
                </>
              )}
            </Grid>
          </Grid>
        </CardContent>
      </Card>
    </>
  )
}
export default LoungeDetail
