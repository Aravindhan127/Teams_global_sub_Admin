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
import DialogConfirmation from "src/views/dialog/DialogConfirmation";
import { useNavigate } from "react-router-dom";
import DialogStatus from "src/views/dialog/DialogStatus";
import DialogChapter from "src/views/dialog/DialogChapter";
import TableChapter from "src/views/tables/TableChapter";
import { useAuth } from "src/hooks/useAuth";


const Chapter = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const { rolePremission, isMasterAdmin } = useAuth()

    // status dialog
    const [statusDialogOpen, setStatusDialogOpen] = useState(false);
    const [statusToUpdate, setStatusToUpdate] = useState(null);

    // const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
    //     setStatusDialogOpen((prev) => !prev);
    //     setStatusToUpdate(statusToUpdate);
    // };

    const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
        e.preventDefault(); // Prevents default behavior if called from a button

        if (!statusToUpdate) return; // Ensure statusToUpdate is provided

        let payload = {
            chapterId: statusToUpdate?.chapterId,
        };
        setLoading(true);
        axiosInstance
            .post(ApiEndPoints.CHAPTER.active_deactive(statusToUpdate?.chapterId), payload)
            .then((response) => {
                toastSuccess(response.data.message);
                fetchChapterData({
                    currentPage: currentPage,
                    pageSize: pageSize,
                    search: search,
                });
            })
            .finally(() => {
                setLoading(false);
            });
    };
    //pagination
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [chapterToDelete, setChapterToDelete] = useState(null);

    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        setConfirmationDialogOpen((prev) => !prev);
        setChapterToDelete(dataToDelete);
    };

    // Testimonials for chapter
    const [chapterData, setChapterData] = useState([])
    const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
    const [chapterDialogMode, setChapterDialogMode] = useState("add");
    const [chapterToEdit, setChapterToEdit] = useState(null);

    const [role, setRole] = useState([])
    const toggleChapterDialog = (e, mode = 'add', chapterToEdit = null) => {
        setChapterDialogOpen(prev => !prev);
        setChapterDialogMode(mode);
        setChapterToEdit(chapterToEdit);
    };

    const fetchChapterData = () => {
        setLoading(true);
        axiosInstance
            .get(ApiEndPoints?.CHAPTER?.get)
            .then((response) => {
                setChapterData(response?.data?.data?.chapters);
                setTotalCount(response?.data.total)
                console.log("chapter response--------------------", response?.data?.data?.chapters);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchChapterData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
        });
    }, [currentPage, pageSize, search])

    const onConfirmChapterDetail = useCallback(
        (e) => {
            e?.preventDefault();
            setConfirmationDialogLoading(true);
            axiosInstance
                .delete(ApiEndPoints.CHAPTER.delete(chapterToDelete?.chapterId))
                .then((response) => response.data)
                .then((response) => {
                    fetchChapterData({
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
        [currentPage, chapterToDelete, pageSize, search]
    );
    return (
        <>
            <Grid container spacing={4} className="match-height">
                <PageHeader
                    // title={
                    //     <Typography variant="h5">
                    //         <Translations text="Chapter" />
                    //     </Typography>
                    // }
                    action=
                    {
                        (rolePremission?.permissions?.some(
                            item => item.permissionName === 'orgChapter.create'
                        ) || isMasterAdmin === true) ? (
                            <Button variant="contained"
                                onClick={toggleChapterDialog}
                            >
                                Add chapter
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
                            <Box></Box>
                        </Box>
                        <Box>
                            <Box sx={{ p: 5 }}>
                                <TableChapter
                                    search={search}
                                    loading={loading}
                                    rows={chapterData}
                                    totalCount={totalCount}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    setPageSize={setPageSize}
                                    pageSize={pageSize}
                                    toggleEdit={toggleChapterDialog}
                                    toggleStatus={toggleChangeStatusDialog}
                                    rolePremission={rolePremission}
                                    isMasterAdmin={isMasterAdmin}
                                    toggleDelete={toggleConfirmationDialog}
                                />
                            </Box>

                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <DialogChapter
                open={chapterDialogOpen}
                toggle={toggleChapterDialog}
                mode={chapterDialogMode}
                dataToEdit={chapterToEdit}
                role={role}
                onSuccess={() => {
                    fetchChapterData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />

            {/* <DialogStatus
                open={statusDialogOpen}
                toggle={toggleChangeStatusDialog}
                dataToEdit={statusToUpdate}
                type="chapter"
                onSuccess={() => {
                    fetchChapterData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            /> */}

            <DialogConfirmation
                loading={confirmationDialogLoading}
                title="Delete Chapter"
                subtitle="Are you sure you want to delete this Chapter"
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmChapterDetail}
            />

        </>
    )
}
export default Chapter