import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import moment from "moment";

function TableHelps({
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
                field: 'title',
                flex: 0,
                minWidth: 350,
                sortable: false,
                headerName: 'Title',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.title}>
                    {row.title}
                </Typography>
            },
            {
                field: 'subTitle',
                minWidth: 500,
                sortable: false,
                headerName: 'SubTitle',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.subTitle}>
                    {row.subTitle}
                </Typography>
            },
            {
                field: 'updatedAt',
                minWidth: 200,
                flex: 0.5,
                sortable: false,
                headerName: 'Posted Date',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.updatedAt}>
                    {moment(row.updatedAt).format('DD-MM-YYYY HH:MM')}
                </Typography>
            },
            {
                field: 'status',
                minWidth: 180,
                sortable: false,
                headerName: 'Status',
                renderCell: ({ row }) => <CustomChip label={row.status} />
            },
            {
                field: 'Actions',
                flex: 0,
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

export default TableHelps
