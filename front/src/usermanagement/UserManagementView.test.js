import React from 'react';
import '@testing-library/jest-dom/extend-expect';
import {
  waitFor,
  render,
  screen,
} from '@testing-library/react';
import { HashRouter as Router } from 'react-router-dom';
import { createMemoryHistory } from 'history';
import { act } from 'react-dom/test-utils';
import UserManagementView from './UserManagementView';

describe('testing UserManagementView', () => {
  it('should render UserManagementView', async () => {
    const history = createMemoryHistory();
    localStorage.setItem('language', '1'); // eslint-disable-line no-undef
    await act(async () => {
      render(
        <Router>
          <UserManagementView
            history={history}
          />
        </Router>,
      );
    });
    await waitFor(() => expect(
      screen.getByText('User management'),
    )
      .toBeInTheDocument());
  });
});
