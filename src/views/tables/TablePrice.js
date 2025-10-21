import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { useNavigate } from "react-router-dom";

function TablePrice({
    rows,
    totalCount,
    setCurrentPage,
    currentPage,
    setPageSize,
    pageSize,
    loading,
    toggleEdit,
    toggleDelete,
}) {
    const navigate = useNavigate();
    const handleCellClick = ({ row, field }) => {
        if (field !== 'Actions') {
            let id = row._id;
            navigate(`/price-management/${id}`);
        }
        // You can add more logic for other fields if needed
    };
    const statusColors = {
        inactive: '#FFB400',
        active: '#66bb6a'
    }
    const CustomChip = styled(Chip)(({ label }) => ({
        backgroundColor: statusColors[label] || statusColors.default,
        textTransform: 'capitalize',
        color: '#fff',
        width: '100px'
    }))
    return <CustomDataGrid
        handleCellClick={handleCellClick}
        loading={loading}
        rowCount={totalCount}
        rows={rows}
        columns={[
            {
                field: 'name',
                minWidth: 200,
                sortable: false,
                headerName: 'Name',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.vehicleType?.name}>
                    {row?.vehicleType?.name}
                </Typography>
            },
            {
                field: 'currency',
                minWidth: 200,
                sortable: false,
                headerName: 'Currency',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.city?.currency}>
                    {/* {row?.city?.map(item => item.currency).join(', ')} */}
                    {row?.currency}
                </Typography>
            },
            {
                field: 'country',
                flex: 0.5,
                minWidth: 250,
                sortable: false,
                headerName: 'Country',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.city?.country}>
                    {/* {row?.city?.map(item => item.country).join(', ')} */}
                    {row?.country}
                </Typography>
            },
            {
                field: 'state',
                flex: 0.5,
                minWidth: 250,
                sortable: false,
                headerName: 'State',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.city?.state}>
                    {/* {row?.city?.map(item => item.state).join(', ')} */}
                    {row?.state}
                </Typography>
            },
            {
                field: 'city',
                flex: 0.5,
                minWidth: 250,
                sortable: false,
                headerName: 'City',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.city?.city}>
                    {row?.city?.map(item => item.city).join(', ')}
                </Typography>
            },
            {
                field: 'status',
                minWidth: 180,
                sortable: false,
                headerName: 'Status',
                renderCell: ({ row }) => <CustomChip label={row.status} />
            },
            // {
            //     field: 'currencySymbol',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'CurrencySymbol',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.currencySymbol}>
            //         {row.currencySymbol}
            //     </Typography>
            // },
            // {
            //     field: 'pricePerKg',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'Price PerKg',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.pricePerKg}>
            //         {row.pricePerKg}
            //     </Typography>
            // },
            // {
            //     field: 'pricePerKm',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'Price PerKm',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.pricePerKm}>
            //         {row.pricePerKm}
            //     </Typography>
            // },
            // {
            //     field: 'pricePerMin',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'Price PerMin',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.pricePerMin}>
            //         {row.pricePerMin}
            //     </Typography>
            // },
            // {
            //     field: 'minimumFareUSD',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'Minimum FareUSD',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.minimumFareUSD}>
            //         {row.minimumFareUSD}
            //     </Typography>
            // },
            // {
            //     field: 'baseFareUSD',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'Base FareUSD',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.baseFareUSD}>
            //         {row.baseFareUSD}
            //     </Typography>
            // },
            // {
            //     field: 'commissionPercentage',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'Commission Percentage',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.commissionPercentage}>
            //         {row.commissionPercentage}
            //     </Typography>
            // },
            // {
            //     field: 'userCancellationTimeLimit',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'User CancellationTimeLimit',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.userCancellationTimeLimit}>
            //         {row.userCancellationTimeLimit}
            //     </Typography>
            // },
            // {
            //     field: 'userCancellationCharges',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'User CancellationCharges',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.userCancellationCharges}>
            //         {row.userCancellationCharges}
            //     </Typography>
            // },
            // {
            //     field: 'waitingTimeLimit',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'Waiting TimeLimit',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.waitingTimeLimit}>
            //         {row.waitingTimeLimit}
            //     </Typography>
            // },
            // {
            //     field: 'waitingChargesUSD',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'Waiting ChargesUSD',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.waitingChargesUSD}>
            //         {row.waitingChargesUSD}
            //     </Typography>
            // },
            // {
            //     field: 'nightCharges',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'nightCharges',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.nightCharges}>
            //         {row.nightCharges ? 'Yes' : 'No'}
            //     </Typography>
            // },
            // {
            //     field: 'priceNightCharges',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'Price NightCharges',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.priceNightCharges}>
            //         {row.priceNightCharges}
            //     </Typography>
            // },
            // {
            //     field: 'expressCharge',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'ExpressCharge',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.expressCharge}>
            //         {row.expressCharge}
            //     </Typography>
            // },
            // {
            //     field: 'updatedAt',
            //     flex: 0.5,
            //     minWidth: 250,
            //     sortable: false,
            //     headerName: 'UpdatedAt',
            //     renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.updatedAt}>
            //         {moment(row.updatedAt).format('DD-MM-YYYY')}
            //     </Typography>
            // },
            // {
            //     field: 'status',
            //     flex: 0,
            //     minWidth: 180,
            //     sortable: false,
            //     headerName: 'Status',
            //     renderCell: ({ row }) => <CustomChip label={row.status} />
            // },
            {
                field: 'Actions',
                flex: 0.5,
                minWidth: 170,
                sortable: false,
                headerName: 'Actions',
                renderCell: ({ row }) => <Box display='flex' alignItems='center' gap='10px'>
                    <IconButton size="small" color="primary" variant="outlined" onClick={(e) => toggleEdit(e, "edit", row)}>
                        <EditIcon />
                    </IconButton>
                    <IconButton size="small" color="secondary" onClick={(e) => toggleDelete(e, row)}>
                        <DeleteIcon />
                    </IconButton>
                </Box>
            }
        ]}
        currentPage={currentPage}
        pageSize={pageSize}
        setCurrentPage={setCurrentPage}
        setPageSize={setPageSize}
    />

}

export default TablePrice
