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
import TableFeedbackCategory from 'src/views/tables/TableFeedBackCategory'
import DialogfeedbackCategory from 'src/views/dialog/DialogfeedbackCategory'

const FeedBackCategory = () => {
    const searchTimeoutRef = useRef()
    const [loading, setLoading] = useState(false)
    const [careerData, setcareerData] = useState([])
    const [search, setSearch] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
    const [feedbackFormDialogOpen, setFeedbackFormDialogOpen] = useState(false)
    const [feedbackFormDialogMode, setFeedbackDialogMode] = useState('add')
    const [feedbackToEdit, setFeedbackToEdit] = useState(null)

    const togglefeedbackFormDialog = (e, mode = 'add', blogToEdit = null) => {
        setFeedbackFormDialogOpen(prev => !prev)
        setFeedbackDialogMode(mode)
        setFeedbackToEdit(blogToEdit)
    }

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false)
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false)
    const [careerToDelete, setcareerToDelete] = useState(null)

    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen(prev => !prev)
        setcareerToDelete(dataToDelete)
    }

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true)
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        }
        axiosInstance
            .get(ApiEndPoints.FEEDBACK_CATEGORY.list, { params })
            .then(response => {
                setcareerData(response.data.data.category)
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
                .delete(ApiEndPoints.FEEDBACK_CATEGORY.delete(careerToDelete._id))
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
        [careerToDelete, currentPage, pageSize]
    )
    return (
        <>
            <Grid container spacing={4} className='match-height'>
                <PageHeader
                    title={
                        <Typography variant='h5'>
                            <Translations text='Feedback Category' />
                        </Typography>
                    }
                    action={
                        <Button variant='contained' onClick={togglefeedbackFormDialog}>
                            Add Feedback Category
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
                            <TableFeedbackCategory
                                search={search}
                                loading={loading}
                                rows={careerData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={togglefeedbackFormDialog}
                                toggleDelete={toggleConfirmationDialog}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <DialogfeedbackCategory
                mode={feedbackFormDialogMode}
                open={feedbackFormDialogOpen}
                toggle={togglefeedbackFormDialog}
                dataToEdit={feedbackToEdit}
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize
                    })
                }}
            />
            <DialogConfirmation
                loading={confirmationDialogLoading}
                title='Delete Feedback Category'
                subtitle='Are you sure you want to delete this Feedback Category?'
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmDelete}
            />
        </>
    )
}

export default FeedBackCategory
