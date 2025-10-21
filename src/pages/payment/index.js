import { useEffect, useState, useRef, useCallback } from "react"
import { Button, Grid, MenuItem, Select, Typography } from "@mui/material"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import TextField from "@mui/material/TextField"
import PageHeader from "src/@core/components/page-header"
import Translations from "src/layouts/components/Translations"
import { axiosInstance } from "src/network/adapter"
import { ApiEndPoints } from "src/network/endpoints"
import { DefaultPaginationSettings } from "src/constants/general.const"
import { toastError, toastSuccess } from "src/utils/utils"
import DialogConfirmation from "src/views/dialog/DialogConfirmation"
import TableCity from "src/views/tables/TableCity"
import DialogFormCity from "src/views/dialog/DialogCity"
import TablePayment from "src/views/tables/TablePayment"

const PaymentPage = () => {

    const searchTimeoutRef = useRef();

    const [loading, setLoading] = useState(false);
    const [status, setStatus] = useState('')
    const [citydata, setCityData] = useState([]);
    const [search, setSearch] = useState("");
    const [totalCount, setTotalCount] = useState(0);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE);


    const fetchData = ({ currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE, search, status }) => {
        setLoading(true);
        let params = {
            page: currentPage,
            limit: pageSize,
            search: search,
            status: status
        };

        axiosInstance
            .get(ApiEndPoints.CITY_MANAGEMENT.list, { params })
            .then((response) => {
                setCityData(response.data.data.city)
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
            status: status
        });
    }, [currentPage, pageSize, search, status]);

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
                        <Translations text="Payment" />
                    </Typography>
                }
            // action={
            //     <Button variant="contained" onClick={toggleCityFormDialog}>
            //         Add City
            //     </Button>
            // }
            />
            <Grid item xs={12}>
                <Card>
                    <Box sx={{ p: 5, pb: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Box></Box>
                        <Box sx={{ display: 'flex', flexWrap: 'wrap', alignItems: 'center', gap: 5 }}>
                            {/* <Select
                                size='small'
                                defaultValue={' '}
                                sx={{ bgcolor: '#F7FBFF' }}
                                onChange={e => {
                                    const selectedValue = e.target.value
                                    setStatus(selectedValue === 'All' ? '' : selectedValue)
                                }}
                            >
                                <MenuItem disabled value={' '}>
                                    <em>Status</em>
                                </MenuItem>
                                <MenuItem value={'All'}>All</MenuItem>
                                <MenuItem value={'active'}>Active</MenuItem>
                                <MenuItem value={'inactive'}>Inactive</MenuItem>
                            </Select> */}
                            <TextField
                                type="search"
                                size='small'
                                placeholder='Search'
                                onChange={handleSearchChange}
                            />
                        </Box>
                    </Box>
                    <Box sx={{ p: 5 }}>
                        <TablePayment
                            search={search}
                            loading={loading}
                            rows={citydata}
                            totalCount={totalCount}
                            setCurrentPage={setCurrentPage}
                            currentPage={currentPage}
                            setPageSize={setPageSize}
                            pageSize={pageSize}
                        />
                    </Box>
                </Card>
            </Grid>
        </Grid>

    </>
}

export default PaymentPage