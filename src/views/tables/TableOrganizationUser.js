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



const mockRows = [
  {
    id: 1,
    name: "John Doe",
    companyName: "Acme Corp",
    title: "Manager",
    city: "New York",
    vendors: "Vendor A",
    phoneNumber: "123-456-7890",
  },
  {
    id: 2,
    name: "Jane Smith",
    companyName: "Globex Inc",
    title: "Developer",
    city: "Los Angeles",
    vendors: "Vendor B",
    phoneNumber: "234-567-8901",
  },
  {
    id: 3,
    name: "Michael Brown",
    companyName: "Initech",
    title: "Designer",
    city: "Chicago",
    vendors: "Vendor C",
    phoneNumber: "345-678-9012",
  },
  {
    id: 4,
    name: "Alice Johnson",
    companyName: "Umbrella Corp",
    title: "Analyst",
    city: "Houston",
    vendors: "Vendor D",
    phoneNumber: "456-789-0123",
  },
  {
    id: 5,
    name: "Tony Stark",
    companyName: "Stark Industries",
    title: "CEO",
    city: "San Francisco",
    vendors: "Vendor E",
    phoneNumber: "567-890-1234",
  },
  {
    id: 6,
    name: "Bruce Wayne",
    companyName: "Wayne Enterprises",
    title: "Director",
    city: "Gotham",
    vendors: "Vendor F",
    phoneNumber: "678-901-2345",
  },
  {
    id: 7,
    name: "Harry Osborn",
    companyName: "Oscorp",
    title: "Manager",
    city: "New York",
    vendors: "Vendor G",
    phoneNumber: "789-012-3456",
  },
  {
    id: 8,
    name: "Sarah Connor",
    companyName: "Cyberdyne Systems",
    title: "Engineer",
    city: "Los Angeles",
    vendors: "Vendor H",
    phoneNumber: "890-123-4567",
  },
  {
    id: 9,
    name: "Gavin Belson",
    companyName: "Hooli",
    title: "CEO",
    city: "Palo Alto",
    vendors: "Vendor I",
    phoneNumber: "901-234-5678",
  },
  {
    id: 10,
    name: "Charlie Bucket",
    companyName: "Wonka Industries",
    title: "Intern",
    city: "London",
    vendors: "Vendor J",
    phoneNumber: "012-345-6789",
  },
];


