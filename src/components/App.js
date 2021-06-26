import React from 'react';
import Typography from '@material-ui/core/Typography';
import Container from '@material-ui/core/Container';
import Box from '@material-ui/core/Box';
import { SortedItemsViewer } from './SortedItemsViewer.component';
import { itemsColumns } from './Items.columns';
import { Grid } from '@material-ui/core';
import api from '../lib/api/index';

export const App = () => {
    return (
        <Container className="app" fixed>
            <Box data-testid="app-box" m={2}>
                <Typography>Your app should show up here.</Typography>

                <Grid container spacing={2}>
                    <Grid item md={6} xs={12}>
                        <SortedItemsViewer
                            data-testid="items-users"
                            title="Users"
                            itemsColumns={itemsColumns}
                            getItemsFn={api.getUsersDiff}
                        />
                    </Grid>

                    <Grid item md={6} xs={12}>
                        <SortedItemsViewer
                            data-testid="items-projects"
                            title="Projects"
                            itemsColumns={itemsColumns}
                            getItemsFn={api.getProjectsDiff}
                        />
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default App;
