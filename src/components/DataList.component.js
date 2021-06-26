import React from 'react';
import {
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    Paper,
    Box,
    Typography,
    Grid,
    TableSortLabel,
} from '@material-ui/core';
import { SortingOrder } from './utils';

export const DataList = ({ items, columns, orderBy, orderDirection, onSort }) => {
    const onSortChangeHandler = (id, prevOrder) => event => {
        let newOrder = SortingOrder.ASC;
        if (prevOrder === SortingOrder.ASC) {
            newOrder = SortingOrder.DESC;
        }

        onSort(id, newOrder);
    };

    return (
        <>
            <Grid container direction="column" justify="center" alignItems="center">
                <Grid item>
                    {
                        <TableContainer component={Paper}>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        {columns.map(column => (
                                            <TableCell
                                                key={column.header}
                                                sortDirection={
                                                    column.sortable && orderBy === column.id ? orderDirection : false
                                                }
                                            >
                                                {column.sortable && (
                                                    <TableSortLabel
                                                        data-testid={'sort-label-' + column.id}
                                                        active={orderBy === column.id}
                                                        direction={
                                                            orderBy === column.id ? orderDirection : SortingOrder.ASC
                                                        }
                                                        onClick={onSortChangeHandler(
                                                            column.id,
                                                            orderBy === column.id ? orderDirection : null,
                                                        )}
                                                    >
                                                        {column.header}
                                                    </TableSortLabel>
                                                )}
                                                {!column.sortable && column.header}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {items.map(item => (
                                        <TableRow key={item.id}>
                                            {columns.map(column => (
                                                <TableCell
                                                    data-testid={'cell-' + column.id}
                                                    key={column.header + item.id}
                                                >
                                                    {column.getter(item)}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    }
                </Grid>
                <Grid item>
                    {!items.length && (
                        <Box>
                            <Typography>No data loaded</Typography>
                        </Box>
                    )}
                </Grid>
            </Grid>
        </>
    );
};
