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
import DialogSocial from 'src/views/dialog/DialogSocial'
import TableSocialMedia from 'src/views/tables/TableSocialMedia'

const SocialMediaPage = () => {
    const searchTimeoutRef = useRef()
    const [loading, setLoading] = useState(false)
    const [faqData, setFaqData] = useState([])
    const [search, setSearch] = useState('')
    const [totalCount, setTotalCount] = useState(0)
    const [currentPage, setCurrentPage] = useState(1)
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
    const [faqFormDialogOpen, setFaqFormDialogOpen] = useState(false)
    const [faqFormDialogMode, setFaqFormDialogMode] = useState('add')
    const [faqToEdit, setFaqToEdit] = useState(null)

    const toggleFaqFormDialog = (e, mode = 'add', faqToEdit = null) => {
        setFaqFormDialogOpen(prev => !prev)
        setFaqFormDialogMode(mode)
        setFaqToEdit(faqToEdit)
    }



    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true)
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        }
        axiosInstance
            .get(ApiEndPoints.FOOTER.list, { params })
            .then(response => {
                setFaqData(response.data.data.category)
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

    return (
        <>
            <Grid container spacing={4} className='match-height'>
                <PageHeader
                    title={
                        <Typography variant='h5'>
                            <Translations text='Social Media' />
                        </Typography>
                    }
                // action={
                //     <Button variant='contained' onClick={toggleFaqFormDialog}>
                //         Add Social Media
                //     </Button>
                // }
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
                            <TableSocialMedia
                                search={search}
                                loading={loading}
                                rows={faqData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={toggleFaqFormDialog}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>
            <DialogSocial
                mode={faqFormDialogMode}
                open={faqFormDialogOpen}
                toggle={toggleFaqFormDialog}
                dataToEdit={faqToEdit}
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize
                    })
                }}
            />
        </>
    )
}

export default SocialMediaPage
