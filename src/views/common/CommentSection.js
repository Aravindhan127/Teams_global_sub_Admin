import { useState } from "react";
import { Avatar, Box, Card, Typography, List, ListItem, ListItemAvatar, ListItemText, FormHelperText, Button, TextField, CircularProgress, CardContent, FormControl, FormLabel, IconButton } from "@mui/material";
import moment from "moment";
import axios from "axios";
import { useAuth } from "src/hooks/useAuth";
import { axiosInstance } from "src/network/adapter";
import { ApiEndPoints } from "src/network/endpoints";
import { toastError, toastSuccess } from "src/utils/utils";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from 'yup'
import FallbackSpinner from "src/@core/components/spinner";
import { useNavigate } from "react-router-dom";
import ChatIcon from '../../../src/assets/images/ChatIcon.svg'
import Dustbin from '../../../src/assets/images/dustbin.svg'
const validationSchema = yup.object({
    comment: yup.string().required('comment is required'),
})

const CommentSection = ({ comments, setComments, loungeId, onSuccess }) => {
    const {
        control,
        handleSubmit,
        setValue,
        reset,
        formState: { errors }
    } = useForm({
        resolver: yupResolver(validationSchema),
        mode: 'onChange'
    })
    const navigate = useNavigate();
    const handleLoungesClick = (userSeqId, comment) => {
        if (comment?.orgUser) {
            navigate(`/organization-user/${userSeqId}`)
        } else {
            navigate(`/college-user/${userSeqId}`)
        }
    }
    const INITIAL_VISIBLE_COUNT = 3;
    const [visibleComments, setVisibleComments] = useState(INITIAL_VISIBLE_COUNT);
    const [loading, setLoading] = useState(false);
    const { user } = useAuth();
    console.log("user", user)
    const handleShowMore = () => {
        setVisibleComments(prev => Math.min(prev + 5, comments?.length));
    };

    const handleShowLess = () => {
        setVisibleComments(prev => Math.max(prev - 5, INITIAL_VISIBLE_COUNT));
    };


    const onSubmit = (data) => {
        console.log("data", data)
        let payload = new FormData();
        payload.append("loungeId", loungeId);
        payload.append("comment", data?.comment);

        setLoading(true);
        let apiInstance = null;
        apiInstance = axiosInstance
            .post(ApiEndPoints.LOUNGE.addComment, payload, {
                headers: { 'Content-Type': 'multipart/form-data' }
            })
        apiInstance
            .then((response) => response.data)
            .then((response) => {
                console.log("commennt", response.data.addedComment.comment)
                setComments([response.data.addedComment.comment, ...comments]);
                onSuccess();
                toastSuccess(response.message);
            })
            .catch((error) => {
                toastError(error)
            })
            .finally(() => {
                setLoading(false);
            })
    }
    if (loading) {
        return <FallbackSpinner />
    }
    return (
        <Card sx={{ maxHeight: "400px", overflowY: "auto", mt: 4, borderRadius: 2, bgcolor: "#F9F9F9" }}>
            <CardContent>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2, px: 1 }}>
                    <img src={ChatIcon} alt="Chat Icon" style={{ width: "24px", height: "24px" }} />
                    <Typography variant="fm-p1" sx={{ fontWeight: 600, color: "#000000" }}>
                        Comments
                    </Typography>
                </Box>


                {/* Comment Input Section */}
                <Box sx={{ display: "flex", gap: 2, flexDirection: "column", mt: 6, bgcolor: "#ffffff", borderRadius: "10px", p: 5 }}>
                    <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                        <Avatar src={user?.orgDetails?.logo} alt={user?.firstName} sx={{ height: "30px", width: "30px" }} />
                        <Typography variant="subtitle1" fontWeight="bold">
                            {user?.firstName}  {user?.lastName}
                        </Typography>
                    </Box>
                    <form noValidate autoComplete='off' onSubmit={handleSubmit(onSubmit)}>
                        <Box sx={{ display: "flex" }}>
                            <FormControl fullWidth>
                                <Controller
                                    name='comment'
                                    control={control}
                                    render={({ field: { value, onChange } }) => (
                                        <TextField
                                            fullWidth
                                            variant="standard"
                                            size="small"
                                            placeholder="Add a comment..."
                                            value={value}
                                            onChange={onChange}
                                        />
                                    )}
                                />
                                {errors.comment && (
                                    <FormHelperText sx={{ color: 'error.main' }}>
                                        {errors.comment.message}
                                    </FormHelperText>
                                )}
                            </FormControl>


                            <Box sx={{ display: "flex", gap: 2 }}>
                                <Button variant="contained" color="primary" disabled={loading} type="submit">
                                    {loading ? <CircularProgress size={20} color="inherit" /> : "Send"}
                                </Button>
                            </Box>
                        </Box>
                    </form>
                </Box>


                {/* Comments List */}
                <List sx={{ mt: 2, px: 0 }}>
                    {comments?.slice(0, visibleComments).map((comment, index) => (
                        <ListItem
                            key={index}
                            alignItems="flex-start"
                            onClick={
                                comment?.isAddedByAdmin === false
                                    ? () =>
                                        handleLoungesClick(
                                            comment?.collegeUser?.userSeqId || comment?.orgUser?.userSeqId,
                                            comment
                                        )
                                    : undefined
                            }
                            sx={{
                                cursor: comment?.isAddedByAdmin ? "default" : "pointer",
                                p: 0,
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "flex-start",
                            }}
                        // secondaryAction={
                        //     <IconButton edge="end" aria-label="delete">
                        //         <img src={Dustbin} />
                        //     </IconButton>
                        // }
                        >
                            <ListItemAvatar>
                                <Avatar
                                    src={comment?.collegeUser?.profileUrl}
                                    alt={comment?.collegeUser?.appUser?.firstName}
                                />
                            </ListItemAvatar>
                            <ListItemText
                                primary={
                                    <Typography variant="subtitle1" fontWeight="bold">
                                        {comment.isAddedByAdmin
                                            ? comment.adminData?.firstName
                                            : comment.collegeUser
                                                ? comment.collegeUser?.appUser?.firstName
                                                : comment.orgUser?.appUser?.firstName}{" "}
                                        {comment.isAddedByAdmin
                                            ? comment.adminData?.lastName
                                            : comment.collegeUser
                                                ? comment.collegeUser?.appUser?.lastName
                                                : comment.orgUser?.appUser?.lastName}
                                        <span
                                            style={{
                                                fontSize: "0.8rem",
                                                color: "gray",
                                                marginLeft: "8px",
                                            }}
                                        >
                                            {moment(comment?.createdAt).fromNow()}
                                        </span>
                                    </Typography>
                                }
                                secondary={
                                    <Typography variant="body2">
                                        {comment?.comment.length > 150 ? (
                                            <>
                                                {comment?.comment.slice(0, 150)}...
                                                <Button
                                                    size="small"
                                                    style={{ textTransform: "none", padding: "0" }}
                                                >
                                                    Read more
                                                </Button>
                                            </>
                                        ) : (
                                            comment?.comment
                                        )}
                                    </Typography>
                                }
                            />
                        </ListItem>
                    ))}
                </List>


                {/* Show More/Less Buttons */}
                <Box sx={{ display: "flex", justifyContent: "center", gap: 2, mt: 2 }}>
                    {visibleComments < comments?.length && (
                        <Button onClick={handleShowMore} variant="outlined">
                            Show more
                        </Button>
                    )}
                    {visibleComments > INITIAL_VISIBLE_COUNT && (
                        <Button onClick={handleShowLess} variant="outlined">
                            Show less
                        </Button>
                    )}
                </Box>
            </CardContent>
        </Card>
    );
};

export default CommentSection;
