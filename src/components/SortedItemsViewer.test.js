import React from 'react';
import { shallow } from 'enzyme';
import { SortedItemsViewer } from './SortedItemsViewer.component';
import { itemsColumns } from './Items.columns';
import { DataList } from './DataList.component';
import { act } from 'react-dom/test-utils';
import { SortingOrder } from './utils';

describe('<SortedItemsViewer />', () => {
    let wrapper;
    const title = 'test title';
    let getItemsFn = jest.fn().mockReturnValue([]);

    beforeEach(() => {
        wrapper = shallow(<SortedItemsViewer itemsColumns={itemsColumns} title={title} getItemsFn={getItemsFn} />);
    });

    const testData = [
        {
            id: 'e28d290a-a2f2-48c2-9001-ff43884e271b',
            timestamp: new Date('2020/2/14').getTime(),
            diff: [{ field: 'name', oldValue: 'John', newValue: 'Bruce' }],
        },
        {
            id: '8bd0166f-f0c6-48fd-9fcd-a17e76eb1e92',
            timestamp: new Date('2020/2/15').getTime(),
            diff: [{ field: 'name', oldValue: 'Bruce', newValue: 'Nick' }],
        },
    ];

    describe('render empty', () => {
        it('renders the Card', () => {
            expect(wrapper.find({ 'data-testid': 'items-card' })).toHaveLength(1);
        });

        it('renders the Card Header', () => {
            const header = wrapper.find({ 'data-testid': 'items-card-header' });
            expect(header).toHaveLength(1);
            expect(header.html().indexOf(title) > 0).toBe(true);
        });

        it('renders the Card Content', () => {
            const content = wrapper.find({ 'data-testid': 'items-card-content' });
            expect(content).toHaveLength(1);
            expect(content.html().indexOf('No data loaded') > 0).toBe(true);
        });

        it('renders the Card Actions', () => {
            const actions = wrapper.find({ 'data-testid': 'items-card-actions' });
            expect(actions).toHaveLength(1);
            const button = wrapper.find({ 'data-testid': 'items-card-button' });
            expect(button).toHaveLength(1);
        });
    });

    describe('render data', () => {
        beforeEach(() => {
            getItemsFn.mockImplementation(() => {
                return {
                    code: 200,
                    data: testData,
                };
            });
            act(() => {
                wrapper = shallow(
                    <SortedItemsViewer itemsColumns={itemsColumns} title={title} getItemsFn={getItemsFn} />,
                );
            });
        });

        function checkSortedItems(wrapper, sortDirection) {
            const dateCells = wrapper.find(DataList).dive().find({ 'data-testid': 'cell-timestamp' });

            expect(dateCells).toHaveLength(2);
            const firstIndex = sortDirection === SortingOrder.DESC ? 1 : 0;
            const lastIndex = sortDirection === SortingOrder.DESC ? 0 : 1;

            expect(
                dateCells.first().html().indexOf(new Date(testData[firstIndex].timestamp).toLocaleDateString()) > 0,
            ).toBe(true);
            expect(
                dateCells.last().html().indexOf(new Date(testData[lastIndex].timestamp).toLocaleDateString()) > 0,
            ).toBe(true);
        }

        it('renders provided list of items with default sorting', async () => {
            const button = wrapper.find({ 'data-testid': 'items-card-button' }).first();

            act(() => {
                button.simulate('click');
            });

            checkSortedItems(wrapper, SortingOrder.DESC);
        });

        it('sorting is changed after click to sort indicator', () => {
            const button = wrapper.find({ 'data-testid': 'items-card-button' }).first();

            act(() => {
                button.simulate('click');
            });

            let sortingIndicator = wrapper.find(DataList).dive().find({ 'data-testid': 'sort-label-timestamp' });

            act(() => {
                sortingIndicator.simulate('click');
            });

            checkSortedItems(wrapper, SortingOrder.ASC);

            sortingIndicator = wrapper.find(DataList).dive().find({ 'data-testid': 'sort-label-timestamp' });
            act(() => {
                sortingIndicator.simulate('click');
            });

            checkSortedItems(wrapper, SortingOrder.DESC);
        });
    });

    describe('render error', () => {
        const testError = 'test Error';
        beforeEach(() => {
            getItemsFn.mockImplementation(() => {
                const err = new Error();
                err.code = 500;
                err.error = testError;
                throw err;
            });

            act(() => {
                wrapper = shallow(
                    <SortedItemsViewer itemsColumns={itemsColumns} title={title} getItemsFn={getItemsFn} />,
                );
            });
        });

        it('renders error after getting 500 code from api', () => {
            const button = wrapper.find({ 'data-testid': 'items-card-button' }).first();

            act(() => {
                button.simulate('click');
            });

            const errorElement = wrapper.find({ 'data-testid': 'items-card-error' });
            expect(errorElement).toHaveLength(1);
            expect(errorElement.html().indexOf(testError) > 0).toBe(true);
        });
    });

    describe('render loading indicator', () => {
        beforeEach(() => {
            getItemsFn.mockImplementation(() => {
                return new Promise(resolve => {
                    return resolve({
                        code: 200,
                        data: testData,
                    });
                });
            });

            act(() => {
                wrapper = shallow(
                    <SortedItemsViewer itemsColumns={itemsColumns} title={title} getItemsFn={getItemsFn} />,
                );
            });
        });

        it('renders loading indicator before actual data come', async () => {
            let loadingIndicator = wrapper.find({ 'data-testid': 'items-card-loader' });
            expect(loadingIndicator).toHaveLength(0);

            const button = wrapper.find({ 'data-testid': 'items-card-button' }).first();

            act(() => {
                button.simulate('click');
            });

            loadingIndicator = wrapper.find({ 'data-testid': 'items-card-loader' });
            expect(loadingIndicator).toHaveLength(1);

            // wait until data is loading
            await Promise.resolve();

            loadingIndicator = wrapper.find({ 'data-testid': 'items-card-loader' });
            expect(loadingIndicator).toHaveLength(0);
        });
    });
});
