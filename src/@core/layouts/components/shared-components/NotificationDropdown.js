import { useState, Fragment, useEffect } from 'react';
import {
  Box,
  Button,
  IconButton,
  Menu as MuiMenu,
  MenuItem as MuiMenuItem,
  Typography,
  Badge,
} from '@mui/material';
import { styled } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import PerfectScrollbarComponent from 'react-perfect-scrollbar';
import CustomChip from 'src/@core/components/mui/chip';
import CustomAvatar from 'src/@core/components/mui/avatar';
import NotificationsNoneOutlinedIcon from '@mui/icons-material/NotificationsNoneOutlined';
import BellIcon from "../../../../../src/assets/images/bell.svg"
import { axiosInstance } from 'src/network/adapter';
import { ApiEndPoints } from 'src/network/endpoints';
import { toastError, toastSuccess } from 'src/utils/utils';
import { Link, useNavigate } from 'react-router-dom';
import moment from 'moment';
import axios from 'axios';
import authConfig from '../../../../configs/auth'
import { DefaultPaginationSettings } from 'src/constants/general.const';

const Menu = styled(MuiMenu)(({ theme }) => ({
  '& .MuiMenu-paper': {
    width: 380,
    overflow: 'hidden',
    marginTop: theme.spacing(4),
    [theme.breakpoints.down('sm')]: {
      width: '100%',
    },
  },
  '& .MuiMenu-list': {
    padding: 0,
  },
}));

const MenuItem = styled(MuiMenuItem)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(3),
  borderBottom: `1px solid ${theme.palette.divider}`,
}));

const styles = {
  maxHeight: 349,
  '& .MuiMenuItem-root:last-of-type': {
    border: 0,
  },
};

const PerfectScrollbar = styled(PerfectScrollbarComponent)({
  ...styles,
});

const Avatar = styled(CustomAvatar)({
  width: '2.375rem',
  height: '2.375rem',
  fontSize: '1.125rem',
});

const MenuItemTitle = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  //flex: '1 1 100%',
  overflow: 'hidden',
  fontSize: '0.875rem',
  whiteSpace: 'nowrap',
  //textOverflow: 'ellipsis',
  marginBottom: theme.spacing(0.75),
}));

const MenuItemSubtitle = styled(Typography)({
  // flex: '1 1 100%',
  overflow: 'hidden',
  whiteSpace: 'nowrap',
  textWrap: 'wrap',
  maxWidth: 220
  // textOverflow: 'ellipsis'
})

