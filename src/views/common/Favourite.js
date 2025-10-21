import React from "react";
import { Grid, Avatar, Typography, Box, Card, CardContent } from "@mui/material";
import AvatarGroup from "@mui/material/AvatarGroup";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { handleURLQueries } from "src/@core/layouts/utils";

const Favourite = ({ favouriteData }) => {
    const navigate = useNavigate();
    const handleLoungesClick = (userSeqId, item) => {
        if (item?.orgUser) {
            navigate(`/organization-user/${userSeqId}`)
        } else {
            navigate(`/college-user/${userSeqId}`)
        }
    }
    console.log("favouriteData", favouriteData)
    return (
        <Card sx={{ borderRadius: "5px", mt: 2 }}>
            <CardContent>
                <Grid container spacing={2}>
                    {favouriteData && favouriteData.length > 0 ? (
                        favouriteData.map((item) => (
                            <Grid
                                item
                                xs={12}
                                key={item.loungeId}
                                onClick={item?.isAddedByAdmin === false ? () => handleLoungesClick(item?.collegeUser?.userSeqId || item?.orgUser?.userSeqId, item) : undefined}
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 2,
                                    bgcolor: "#F0F0F0",
                                    mt: 1,
                                    p: 1,
                                    borderRadius: "5px",
                                    cursor: item?.isAddedByAdmin ? "default" : "pointer"
                                }}

                            >
                                <Avatar
                                    alt={`${item.isAddedByAdmin ? item.adminData?.firstName : item.collegeUser?.appUser?.firstName
                                        }`}
                                    src={item.isAddedByAdmin ? item.adminData?.logo : item.collegeUser?.appUser?.firstName}
                                    sx={{ width: 50, height: 50, bgcolor: "white" }}
                                />
                                <Box>
                                    <Typography variant="body1" fontWeight={500}>
                                        {item.isAddedByAdmin === true ? item.adminData?.firstName : item.collegeUser ? item.collegeUser?.appUser?.firstName : item.orgUser?.appUser?.firstName} &nbsp;
                                        {item.isAddedByAdmin === true ? item.adminData?.lastName : item.collegeUser ? item.collegeUser?.appUser?.lastName : item.orgUser?.appUser?.lastName}
                                    </Typography>
                                    <Typography variant="body2" color="gray">
                                        {item?.isAddedByAdmin === true ? "You Added in favourites" : "Added to favourites"} {moment(item.createdAt).fromNow()}
                                    </Typography>
                                </Box>
                            </Grid>
                        ))
                    ) : (
                        <Grid item xs={12} key="no-followers">
                            No Favourites
                        </Grid>
                    )}

                </Grid>

            </CardContent>
        </Card>
    );
};

export default Favourite;
