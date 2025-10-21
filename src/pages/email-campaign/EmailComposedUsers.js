import { useEffect, useState, useRef, useCallback } from "react";
import { Button, Grid, IconButton, Tooltip, Typography, TextField, Select } from "@mui/material";
import Card from "@mui/material/Card";
import Box from "@mui/material/Box";
import Translations from "src/layouts/components/Translations";
import PageHeader from "src/@core/components/page-header";
import { DefaultPaginationSettings } from "src/constants/general.const";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { useAuth } from "src/hooks/useAuth";
import SearchIcon from '@mui/icons-material/Search';
import Filter from "../../../src/assets/images/filter.svg"
import toast from "react-hot-toast";
import TableMailComposedUsers from "src/views/tables/TableMailComposedUsers";


const EmailComposedUsers = () => {
    const [loading, setLoading] = useState(false);
    const { rolePremission, isMasterAdmin } = useAuth()
    const location = useLocation()
    const { id } = useParams()
    //pagination
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [toggleStates, setToggleStates] = useState(false);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);
    const navigate = useNavigate();
    // Testimonials for guest
    const [campaignList, setCampaignList] = useState([])
    const [senderData, setSenderData] = useState([])
    const [listType, setListType] = useState('all')


    const fetchSenderData = () => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            campaignId: id,
        }
        if (search) {
            params.search = search;
        }
        axiosInstance
            .get(ApiEndPoints?.EMAIL_CAMPAIGN?.getSenderData, { params }
            )
            .then((response) => {
                console.log("sender data response--------------------", response);
                setSenderData(response?.data.data);
                setTotalCount(response?.data.data.total);
            })
            .catch((error) => {
                toastError(error);
            })
            .finally(() => {
                setLoading(false);
            });
    };

    useEffect(() => {
        fetchSenderData();
    }, [search, listType])


    return (
        <>
            <Grid container spacing={4} className="match-height">
                <Grid item xs={12} sx={{ p: 5 }}>
                    <Box sx={{ display: "flex", gap: "10px", alignItems: "center" }}>
                        <Tooltip title="Back to events">
                            <IconButton onClick={() => navigate(-1)}>
                                <ArrowBackIcon color="primary" />
                            </IconButton>
                        </Tooltip>
                        <Typography variant="h5" fontWeight={700} color="primary" ml={1}>
                            Composed Users
                        </Typography>
                    </Box>

                </Grid>
                <Grid item xs={12} sx={{ p: 5 }}>
                    <TableMailComposedUsers
                        search={search}
                        loading={loading}
                        rows={senderData}
                        totalCount={totalCount}
                        setCurrentPage={setCurrentPage}
                        currentPage={currentPage}
                        setPageSize={setPageSize}
                        pageSize={pageSize}
                        rolePremission={rolePremission}
                        isMasterAdmin={isMasterAdmin}
                        toggleStates={toggleStates}
                    />
                </Grid>
            </Grid>


        </>
    )
}
export default EmailComposedUsers