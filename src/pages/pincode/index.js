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
import DialogPinCode from 'src/views/dialog/DialogPinCode'
import DialogConfirmation from 'src/views/dialog/DialogConfirmation'
import TablePinCode from 'src/views/tables/TablePinCode'

const PincodePage = () => {
    const searchTimeoutRef = useRef()
    const [loading, setLoading] = useState(false)
    const [pinCodeData, setPinCodeData] = useState([])
    const [search, setSearch] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)

    const [pinCodeFormDialogOpen, setPinCodeFormDialogOpen] = useState(false)
    const [pinCodeFormDialogMode, setPinCodeFormDialogMode] = useState('add')
    const [pinCodeToEdit, setPinCodeToEdit] = useState(null)

    const togglePinCodeFormDialog = (e, mode = 'add', pinCodeToEdit = null) => {
        setPinCodeFormDialogOpen(prev => !prev)
        setPinCodeFormDialogMode(mode)
        setPinCodeToEdit(pinCodeToEdit)
    }

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
    const [pincodeToDelete, setPincodeToDelete] = useState(null)

    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setPincodeToDelete(dataToDelete)
    }

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true)
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        }

        axiosInstance
            .get(ApiEndPoints.PINCODE.list, { params })
            .then(response => {
                setPinCodeData(response.data.data.pincodes)
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
    const onConfirmDeletePincode = useCallback(
        e => {
            e?.preventDefault()
            setConfirmationDialogLoading(true)
            axiosInstance
                .delete(ApiEndPoints.PINCODE.delete(pincodeToDelete.id))
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
        [pincodeToDelete, currentPage, pageSize]
    )
    return (
        <>
            <Grid container spacing={4} className='match-height'>
                <PageHeader
                    title={
                        <Typography variant='h5'>
                            <Translations text='Pin Code' />
                        </Typography>
                    }
                    action={
                        <Button variant='contained' onClick={togglePinCodeFormDialog}>
                            Add Pincode
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
                            <TablePinCode
                                search={search}
                                loading={loading}
                                rows={pinCodeData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={togglePinCodeFormDialog}
                                toggleDelete={toggleConfirmationDialog}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <DialogPinCode
                mode={pinCodeFormDialogMode}
                open={pinCodeFormDialogOpen}
                toggle={togglePinCodeFormDialog}
                dataToEdit={pinCodeToEdit}
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize
                    })
                }}
            />

            <DialogConfirmation
                loading={confirmationDialogLoading}
                title='Delete PinCode'
                subtitle='Are you sure you want to delete this PinCode?'
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmDeletePincode}
            />
        </>
    )
}

export default PincodePage
