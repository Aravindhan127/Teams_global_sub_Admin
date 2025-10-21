import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import DeleteIcon from '@mui/icons-material/Delete';
import { Button } from "@mui/material";
import { axiosInstance } from "src/network/adapter";
import moment from "moment";
function TableCollegeUser({
    rows,
    type,
    currentHigherStudies,
    currentemploye,
    currententrepreneur,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleStatus,
    rolePremission,
    isMasterAdmin,
    toggleApproveReject,
    toggleEdit,
    toggleDelete,
}) {

    const statusColors = {
        Active: '#8bc34a',
        Inactive: '#FFB400',
        Rejected: '#f44336',
        Pending: '#9e9e9e',
    }

    const CustomChip = styled(Chip)(({ label }) => ({
        backgroundColor: statusColors[label] || statusColors.default,
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px'
    }))

    const btnStatusColors = {
        approve: '#8bc34a',  // Green for accepted
        reject: '#f44336',  // Red for rejected
    };

    const ButtonChip = styled(Chip)(({ label }) => ({
        backgroundColor: btnStatusColors[label.toLowerCase()] || '#ccc', // Default gray if label doesn't match
        borderRadius: "8px",
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px',
    }));

    const navigate = useNavigate();
    const handleCellClick = ({ row, field }) => {
        if (field !== 'Actions' && field !== 'status' && field !== 'delete') {
            let userSeqId = row?.userSeqId;
            navigate(`/college-user/${userSeqId}`);
        }
    };

    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row?.userSeqId,
        index: index + 1,
        firstName: row?.appUser?.firstName,
        lastName: row?.appUser?.lastName,
        userEmail: row?.appUser?.userEmail,
        city: row?.appUser?.city,
        state: row?.appUser?.state,
        country: row?.appUser?.country,
        deptName: row?.department?.deptName,
        degreeName: row?.degree?.degreeName
    }))

    console.log("mappedRows", mappedRows);
    const hasActiveDeactivePermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'collegeUser.approvereject') || isMasterAdmin === true;
    const hasDeletePermission = rolePremission?.permissions?.some(item => item.permissionName === 'collegeUser.delete') || isMasterAdmin === true;
    return <CustomDataGrid
        handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        columns={[
            {
                field: 'id',
                minWidth: 120,
                flex: 0.1,
                sortable: true,
                headerName: 'User ID',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.index}>
                    {row?.index ? row?.index : '-'}
                </Typography>
            },
            {
                field: 'firstName',
                minWidth: 150,
                flex: 0.1,
                sortable: true,
                headerName: 'User Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.firstName}>
                    {row?.firstName && row?.lastName
                        ? `${row?.firstName} ${row?.lastName}`
                        : '-'}

                </Typography>
            },
            {
                field: 'userType',
                minWidth: 120,
                flex: 0.1,
                sortable: true,
                headerName: 'User Type',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.userType}>
                    {row?.userType ? row?.userType : '-'}
                </Typography>
            },

            ...(type !== "faculty"
                ? [
                    {
                        field: 'passoutYear',
                        flex: 0.3,
                        minWidth: 150,
                        sortable: true,
                        headerName: 'Passout year',
                        renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.passoutYear}>
                            {row?.passoutYear ? row?.passoutYear : '-'}
                        </Typography>
                    },
                ]
                : []),

            {
                field: 'userEmail',
                minWidth: 200,
                flex: 0.1,
                sortable: true,
                headerName: 'Email',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.userEmail}>
                    {row?.userEmail ? row?.userEmail : '-'}
                </Typography>
            },

            // {
            //     field: 'country',
            //     minWidth: 100,
            //     flex: 0.1,
            //     sortable: true,
            //     headerName: 'Country',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.country}>
            //         {row?.country ? row?.country : '-'}
            //     </Typography>
            // },
            // {
            //     field: 'state',
            //     minWidth: 100,
            //     flex: 0.1,
            //     sortable: true,
            //     headerName: 'State',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.state}>
            //         {row?.state ? row?.state : '-'}
            //     </Typography>
            // },
            // {
            //     field: 'city',
            //     minWidth: 100,
            //     flex: 0.1,
            //     sortable: true,
            //     headerName: 'City',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.city}>
            //         {row?.city ? row?.city : '-'}
            //     </Typography>
            // },

            ...(type !== "faculty"
                ? [
                    {
                        field: 'studentId',
                        minWidth: 200,
                        flex: 0.1,
                        sortable: true,
                        headerName: 'Student Id',
                        renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.studentId}>
                            {row?.studentId ? row?.studentId : '-'}
                        </Typography>
                    },
                ]
                : []),

            ...(type === "faculty"
                ? [
                    {
                        field: 'employeeId',
                        minWidth: 200,
                        flex: 0.1,
                        sortable: true,
                        headerName: 'Employee Id',
                        renderCell: ({ row }) => (
                            <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.employeeId}>
                                {row?.employeeId ? row?.employeeId : '-'}
                            </Typography>
                        )
                    },
                ]
                : []),


            {
                field: 'profileBio',
                minWidth: 200,
                sortable: true,
                headerName: 'Profile Bio',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.profileBio}>
                    {row?.profileBio ? row?.profileBio : '-'}
                </Typography>
            },
            {
                field: 'deptName',
                minWidth: 200,
                sortable: true,
                headerName: 'Department',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.deptName}>
                    {row?.deptName ? row?.deptName : '-'}
                </Typography>
            },
            {
                field: 'degreeName',
                minWidth: 200,
                sortable: true,
                headerName: 'Degree',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.degreeName}>
                    {row?.degreeName ? row?.degreeName : '-'}
                </Typography>
            },


            ...(type === "alum"
                ? [
                    {
                        field: 'currentStatus',
                        minWidth: 200,
                        sortable: true,
                        headerName: 'Current Status',
                        renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.currentStatus}>
                            {row?.currentStatus ? row?.currentStatus : '-'}
                        </Typography>
                    },
                ]
                : []),

            {
                field: 'createdAt',
                flex: 0.5,
                minWidth: 200,
                sortable: false,
                headerName: 'Created Date',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.createdAt}>
                    {moment(row.createdAt).format('DD-MM-YYYY')}
                </Typography>
            },
            {
                field: 'status',
                minWidth: 150,
                sortable: true,
                filterable: true,
                headerName: 'Status',
                renderCell: ({ row }) => {
                    let statusLabel = 'Pending'; // Default status

                    if (row.status === 'rejected') {
                        statusLabel = 'Rejected';
                    } else if (row.status === 'accepted') {
                        statusLabel = row.isActive ? 'Active' : 'Inactive';
                    }

                    return (
                        <CustomChip
                            label={statusLabel}
                            onClick={
                                row.status === 'accepted'
                                    ? (e) => toggleStatus(e, row)
                                    : undefined
                            }
                            style={{
                                cursor: row.status === 'accepted' ? 'pointer' : 'not-allowed',
                            }}
                        />
                    );
                },
            },

            ...(hasActiveDeactivePermission
                ?
                [{
                    field: 'Actions',
                    flex: 0,
                    minWidth: 300,
                    sortable: true,
                    headerName: 'Actions',
                    renderCell: ({ row }) => (
                        <Box display="flex" alignItems="center" gap="10px">
                            <>
                                <ButtonChip
                                    size="medium"
                                    disabled={row.status === 'accepted'}
                                    label="Approve"
                                    onClick={() => toggleApproveReject('approve', row.id)}
                                />
                                <ButtonChip
                                    size="medium"
                                    disabled={row.status === 'rejected' || row.status === 'accepted'}
                                    label="Reject"
                                    onClick={() => toggleApproveReject('reject', row.id)}
                                />

                                {/* <IconButton size="small" color="primary" variant="outlined" onClick={() => handleViewDetails(row.orgId)} >
                                    <RemoveRedEyeIcon />
                                </IconButton> */}
                            </>
                        </Box>
                    )
                }]
                : []),
            {
                field: 'rejectReason',
                minWidth: 200,
                sortable: true,
                headerName: 'Rejected Reason',
                renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.rejectReason}>
                    {row?.rejectReason ? row?.rejectReason : '-'}
                </Typography>
            },
            ...(hasDeletePermission
                ? [
                    {
                        field: 'delete',
                        minWidth: 150,
                        sortable: true,
                        headerName: 'Delete User',
                        renderCell: ({ row }) =>
                            <IconButton size="small" color="secondary" onClick={(e) => {
                                toggleDelete(e, row);
                            }}>
                                <DeleteIcon />
                            </IconButton>
                    }
                ]
                : []),

        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableCollegeUser
