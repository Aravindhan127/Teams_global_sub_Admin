import React, { useEffect, useState } from 'react';
import { Box, Card, CardContent, Grid, Typography } from '@mui/material';
import { Link } from 'react-router-dom';
import { axiosInstance } from 'src/network/adapter';
import { ApiEndPoints } from 'src/network/endpoints';
import { toastError } from 'src/utils/utils';
import { useAuth } from 'src/hooks/useAuth';
import icon from "../../../src/assets/images/Icon.svg"
import approved from "../../../src/assets/images/apporved.svg"
import pending from "../../../src/assets/images/pending.svg"
import rejected from "../../../src/assets/images/rejected.svg"
import UpComingEventCard from 'src/views/common/UpcomingEventCard';
import LoungeCard from 'src/views/common/LoungeCard';
import UserApprovalCard from 'src/views/common/UserApprovalCard';
import { DefaultPaginationSettings } from 'src/constants/general.const';
import NotInterestedOutlinedIcon from '@mui/icons-material/NotInterestedOutlined';
import DynamicFeedIcon from '@mui/icons-material/DynamicFeed';
function DashboardPage() {
    const collegeInitialData = [
        // {
        //     stats: {
        //         pendingUserCount: 0,
        //         rejectedUserCount: 0,
        //         acceptedUserCount: 0,
        //         studentUserCount: 0,
        //         facultyUserCount: 0,
        //         alumUserCount: 0,
        //         // total: 0,
        //     },
        //     title: 'College Users',
        //     link: '/college-user',
        //     type: 'collegeUsers',
        //     requiredPermission: 'collegeUser.list',
        // },
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
            requiredPermission: 'collegeUser.list'
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
            requiredPermission: 'collegeUser.list'
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
            requiredPermission: 'collegeUser.list'
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
            requiredPermission: 'collegeUser.list'
        },
        // {
        //     stats: '0',
        //     title: 'App Admin',
        //     link: '/admin',
        //     type: 'admins',
        //     requiredPermission: 'subadmin.list'
        // },
        // {
        //     stats: '0',
        //     title: 'Departments',
        //     link: '/department',
        //     type: 'departments',
        //     requiredPermission: 'dept.list'
        // }
    ]

    const orgInitialData = [
        // {
        //     stats: {
        //         pendingUserCount: 0,
        //         rejectedUserCount: 0,
        //         acceptedUserCount: 0,
        //         total: 0,
        //     },
        //     title: 'Organization Users',
        //     link: '/organization-user',
        //     type: 'orgUser',
        //     requiredPermission: 'orgUser.list'
        // },
        {
            stats: '0',
            title: 'Users',
            link: '/organization-user',
            type: 'orgUser',
            pendingStats: 0,
            rejectedStats: 0,
            acceptedStats: 0,
            pendingType: 'pendingUserCount',
            acceptedType: 'acceptedUserCount',
            rejectedType: 'rejectedUserCount',
            requiredPermission: 'orgUser.list'
        },
        {
            stats: '0',
            title: 'App Admin',
            link: '/admin',
            type: 'admins',
            activeStats: 0,
            inactiveStats: 0,
            activeType: 'admins',
            inactiveType: 'inactiveAdmins',
            requiredPermission: 'subadmin.list'
        },
        {
            stats: '0',
            title: 'Chapter',
            link: '/chapter',
            type: 'chapters',
            requiredPermission: 'orgChapter.list'
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
            requiredPermission: 'orgUser.list'
        },
    ]

    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [orgData, setOrgData] = useState([])
    const [collegeStudentData, setCollegeStudentData] = useState([])
    const [collegeAlumData, setCollegeAlumData] = useState([])
    const [collegeFacultyData, setCollegeFacultyData] = useState([])
    const [loungeData, setLoungeData] = useState([])
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);
    const user = useAuth();
    const { rolePremission } = useAuth()
    console.log("orgId", user?.user?.orgId)
    const userType = user?.user?.orgDetails?.orgType;
    console.log("userType", userType)
    const [loading, setLoading] = useState(false);
    const [stats, setStats] = useState(userType === 'college' ? collegeInitialData : orgInitialData);
    const [orderStats, setOrderStats] = useState([]);
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
                console.log("data", data)
                // Convert loungeCount array into an object with statuses as keys
                const loungeStats = data.loungeCount.reduce((acc, item) => {
                    acc[item.status] = item.count;
                    return acc;
                }, {});

                setStats(prevStats =>
                    prevStats.map(item => {
                        if (item.type === 'loungeCount') {
                            return {
                                ...item,
                                stats: data.totalLoungeCount || 0,
                                pendingStats: loungeStats.pending || 0,
                                acceptedStats: loungeStats.approved || 0,
                                rejectedStats: loungeStats.rejected || 0,
                                closedStats: loungeStats.closed || 0,
                            };
                        }
                        if (item.type === 'admins') {
                            return {
                                ...item,
                                stats: (data[item.activeType] || 0) + (data[item.inactiveType] || 0),
                                activeStats: data[item.activeType] || 0,
                                inactiveStats: data[item.inactiveType] || 0
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
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchData();
    }, []);

    const fetchUserData = async ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);

        try {
            let responses = [];
            let params = {
                page: currentPage,
                limit: pageSize,
                search: search || null,
            };

            if (userType === 'organisation') {
                responses.push(axiosInstance.get(ApiEndPoints.COLLEGE_USER.get_college_users, { params }));
            } else if (userType === 'college') {
                const studentParams = { ...params, userType: 'student' };
                const alumParams = { ...params, userType: 'alum' };
                const facultyParams = { ...params, userType: 'faculty' };

                responses.push(
                    axiosInstance.get(ApiEndPoints.COLLEGE_USER.get_college_users, { params: studentParams }),
                    axiosInstance.get(ApiEndPoints.COLLEGE_USER.get_college_users, { params: alumParams }),
                    axiosInstance.get(ApiEndPoints.COLLEGE_USER.get_college_users, { params: facultyParams })
                );
            }

            const results = await Promise.all(responses);

            if (userType === 'organisation') {
                setOrgData(results[0]?.data?.data?.users || []);
            } else if (userType === 'college') {
                setCollegeStudentData(results[0]?.data?.data?.users || []);
                setCollegeAlumData(results[1]?.data?.data?.users || []);
                setCollegeFacultyData(results[2]?.data?.data?.users || []);
            }
        } catch (error) {
            toastError(error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchUserData({ currentPage, pageSize, search });
    }, [currentPage, pageSize, search, userType]);

    const fetchLoungeData = ({
        currentPage,
        pageSize = DefaultPaginationSettings.ROWS_PER_PAGE,
    }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            longueType: "all"
        };
        axiosInstance
            .get(ApiEndPoints?.LOUNGE?.list, { params })
            .then((response) => {
                setLoungeData(response?.data?.data?.loungeList);
                setTotalCount(response?.data.data.total)
                console.log("lounge response--------------------", response?.data.data.total);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchLoungeData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
        });
    }, [currentPage, pageSize, search])


    const fetchEventData = ({
        search,
        currentPage,
        pageSize = DefaultPaginationSettings.ROWS_PER_PAGE,
    }) => {
        setLoading(true);

        let params = {
            page: currentPage,
            limit: pageSize,
            status: "upcoming"
        };

        axiosInstance
            .get(ApiEndPoints?.EVENT?.list, { params })
            .then((response) => {
                setUpcomingEventData(response?.data?.data?.eventList);
                setTotalCount(response?.data.data.total);
                console.log("Event response--------------------", response?.data.data.total);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };


    useEffect(() => {
        fetchEventData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
            status: "upcoming",
        });
    }, [currentPage, pageSize, search]);

    console.log("stats", stats)
    return (
        <>
            <Grid container spacing={6}>
                <Grid item container xs={12} spacing={6}>
                    {stats.map((item, index) => (
                        <Grid key={index} item xs={12} sm={6} md={6} lg={6} xl={item?.type === 'loungeCount' ? 3 : 3}>
                            <Box
                                component={Link}
                                to={item.link}
                                key={index}
                                variant="body1"
                                sx={{ textDecoration: 'none' }}
                            >
                                <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
                                    <CardContent>
                                        <Typography variant='fm-h6' fontWeight={600} color={'#202224'}>
                                            {item.title}
                                        </Typography>
                                        {/* <Box>
                                            {item.type === 'collegeUsers' &&
                                                <Typography variant="body1">
                                                    Student: {item.stats.studentUserCount} | Faculty: {item.stats.facultyUserCount} | Alumni: {item.stats.alumUserCount}
                                                </Typography>
                                            }
                                        </Box> */}
                                        {/* {item.type === 'orgUser' || item.type === 'collegeUsers' ? ( */}
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "space-between", mt: 3 }}>
                                            <Typography variant='fm-h5' fontWeight={700} color={'#202224'}>
                                                {item.stats}
                                            </Typography>
                                            <img src={icon} />
                                        </Box>
                                        {/* ) : null} */}

                                        <Box sx={{ display: "flex", justifyContent: "space-between", mt: 5 }}>
                                            {item.type === 'admins' ? (
                                                <>
                                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                        <img src={approved} style={{ height: "30px", width: "30px" }} />
                                                        <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                            <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Active</Typography>
                                                            <Typography variant='fm-p4' fontWeight={500} color={'#606060'}> {item?.activeStats}</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                        <img src={pending} style={{ height: "30px", width: "30px" }} />
                                                        <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                            <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Pending</Typography>
                                                            <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>0</Typography>
                                                        </Box>
                                                    </Box>
                                                    <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                        <img src={rejected} style={{ height: "30px", width: "30px" }} />
                                                        <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                            <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Inactive</Typography>
                                                            <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>{item?.inactiveStats}</Typography>
                                                        </Box>
                                                    </Box>
                                                </>
                                            ) : (
                                                <>
                                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                <img src={approved} style={{ height: "30px", width: "30px" }} />
                                                <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                    <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Approved</Typography>
                                                    <Typography variant='fm-p4' fontWeight={500} color={'#606060'}> {item?.acceptedStats}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                <img src={pending} style={{ height: "30px", width: "30px" }} />
                                                <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                    <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Pending</Typography>
                                                    <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>{item?.pendingStats}</Typography>
                                                </Box>
                                            </Box>
                                            <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                <img src={rejected} style={{ height: "30px", width: "30px" }} />
                                                <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                    <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Rejected</Typography>
                                                    <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>{item?.rejectedStats}</Typography>
                                                </Box>
                                            </Box>
                                            {item.type === 'loungeCount' && (
                                                <Box sx={{ display: "flex", gap: 1, alignItems: "center" }}>
                                                    <NotInterestedOutlinedIcon color='error' />
                                                    <Box sx={{ display: "flex", flexDirection: "column", textAlign: "center", gap: 1 }}>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>Closed</Typography>
                                                        <Typography variant='fm-p4' fontWeight={500} color={'#606060'}>{item?.closedStats}</Typography>
                                                    </Box>
                                                </Box>
                                            )}
                                                </>
                                            )}
                                        </Box>


                                    </CardContent>
                                </Card>

                            </Box>

                        </Grid>
                    ))}
                </Grid>
                <Grid item xs={12} md={6} sx={{ display: "flex", flexDirection: "column", gap: 4 }}>
                    <LoungeCard loungeData={loungeData}
                        onSuccess={() => {
                            fetchLoungeData({
                                currentPage,
                                pageSize: DefaultPaginationSettings.ROWS_PER_PAGE,
                                loungeType: "all",
                            })
                        }} />
                    <UserApprovalCard orgData={orgData} collegeStudentData={collegeStudentData} collegeAlumData={collegeAlumData} collegeFacultyData={collegeFacultyData}
                        onSuccess={() => {
                            fetchData()
                        }}
                    />
                </Grid>

                {/* Upcoming Event Card (Beside Lounge & Approval Cards) */}
                {/* {user?.user?.orgId === 19 && ( */}
                <Grid item xs={12} md={6} lg={6} xl={4}>
                    <UpComingEventCard upcomingEventData={upcomingEventData} />
                </Grid>
                {/* )} */}

            </Grid>


        </>
    );
}

export default DashboardPage;