function TableOrganizationUser({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleStatus,
    toggleApproveReject,
    rolePremission,
    isMasterAdmin,
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
            navigate(`/organization-user/${userSeqId}`);
        }
    };

    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: index + 1, // Add `id` for compatibility with CustomDataGrid
        firstName: row?.appUser?.firstName,
        lastName: row?.appUser?.lastName,
        userEmail: row?.appUser?.userEmail,
        city: row?.appUser?.city,
        state: row?.appUser?.state,
        country: row?.appUser?.country
    }));

    const hasActiveDeactivePermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'orgUser.approvereject') || isMasterAdmin === true;
    const hasDeletePermission = rolePremission?.permissions?.some(item => item.permissionName === 'orgUser.delete') || isMasterAdmin === true;

    return <CustomDataGrid
     autoHeight
  sx={{
    width: '100%',             // full width
    '& .MuiDataGrid-cell': {
      px: 1,                   // internal padding
    },
    '& .MuiDataGrid-columnHeaders': {
      backgroundColor: 'transparent',
      borderBottom: 'none',
    },
  }}
  columnSpacing={4}      
        handleCellClick={handleCellClick}
        loading={loading}
        rows={mockRows}
        // rowCount={totalCount}
        // rows={mappedRows}
          rowCount={mockRows.length}
        columns={[
  { field: 'name', headerName: 'Name', flex: 0.5, minWidth: 100 },
  { field: 'companyName', headerName: 'Company Name', flex: 1, minWidth: 150 },
  { field: 'title', headerName: 'Title', flex: 1, minWidth: 200 },
  { field: 'city', headerName: 'City', flex: 1, minWidth: 200 },
  { field: 'vendors', headerName: 'Vendors', flex: 1, minWidth: 200 },
  { field: 'phoneNumber', headerName: 'Phone Number', flex: 1, minWidth: 200 },
]}

        // columns={[
        //     {
        //         field: 'id',
        //         minWidth: 100,
        //         flex: 0.1,
        //         sortable: true,
        //         headerName: 'ID',
        //         renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row.id}>
        //             {row.id ? row.id : '-'}
        //         </Typography>
        //     },
        //     // {
        //     //     field: 'organisationId',
        //     //     minWidth: 170,
        //     //     flex: 0.1,
        //     //     sortable: true,
        //     //     headerName: 'Organisation Id',
        //     //     renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.organisationId}>
        //     //         {row?.organisationId ? row?.organisationId : '-'}
        //     //     </Typography>
        //     // },

        //     {
        //         field: 'firstName',
        //         flex: 0.3,
        //         minWidth: 150,
        //         sortable: true,
        //         headerName: 'First Name',
        //         renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.firstName}>
        //             {row?.firstName ? row?.firstName : '-'}
        //         </Typography>
        //     },
        //     {
        //         field: 'lastName',
        //         flex: 0.3,
        //         minWidth: 150,
        //         sortable: true,
        //         headerName: 'Last Name',
        //         renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.lastName}>
        //             {row?.lastName ? row?.lastName : '-'}
        //         </Typography>
        //     },

        //     {
        //         field: 'userEmail',
        //         minWidth: 200,
        //         flex: 0.1,
        //         sortable: true,
        //         headerName: 'Email',
        //         renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.userEmail}>
        //             {row?.userEmail ? row?.userEmail : '-'}
        //         </Typography>
        //     },
        //     {
        //         field: 'profileBio',
        //         minWidth: 200,
        //         sortable: true,
        //         headerName: 'Profile Bio',
        //         renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.profileBio}>
        //             {row?.profileBio ? row?.profileBio : '-'}
        //         </Typography>
        //     }, {
        //         field: 'job',
        //         minWidth: 200,
        //         sortable: true,
        //         headerName: 'Job',
        //         renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.job}>
        //             {row?.job ? row?.job : '-'}
        //         </Typography>
        //     },

        //     {
        //         field: 'createdAt',
        //         flex: 0.5,
        //         minWidth: 200,
        //         sortable: false,
        //         headerName: 'Created Date',
        //         renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.createdAt}>
        //             {moment(row.createdAt).format('DD-MM-YYYY')}
        //         </Typography>
        //     },
        //     // {
        //     //     field: 'status',
        //     //     minWidth: 180,
        //     //     sortable: true,
        //     //     headerName: 'Status',
        //     //     renderCell: ({ row }) => (
        //     //         <CustomChip
        //     //             label={row.status === 'pending' ? 'Pending' : row.status === 'accepted' ? 'Accepted' : 'Rejected'}
        //     //             color={
        //     //                 row.status === 'pending' ? 'warning' : row.status === 'accepted' ? 'success' : 'error'
        //     //             }
        //     //         />
        //     //     )
        //     // },

        //     {
        //         field: 'status',
        //         minWidth: 150,
        //         sortable: true,
        //         filterable: true,
        //         headerName: 'Status',
        //         renderCell: ({ row }) => {
        //             let statusLabel = 'Pending'; // Default status

        //             if (row.status === 'rejected') {
        //                 statusLabel = 'Rejected';
        //             } else if (row.status === 'accepted') {
        //                 statusLabel = row.isActive ? 'Active' : 'Inactive';
        //             }

        //             return (
        //                 <CustomChip
        //                     label={statusLabel}
        //                     onClick={
        //                         row.status === 'accepted'
        //                             ? (e) => toggleStatus(e, row)
        //                             : undefined
        //                     }
        //                     style={{
        //                         cursor: row.status === 'accepted' ? 'pointer' : 'not-allowed',
        //                     }}
        //                 />
        //             );
        //         },
        //     },



        //     ...(hasActiveDeactivePermission
        //         ? [
        //             {
        //                 field: 'Actions',
        //                 flex: 0,
        //                 minWidth: 250,
        //                 sortable: true,
        //                 headerName: 'Actions',
        //                 renderCell: ({ row }) => (
        //                     <Box display="flex" alignItems="center" gap="10px">
        //                         <>
        //                             <ButtonChip
        //                                 size="medium"
        //                                 disabled={row.status === 'accepted'}
        //                                 label="Approve"
        //                                 onClick={() => toggleApproveReject('approve', row.userSeqId)}
        //                             />
        //                             <ButtonChip
        //                                 size="medium"
        //                                 disabled={row.status === 'rejected' || row.status === 'accepted'}
        //                                 label="Reject"
        //                                 onClick={() => toggleApproveReject('reject', row.userSeqId)}
        //                             />
        //                         </>
        //                     </Box>
        //                 )
        //             }
        //         ]
        //         : []),
        //     {
        //         field: 'rejectReason',
        //         minWidth: 200,
        //         sortable: true,
        //         headerName: 'Rejected Reason',
        //         renderCell: ({ row }) => <Typography noWrap variant='body2' textTransform={'capitalize'} title={row?.rejectReason}>
        //             {row?.rejectReason ? row?.rejectReason : '-'}
        //         </Typography>
        //     },
        //     ...(hasDeletePermission
        //         ? [
        //             {
        //                 field: 'delete',
        //                 minWidth: 150,
        //                 sortable: true,
        //                 headerName: 'Delete User',
        //                 renderCell: ({ row }) =>
        //                     <IconButton size="small" color="secondary" onClick={(e) => {
        //                         toggleDelete(e, row);
        //                     }}>
        //                         <DeleteIcon />
        //                     </IconButton>
        //             }
        //         ]
        //         : []),

        // ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableOrganizationUser
