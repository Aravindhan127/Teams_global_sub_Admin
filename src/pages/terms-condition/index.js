import { Button, Grid, Typography } from "@mui/material"
import Card from "@mui/material/Card"
import Box from "@mui/material/Box"
import PageHeader from "src/@core/components/page-header"
import Translations from "src/layouts/components/Translations"
import { useEffect, useState } from "react"
import DialogPrivacyPolicy from "src/views/dialog/DialogPrivacyPolicy"
import { axiosInstance } from "src/network/adapter"
import { ApiEndPoints } from "src/network/endpoints"
import toast from "react-hot-toast"
import DialogTerms from "src/views/dialog/DialogTerms"
import FallbackSpinner from "src/@core/components/spinner"
import { useAuth } from "src/hooks/useAuth"


const TermsandConditionPage = () => {
    const { rolePremission, isMasterAdmin } = useAuth()


    const [loading, setLoading] = useState(false)

    const [terms, setTerms] = useState([])
    const getPrivacypolicy = () => {
        setLoading(true)
        axiosInstance
            .get(`${ApiEndPoints.DOCUMENT.document('terms')}`)
            .then(response => {
                setTerms(response.data.data || '')

            })
            .catch(error => {
                toast.error(error.response.data.message)
            })
            .finally(() => {
                setLoading(false)
            })
    }
    useEffect(() => {
        getPrivacypolicy()
    }, [])
    if (loading) {
        return <FallbackSpinner />
    }
    return <>
        <Grid container spacing={4} className="match-height">
            <PageHeader
            // title={
            //     <Typography variant="h5">
            //         <Translations text="Terms and Condition" />
            //     </Typography>
            // }

            />
            <Grid item xs={12}>
                <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
                    <Box sx={{ p: 5, pb: 0, display: 'flex', flexWrap: 'wrap', alignItems: 'center', justifyContent: 'space-between' }}>
                        <Typography sx={{ fontSize: "15px", fontWeight: 600 }}>
                            <div className="blog_____content" dangerouslySetInnerHTML={{
                                __html: (terms.description)
                            }} />
                        </Typography>
                    </Box>
                </Card>
            </Grid>
        </Grid>

    </>
}

export default TermsandConditionPage