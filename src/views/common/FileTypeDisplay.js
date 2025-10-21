import React, { useState } from 'react';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import ImageIcon from '@mui/icons-material/Image';
import PictureAsPdfIcon from '@mui/icons-material/PictureAsPdf';
import DescriptionIcon from '@mui/icons-material/Description';
import { Dialog, DialogContent, Grid } from '@mui/material';

const FileTypeDisplay = ({ url, index }) => {
    // console.log("url: " + url, index);
    const [openDialog, setOpenDialog] = useState(false);

    // Function to extract file extension from URL
    const getFileExtension = (url) => {
        return url.split('.').pop().toLowerCase();
    };

    // Function to determine icon based on file extension
    const getIcon = (extension) => {
        switch (extension) {
            case 'png':
            case 'jpg':
            case 'jpeg':
            case 'gif':
                return <Avatar src={url} alt="Thumbnail" variant="rounded" sx={{
                    width: '100%', height: '100%',
                    // '& img': {
                    //     objectFit: 'contain !important'
                    // }
                }}>
                    <ImageIcon />
                </Avatar>;
            case 'pdf':
                return <PictureAsPdfIcon sx={{ width: 64, height: 64 }} />;
            case 'doc':
            case 'docx':
                return <DescriptionIcon sx={{ width: 64, height: 64 }} />;
            default:
                return null;
        }
    };

    // Extract file extension from URL
    const fileExtension = getFileExtension(url);

    // Get corresponding icon or thumbnail
    const iconOrThumbnail = getIcon(fileExtension);
    const handleOpenDialog = () => {
        setOpenDialog(true);
    };
    const handleCloseDialog = () => {
        setOpenDialog(false);
    };
    return (
        <>
            <Box sx={{ height: '80px', width: '94px', display: 'flex', justifyContent: 'center', alignItems: 'center' }} onClick={handleOpenDialog}>
                {iconOrThumbnail}
            </Box>
            <Dialog open={openDialog} onClose={handleCloseDialog}>
                <DialogContent>
                    {/* <img src={url} alt="Image" style={{ maxWidth: '100%', maxHeight: '100%' }} /> */}
                    {fileExtension === 'pdf' ? (
                        <iframe
                            src={`https://docs.google.com/viewer?url=${encodeURIComponent(url)}&embedded=true`}
                            title="PDF Viewer"
                            width="500px"
                            height="1500px"
                        />
                    ) : fileExtension === 'docx' ? (
                        <iframe
                            src={`https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(url)}`}
                            title="Document Viewer"
                            width="1000px"
                            height="1500px"

                        />
                    ) : (
                        <img
                            src={url}
                            alt=""
                            style={{ maxWidth: '100%', maxHeight: '100%' }}
                        />
                    )}

                </DialogContent>
            </Dialog>
        </>
    )

};

export default FileTypeDisplay;
