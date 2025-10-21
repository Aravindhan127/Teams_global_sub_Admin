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
import TableCareer from 'src/views/tables/TableCareer'
import Dialogcareer from 'src/views/dialog/Dialogcareer'

const CareerPage = () => {
    const searchTimeoutRef = useRef()
    const [loading, setLoading] = useState(false)
    const [careerData, setcareerData] = useState([])
    const [search, setSearch] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
    const [careerFormDialogOpen, setCareerFormDialogOpen] = useState(false)
    const [careerFormDialogMode, setCareerFormDialogMode] = useState('add')
    const [careerToEdit, setCareerToEdit] = useState(null)

    const togglecareerFormDialog = (e, mode = 'add', careerToEdit = null) => {
        setCareerFormDialogOpen(prev => !prev)
        setCareerFormDialogMode(mode)
        setCareerToEdit(careerToEdit)
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
            .get(ApiEndPoints.CAREER_SECTION.list, { params })
            .then(response => {
                setcareerData(response.data.data.careers)
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
                .delete(ApiEndPoints.CAREER_SECTION.delete(careerToDelete._id))
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
                            <Translations text='Career Section' />
                        </Typography>
                    }
                    action={
                        <Button variant='contained' onClick={togglecareerFormDialog}>
                            Add Job Post
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
                            <TableCareer
                                search={search}
                                loading={loading}
                                rows={careerData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={togglecareerFormDialog}
                                toggleDelete={toggleConfirmationDialog}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <Dialogcareer
                mode={careerFormDialogMode}
                open={careerFormDialogOpen}
                toggle={togglecareerFormDialog}
                dataToEdit={careerToEdit}
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize
                    })
                }}
            />
            <DialogConfirmation
                loading={confirmationDialogLoading}
                title='Delete Career'
                subtitle='Are you sure you want to delete this Career?'
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmDelete}
            />
        </>
    )
}

export default CareerPage