const NotificationDropdown = props => {
  const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
  const [loading, setLoading] = useState(false);
  const [notificationData, setNotificationData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);
  const [totalCount, setTotalCount] = useState(0);
  const [unreadCount, setUnreadCount] = useState(0);
  const navigate = useNavigate();
  const fetchData = () => {
    setLoading(true);
    let params = {
      page: currentPage,
      limit: pageSize,
    };

    axiosInstance
      .get(ApiEndPoints.NOTIFICATION.list, { params })
      .then((response) => {
        setNotificationData(response?.data?.data)
        setTotalCount(response?.data?.total)
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });

  };


  const fetchUnreadCount = () => {
    setLoading(true);

    axiosInstance
      .get(ApiEndPoints.NOTIFICATION.getUnreadCount)
      .then((response) => {
        console.log("count", response?.data?.unreadNotificationCount)
        setUnreadCount(response?.data?.unreadNotificationCount)
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });

  };


  useEffect(() => {
    fetchData();
    fetchUnreadCount();
  }, []);

  const handleMarkAsRead = () => {
    setLoading(true);
    axiosInstance
      .get(ApiEndPoints.NOTIFICATION.markAsRead)
      .then((response) => {
        fetchData();
        fetchUnreadCount();
        navigate('/notifications');
        toastSuccess(response?.data?.message);
        handleDropdownClose();
      })
      .catch((error) => {
        toastError(error);
      })
      .finally(() => {
        setLoading(false);
      });
  };

  const { settings } = props;
  const [anchorEl, setAnchorEl] = useState(null);
  const hidden = useMediaQuery(theme => theme.breakpoints.down('lg'));
  const { direction } = settings;

  const handleDropdownOpen = event => {
    setAnchorEl(event.currentTarget);
  };


  const handleDropdownClose = () => {
    setAnchorEl(null);
  };

  const ScrollWrapper = ({ children }) => {
    if (hidden) {
      return <Box sx={{ ...styles, overflowY: 'auto', overflowX: 'hidden' }}>{children}</Box>;
    } else {
      return <PerfectScrollbar options={{ wheelPropagation: false, suppressScrollX: true }}>{children}</PerfectScrollbar>;
    }
  };
  console.log("notificationData", notificationData)
  return (
    <Fragment>
      <IconButton color='inherit' aria-haspopup='true' onClick={handleDropdownOpen} aria-controls='customized-menu'>
        <Badge badgeContent={unreadCount} color='secondary'>
          <Box sx={{ backgroundColor: 'background.paper', borderRadius: "8px", padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
            {/* <NotificationsNoneOutlinedIcon /> */}
            <img src={BellIcon} style={{ width: "24px", height: "24px" }} />
          </Box>
        </Badge>
      </IconButton>

      <Menu
        anchorEl={anchorEl}
        open={Boolean(anchorEl)}
        onClose={handleDropdownClose}
        anchorOrigin={{ vertical: 'bottom', horizontal: direction === 'ltr' ? 'right' : 'left' }}
        transformOrigin={{ vertical: 'top', horizontal: direction === 'ltr' ? 'right' : 'left' }}
      >
        <MenuItem disableRipple>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', width: '100%' }}>
            <Typography sx={{ fontWeight: 600 }}>Notifications</Typography>
            <CustomChip
              skin='light'
              size='small'
              label={`${unreadCount} New`}
              color='primary'
              sx={{ height: 20, fontSize: '0.75rem', fontWeight: 500, borderRadius: '10px' }}
            />
          </Box>
        </MenuItem>

        <ScrollWrapper>
          {notificationData?.length === 0 ? (
            <Box sx={{ p: 2, textAlign: 'center' }}>
              <Typography variant='body2' color='secondary'>
                No notifications yet
              </Typography>
            </Box>
          ) : (
            notificationData?.map(notification => (
              <MenuItem key={notification._id}
                onClick={() => { handleDropdownClose() }}
                sx={{
                  backgroundColor: !notification.isRead ? '#e0c0fd6b' : 'transparent',
                  '&:hover': {
                    backgroundColor: !notification.isRead ? '#4e3f5d' : 'action.hover',
                  },
                }}
              >
                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                  <Avatar alt={notification?.userData?.appUser?.firstName} src={notification?.userData?.appUser?.firstName} />
                  <Box sx={{ mx: 4, flex: '1 1', display: 'flex', overflow: 'hidden', flexDirection: 'column' }}>
                    {/* <MenuItemTitle>{ notification?.userData?.appUser?.firstName} {notification?.userData?.appUser?.lastName}</MenuItemTitle> */}
                    <MenuItemTitle>
                      {(() => {
                        const { notificationType, notificationData } = notification || {};
                        const userName = notificationData?.collegeUser?.appUser?.firstName || notificationData?.orgUser?.appUser?.firstName;

                        switch (notificationType) {
                          case "termsPolicyUpdate":
                            return "Terms and Policy Updated";
                          case "privacyUpdate":
                            return "Privacy Updated";
                          case "collegeUserRegister":
                            return "User Registered";
                          case "loungeCreated":
                            return "Lounge Created";
                          case "loungeAddedToFavList":
                            return "Lounge Added to Favourites";
                          case "followLounge":
                            return `${userName} Started Following You`;
                          case "eventBookByUser":
                            return `Event has been booked`;
                          case "closedLounge":
                            return `Lounge Has Been Closed`;
                          case "addedCommentInYourLounge":
                            return `${userName} Commented on your lounge`;
                          default:
                            return "New Notification"; // Default case to prevent empty rendering
                        }
                      })()}
                    </MenuItemTitle>

                    <MenuItemSubtitle variant='body2'> {notification?.notificationType === 'collegeUserRegister' || notification?.notificationType === 'organisationUserRegister'
                      ? 'User has been registered successfully'
                      : null}
                    </MenuItemSubtitle>

                    <MenuItemSubtitle variant='body2'> {notification?.notificationType === 'pollcreated' || notification?.notificationType === 'loungeCreated'
                      ? 'Lounge has been Created!'
                      : null}</MenuItemSubtitle>
                  </Box>
                  <Typography variant='caption' sx={{ color: 'text.disabled' }}>
                    {moment(notification?.createdAt).format('DD-MM-YYYY')}
                  </Typography>
                </Box>
              </MenuItem>
            ))
          )}
        </ScrollWrapper>
        {notificationData?.length > 0 && (
          <MenuItem disableRipple sx={{ py: 3.5, borderBottom: 0, borderTop: theme => `1px solid ${theme.palette.divider}` }}>
            <Button variant='contained' as={Link} onClick={handleMarkAsRead} sx={{ textDecoration: 'none', width: '100%', textAlign: 'center' }}>
              Read All Notifications
            </Button>
          </MenuItem>
        )}
      </Menu>
    </Fragment>
  );
};

export default NotificationDropdown;
