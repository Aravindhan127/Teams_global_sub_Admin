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
import { useAuth } from "src/hooks/useAuth";
import TableCategory from "src/views/tables/TableCategory";
import DialogCategory from "src/views/dialog/DialogCategory";


const EventCategory = () => {
    const navigate = useNavigate()
    const [loading, setLoading] = useState(false);
    const { rolePremission, isMasterAdmin } = useAuth()


    //pagination
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    // Confirmation
    const [confirmationDialogLoading, setConfirmationDialogLoading] = useState(false);
    const [confirmationDialogOpen, setConfirmationDialogOpen] = useState(false);
    const [categoryToDelete, setCategoryToDelete] = useState(null);
    const [type, setType] = useState('');

    const toggleConfirmationDialog = (e, dataToDelete = null) => {
        console.log("dataToDelete", dataToDelete)
        setConfirmationDialogOpen((prev) => !prev);
        setCategoryToDelete(dataToDelete);
    };

    // Testimonials for Category
    const [categoryData, setCategoryData] = useState([])
    const [categoryDialogOpen, setCategoryDialogOpen] = useState(false);
    const [categoryDialogMode, setCategoryDialogMode] = useState("add");
    const [categoryToEdit, setCategoryToEdit] = useState(null);

    const toggleCategoryDialog = (e, mode = 'add', CategoryToEdit = null) => {
        setCategoryDialogOpen(prev => !prev);
        setCategoryDialogMode(mode);
        setCategoryToEdit(CategoryToEdit);
    };

    const fetchCategoryData = () => {
        setLoading(true);
        axiosInstance
            .get(ApiEndPoints?.EVENT_CATEGORY?.list)
            .then((response) => {
                setCategoryData(response?.data?.data?.eventCategoryList);
                setTotalCount(response?.data.total)
                console.log("Category response--------------------", response?.data?.data?.eventCategoryList);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchCategoryData({
            currentPage: currentPage,
            pageSize: pageSize,
            search: search,
        });
    }, [currentPage, pageSize, search])

    const onConfirmCategoryDelete = useCallback(
        (e) => {
            e?.preventDefault();
            setConfirmationDialogLoading(true);
            axiosInstance
                .delete(ApiEndPoints.EVENT_CATEGORY.delete(categoryToDelete?.categoryId))
                .then((response) => response.data)
                .then((response) => {
                    fetchCategoryData({
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
        [currentPage, categoryToDelete, pageSize, search]
    );
    return (
        <>
            <Grid container spacing={4} className="match-height">
                <PageHeader
                    // title={
                    //     <Typography variant="h5">
                    //         <Translations text="Category" />
                    //     </Typography>
                    // }
                    action=
                    {

                        (rolePremission?.permissions?.some(
                            item => item.permissionName === 'eventCat.create'
                        ) || isMasterAdmin === true) ? (
                            <Button variant="contained"
                                onClick={toggleCategoryDialog}
                            >
                                Add Category
                            </Button>
                        ) : null
                    }

                />
                <Grid item xs={12}>
                    <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
                        <Box sx={{ p: 5 }}>
                            <TableCategory
                                search={search}
                                loading={loading}
                                rows={categoryData}
                                totalCount={totalCount}
                                setCurrentPage={setCurrentPage}
                                currentPage={currentPage}
                                setPageSize={setPageSize}
                                pageSize={pageSize}
                                toggleEdit={toggleCategoryDialog}
                                rolePremission={rolePremission}
                                isMasterAdmin={isMasterAdmin}
                                toggleDelete={toggleConfirmationDialog}
                            />
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <DialogCategory
                open={categoryDialogOpen}
                toggle={toggleCategoryDialog}
                mode={categoryDialogMode}
                dataToEdit={categoryToEdit}
                onSuccess={() => {
                    fetchCategoryData({
                        currentPage: currentPage,
                        pageSize: pageSize,
                    });
                }}
            />


            <DialogConfirmation
                loading={confirmationDialogLoading}
                title="Delete Category"
                subtitle="Are you sure you want to delete this Category"
                open={confirmationDialogOpen}
                toggle={toggleConfirmationDialog}
                onConfirm={onConfirmCategoryDelete}
            />

        </>
    )
}
export default EventCategory