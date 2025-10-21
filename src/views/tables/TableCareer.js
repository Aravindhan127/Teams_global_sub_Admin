import Typography from "@mui/material/Typography";
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import CustomDataGrid from "src/@core/components/data-grid";
import Chip from '@mui/material/Chip'
import { styled } from '@mui/material/styles'
import { MEDIA_URL } from "src/network/endpoints";
import moment from "moment";

function TableCareer({
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
                field: 'role',
                minWidth: 250,
                sortable: false,
                headerName: 'Roles',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.role}>
                    {row.role}
                </Typography>
            },
            {
                field: 'description',
                minWidth: 400,
                sortable: false,
                headerName: 'Description',
                renderCell: ({ row }) =>
                    <Typography noWrap variant='body2' title={row.description}>
                        <div className="blog_____content" dangerouslySetInnerHTML={{
                            __html: (row.description)
                        }} />
                    </Typography>
            },
            {
                field: 'location',
                minWidth: 200,
                sortable: false,
                headerName: 'Location',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.location}>
                    {row.location}
                </Typography>
            },
            {
                field: 'category',
                minWidth: 300,
                sortable: false,
                headerName: 'Category',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row?.category?.name}>
                    {row?.category?.name}
                </Typography>
            },
            {
                field: 'postedDate',
                minWidth: 200,
                flex: 0.5,
                sortable: false,
                headerName: 'Posted Date',
                renderCell: ({ row }) => <Typography noWrap variant='body2' title={row.postedDate}>
                    {moment(row.postedDate).format('DD-MM-YYYY HH:MM')}
                </Typography>
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

export default TableCareer
