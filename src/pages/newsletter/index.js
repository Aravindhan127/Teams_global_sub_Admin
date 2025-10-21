import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Translations from "src/layouts/components/Translations";
import PageHeader from "src/@core/components/page-header";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import { useNavigate } from "react-router-dom";

import { useAuth } from "src/hooks/useAuth";
import TableNewsLetter from "src/views/tables/TableNewsLetter";
import DialogNewsLetters from "src/views/dialog/DialogLounge";
import DialogConfirmation from "src/views/dialog/DialogConfirmation";

const NewsLetter = () => {
    const [loading, setLoading] = useState(false);
    const { rolePremission, isMasterAdmin } = useAuth()

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [newsLetterToDelete, setNewsLetterToDelete] = useState(null);

    const toggleConfirmationDialog = (e, newsLetterToDelete = null) => {
        setConfirmationDialogOpen((prev) => !prev);
        setNewsLetterToDelete(newsLetterToDelete);
    };
    //pagination
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);
    const navigate = useNavigate();
    // Testimonials for Newsletter
    const [newsletterData, setNewsletterData] = useState([])
    const [newsletterDialogOpen, setNewsletterDialogOpen] = useState(false);
    const [newsletterDialogMode, setNewsletterDialogMode] = useState("add");
    const [newsletterToEdit, setNewsletterToEdit] = useState(null);

    const [role, setRole] = useState([])
    const toggleNewsletterDialog = (e, mode = 'add', NewsletterToEdit = null) => {
        setNewsletterDialogOpen(prev => !prev);
        setNewsletterDialogMode(mode);
        setNewsletterToEdit(NewsletterToEdit);
    };
    const handleAddNewsLetter = () => {
        navigate('/add-newsletter', { state: { mode: 'add' } })
    }
    const fetchNewsLetterData = () => {
        setLoading(true);
        axiosInstance
            .get(ApiEndPoints?.NEWSLETTER?.list)
            .then((response) => {
                setNewsletterData(response?.data?.data?.newsLettersList);
                setTotalCount(response?.data.data.total)
                console.log("Newsletter response--------------------", response);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchNewsLetterData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
        });
    }, [currentPage, pageSize, search])

    const onConfirmDeleteNewsletter = useCallback(
        (e) => {
            e?.preventDefault();
            setConfirmationDialogLoading(true);
            axiosInstance
                .delete(ApiEndPoints.NEWSLETTER.delete(newsLetterToDelete?.id))
                .then((response) => response.data)
                .then((response) => {
                    fetchNewsLetterData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                        search: search,
                    });
                    toggleConfirmationDialog();
                    toastSuccess(response.message);
                    console.log("response", response);
                })
                .catch((error) => {
                    toastError(error);
                })
                .finally(() => {
                    setConfirmationDialogLoading(false);
                });
        },
        [currentPage, newsLetterToDelete, pageSize, search]
    );
    return (
        <Grid container spacing={4} className="match-height">
            <PageHeader
                // title={
                //     <Typography variant="h5">
                //         <Translations text="Newsletter" />
                //     </Typography>
                // }
                action={
                    (rolePremission?.permissions?.some(
                        item => item.permissionName === 'newsLetters.add'
                    ) || isMasterAdmin === true) ? (
                        <Button variant="contained"
                            onClick={handleAddNewsLetter}
                        >
                            Add Newsletter
                        </Button>
                    ) : null
                }

            />
            <Grid item xs={12}>
                <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
                    <Box
                        sx={{
                            p: 5,
                            pb: 0,
                            display: "flex",
                            flexWrap: "wrap",
                            alignItems: "center",
                            justifyContent: "space-between",
                        }}
                    >
                    </Box>
                    <Box>
                        <Box sx={{ p: 5 }}>
                            <TableNewsLetter
                                search={search}
                                loading={loading}
                                rows={newsletterData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={toggleNewsletterDialog}
                                rolePremission={rolePremission}
                                isMasterAdmin={isMasterAdmin}
                                toggleDelete={toggleConfirmationDialog}
                            />
                        </Box>

                    </Box>
                </Card>
            </Grid>
            <DialogNewsLetters
                open={newsletterDialogOpen}
                toggle={toggleNewsletterDialog}
                mode={newsletterDialogMode}
                dataToEdit={newsletterToEdit}
                role={role}
                onSuccess={() => {
                    fetchNewsLetterData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />

            <DialogConfirmation
                loading={confirmationDialogLoading}
                title="Delete Newsletter"
                subtitle="Are you sure you want to delete this Newsletter?"
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmDeleteNewsletter}
            />
        </Grid>


    )
}
export default NewsLetter