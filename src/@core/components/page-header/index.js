import { Box } from "@mui/material";
import Grid from "@mui/material/Grid";

const PageHeader = (props) => {
    // ** Props
    const { title, subtitle, action } = props;

    return (
        <Grid item xs={12} sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <Box>
                {title}
                {subtitle || null}
            </Box>
            {
                !!action && <Box>
                    {action}
                </Box>
            }
        </Grid>
    )
}

export default PageHeader