import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { Avatar, Button, Tooltip } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import right from "../../assets/images/right.svg"
import wrong from "../../assets/images/wrong.svg"
import LockOpenIcon from '@mui/icons-material/LockOpen';
import LockIcon from '@mui/icons-material/Lock';
import CheckCircleOutlineOutlinedIcon from '@mui/icons-material/CheckCircleOutlineOutlined';
import CancelOutlinedIcon from '@mui/icons-material/CancelOutlined';
import ArrowUpwardIcon from '@mui/icons-material/ArrowUpward';
import ArrowDownwardIcon from '@mui/icons-material/ArrowDownward';
import moment from "moment";
function TableLounge({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    rolePremission,
    isMasterAdmin,
    toggleStatus,
    loungeType,
    handleAction,
    toggleDelete,
    onSort,
    sortBy,
    sortOrder,
    orgType
}) {
    const statusColors = {
        approved: '#8bc34a',
        pending: '#FFB400',
        closed: '#9e9e9e',
        rejected: '#f44336'
    }
    const CustomChip = styled(Chip)(({ label }) => ({
        backgroundColor: statusColors[label] || statusColors.default,
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px'
    }))
    const navigate = useNavigate();


    const handleCellClick = ({ row, field }) => {
        if (
            hasDetailPagePermission &&
            field !== 'Actions' &&
            field !== 'status' &&
            field !== 'loungeActions'
        ) {
            navigate(`/lounge/${row?.loungeId}`);
        }
    };
    const handleSortClick = (field) => {
        if (['loungeId', 'noOfComments', 'status', 'createdAt'].includes(field)) {
            const newSortOrder = sortBy === field && sortOrder === 'ASC' ? 'DESC' : 'ASC';
            onSort(field, newSortOrder);
        }
    };

    const renderSortIcon = (field) => {
        if (sortBy === field) {
            return sortOrder === 'ASC' ? <ArrowUpwardIcon fontSize="small" /> : <ArrowDownwardIcon fontSize="small" />;
        }
        return <ArrowDownwardIcon fontSize="small" />;
    };

    // Add debug logging
    console.log("Current sort state:", { sortBy, sortOrder });

    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row.loungeId,
        index: index + 1,
        isCreatedByAdmin: row?.isCreatedByAdmin === true ? "Admin" : "User",
        createdAt: row?.createdAt,
        firstName: row?.collegeUser?.appUser?.firstName || row?.orgUser?.appUser?.firstName || row?.adminData?.firstName,
        lastName: row?.collegeUser?.appUser?.lastName || row?.orgUser?.appUser?.lastName || row?.adminData?.lastName,
        batch: row?.collegeUser?.passoutYear || row?.orgUser?.passoutYear,
        department: row?.collegeUser?.department?.deptName || row?.orgUser?.department?.deptName,
        userType: row?.collegeUser?.userType || row?.orgUser?.userType || row?.adminData?.userType
    }));

    console.log("TableLounge - Current sort state:", { sortBy, sortOrder });
    console.log("TableLounge - Mapped rows:", mappedRows);

    const hasEditPermission = rolePremission?.permissions?.some(item => item.permissionName === 'lounge.edit') || isMasterAdmin === true;
    const hasDeletePermission = rolePremission?.permissions?.some(item => item.permissionName === 'lounge.delete') || isMasterAdmin === true;
    const hasApproveRejectPermission = rolePremission?.permissions?.some(item => item.permissionName === 'lounge.approvereject') || isMasterAdmin === true;
    const hasClosePermission = rolePremission?.permissions?.some(item => item.permissionName === 'lounge.close') || isMasterAdmin === true;
    const hasDetailPagePermission = rolePremission?.permissions?.some(item => item.permissionName === 'lounge.details') || isMasterAdmin === true;

    return <CustomDataGrid
        handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        hideToolBarEvent={true}
        rows={mappedRows}
        getRowId={(row) => row.id}
        columns={[
            {
                field: 'loungeId',
                minWidth: 120,
                flex: 0.1,
                sortable: false,
                headerName: 'SNo',
                renderHeader: () => (
                    <Box display="flex" alignItems="center" gap={1} onClick={() => handleSortClick('loungeId')} sx={{ cursor: 'pointer' }}>
                        <Typography sx={{ fontSize: "15px !important", fontWeight: 550, color: "#ffffffff" }}>SNo</Typography>
                        {renderSortIcon('loungeId')}
                    </Box>
                ),
                renderCell: ({ row }) => (
                    <Typography noWrap variant="body2" title={row?.loungeId}>
                        {row?.loungeId}
                    </Typography>
                )
            },
            ...(loungeType === 'all' || loungeType === 'post'
                ? [
                    {
                        field: 'title',
                        minWidth: 150,
                        flex: 0.1,
                        sortable: false,
                        headerName: 'Title',
                        renderCell: ({ row }) => <Typography noWrap variant='body2'
                            title={row?.title}
                        >
                            {row?.title || row?.pollQuestion || '--'}
                        </Typography>
                    },
                ]
                : []
            ),
            {
                field: 'longueType',
                minWidth: 170,
                flex: 0.1,
                sortable: false,
                headerName: 'Lounge Type',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'}
                    title={row?.longueType}
                >
                    {row?.longueType}
                </Typography>
            },
            ...(orgType === 'college'
                ? [
                    {
                        field: 'userType',
                        minWidth: 200,
                        flex: 0.1,
                        sortable: false,
                        headerName: 'User Type',
                        renderCell: ({ row }) => <Typography noWrap variant='body2'
                            title={row?.userType}
                        >
                            {row?.userType}
                        </Typography>
                    },
                ]
                : []
            ),
            ...(loungeType === 'poll'
                ? [
                    {
                        field: 'pollQuestion',
                        minWidth: 200,
                        flex: 0.1,
                        sortable: false,
                        headerName: 'Poll Question',
                        renderCell: ({ row }) => <Typography noWrap variant='body2'
                            title={row?.pollQuestion}
                        >
                            {row?.pollQuestion}
                        </Typography>
                    },
                ]
                : []
            ),
            {
                field: 'firstName',
                minWidth: 200,
                flex: 0.1,
                sortable: false,
                headerName: 'User Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2'
                    title={row?.firstName}
                >
                    {row?.firstName} {row?.lastName}
                </Typography>
            },
            {
                field: 'passoutYear',
                minWidth: 150,
                flex: 0.1,
                sortable: false,
                headerName: 'Batch',
                renderCell: ({ row }) => <Typography noWrap variant='body2'
                    title={row?.batch}
                >
                    {row?.batch || '--'}
                </Typography>
            },
            ...(loungeType === 'all'
                ? [
                    {
                        field: 'department',
                        minWidth: 150,
                        flex: 0.1,
                        sortable: false,
                        headerName: 'Department',
                        renderCell: ({ row }) => <Typography noWrap variant='body2'
                            title={row?.department}
                        >
                            {row?.department || '--'}
                        </Typography>
                    },
                ]
                : []
            ),
            // ...(loungeType === 'poll'
            //     ? [
            //         {
            //             field: 'options',
            //             minWidth: 250,
            //             flex: 0.1,
            //             sortable: false,
            //             headerName: 'Options',
            //             renderCell: ({ row }) => (
            //                 <Typography noWrap variant='body2' title={row?.options?.length ? row.options.map(item => item.optionTag).join(', ') : '--'}>
            //                     {row?.options?.length ? row.options.map(item => item.optionTag).join(', ') : '--'}
            //                 </Typography>
            //             ),
            //         },
            //     ]
            //     : []
            // ),

            ...(loungeType === 'post'
                ? [
                    {
                        field: 'description',
                        minWidth: 250,
                        flex: 0.1,
                        sortable: false,
                        headerName: 'Description',
                        renderCell: ({ row }) => (
                            <Typography noWrap variant='body2' title={row?.description || '--'}>
                                {row?.description || '--'}
                            </Typography>
                        )
                    }]
                : []),
            ...(loungeType === 'poll' || loungeType === 'post'
                ? [
                    {
                        field: 'noOfComments',
                        minWidth: 250,
                        flex: 0.1,
                        sortable: false,
                        headerName: 'Traction of Comments',
                        renderHeader: () => (
                            <Box display="flex" alignItems="center" gap={1} onClick={() => handleSortClick('noOfComments')} sx={{ cursor: 'pointer' }}>
                                <Typography sx={{ fontSize: "15px !important", fontWeight: 550, color: "#ffffffff"}}>Traction of Comments</Typography>
                                {renderSortIcon('noOfComments')}
                            </Box>
                        ),
                        renderCell: ({ row }) => (
                            <Typography noWrap variant='body2' title={row?.noOfComments || '--'}>
                                {row?.noOfComments || '--'}
                            </Typography>
                        )
                    }
                ]
                : []),

            // ...(loungeType === 'poll' || loungeType === 'post'
            //     ? [
            //         {
            //             field: 'media',
            //             minWidth: 150,
            //             flex: 0.1,
            //             sortable: false,
            //             headerName: 'Media',
            //             renderCell: ({ row }) =>
            //                 <Avatar
            //                     src={row?.media[0]?.mediaPath}
            //                     sx={{ width: 40, height: 40 }}
            //                 />

            //         }]
            //     : []),
            {
                field: 'status',
                minWidth: 150,
                flex: 0.2,
                sortable: false,
                headerName: 'Status',
                renderHeader: () => (
                    <Box display="flex" alignItems="center" gap={1} onClick={() => handleSortClick('status')} sx={{ cursor: 'pointer' }}>
                        <Typography sx={{ fontSize: "15px !important", fontWeight: 550, lineHeight: "23px !important", color: "#ffffffff"}}>Status</Typography>
                        {renderSortIcon('status')}
                    </Box>
                ),
                renderCell: ({ row }) =>
                    <Box sx={{ display: "flex", alignItems: "center", width: '100%' }}>
                        <CustomChip
                            label={row?.status}
                            sx={{
                                cursor: row?.status === "pending" ? "pointer" : "default",
                            }}
                        />
                    </Box>
                ,
                filterable: true,
            },
            ...(hasClosePermission
                ? [
                    {
                        field: 'loungeActions',
                        minWidth: 200,
                        flex: 0.2,
                        align: 'center',
                        headerAlign: 'center',
                        sortable: false,
                        headerName: 'Lounge Actions',
                        renderCell: ({ row }) => (
                            <Box display="flex" gap={1}>

                                {row.status === "approved" && (
                                    <Tooltip title="Close Lounge">
                                        <Button
                                            variant="contained"
                                            onClick={(e) => toggleStatus(e, 'close', row)}
                                            startIcon={<LockIcon sx={{ color: "white" }} />}
                                            size="small"
                                            sx={{
                                                backgroundColor: "red",
                                                color: "white",
                                                "&:hover": { backgroundColor: "darkred" },
                                            }}
                                        >
                                            Close
                                        </Button>
                                    </Tooltip>
                                )}

                                {row.status === "closed" && (
                                    <Tooltip title="Undo Lounge">
                                        <Button
                                            variant="outlined"
                                            onClick={(e) => toggleStatus(e, 'undo', row)}
                                            startIcon={<LockOpenIcon />}
                                            size="small"
                                        >
                                            Undo
                                        </Button>
                                    </Tooltip>
                                )}

                                {(row.status === "rejected" || row.status === "pending") && (
                                    <Box sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                                        <Typography variant="body2" color="textSecondary">
                                            No Actions
                                        </Typography>
                                    </Box>
                                )}

                            </Box>
                        ),
                    }]
                : []),

            {
                field: 'isCreatedByAdmin',
                minWidth: 150,
                sortable: false,
                headerAlign: 'center',
                align: 'center',
                headerName: 'Created By',
                renderCell: ({ row }) => <Typography noWrap variant='body2'
                    title={row?.isCreatedByAdmin}
                >
                    {row?.isCreatedByAdmin}
                </Typography>
            },
            {
                field: 'createdAt',
                minWidth: 150,
                sortable: false,
                headerAlign: 'center',
                align: 'center',
                headerName: 'Created At',
                renderHeader: () => (
                    <Box display="flex" alignItems="center" gap={1} onClick={() => handleSortClick('createdAt')} sx={{ cursor: 'pointer' }}>
                        <Typography sx={{ fontSize: "15px !important", fontWeight: 550, color: "#ffffffff"}}>Created At</Typography>
                        {renderSortIcon('createdAt')}
                    </Box>
                ),
                renderCell: ({ row }) => <Typography noWrap variant='body2'
                    title={row?.createdAt}
                >
                    {moment(row?.createdAt).format("MMM Do YY")}
                </Typography>
            },

            ...(hasEditPermission || hasDeletePermission || hasApproveRejectPermission
                ? [
                    {
                        field: 'Actions',
                        flex: 0,
                        minWidth: 250,
                        sortable: false,
                        align: 'center',
                        headerAlign: 'center',
                        headerName: 'Actions',
                        renderCell: ({ row }) => {
                            console.log("isCreatedByAdmin:", row.isCreatedByAdmin); // Debugging

                            return (
                                <Box display='flex' alignItems='center' gap='10px'>
                                    {/* Conditionally render the EditIcon button */}
                                    {row.isCreatedByAdmin === 'Admin' && (
                                        <IconButton size="small" color="primary" variant="outlined"
                                            onClick={(e) => toggleEdit(e, "edit", row)}
                                        >
                                            <EditIcon />
                                        </IconButton>
                                    )}
                                    {row.isCreatedByAdmin === 'Admin' && (
                                        <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row)}>
                                            <DeleteIcon />
                                        </IconButton>
                                    )}
                                    <Tooltip title="Approve">
                                        <IconButton
                                            onClick={(e) => row.status === "pending" && handleAction(e, "approved", row)}
                                            disabled={row.status !== "pending"}
                                            sx={{
                                                bgcolor: row.status !== "pending" ? "#ddd" : "#00800024",
                                                borderRadius: '10px',
                                                opacity: row.status !== "pending" ? 0.5 : 1,
                                                pointerEvents: row.status !== "pending" ? "none" : "auto",
                                            }}
                                        >
                                            <CheckCircleOutlineOutlinedIcon
                                                sx={{
                                                    fill: row.status !== "pending" ? 'gray' : 'green'
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>

                                    <Tooltip title="Reject">
                                        <IconButton
                                            onClick={(e) => row.status === "pending" && handleAction(e, "rejected", row)}
                                            disabled={row.status !== "pending"}
                                            sx={{
                                                bgcolor: row.status === "rejected" ? "#ddd" : '#ff00001f',
                                                borderRadius: '10px',
                                                opacity: row.status !== "pending" ? 0.5 : 1,
                                                pointerEvents: row.status !== "pending" ? "none" : "auto",
                                            }}
                                        >
                                            <CancelOutlinedIcon
                                                sx={{
                                                    fill: row.status !== "pending" ? 'gray'
                                                        : 'red'
                                                }}
                                            />
                                        </IconButton>
                                    </Tooltip>
                                </Box>
                            );
                        },
                    }
                ]
                : [])

        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
        overrideConfigs={{
            sortingMode: 'server',
            disableColumnMenu: true,
            disableColumnFilter: true,
            disableColumnSelector: true,
            disableDensitySelector: true,
            disableSelectionOnClick: true,
            sortModel: [], // Disable MUI's default sorting
        }}
    />

}

export default TableLounge
