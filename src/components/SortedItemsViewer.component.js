import React, { useCallback, useState } from 'react';
import { DataList } from './DataList.component';
import {
    CardHeader,
    Card,
    CardContent,
    CardActions,
    CircularProgress,
    Button,
    Typography,
    Grid,
} from '@material-ui/core';
import { SortingOrder } from './utils';

const comparer = (a, b, field) => {
    if (a[field] > b[field]) {
        return 1;
    } else if (a[field] < b[field]) {
        return -1;
    }
    return 0;
};

const sortItems = (items, orderBy, orderDirection) => {
    const sign = orderDirection === SortingOrder.ASC ? 1 : -1;
    switch (orderBy) {
        case 'timestamp':
            return items.sort((a, b) => sign * comparer(a, b, orderBy));
        default:
            return items;
    }
};

export const SortedItemsViewer = ({ title, getItemsFn, itemsColumns }) => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    const [items, setItems] = useState([]);
    const [sorting, setSorting] = useState({ orderBy: 'timestamp', orderDirection: 'desc' });

    const fetchData = useCallback(async () => {
        setIsLoading(true);
        setError(null);

        try {
            const newItems = await getItemsFn();
            setItems(sortItems([...items, ...newItems.data], sorting.orderBy, sorting.orderDirection));
        } catch (e) {
            setError(e.error);
        } finally {
            setIsLoading(false);
        }
    }, [items, sorting.orderBy, sorting.orderDirection, getItemsFn]);

    const onSort = useCallback(
        (orderBy, orderDirection) => {
            setSorting({ orderBy, orderDirection });
            setItems(sortItems([...items], orderBy, orderDirection));
        },
        [items],
    );

    return (
        <Card data-testid="items-card">
            <CardHeader data-testid="items-card-header" title={title} />
            <CardContent data-testid="items-card-content">
                <DataList
                    items={items}
                    columns={itemsColumns}
                    onSort={onSort}
                    orderBy={sorting.orderBy}
                    orderDirection={sorting.orderDirection}
                />
            </CardContent>
            <CardActions data-testid="items-card-actions">
                <Grid container direction="column" justify="center" alignItems="center">
                    {!!error && (
                        <Grid item>
                            <Typography data-testid="items-card-error" color="error">
                                {error}
                            </Typography>
                        </Grid>
                    )}
                    <Grid item>
                        {isLoading && <CircularProgress data-testid="items-card-loader" />}
                        {!isLoading && (
                            <Button
                                data-testid="items-card-button"
                                variant="contained"
                                color="primary"
                                onClick={fetchData}
                            >
                                {!!error ? 'Retry' : 'Load More'}
                            </Button>
                        )}
                    </Grid>
                </Grid>
            </CardActions>
        </Card>
    );
};
