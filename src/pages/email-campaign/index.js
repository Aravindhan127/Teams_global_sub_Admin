import { useEffect, useState, useRef, useCallback } from 'react'
import { Button, Grid, IconButton, Tooltip, Typography, TextField, Select } from '@mui/material'
import Card from '@mui/material/Card'
import Box from '@mui/material/Box'
import Translations from 'src/layouts/components/Translations'
import PageHeader from 'src/@core/components/page-header'
import { DefaultPaginationSettings } from 'src/constants/general.const'
import { axiosInstance } from 'src/network/adapter'
import { ApiEndPoints } from 'src/network/endpoints'
import { toastError, toastSuccess } from 'src/utils/utils'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import ArrowBackIcon from '@mui/icons-material/ArrowBack'
import { useAuth } from 'src/hooks/useAuth'
import SearchIcon from '@mui/icons-material/Search'
import Filter from '../../../src/assets/images/filter.svg'
import toast from 'react-hot-toast'
import TableMailCampaign from 'src/views/tables/TableMailCampaign'
import DialogEmailCompose from 'src/views/dialog/DialogEmailCompose'
import EmailCompose from './EmailCompose'

const EmailCampaign = () => {
  const [loading, setLoading] = useState(false)
  const { rolePremission, isMasterAdmin } = useAuth()
  const location = useLocation()
  const searchTimeoutRef = useRef(null)
  const { id } = useParams()
  const { user } = useAuth()
  const userType = user?.orgDetails?.orgType
  const [openComposeEmail, setOpenComposeEmail] = useState(false)
  const [selectedUserIds, setSelectedUserIds] = useState([])
  const tabOptions = [{ name: 'All', value: 'all' }]

  //pagination
  const [search, setSearch] = useState('')
  const [totalCount, setTotalCount] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize, setPageSize] = useState(DefaultPaginationSettings.ROWS_PER_PAGE)
  const [toggleStates, setToggleStates] = useState(false)
  const navigate = useNavigate()
  // Testimonials for guest
  const [campaignList, setCampaignList] = useState([])
  const [senderData, setSenderData] = useState([])
  const [listType, setListType] = useState('all')
  const toggleCloseCompose = () => {
    navigate('/email-compose')
    setSelectedUserIds([])
  }

  const fetchEmailCampaignList = ({ search, currentPage, pageSize = DefaultPaginationSettings.ROWS_PER_PAGE }) => {
    setLoading(true)
    let params = {
      page: currentPage,
      limit: pageSize
    }
    if (search) {
      params.search = search
    }
    axiosInstance
      .get(ApiEndPoints?.EMAIL_CAMPAIGN?.getCampaignList, { params })
      .then(response => {
        setCampaignList(response?.data.data.campaignList)
        setTotalCount(response?.data.data.total)
        console.log('campaign response--------------------', response?.data.data.campaignList)
      })
      .catch(error => {
        toastError(error)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  // const fetchSenderData = () => {
  //     setLoading(true);
  //     let params = {
  //         page: currentPage,
  //         limit: pageSize
  //     }
  //     if (search) {
  //         params.search = search;
  //     }
  //     axiosInstance
  //         .get(ApiEndPoints?.EMAIL_CAMPAIGN?.getSenderData, { params }
  //         )
  //         .then((response) => {
  //             console.log("sender data response--------------------", response?.data.data);
  //             setSenderData(response?.data.data);
  //         })
  //         .catch((error) => {
  //             toastError(error);
  //         })
  //         .finally(() => {
  //             setLoading(false);
  //         });
  // };

  useEffect(() => {
    fetchEmailCampaignList({
      currentPage,
      pageSize,
      search
    })
  }, [search, listType, currentPage, pageSize])

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
        <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Box display='flex' alignItems='center'>
            {rolePremission?.permissions?.some(item => item.permissionName === 'lounge.create') ||
            isMasterAdmin === true ? (
              <Button
                variant='contained'
                onClick={() => {
                  toggleCloseCompose()
                }}
              >
                Compose Campaign Mail
              </Button>
            ) : null}
          </Box>
        </Grid>

        <Grid item xs={12} sx={{ display: 'flex', gap: 5, alignItems: 'center' }}>
          {/* <Box sx={{ display: "flex", gap: 4 }}>
                        {tabOptions.map(({ name, value }) => {
                            const isSelected = listType === value;
                            return (
                                <Box
                                    key={value}
                                    sx={{
                                        bgcolor: isSelected ? "#1e3a8a" : "#D9D9D9",
                                        width: "100px",
                                        height: "40px",
                                        borderRadius: "10px",
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        cursor: "pointer",
                                    }}
                                    onClick={() => setListType(value)}
                                >
                                    <Typography
                                        variant="fm-p4"
                                        sx={{
                                            color: isSelected ? "#fff" : "#656565",
                                            fontWeight: isSelected ? 600 : 400,
                                        }}
                                    >
                                        {name}
                                    </Typography>
                                </Box>
                            );
                        })}
                    </Box> */}
          <Box sx={{ width: '100%' }}>
            <TextField
              placeholder='Search Anything...'
              variant='standard'
              size='medium'
              type='search'
              InputProps={{
                disableUnderline: true,
                startAdornment: <SearchIcon sx={{ color: '#888', mr: 1, fontSize: '30px' }} />,
                sx: { fontSize: '14px' }
              }}
              sx={{ bgcolor: '#FFFFFF', borderRadius: '10px', py: 2, px: 1 }}
              fullWidth
              onChange={handleSearchChange}
            />
          </Box>
          {/* <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                        <img src={Filter} alt="filter" style={{ width: "24px", height: "28px" }} />
                    </Box> */}
        </Grid>

        <Grid item xs={12} sx={{ p: 5 }}>
          <TableMailCampaign
            search={search}
            loading={loading}
            rows={campaignList}
            totalCount={totalCount}
            setCurrentPage={setCurrentPage}
            currentPage={currentPage}
            setPageSize={setPageSize}
            pageSize={pageSize}
            rolePremission={rolePremission}
            isMasterAdmin={isMasterAdmin}
            toggleStates={toggleStates}
            onSelectionChange={ids => setSelectedUserIds(ids)}
            selectedIds={selectedUserIds}
            setSelectedIds={setSelectedUserIds}
          />
        </Grid>
      </Grid>
    </>
  )
}
export default EmailCampaign
