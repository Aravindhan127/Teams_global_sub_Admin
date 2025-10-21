// import { useEffect, useState, useRef, useCallback } from "react";
// import { Button, Grid, Typography } from "@mui/material";
// import Card from "@mui/material/Card";
// import Box from "@mui/material/Box";
// import Translations from "src/layouts/components/Translations";
// import PageHeader from "src/@core/components/page-header";
// import { DefaultPaginationSettings } from "src/constants/general.const";
// import { axiosInstance } from "src/network/adapter";
// import { ApiEndPoints } from "src/network/endpoints";
// import { toastError, toastSuccess } from "src/utils/utils";
// import DialogConfirmation from "src/views/dialog/DialogConfirmation";
// import { useNavigate } from "react-router-dom";
// import DialogStatus from "src/views/dialog/DialogStatus";
// import DialogChapter from "src/views/dialog/DialogChapter";
// import TableChapter from "src/views/tables/TableChapter";
// import { useAuth } from "src/hooks/useAuth";
// import TableLounge from "src/views/tables/TableLounge";



// const Archives = () => {
//     const navigate = useNavigate()
//     const [loading, setLoading] = useState(false);
//     const { rolePremission, isMasterAdmin } = useAuth()

//     // status dialog
//     // const [statusDialogOpen, setStatusDialogOpen] = useState(false);
//     // const [statusToUpdate, setStatusToUpdate] = useState(null);

//     // const toggleChangeStatusDialog = (e, statusToUpdate = null) => {
//     //     setStatusDialogOpen((prev) => !prev);
//     //     setStatusToUpdate(statusToUpdate);
//     // };

//     //pagination
//     const [search, setSearch] = useState("");
//     const [totalCount, setTotalCount] = useState(0);
//     const [currentPage, setCurrentPage] = useState(1);
//     const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);


//     // Testimonials for chapter
//     const [archivesData, setArchivesData] = useState([])
//     // const [chapterDialogOpen, setChapterDialogOpen] = useState(false);
//     // const [chapterDialogMode, setChapterDialogMode] = useState("add");
//     // const [chapterToEdit, setChapterToEdit] = useState(null);

//     // const [role, setRole] = useState([])
//     // const toggleChapterDialog = (e, mode = 'add', chapterToEdit = null) => {
//     //     setChapterDialogOpen(prev => !prev);
//     //     setChapterDialogMode(mode);
//     //     setChapterToEdit(chapterToEdit);
//     // };

//     // const fetcharchivesData = () => {
//     //     setLoading(true);
//     //     axiosInstance
//     //         .get(ApiEndPoints?.CHAPTER?.get)
//     //         .then((response) => {
//     //             setArchivesData(response?.data?.data?.chapters);
//     //             setTotalCount(response?.data.total)
//     //             console.log("chapter response--------------------", response);
//     //         })
//     //         .catch((error) => {
//     //             toastError(error);
//     //         })
//     //         .finally(() => {
//     //             setLoading(false);
//     //         });
//     // };

//     // useEffect(() => {
//     //     fetcharchivesData({
//     //         currentPage: currentPage,
//     //         pageSize: pageSize,
//     //         search: search,
//     //     });
//     // }, [currentPage, pageSize, search])

//     return (
//         <>
//             <Grid container spacing={4} className="match-height">
//                 <PageHeader
//                 // title={
//                 //     <Typography variant="h5">
//                 //         <Translations text="Archives" />
//                 //     </Typography>
//                 // }
//                 // action={
//                 //     (rolePremission?.permissions?.some(
//                 //         item => item.permissionName === 'orgChapter.create'
//                 //     ) || isMasterAdmin === true) ? (
//                 //         <Button variant="contained"
//                 //             onClick={toggleChapterDialog}
//                 //         >
//                 //             Add chapter
//                 //         </Button>
//                 //     ) : null
//                 // }

//                 />
//                 <Grid item xs={12}>
//                     <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
//                         <Box sx={{ p: 5 }}>
//                             <TableLounge
//                                 search={search}
//                                 loading={loading}
//                                 rows={archivesData}
//                                 totalCount={totalCount}
//                                 setCurrentPage={setCurrentPage}
//                                 currentPage={currentPage}
//                                 setPageSize={setPageSize}
//                                 pageSize={pageSize}
//                             // toggleEdit={toggleChapterDialog}
//                             // toggleStatus={toggleChangeStatusDialog}
//                             // rolePremission={rolePremission}
//                             // isMasterAdmin={isMasterAdmin}
//                             // toggleDelete={toggleChangeStatusDialog}
//                             />
//                         </Box>


//                     </Card>
//                 </Grid>
//             </Grid>

//             {/* <DialogChapter
//                 open={chapterDialogOpen}
//                 toggle={toggleChapterDialog}
//                 mode={chapterDialogMode}
//                 dataToEdit={chapterToEdit}
//                 role={role}
//                 onSuccess={() => {
//                     fetcharchivesData({
//                         currentPage: currentPage,
//                         pageSize: pageSize,
//                     });
//                 }}
//             />

//             <DialogStatus
//                 open={statusDialogOpen}
//                 toggle={toggleChangeStatusDialog}
//                 dataToEdit={statusToUpdate}
//                 type="chapter"
//                 onSuccess={() => {
//                     fetcharchivesData({
//                         currentPage: currentPage,
//                         pageSize: pageSize,
//                     });
//                 }}
//             /> */}
//         </>
//     )
// }
// export default Archives


import React from 'react';
import ComingSoon from '../../views/common/ComingSoon';

const Archives = () => {
  return <ComingSoon title="Archives" />;
};

export default Archives; 