import React from 'react';
import Dayview from './Dayview'
import { HashRouter as Router } from "react-router-dom";
import { createMemoryHistory } from 'history'
import '@testing-library/jest-dom/extend-expect'
import {
  render,
  screen,
  waitFor
} from '@testing-library/react'
import * as utils from '../utils/Utils';

describe('testing Dayview component', () => {
  it('should render Dayview', async () => {
    const history = createMemoryHistory()
    const date = new Date('2020-10-21T11:30:57.000Z')
    
    localStorage.setItem('language', '1');
    const state = {
      state: 'loading',
      date: date,
      weekNro: 0,
      dayNro: 0,
      yearNro: 0,
    };
    Date.now = jest.fn(() => '2020-10-21T11:30:57.000Z')
    render(
    <Router>
      <Dayview
        history={history} 
        match={{params: { date: date }}}
        state={ state } />
      </Router>
    );
    await waitFor( () =>
      expect(screen.getByText("Back to weekview"))
        .toBeInTheDocument()
    );
  });
});