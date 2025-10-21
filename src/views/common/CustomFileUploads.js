
import React, { Fragment, useCallback } from "react";
import {
    Box,
    Button,
    IconButton,
    List,
    ListItem,
    ListItemAvatar,
    ListItemText,
    Typography,
} from "@mui/material";
import { styled } from "@mui/material/styles";
import { useDropzone } from "react-dropzone";
import Close from "@mui/icons-material/Close";
import FileDocumentOutline from "mdi-material-ui/FileDocumentOutline";
import AddCircleIcon from '@mui/icons-material/AddCircle';

const DragDrop_Box_Style = {
    flexShrink: 0,
    //   background: "#F1F1F1",
    strokeWidth: "1px",
    //   stroke: "#007167",
};


function CustomFileUploads({
    multiple,
    files,
    onChange,
    minHeight = "100px",
    title,
    customize
    // MediaUrl
}) {

    const AddShopImageText = styled(Typography)(({ theme }) => ({
        fontSize: "14px",
        fontWeight: 400,
        lineHeight: "19.6px",
        letterSpacing: "0.2px",
        color: "#000000",
    }));

    console.log("DEBUGfiles", files);

    const onDrop = useCallback(
        (acceptedFiles) => {
            if (multiple) {
                onChange([
                    ...(Array.isArray(files) ? files : []),
                    ...acceptedFiles,
                ]); // Pass files directly, no need to map
            } else {
                onChange(acceptedFiles[0]);
            }
        },
        [files, multiple, onChange]
    );

    const { getRootProps, getInputProps } = useDropzone({
        onDrop,
        accept: ".jpg, .jpeg, .png, .pdf", // Allow all image and document extensions
        multiple: multiple, // Set to true if you want to allow multiple file selection
    });

    const handleRemoveFile = (file) => {
        if (multiple) {
            const uploadedFiles = Array.isArray(files) ? files : [];
            const filtered = uploadedFiles?.filter((i) =>
                typeof file === "string" ? i !== file : i?.name !== file?.name
            );
            onChange([...filtered]);
        } else {
            onChange(null);
        }
    };

    const renderFilePreview = (file) => {
        if (file?.type?.startsWith("image")) {
            return (
                <img
                    width={38}
                    height={38}
                    alt={file.name}
                    src={URL.createObjectURL(file)} // Temporary URL for the image preview
                />
            );
        } else {
            return <FileDocumentOutline />;
        }
    };

    const renderFilePreviewFromURL = (fileURL) => {
        console.log("fileURL", fileURL);

        const fileExtension = fileURL.split(".").pop().toLowerCase();
        const imageExtensions = ["jpg", "jpeg", "png"];
        if (imageExtensions.includes(fileExtension)) {
            return (
                <img
                    width={38}
                    height={38}
                    alt="File Preview"
                    // src={`${MediaUrl}${fileURL}`}
                    src={`${fileURL}`}
                />
            );
        } else {
            return (
                <img
                    width={38}
                    height={38}
                    alt="File Preview"
                    // src={`${MediaUrl}${fileURL}`}
                    src={`${fileURL}`}
                />
            );
        }
    };

    const fileItem = (file) => {
        if (typeof file === "string")
            return (
                <ListItem
                    key={"Thumb"}
                    secondaryAction={
                        <IconButton edge="end" onClick={() => handleRemoveFile(file)}>
                            <Close fontSize="small" />
                        </IconButton>
                    }
                >
                    <ListItemAvatar>{renderFilePreviewFromURL(file)}</ListItemAvatar>
                </ListItem>
            );

        return (
            <ListItem
                key={file?.name}
                secondaryAction={
                    <IconButton edge="end" onClick={() => handleRemoveFile(file)}>
                        <Close fontSize="small" />
                    </IconButton>
                }
            >
                <ListItemAvatar>{renderFilePreview(file)}</ListItemAvatar>
                <ListItemText
                    primary={<Typography className="file-name">{file.name}</Typography>}
                    secondary={
                        <Typography className="file-size" variant="body2">
                            {Math.round(file?.size / 100) / 10 > 1000
                                ? `${(Math.round(file?.size / 100) / 10000).toFixed(1)} mb`
                                : `${(Math.round(file?.size / 100) / 10).toFixed(1)} kb`}
                        </Typography>
                    }
                />
            </ListItem>
        );
    };

    const fileList = multiple
        ? Array.isArray(files) && files?.map((file) => fileItem(file))
        : files
            ? fileItem(files)
            : null;

    return (
        <div>
            <Box
                {...getRootProps()}
                display="flex"
                flexDirection="column"
                alignItems="center"
                justifyContent="center"
                minHeight={minHeight}
                borderRadius={"12px"}
                p={2}
                textAlign="center"
                sx={{
                    cursor: "pointer",
                    ...DragDrop_Box_Style,
                    bgcolor: customize ? "white" : "none",
                    border: customize ? "none" : "2px dashed #000000"
                }}
            >

                <input {...getInputProps()} />
                <div>
                    <Box>
                        <AddCircleIcon />
                    </Box>
                    <AddShopImageText>{title}</AddShopImageText>
                </div>
            </Box>

            {multiple && Array.isArray(files) && files?.length ? (
                <Fragment>
                    <List>{fileList}</List>
                </Fragment>
            ) : null}
            {!multiple && files ? (
                <Fragment>
                    <List>{fileList}</List>
                </Fragment>
            ) : null}
        </div>
    );
}

export default CustomFileUploads;
