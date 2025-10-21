import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'

function TableSizeChart({
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
                field: 'size',
                flex: 0.5,
                minWidth: 250,
                sortable: false,
                headerName: 'Size',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.size}>
                    {row.size}
                </Typography>
            },
            {
                field: 'dimensions',
                flex: 0.5,
                minWidth: 300,
                sortable: false,
                headerName: 'Length',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.dimensions.length}>
                    {row.dimensions.length}
                </Typography>
            },
            {
                field: 'height',
                flex: 0.5,
                minWidth: 300,
                sortable: false,
                headerName: 'Height',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.dimensions.height}>
                    {row.dimensions.height}
                </Typography>
            },
            {
                field: 'width',
                flex: 0.5,
                minWidth: 300,
                sortable: false,
                headerName: 'Width',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.dimensions.width}>
                    {row.dimensions.width}
                </Typography>
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

export default TableSizeChart
