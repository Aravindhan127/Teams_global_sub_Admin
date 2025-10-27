import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { axiosInstance } from 'src/network/adapter';
import { ApiEndPoints } from 'src/network/endpoints';
import { toastError } from 'src/utils/utils';
import { useAuth } from 'src/hooks/useAuth';
import UpComingEventCard from 'src/views/common/UpcomingEventCard';
import LoungeCard from 'src/views/common/LoungeCard';
import UserApprovalCard from 'src/views/common/UserApprovalCard';
import { DefaultPaginationSettings } from 'src/constants/general.const';

import PeopleIcon from '@mui/icons-material/People';
import WhatsAppIcon from '@mui/icons-material/WhatsApp';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import WorkOutlineIcon from '@mui/icons-material/WorkOutline';
import EmailIcon from '@mui/icons-material/Email';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import TrendingDownIcon from '@mui/icons-material/TrendingDown';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import CampaignIcon from '@mui/icons-material/Campaign';
import EventIcon from '@mui/icons-material/Event';
import ChatIcon from '@mui/icons-material/Chat';
import ActivityFeed from 'src/views/common/RecentActivity';

function DashboardPage() {
  const collegeInitialData = [
    {
      stats: 0,
      title: 'Student',
      link: '/student-list',
      type: 'studentUserCount',
      pendingStats: 0,
      rejectedStats: 0,
      acceptedStats: 0,
      pendingType: 'studentPendingUserCount',
      acceptedType: 'studentAcceptedUserCount',
      rejectedType: 'studentRejectedUserCount',
      requiredPermission: 'collegeUser.list',
      icon: PeopleIcon,
      trend: 'up',
      percentage: '12.5%',
      vsText: 'vs last month'
    },
    {
      stats: '0',
      title: 'Alumni',
      link: '/alumni',
      type: 'alumUserCount',
      pendingStats: 0,
      rejectedStats: 0,
      acceptedStats: 0,
      pendingType: 'alumPendingUserCount',
      acceptedType: 'alumAccpetedUserCount',
      rejectedType: 'alumRejectedUserCount',
      requiredPermission: 'collegeUser.list',
      icon: PeopleIcon,
      trend: 'up',
      percentage: '12.5%',
      vsText: 'vs last month'
    },
    {
      stats: '0',
      title: 'Faculty',
      link: '/faculty',
      type: 'facultyUserCount',
      pendingStats: 0,
      rejectedStats: 0,
      acceptedStats: 0,
      pendingType: 'facultyPendingUserCount',
      acceptedType: 'facultyAcceptedUserCount',
      rejectedType: 'facultyRejectedUserCount',
      requiredPermission: 'collegeUser.list',
      icon: PeopleIcon,
      trend: 'up',
      percentage: '12.5%',
      vsText: 'vs last month'
    },
    {
      stats: '0',
      title: 'Lounge',
      link: '/lounge',
      type: 'loungeCount',
      pendingStats: 0,
      rejectedStats: 0,
      acceptedStats: 0,
      closedStats: 0,
      pendingType: 'loungePendingUserCount',
      acceptedType: 'loungeAcceptedUserCount',
      rejectedType: 'loungeRejectedUserCount',
      closedType: 'loungeRejectedUserCount',
      requiredPermission: 'collegeUser.list',
      icon: PeopleIcon,
      trend: 'up',
      percentage: '12.5%',
      vsText: 'vs last month'
    },
  ];

  const orgInitialData = [
    {
      stats: '0',
      title: 'Total Users',
      link: '/organization-user',
      type: 'orgUser',
      pendingStats: 0,
      rejectedStats: 0,
      acceptedStats: 0,
      pendingType: 'pendingUserCount',
      acceptedType: 'acceptedUserCount',
      rejectedType: 'rejectedUserCount',
      requiredPermission: 'orgUser.list',
      icon: PeopleIcon,
      trend: 'up',
      percentage: '12.5%',
      vsText: 'vs last month',
      statusItems: [
        { label: 'Approved', value: 0, color: '#10b981' },
        { label: 'Probing', value: 0, color: '#f59e0b' },
        { label: 'Rejected', value: 0, color: '#ef4444' }
      ]
    },
    {
      stats: '0',
      title: 'WhatsApp Messages',
      link: '/whatsapp-Business',
      type: 'whatsapp',
      requiredPermission: 'subadmin.list',
      icon: WhatsAppIcon,
      trend: 'up',
      percentage: '18.4%',
      vsText: 'vs last month',
      statusItems: [
        { label: 'Read', value: 0, color: '#10b981' },
        { label: 'Unread', value: 0, color: '#f59e0b' },
        { label: 'Need Attention', value: 0, color: '#ef4444' }
      ]
    },
    {
      stats: '0',
      title: 'Chapters',
      link: '/chapter',
      type: 'chapters',
      requiredPermission: 'orgChapter.list',
      icon: LocationOnIcon,
      trend: 'up',
      percentage: '2.1%',
      vsText: 'vs last month',
      statusItems: [
        { label: 'Mumbai', value: 4, color: '#6b7280' },
        { label: 'Delhi', value: 3, color: '#6b7280' },
        { label: 'Bangalore', value: 3, color: '#6b7280' },
        { label: 'Pune', value: 2, color: '#6b7280' },
        { label: 'Chennai', value: 2, color: '#6b7280' },
        { label: 'Hyderabad', value: 1, color: '#6b7280' }
      ]
    },
    {
      stats: '0',
      title: 'Jobopedia',
      link: '/carrers',
      type: 'jobopedia',
      requiredPermission: 'orgUser.list',
      icon: WorkOutlineIcon,
      trend: 'up',
      percentage: '32.7%',
      vsText: 'vs last month',
      statusItems: [
        { label: 'Active Jobs', value: 0, color: '#10b981' },
        { label: 'Probing', value: 0, color: '#f59e0b' },
        { label: 'Closed', value: 0, color: '#6b7280' }
      ]
    },
    {
      stats: '0',
      title: 'Email Campaigns',
      link: '/email-campaign',
      type: 'email',
      requiredPermission: 'orgUser.list',
      icon: EmailIcon,
      trend: 'up',
      percentage: '15.2%',
      vsText: 'vs last month',
      statusItems: [
        { label: 'Active', value: 0, color: '#10b981' },
        { label: 'Scheduled', value: 0, color: '#f59e0b' },
        { label: 'Draft', value: 0, color: '#6b7280' },
        { label: 'Completed', value: 0, color: '#3b82f6' }
      ]
    },
  ];

    const quickActions = [
    {
      icon: <PersonAddIcon sx={{ fontSize: 48 }} />,
      title: 'Add User',
      description: 'Invite new members',
      color: '#3B82F6',
      link: '/add-user' // Add appropriate links
    },
    {
      icon: <EmailIcon sx={{ fontSize: 48 }} />,
      title: 'Send Campaign',
      description: 'Create email blast',
      color: '#10B981',
      link: '/email-campaign'
    },
    {
      icon: <EventIcon sx={{ fontSize: 48 }} />,
      title: 'Schedule Event',
      description: 'Plan new event',
      color: '#F59E0B',
      link: '/events'
    },
    {
      icon: <ChatIcon sx={{ fontSize: 48 }} />,
      title: 'Broadcast',
      description: 'WhatsApp message',
      color: '#8B5CF6',
      link: '/whatsapp-Business'
    }
  ];


  const [search, setSearch] = useState("");
  const [totalCount, setTotalCount] = useState(0);
  const [orgData, setOrgData] = useState([]);
  const [collegeStudentData, setCollegeStudentData] = useState([]);
  const [collegeAlumData, setCollegeAlumData] = useState([]);
  const [collegeFacultyData, setCollegeFacultyData] = useState([]);
  const [loungeData, setLoungeData] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);
  const user = useAuth();
  const { rolePremission } = useAuth();
  const userType = user?.user?.orgDetails?.orgType;
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState(userType === 'college' ? collegeInitialData : orgInitialData);
  
  const [upcomingEventData, setUpcomingEventData] = useState([]);

  const hasPermission = (permission) =>
    rolePremission?.permissions?.some((perm) => perm.permissionName === permission);

  const fetchData = () => {
    setLoading(true);
    const apiEndpoint =
      userType === 'college'
        ? ApiEndPoints.DASHBOARD.collegeCount
        : ApiEndPoints.DASHBOARD.organizationCount;

    axiosInstance
      .get(apiEndpoint)
      .then((response) => {
        const data = response.data.data;

        const loungeStats = data.loungeCount?.reduce((acc, item) => {
          acc[item.status] = item.count;
          return acc;
        }, {});

        setStats(prevStats =>
          prevStats.map(item => {
            if (item.type === 'loungeCount') {
              return {
                ...item,
                stats: data.totalLoungeCount || 0,
                pendingStats: loungeStats?.pending || 0,
                acceptedStats: loungeStats?.approved || 0,
                rejectedStats: loungeStats?.rejected || 0,
                closedStats: loungeStats?.closed || 0,
              };
            }
            return {
              ...item,
              stats: data[item.type] || 0,
              pendingStats: data[item.pendingType] || 0,
              acceptedStats: data[item.acceptedType] || 0,
              rejectedStats: data[item.rejectedType] || 0,
            };
          })
        );
      })
      .catch((error) => toastError(error))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
     <Box sx={{ p: 4, }}>
      {/* Welcome Banner */}
    <Box sx={{
  mb: 6,
  p: 6,
  borderRadius: '12px',
  backgroundColor: '#1e3a8a',
  color: '#ffffff'
}}>
  <Typography 
    variant="h5" 
    fontWeight={700} 
    sx={{ 
      color: '#ffffff',
    fontSize: '40px !important', // forces the size
      lineHeight: 1.5      // optional, keeps spacing nice
    }}
  >
    Welcome back, Admin
  </Typography>
  <Typography 
    variant='body2'   
    sx={{ 
      color: '#ffffff',
      fontSize: '18px',   // slightly larger for body text
      mt: 2              // margin top for spacing
    }}
  >
    Here's what's happening with your organization today
  </Typography>
</Box>


    <Grid container spacing={4}>
      <Grid item container xs={12} spacing={4}>
        {stats.map((item, index) => (
          <Grid key={index} item xs={12} sm={6} md={4} lg={3}>
            <Box component={Link} to={item.link} sx={{ textDecoration: 'none' }}>
              <Card sx={{
                bgcolor: "#FFFFFF",
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                border: '1px solid #f1f5f9',
                height: '100%',
                transition: 'all 0.3s ease',
                '&:hover': { boxShadow: '0px 4px 20px rgba(0, 0, 0, 0.12)' }
              }}>
                
                <CardContent sx={{ p: 3, '&:last-child': { pb: 3 } }}>
                  {/* Header with Icon */}
                  <Box sx={{ display: "flex", alignItems: "center",   justifyContent: "space-between", mb: 3 }}>
                    <Typography variant='h6' fontWeight={600} color={'#1e3a8a'} sx={{ fontSize: '1.1rem' }}>
                      {item.title}
                    </Typography>
                    <Box sx={{
                      width: 60,
                      height: 60,
                      borderRadius: '12px',
                      backgroundColor: '#1e3a8a',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#f8fafc'
                    }}>
                      <item.icon sx={{ fontSize: 34 }} />
                    </Box>
                  </Box>

                  {/* Main Stats */}
                  <Box sx={{ mb: 3,}}>
<Box sx={{ mb: 3, display: 'flex', alignItems: 'center', gap: 5 }}>
  {/* Stats */}
  <Typography
    variant='h3'
    fontWeight={700}
    color={'#1e3a8a'}
    sx={{ fontSize: '2.5rem', lineHeight: 1.2 }}
  >
    {item.stats}
  </Typography>

  {/* Trend */}
  <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
    {item.trend === 'up' ? (
      <TrendingUpIcon sx={{ fontSize: 20, color: '#10b981' }} />
    ) : (
      <TrendingDownIcon sx={{ fontSize: 20, color: '#ef4444' }} />
    )}
    <Typography
      variant='body2'
      sx={{
        color: item.trend === 'up' ? '#10b981' : '#ef4444',
        fontWeight: 600,
        fontSize: '1rem'
      }}
    >
      {item.percentage}
    </Typography>
  </Box>
    </Box>

  {/* Optional: vs last month */}
  <Typography
    variant='body2'
    sx={{ color: '#64748b', fontSize: '0.75rem', ml: 1 }}
  >
    vs last month
  </Typography>
</Box>


                  {/* Breakdown */}
   
      {/* If breakdown data is provided */}
      {item.breakdown?.map((breakdownItem, idx) => (
        <Box key={idx} sx={{ 
          display: 'flex', 
          justifyContent: 'space-between', 
          alignItems: 'center' 
        }}>
          <Typography variant='body2' sx={{ 
            color: breakdownItem.color, 
            fontWeight: 600, 
            fontSize: '0.875rem' 
          }}>
            {breakdownItem.label}
          </Typography>
          <Typography variant='body2' sx={{ 
            color: '#1e293b', 
            fontWeight: 600, 
            fontSize: '0.875rem' 
          }}>
            {breakdownItem.value}
          </Typography>
        </Box>
      ))}

      {/* Default breakdown if no breakdown data is provided */}
  {!item.breakdown && (
  <Box
    sx={{
      display: 'flex',
      flexWrap: 'wrap',
      gap: 2,
      justifyContent: { xs: 'center', sm: 'flex-start' },
      alignItems: 'center',
    }}
  >
    {/* Approved */}
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
        border: '1px solid #10b948ff',
        borderRadius: '15px',
        padding: { xs: '6px 10px', sm: '8px 14px' },
        backgroundColor: '#b6f7b6ff',
        minWidth: { xs: '100px', sm: '130px' },
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          color: '#10b948ff',
          fontWeight: 600,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      >
        Approved
      </Typography>
      <Typography
        sx={{
          color: '#10b948ff',
          fontWeight: 600,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      >
        {item.acceptedStats || 1180}
      </Typography>
    </Box>

    {/* Pending */}
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
        border: '1px solid #f59e0b',
        borderRadius: '15px',
        padding: { xs: '6px 10px', sm: '8px 14px' },
        backgroundColor: '#fff7e6',
        minWidth: { xs: '100px', sm: '130px' },
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          color: '#f59e0b',
          fontWeight: 600,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      >
        Pending
      </Typography>
      <Typography
        sx={{
          color: '#f59e0b',
          fontWeight: 600,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      >
        {item.pendingStats || 48}
      </Typography>
    </Box>

    {/* Rejected */}
    <Box
      sx={{
        display: 'flex',
        gap: 1.5,
        alignItems: 'center',
        border: '1px solid #ef4444',
        borderRadius: '15px',
        padding: { xs: '6px 10px', sm: '8px 14px' },
        backgroundColor: '#ffe5e5',
        minWidth: { xs: '100px', sm: '130px' },
        justifyContent: 'center',
      }}
    >
      <Typography
        sx={{
          color: '#ef4444',
          fontWeight: 600,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      >
        Rejected
      </Typography>
      <Typography
        sx={{
          color: '#ef4444',
          fontWeight: 600,
          fontSize: { xs: '0.75rem', sm: '0.875rem' },
        }}
      >
        {item.rejectedStats || 20}
      </Typography>
    </Box>
  </Box>
)}

                </CardContent>
              </Card>
            </Box>
          </Grid>
        ))}
      </Grid>

{/* Quick Actions Section */}
<Box sx={{ width: '100%',   bgcolor: "#FFFFFF",
                boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.08)',
                borderRadius: '12px',
                border: '1px solid #f1f5f9', p: 4, mt: 6 }}
                margin={4}>
<Grid item xs={12}>
  <Box sx={{ mt: 3 }}>
    <Typography 
      variant="h4" 
      fontWeight={700} 
      sx={{ 
        color: '#1e3a8a',// deeper blue
        mb: 4,
        fontSize: '32px'
      }}
    >
      Quick Actions
    </Typography>
    
    <Grid container spacing={4}>
      {quickActions.map((action, index) => (
        <Grid key={index} item xs={12} sm={6} md={3}>
          <Box 
            component={Link} 
            to={action.link} 
            sx={{ textDecoration: 'none', display: 'block' }}
          >
            <Card sx={{
                background: '#f0f9ff',
              padding: '25px',
              textAlign: 'center',
              boxShadow: '0 10px 20px rgba(0,0,0,0.12)',
              border: '1px solid #cbd5e1',
              transition: 'all 0.3s ease',
              cursor: 'pointer',
              position: 'relative',
              overflow: 'hidden',
              '&:hover': {
                transform: 'translateY(-6px)',
              }
            }}>
              {/* Top accent border */}
              <Box sx={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                height: '6px',
              }} />
              
           {/* Icon in a square box */}
<Box sx={{ 
  width: '64px',
  height: '64px',
  backgroundColor: '#1e3a8a', // colored background
  color: '#ffffff',              // icon color
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  margin: '0 auto 20px auto',    // center horizontally and add bottom margin
  borderRadius: '8px',           // rounded corners (optional)
  fontSize: '28px'               // icon size
}}>
  {action.icon}
</Box>
              
              {/* Title */}
              <Typography 
                variant="h6" 
                sx={{
                  fontSize: '20px',
                  fontWeight: 700,
                  color: '#1e293b',
                  marginBottom: '12px'
                }}
              >
                {action.title}
              </Typography>
              
              {/* Description */}
              <Typography 
                variant="body2" 
                sx={{
                  fontSize: '15px',
                  color: '#475569',
                  lineHeight: 1.6,
                  margin: 0
                }}
              >
                {action.description}
              </Typography>
            </Card>
          </Box>
        </Grid>
      ))}
    </Grid>
  </Box>
</Grid>
</Box>


      {/* Other components */}
      <Grid item xs={12} md={6} lg={6} xl={8} sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <LoungeCard loungeData={loungeData} onSuccess={() => fetchData()} />
        <UserApprovalCard
          orgData={orgData}
          collegeStudentData={collegeStudentData}
          collegeAlumData={collegeAlumData}
          collegeFacultyData={collegeFacultyData}
          onSuccess={() => fetchData()}
        />
      </Grid>

      <Grid item xs={12} md={6} lg={6} xl={4} sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
        <UpComingEventCard upcomingEventData={upcomingEventData} />
        <ActivityFeed />
        
      </Grid>

    </Grid>
    </Box>

  );
}

export default DashboardPage;
