import { Avatar, Box, Card, CardContent, Divider, IconButton, Table, TableBody, TableCell, TableHead, TableRow, Typography } from "@mui/material";
import ArrowCircleLeftOutlinedIcon from '@mui/icons-material/ArrowCircleLeftOutlined';
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { Link, useNavigate, useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import FallbackSpinner from "src/@core/components/spinner";
import EditIcon from '@mui/icons-material/Edit';
import moment from "moment";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
const NewsLetterDetail = () => {
    const params = useParams();
    const navigate = useNavigate();
    const { newsletterId } = params;
    const [newsletterData, setNewsletterData] = useState([]);
    const [loading, setLoading] = useState('');
    const [statusFormDialogOpen, setStatusFormDialogOpen] = useState(false);
    const [statusToEdit, setStatusToEdit] = useState(null);

    const fetchData = () => {
        setLoading(true);
        axiosInstance
            .get(ApiEndPoints.NEWSLETTER.getById(newsletterId))
            .then(response => {
                console.log("response", response?.data?.data?.newsLettersList)
                setNewsletterData(response?.data?.data?.newsLettersList);
            })
            .catch(error => {
                // Handle error
            })
            .finally(() => {
                setLoading(false);
            });
    };
    useEffect(() => {
        fetchData();
    }, [newsletterId]);

    console.log("newsletterData", newsletterData)
    if (loading) return <FallbackSpinner />;

    function formatLabel(value) {
        if (!value) return "N/A";
        return value
            .replace(/_/g, " ") // Replace underscores with spaces
            .replace(/\b\w/g, char => char.toUpperCase()); // Capitalize the first letter of each word
    }
    return (
        <>
            <Card sx={{ bgcolor: "#FFFFFF", boxShadow: '0px 0px 25px 7px rgba(0, 0, 0, 0.03)' }}>
                <CardContent sx={{ width: "100%" }}>
                    <Box display='flex' justifyContent={"space-between"} gap={2} mb={5}>
                        <Box sx={{ display: "flex", gap: 2, alignItems: "center" }}>
                            <ArrowBackIcon onClick={() => navigate(-1)} />
                            <Typography variant="h6" sx={{ fontWeight: 700, color: "primary.main" }}>
                                Newsletter Details
                            </Typography>
                        </Box>
                    </Box>

                    <Table sx={{ width: "100%", mt: 1 }}>
                        {
                            newsletterData?.map((item, index) => (
                                <TableBody key={index}>
                                    {[
                                        { label: "Author:", value: item?.author || "N/A" },
                                        {
                                            label: "Category:",
                                            value: item?.category || "N/A"
                                        },

                                        { label: "Title:", value: item?.title },
                                        {
                                            label: "Content:", value:
                                                <div
                                                    style={{ wordBreak: "break-word", whiteSpace: "normal" }}
                                                    dangerouslySetInnerHTML={{
                                                        __html: `<style>p { margin: 0; }</style>${item?.content}`,
                                                    }}
                                                />

                                        },
                                        { label: "Created Date:", value: item.createdAt ? moment(item.createdAt).format('L') : "N/A" },
                                        {
                                            label: "Media:",
                                            value: item?.newsMediaUrl ? (
                                                item.newsMediaUrl.toLowerCase().endsWith(".pdf") ? (
                                                    <a
                                                        href={item.newsMediaUrl}
                                                        target="_blank"
                                                        rel="noopener noreferrer"
                                                        style={{ color: "blue", textDecoration: "underline", fontWeight: "bold" }}
                                                    >
                                                        📄 View Document
                                                    </a>
                                                ) : (
                                                    <Avatar src={item.newsMediaUrl} />
                                                )
                                            ) : "N/A"
                                        }


                                    ].map((item, index) => (
                                        <TableRow key={index}>
                                            <TableCell sx={{ fontWeight: 700, width: "50%" }}>{item.label}</TableCell>
                                            <TableCell
                                                sx={{
                                                    width: "50%",
                                                    textTransform: item.isEmail ? "lowercase" : "capitalize" // Prevent capitalization for email
                                                }}
                                            >
                                                {item.value || "N/A"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            ))
                        }


                    </Table>

                </CardContent>
            </Card>

        </>
    );
};
export default NewsLetterDetail;
