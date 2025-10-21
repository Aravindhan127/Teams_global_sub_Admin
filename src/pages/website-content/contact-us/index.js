import { useEffect, useState, useRef } from "react"
import { Grid, Typography } from "@mui/material"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import PageHeader from "src/@core/components/page-header"
import Translations from "src/layouts/components/Translations"
import { axiosInstance } from "src/network/adapter"
import { ApiEndPoints } from "src/network/endpoints"
import { DefaultPaginationSettings } from "src/constants/general.const"
import { toastError } from "src/utils/utils"
import TableContactUs from "src/views/tables/TableContactUs"
import DialogContact from "src/views/dialog/DialogContact"
import DialogViewContactInfo from "src/views/dialog/DialogViewContactInfo"

const ContactUsPage = () => {

    const searchTimeoutRef = useRef();

    const [loading, setLoading] = useState(false);

    const [contactData, setContactData] = useState([]);
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    const [contactFormDialogOpen, setContactFormDialogOpen] = useState(false)
    const [contactViewFormDialogOpen, setContactViewFormDialogOpen] = useState(false)
    const [contactToEdit, setContactToEdit] = useState(null)

    const toggleContactFormDialog = (e, contactToEdit = null) => {
        setContactFormDialogOpen(prev => !prev)
        setContactToEdit(contactToEdit)
    }

    const toggleContactViewFormDialog = (e, contactToEdit = null) => {
        setContactViewFormDialogOpen(prev => !prev)
        setContactToEdit(contactToEdit)
    }

    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        };

        axiosInstance
            .get(ApiEndPoints.ContactUs.list, { params })
            .then((response) => {
                setContactData(response.data.data.contactus)
                setTotalCount(response.data.data.totalCount)
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });

    };

    useEffect(() => {
        fetchData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
        });
    }, [currentPage, pageSize, search])

    const handleSearchChange = (e) => {
        if (searchTimeoutRef.current) {
            clearTimeout(searchTimeoutRef.current);
        }

        searchTimeoutRef.current = setTimeout(() => {
            setSearch(e.target.value);
        }, 500)
    }
    return <>
        <Grid container spacing={4} className="match-height">
            <PageHeader
                title={
                    <Typography variant="h5">
                        <Translations text="ContactUs" />
                    </Typography>
                }
            />
            <Grid item xs={12}>
                <Card>
                    <Box sx={{ p: 5, pb: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box></Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center' }}>
                            <TextField
                                type="search"
                                size='small'
                                placeholder='Search'
                                onChange={handleSearchChange}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ p: 5 }}>
                        <TableContactUs
                            search={search}
                            loading={loading}
                            rows={contactData}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                            toggleEdit={toggleContactFormDialog}
                            toggleView={toggleContactViewFormDialog}
                        />
                    </Box>
                </Card>
            </Grid>
        </Grid>
        <DialogContact
            open={contactFormDialogOpen}
            toggle={toggleContactFormDialog}
            dataToEdit={contactToEdit}
            onSuccess={() => {
                fetchData({
                    currentPage: currentPage,
                    pageSize: pageSize
                })
            }}
        />
        <DialogViewContactInfo
            open={contactViewFormDialogOpen}
            toggle={toggleContactViewFormDialog}
            dataToEdit={contactToEdit}
        />
    </>
}

export default ContactUsPage