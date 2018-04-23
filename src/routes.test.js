import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { mount, shallow } from 'enzyme';
import { MemoryRouter } from 'react-router';
import Routes from './routes';
import Dashboard from './components/Main/Dashboard';
import Feedback from './components/Feedback';
import Howto from './components/Howto';

const renderRoutes = path =>
	mount(
		<MemoryRouter initialEntries={[path]}>
			<Routes />
		</MemoryRouter>
	);
describe('#Routes', () => {
	it('renders dashboard on base route', () => {
		const component = renderRoutes('/');
		expect(component.find(Dashboard)).toHaveLength(1);
	});
});
