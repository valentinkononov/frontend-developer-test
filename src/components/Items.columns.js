export const itemsColumns = [
    {
        header: 'Date',
        id: 'timestamp',
        getter: item => new Date(item.timestamp).toLocaleDateString(),
        sortable: true,
    },
    {
        header: 'User ID',
        id: 'id',
        getter: item => item.id,
        sortable: false,
    },
    {
        header: 'Old Value',
        id: 'newValue',
        getter: item => item.diff.map(x => x.oldValue).join(', '),
        sortable: false,
    },
    {
        header: 'New Value',
        id: 'oldValue',
        getter: item => item.diff.map(x => x.newValue).join(', '),
        sortable: false,
    },
];
