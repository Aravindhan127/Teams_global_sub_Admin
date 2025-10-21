import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Grid, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import PageHeader from "src/@core/components/page-header";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError } from "src/utils/utils";
import TableBulkUpload from "src/views/tables/TableBulkUpload";
import DialogBulkUpload from "src/views/dialog/DialogBulkUpload";
import { useAuth } from "src/hooks/useAuth";


const BulkUpload = () => {
    const [loading, setLoading] = useState(false);
    const [docData, setDocData] = useState([])
    const { rolePremission, isMasterAdmin, user } = useAuth()

    console.log("user", user?.orgDetails.orgType)
    const isClg = user?.orgDetails.orgType === "college";
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);

    const [uploadDocumentDialogOpen, setUploadDocumentDialogOpen] = useState(false)
    const [uploadDocumentDialogMode, setUploadDocumentDialogMode] = useState('add')

    const toggleUploadDocumentDialog = (e, mode = "add") => {
        setUploadDocumentDialogOpen(prev => !prev);
        setUploadDocumentDialogMode(mode);
    }


    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search
        };
        const endpoint = isClg
            ? ApiEndPoints.BULK_UPLOAD.doc_list
            : ApiEndPoints.BULK_UPLOAD.doc_list_for_org;

        axiosInstance
            .get(endpoint, { params })
            .then((response) => {
                setDocData(response?.data?.invitations);
                setTotalCount(response.data.total)
                console.log("BULK_UPLOAD--------------------", response);
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

    const handleDownloadSampleFile = () => {
        if (isClg) {
            const csvHeader = "firstName,lastName,userEmail,userType\n";
            const sampleData = [
                "John,Doe,john.doe@example.com,Student",
                "Jane,Doe,jane.doe@example.com,Alumni",
                "Mark,Smith,mark.smith@example.com,Faculty",
            ].join("\n");
            const csvContent = csvHeader + sampleData + "\n";
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "sample_file.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } else {
            // Use the provided sample data for non-college orgs
            const csvHeader = "firstName,lastName,userEmail,dateOfBirth,jobTitle,companyName,companyUrl,cityName,countryName,stateName,chapterId,profileBio,whatsappNumber,countryCd\n";
            const sampleData = [
                "John,Doe,john.doe@yopmail.com,1996-11-15,Frontend developer,42Gears,,Valsad,India,Gujarat,1,testbio,7879454577,91",
                "Jane,Doe,jane.doe@yopmail.com,1996-11-15,Fullstack developer,42Gears,,Valsad,India,Gujarat,1,testbio,7879454577,91",
                "Mark,Smith,mark.smith@yopmail.com,1996-11-15,Fullstack developer,42Gears,,Valsad,India,Gujarat,1,testbio,7879454577,91",
            ].join("\n");
            const csvContent = csvHeader + sampleData + "\n";
            const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
            const url = URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.setAttribute("download", "sample_file.csv");
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    };


    return (
        <>
            <Grid container spacing={4} className="match-height">
                <PageHeader
                    // title={
                    //     <Typography variant="h5">
                    //         User Invitation
                    //     </Typography>
                    // }

                    action={
                        <>
                            {(rolePremission?.permissions?.some(
                                (item) => item.permissionName === "bulkUser.add"
                            ) || isMasterAdmin === true) && (
                                    <Box sx={{ display: "flex", gap: 1 }}>
                                        <Button
                                            variant="outlined"
                                            onClick={handleDownloadSampleFile}
                                        >
                                            Download Sample File
                                        </Button>

                                        <Button
                                            variant="contained"
                                            onClick={(e) => toggleUploadDocumentDialog(e, "add")}
                                            style={{ marginRight: "10px" }}
                                        >
                                            Upload Document
                                        </Button>

                                    </Box>
                                )}
                        </>
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
                                <TableBulkUpload
                                    search={search}
                                    loading={loading}
                                    rows={docData}
                                    totalCount={totalCount}
                                    setCurrentPage={setCurrentPage}
                                    currentPage={currentPage}
                                    setPageSize={setPageSize}
                                    pageSize={pageSize}
                                />
                            </Box>
                        </Box>
                    </Card>
                </Grid>
            </Grid>

            <DialogBulkUpload
                mode={uploadDocumentDialogMode}
                open={uploadDocumentDialogOpen}
                toggle={toggleUploadDocumentDialog}
                isClg={isClg}
                onSuccess={() => {
                    fetchData({
                        currentPage: currentPage,
                        pageSize: pageSize,

                    });
                }}

            />


        </>
    )
}
export default BulkUpload