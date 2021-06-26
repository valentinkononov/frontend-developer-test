import React from 'react';
import { shallow } from 'enzyme';
import { App } from './App';

jest.mock('../lib/api/index', () => ({
    getProjectsDiff: jest.fn().mockReturnValue([]),
    getUsersDiff: jest.fn().mockReturnValue([]),
}));

describe('<App />', () => {
    let wrapper;

    beforeEach(() => {
        wrapper = shallow(<App />);
    });

    describe('render()', () => {
        it('renders the Box', () => {
            expect(wrapper.find({ 'data-testid': 'app-box' })).toHaveLength(1);
            expect(wrapper.find({ 'data-testid': 'items-users' })).toHaveLength(1);
            expect(wrapper.find({ 'data-testid': 'items-projects' })).toHaveLength(1);
        });
    });
});
