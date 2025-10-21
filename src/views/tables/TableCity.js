import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'

function TableCity({
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
        loading={loading}
        rowCount={totalCount}
        rows={rows}
        columns={[
            {
                field: 'country',
                minWidth: 200,
                sortable: false,
                headerName: 'Country',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.country}>
                    {row.country}
                </Typography>
            },
            {
                field: 'city',
                minWidth: 200,
                sortable: false,
                headerName: 'City',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.city}>
                    {row.city}
                </Typography>
            },
            {
                field: 'currency',
                minWidth: 200,
                sortable: false,
                headerName: 'Currency',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.currency}>
                    {row.currency}
                </Typography>
            },
            {
                field: 'code',
                flex: 0.5,
                minWidth: 250,
                sortable: false,
                headerName: 'Code',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.code}>
                    {row.code}
                </Typography>
            },
            {
                field: 'symbol',
                flex: 0.5,
                minWidth: 250,
                sortable: false,
                headerName: 'Symbol',
                renderCell: ({ row }) => <p dangerouslySetInnerHTML={{ __html: row?.symbol || '' }} />
                //  <Typography noWrap variant='body2' title={row.symbol}>
                //     {row.symbol}
                // </Typography>
            },
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
            {
                field: 'status',
                flex: 0,
                minWidth: 180,
                sortable: false,
                headerName: 'Status',
                renderCell: ({ row }) => <CustomChip label={row?.status} />
            },
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

export default TableCity
