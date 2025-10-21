import { useEffect, useState, useRef, useCallback } from 'react'
import { Button, Grid, Typography } from '@mui/material'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import PageHeader from 'src/@core/components/page-header'
import Translations from 'src/layouts/components/Translations'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { DefaultPaginationSettings } from 'src/constants/general.const'
import { toastError, toastSuccess } from 'src/utils/utils'
import DialogConfirmation from 'src/views/dialog/DialogConfirmation'
import TableFeedback from 'src/views/tables/Tablefeedback'
import Dialogfeedback from 'src/views/dialog/Dialogfeedback'
import TableCoupons from 'src/views/tables/TableCoupons'
import Dialogcoupons from 'src/views/dialog/Dialogcoupons'

const CouponsPage = () => {
    const searchTimeoutRef = useRef()
    const [loading, setLoading] = useState(false)
    const [careerData, setcareerData] = useState([])
    const [search, setSearch] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
    const [couponsFormDialogOpen, setCouponsFormDialogOpen] = useState(false)
    const [couponsFormDialogMode, setCouponsDialogMode] = useState('add')
    const [couponsToEdit, setCouponsToEdit] = useState(null)

    const togglecouponsFormDialog = (e, mode = 'add', couponsToEdit = null) => {
        setCouponsFormDialogOpen(prev => !prev)
        setCouponsDialogMode(mode)
        setCouponsToEdit(couponsToEdit)
    }

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
    const [couponsToDelete, setcCouponsToDelete] = useState(null)

    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setcCouponsToDelete(dataToDelete)
    }

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true)
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        }
        axiosInstance
            .get(ApiEndPoints.COUPONS.list, { params })
            .then(response => {
                setcareerData(response.data.data.coupon)
                setTotalCount(response.data.data.totalCount)
            })
            .catch(error => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    useEffect(() => {
        fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search
        })
    }, [currentPage, pageSize, search])

    const handleSearchChange = e => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current)
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value)
        }, 500)
    }
    const onConfirmDelete = useCallback(
        e => {
            e?.preventDefault()
            setConfirmationDialogLoading(true)
            axiosInstance
                .delete(ApiEndPoints.COUPONS.delete(couponsToDelete._id))
                .then(response => response.data)
                .then(response => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize
                    })
                    toggleConfirmationDialog()
                    toastSuccess(response.message)
                })
                .catch(error => {
                    toastError(error)
                })
                .finally(() => {
                    setConfirmationDialogLoading(false)
                })
        },
        [couponsToDelete, currentPage, pageSize]
    )
    return (
        <>
            <Grid container spacing={4} className='match-height'>
                <PageHeader
                    title={
                        <Typography variant='h5'>
                            <Translations text='Coupons' />
                        </Typography>
                    }
                    action={
                        <Button variant='contained' onClick={togglecouponsFormDialog}>
                            Add Coupons
                        </Button>
                    }
                />
                <Grid item xs={12}>
                    <Card>
                        <Box
                            sx={{
                                p: 5,
                                pb: 0,
                                display: 'flex',
                                flexWrap: 'wrap',
                                alignItems: 'center',
                                justifyContent: 'space-between'
                            }}
                        >
                            <Box></Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                                <TextField type='search' size='small' placeholder='Search' onChange={handleSearchChange} />
                            </Box>
                        </Box>
                        <Box sx={{ p: 5 }}>
                            <TableCoupons
                                search={search}
                                loading={loading}
                                rows={careerData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={togglecouponsFormDialog}
                                toggleDelete={toggleConfirmationDialog}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <Dialogcoupons
                mode={couponsFormDialogMode}
                open={couponsFormDialogOpen}
                toggle={togglecouponsFormDialog}
                dataToEdit={couponsToEdit}
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize
                    })
                }}
            />
            <DialogConfirmation
                loading={confirmationDialogLoading}
                title='Delete Coupons'
                subtitle='Are you sure you want to delete this Coupons?'
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmDelete}
            />
        </>
    )
}

export default CouponsPage
