import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import { useNavigate } from "react-router-dom";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { Avatar, Button } from "@mui/material";
import DeleteIcon from '@mui/icons-material/Delete';
import moment from "moment";
import VisibilityIcon from '@mui/icons-material/Visibility';

function TableEvent({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    rolePremission,
    isMasterAdmin,
    toggleStatus,
    toggleDelete,
}) {
    const statusColors = {
        Active: '#8bc34a',
        Inactive: '#FFB400',
    }
    const CustomChip = styled(Chip)(({ label }) => ({
        backgroundColor: statusColors[label] || statusColors.default,
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px'
    }))
    const navigate = useNavigate();
    const handleCellClick = ({ row, field }) => {
        if (field !== 'Actions' && field !== 'status') {
            navigate(`/event-detail/${row?.eventId}`);
        }
    };
    const mappedRows = rows.map((row, index) => ({
        ...row,
        id: row.eventId, // Add `id` for compatibility with CustomDataGrid
        index: index + 1,
    }));
    console.log("rows", rows)

    const hasEditPermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'newsLetters.edit') || isMasterAdmin === true;

    const hasDeletePermission =
        rolePremission?.permissions?.some(item => item.permissionName === 'newsLetters.delete') || isMasterAdmin === true;

    return <CustomDataGrid
        handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={mappedRows}
        getRowId={(row) => row.id}
        columns={[
            {
                field: 'id',
                minWidth: 70,
                flex: 0.1,
                sortable: true,
                headerName: 'ID',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.index}>
                    {row?.index}
                </Typography>
            },
            {
                field: 'name',
                minWidth: 300,
                flex: 0.1,
                sortable: true,
                headerName: 'Event Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.name}>
                    {row?.name}
                </Typography>
            },
            // {
            //     field: 'description',
            //     minWidth: 150,
            //     flex: 0.1,
            //     sortable: true,
            //     headerName: 'Description',
            //     renderCell: ({ row }) => {
            //         return (
            //             <Typography
            //                 noWrap
            //                 variant="body2"
            //             >
            //                 {row.description}
            //             </Typography>


            //         );
            //     }
            // },

            {
                field: 'startDate',
                flex: 0.5,
                minWidth: 130,
                sortable: false,
                headerName: 'Start Date',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.startDate}>
                    {moment(row.startDate).format('DD-MM-YYYY')}
                </Typography>
            },
            {
                field: 'endDate',
                flex: 0.5,
                minWidth: 130,
                sortable: false,
                headerName: 'End Date',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.endDate}>
                    {moment(row.endDate).format('DD-MM-YYYY')}
                </Typography>
            },

            // {
            //     field: 'address',
            //     minWidth: 150,
            //     flex: 0.1,
            //     sortable: true,
            //     headerName: 'address',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.address}>
            //         {row?.address || '-'}
            //     </Typography>
            // },
            // {
            //     field: 'country',
            //     minWidth: 150,
            //     flex: 0.1,
            //     sortable: true,
            //     headerName: 'Country',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.country}>
            //         {row?.country || '-'}
            //     </Typography>
            // },
            // {
            //     field: 'state',
            //     minWidth: 150,
            //     flex: 0.1,
            //     sortable: true,
            //     headerName: 'State',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.state}>
            //         {row?.state || '-'}
            //     </Typography>
            // },
            {
                field: 'city',
                minWidth: 180,
                flex: 0.1,
                sortable: true,
                headerName: 'City',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.city}>
                    {row?.city || '-'}
                </Typography>
            },
            // {
            //     field: 'promoCode',
            //     minWidth: 150,
            //     flex: 0.1,
            //     sortable: true,
            //     headerName: 'Promo Code',
            //     renderCell: ({ row }) => {
            //         const promoCode = row?.promoCode && row.promoCode !== "undefined" ? row.promoCode : "N/A";

            //         return (
            //             <Typography noWrap variant='body2' title={promoCode}>
            //                 {promoCode}
            //             </Typography>
            //         );
            //     }
            // },

            {
                field: 'maxParticipants',
                minWidth: 110,
                flex: 0.1,
                sortable: true,
                headerName: 'Total Guest',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.maxParticipants}>
                    {row?.maxParticipants}
                </Typography>
            },
            // {
            //     field: 'discountValue',
            //     minWidth: 150,
            //     flex: 0.1,
            //     sortable: true,
            //     headerName: 'Discount value',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.discountValue}>
            //         {row?.discountValue}
            //     </Typography>
            // },
            // {
            //     field: 'eventImage',
            //     minWidth: 150,
            //     flex: 0.1,
            //     headerAlign: "center",
            //     align: "center",
            //     sortable: true,
            //     headerName: 'Event Image',
            //     renderCell: ({ row }) =>
            //         <Avatar src={row?.eventImage} />

            // },
            // {
            //     field: 'organizeBy',
            //     minWidth: 150,
            //     flex: 0.1,
            //     sortable: true,
            //     headerName: 'Organized By',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.organizeBy}>
            //         {row?.organizeBy || '-'}
            //     </Typography>
            // },

            {
                field: 'createdAt',
                flex: 0.5,
                minWidth: 130,
                sortable: false,
                headerName: 'Created Date',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.createdAt}>
                    {moment(row.createdAt).format('DD-MM-YYYY')}
                </Typography>
            },
            // {
            //     field: 'expireDate',
            //     flex: 0.5,
            //     minWidth: 200,
            //     sortable: false,
            //     headerName: 'Expire Date',
            //     renderCell: ({ row }) => (
            //         <Typography noWrap variant='body2' title={row.expireDate || 'No Expiry Date'}>
            //             {row.expireDate ? moment(row.expireDate).format('DD-MM-YYYY') : 'N/A'}
            //         </Typography>
            //     )
            // },

            ...(hasEditPermission || hasDeletePermission
                ? [
                    {
                        field: 'Actions',
                        flex: 0,
                        minWidth: 350,
                        sortable: true,
                        align: 'center',
                        headerAlign: 'center',
                        headerName: 'Actions',
                        renderCell: ({ row }) => (
                            <Box display="flex" alignItems="center" gap="10px">
                                {hasEditPermission && (
                                    <IconButton size="small" color="primary" variant="outlined" onClick={(e) => navigate('/create-event', { state: { mode: 'edit', dataToEdit: row } })}>
                                        <EditIcon />
                                    </IconButton>
                                )}
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    startIcon={<VisibilityIcon />}
                                    onClick={(e) => navigate(`/view-guest/${row.eventId}`, { state: { mode: 'edit', dataToEdit: row } })}
                                >
                                    View Attendees
                                </Button>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    size="small"
                                    onClick={(e) =>
                                        navigate(`/guest-form/${row.eventId}`, {
                                            state: { eventName: row.name },
                                        })
                                    }
                                >
                                    Add Guest
                                </Button>


                                {/* {hasDeletePermission && (
                                    <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row)}>
                                        <DeleteIcon />
                                    </IconButton>
                                )} */}
                            </Box>
                        )
                    }
                ]
                : []),
            {
                field: 'isEventAllTicketSold',
                flex: 0.5,
                minWidth: 200,
                sortable: false,
                headerName: 'Ticket Availability',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.isEventAllTicketSold}>
                    <Chip
                        label={row.isEventAllTicketSold === true ? "Sold Out" : "Available"}
                        sx={{
                            fontSize: "14px",
                            fontWeight: 500,
                            lineHeight: "14px",
                            color:
                                row?.isEventAllTicketSold === false
                                    ? "#009727"
                                    : "#FF0000",
                            backgroundColor:
                                row?.isEventAllTicketSold === false
                                    ? "#ECF8F4"
                                    : "#FEF3F2",
                        }}
                    />
                </Typography>
            },

        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TableEvent
