import React, { Component } from 'react';

import '../App.css';
import './Monthview.css';

// Material UI components
import { Link } from 'react-router-dom';
import CircularProgress from '@material-ui/core/CircularProgress';

// Moment for date management
import moment from 'moment';
import {
  viewChanger, jumpToCurrent, getSchedulingFreeform, checkColor,
} from '../utils/Utils';
import Infoboxes from '../infoboxes/Infoboxes';

// Translation
import texts from '../texts/texts.json';

const smallInfoIcon = require('../logo/Small-info.png');

const { weekdayShorthand } = texts;  // eslint-disable-line

class Monthview extends Component {
  constructor(props) {
    super(props);
    this.state = {
      state: 'loading',
      yearNro: 0,
      monthNro: 0,
    };

    this.previousMonthClick = this.previousMonthClick.bind(this);
    this.nextMonthClick = this.nextMonthClick.bind(this);
    this.update = this.update.bind(this);
  }

  componentDidMount() {
    this.update();
    this.getYear();
    this.getMonth();
  }

  componentWillReceiveProps() { // eslint-disable-line
    this.setState({
      state: 'loading',
    }, () => {
      this.update();
    });
  }

  getYear = () => {
    try {
      const fullUrl = window.location.href.split('/');
      const urlParamDate = fullUrl[5];

      const urlParamDateSplit = urlParamDate.split('-');

      const paramYear = urlParamDateSplit[0];
      if (paramYear.length === 4) {
        this.setState({ yearNro: paramYear });
        return paramYear;
      }
    } catch {
      console.log('Error getting year from url');
    }
    const today = new Date();
    const yyyy = today.getFullYear();
    this.setState({ yearNro: yyyy });
    return yyyy;
  }

  getMonth = () => {
    try {
      const fullUrl = window.location.href.split('/');
      const urlParamDate = fullUrl[5];

      const urlParamDateSplit = urlParamDate.split('-');

      const paramMonth = urlParamDateSplit[1].padStart(2, '0');
      if (paramMonth.length === 2) {
        this.setState({ monthNro: paramMonth });
        return paramMonth;
      }
    } catch {
      console.log('Error getting month from url');
    }
    const today = new Date();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    this.setState({ monthNro: mm });
    return mm;
  }

  createWeekDay = () => {
    const table = [];
    let dayNumber;

    const fin = localStorage.getItem('language');
    const { month } = texts;

    for (let j = 0; j < 8; j += 1) {
      dayNumber = j.toString();

      if (dayNumber === '0') {
        table.push(
          <div className="weekNumber">
            {month.weekNumber[fin]}
          </div>,
        );
      } else {
        table.push(
          <div>
            {weekdayShorthand[dayNumber - 1][fin]}
          </div>,
        );
      }
    }

    return table;
  }

  createMonthTable = () => {
    const requestSchedulingFreeform = async (date) => {
      const response = await getSchedulingFreeform(date);

      if (response) {
        this.setState({
          state: 'ready',
          paivat: response.month,
        });
      } else console.error('getting info failed');
    };

    const table = [];
    if (this.state.yearNro === 0) {
      return false;
    }

    let help = 0;
    const days = moment(`${this.state.yearNro}-${this.state.monthNro}`, 'YYYY-MM').daysInMonth();
    const startDay = moment(`${this.state.yearNro}-${this.state.monthNro}-1`, 'YYYY-MM-DD');
    let firstMon = moment(`${this.state.yearNro}-${this.state.monthNro}-1`, 'YYYY-MM-DD');
    let info = false;

    // safety loop incase of errors in name detection due to wrong locale, e.g. Sweden
    let safetyLoop = 0;

    while (firstMon.format('ddd') !== 'Mon' && firstMon.format('ddd') !== 'ma') {
      firstMon = firstMon.subtract(1, 'days');
      if (safetyLoop > 7) {
        break;
      }
      safetyLoop += 1;
    }
    safetyLoop = 0;

    if (this.state.paivat === undefined || this.state.paivat[0].date !== firstMon.format('YYYY-MM-DD')) {
      requestSchedulingFreeform(firstMon.format('YYYY-MM-DD'));
    }
    if (this.state.paivat === undefined) {
      return false;
    }
    // Tarkistetaan ensimmäinen maanantai ja lisätään siitä päivät
    while (firstMon.format('ddd') !== startDay.format('ddd')) {
      const colorFromBackEnd = checkColor(this.state.paivat, help);
      if (this.state.paivat[help].tracks) {
        this.state.paivat[help].tracks.forEach((track) => {
          if (track.notice !== null) {
            info = true;
          }
        });
      }
      help += 1;
      table.push(
        <Link style={{ backgroundColor: `${colorFromBackEnd}` }} class="link notCurMonth" to={`/dayview/${firstMon.format('YYYY-MM-DD')}`}>
          {info
            ? (
              <div className="monthview-day-img">
                {firstMon.date()}
                <img className="Monthview-info" src={smallInfoIcon} />
              </div>
            )
            : (
              <div>
                {firstMon.date()}
              </div>
            )}
        </Link>,
      );
      firstMon.add(1, 'days');
      info = false;
    }

    // lisätään kuukauteen kuuluvat päivät.
    while (startDay.format('D') < days) {
      const colorFromBackEnd = checkColor(this.state.paivat, help);
      if (this.state.paivat[help].tracks) {
        this.state.paivat[help].tracks.forEach((track) => {
          if (track.notice !== null) {
            info = true;
          }
        });
      }
      help += 1;
      table.push(
        <Link style={{ backgroundColor: `${colorFromBackEnd}` }} class="link" to={`/dayview/${startDay.format('YYYY-MM-DD')}`}>
          {info
            ? (
              <div className="monthview-day-img">
                {startDay.date()}
                <img className="Monthview-info" src={smallInfoIcon} />
              </div>
            )
            : (
              <div>
                {startDay.date()}
              </div>
            )}
        </Link>,
      );
      startDay.add(1, 'days');
      info = false;
    }

    let colorFromBackEnd = checkColor(this.state.paivat, help);
    help += 1;
    if (this.state.paivat[help].tracks) {
      this.state.paivat[help].tracks.forEach((track) => {
        if (track.notice !== null) {
          info = true;
        }
      });
    }
    table.push(
      <Link style={{ backgroundColor: `${colorFromBackEnd}` }} class="link" to={`/dayview/${startDay.format('YYYY-MM-DD')}`}>
        {info
          ? (
            <div className="monthview-day-img">
              {startDay.date()}
              <img className="Monthview-info" src={smallInfoIcon} />
            </div>
          )
          : (
            <div>
              {startDay.date()}
            </div>
          )}
      </Link>,
    );
    startDay.add(1, 'days');

    // Lisätään viimeiseen viikkoon kuuluvat päivät.
    while (startDay.format('ddd') !== 'Mon' && startDay.format('ddd') !== 'ma') {
      colorFromBackEnd = checkColor(this.state.paivat, help);
      if (this.state.paivat[help].tracks) {
        this.state.paivat[help].tracks.forEach((track) => {
          if (track.notice !== null) {
            info = true;
          }
        });
      }
      help += 1;
      table.push(
        <Link style={{ backgroundColor: `${colorFromBackEnd}` }} class="link notCurMonth" to={`/dayview/${startDay.format('YYYY-MM-DD')}`}>
          {info
            ? (
              <div className="monthview-day-img">
                {startDay.date()}
                <img className="Monthview-info" src={smallInfoIcon} />
              </div>
            )
            : (
              <div>
                {startDay.date()}
              </div>
            )}
        </Link>,
      );
      startDay.add(1, 'days');
      if (safetyLoop > 7) {
        break;
      }
      safetyLoop += 1;
      info = false;
    }

    return table;
  }

  createWeekNumber = () => {
    const table = [];
    const days = moment(`${this.state.yearNro}-${this.state.monthNro}`, 'YYYY-MM').daysInMonth();
    let startWeek = moment(`${this.state.yearNro}-${this.state.monthNro}-1`, 'YYYY-MM-DD').isoWeek();
    const startHelp = moment(`${this.state.yearNro}-${this.state.monthNro}-1`, 'YYYY-MM-DD');
    const endWeek = moment(`${this.state.yearNro}-${this.state.monthNro}-${days}`, 'YYYY-MM-DD').isoWeek();
    const link = moment(`${this.state.yearNro}-${this.state.monthNro}-1`, 'YYYY-MM-DD');

    if (this.state.yearNro === 0) {
      return false;
    }

    while (startHelp.isoWeek() !== endWeek) {
      table.push(
        <Link class="link" to={`/weekview/${link.format('YYYY-MM-DD')}`}>
          <div>
            {startWeek}
          </div>
        </Link>,
      );
      link.add(1, 'weeks');
      startHelp.add(1, 'weeks');
      startWeek = startHelp.isoWeek();
    }

    table.push(
      <Link class="link" to={`/weekview/${link.format('YYYY-MM-DD')}`}>
        <div>
          {startWeek}
        </div>
      </Link>,
    );

    return table;
  }

  previousMonthClick(e) {
    this.setState({
      state: 'loading',
    });

    e.preventDefault();
    try {
      const fullUrl = window.location.href.split('/');
      const urlParamDate = fullUrl[5];
      const urlParamDateSplit = urlParamDate.split('-');

      const paramYear = urlParamDateSplit[0];
      const paramMonth = urlParamDateSplit[1].padStart(2, '0');
      const paramDay = urlParamDateSplit[2];

      const paramDateCorrect = moment(paramYear + paramMonth + paramDay, 'YYYYMMDD');
      paramDateCorrect.add(1, 'days');
      paramDateCorrect.subtract(1, 'month');
      this.props.history.replace(`/Monthview/${paramDateCorrect.toISOString().substring(0, 10)}`); // eslint-disable-line
      this.setState(
        {
          monthNro: paramMonth,
          yearNro: paramYear,
        },
        function () {
          this.update();
        },
      );
    } catch (err) {
      console.error(err);
      this.update();
    }
  }

  nextMonthClick(e) {
    this.setState({
      state: 'loading',
    });

    e.preventDefault();
    try {
      const fullUrl = window.location.href.split('/');
      const urlParamDate = fullUrl[5];
      const urlParamDateSplit = urlParamDate.split('-');

      const paramYear = urlParamDateSplit[0];
      const paramMonth = urlParamDateSplit[1].padStart(2, '0');
      const paramDay = urlParamDateSplit[2];

      const paramDateCorrect = moment(paramYear + paramMonth + paramDay, 'YYYYMMDD');
      paramDateCorrect.add(1, 'days');
      paramDateCorrect.add(1, 'month');
      this.props.history.replace(`/Monthview/${paramDateCorrect.toISOString().substring(0, 10)}`); // eslint-disable-line
      this.setState(
        {
          monthNro: paramMonth,
          yearNro: paramYear,
        },
        function () {
          this.update();
        },
      );
    } catch (err) {
      console.error(err);
      this.update();
    }
  }

  update() {
    try {
      const fullUrl = window.location.href.split('/');
      const urlParamDate = fullUrl[5];
      const urlParamDateSplit = urlParamDate.split('-');

      const paramYear = urlParamDateSplit[0];
      const paramMonth = urlParamDateSplit[1].padStart(2, '0');

      if ((paramMonth === this.state.monthNro && paramYear === this.state.yearNro)) {
        this.setState({
          state: 'ready',
        });
      }
      if ((paramMonth !== this.state.monthNro && this.state.monthNro !== 0)
        || (paramYear !== 0 && paramYear !== this.state.yearNro)) {
        this.setState({
          monthNro: paramMonth,
          yearNro: paramYear,
        });
      }
    } catch (err) {
      const date = new Date();
      const paramMonth = String(date.getMonth() + 1).padStart(2, '0');
      this.setState({
        monthNro: paramMonth,
        yearNro: date.getYear(),
      });
      console.error(err);
      this.props.history.replace(`/Monthview/${date.toISOString().substring(0, 10)}`);
    }
  }

  render() {
    const fin = localStorage.getItem('language'); // eslint-disable-line
    const { month } = texts;  // eslint-disable-line
    const monthTable = this.createMonthTable();
    return (
      <div>
        {this.state.state !== 'ready'
          ? (
            <div className="progress">
              <CircularProgress size="25vw" disableShrink />
            </div>
          )
          : (
            <div>
              <div className="date-headerM">
                <div
                  className="hoverHand arrow-left"
                  onClick={this.previousMonthClick}
                />
                <h1 className="dateHeader-text">
                  {`${month[this.state.monthNro][fin]},`}
                  {' '}
                  {this.state.yearNro}
                </h1>
                <div
                  className="hoverHand arrow-right"
                  onClick={this.nextMonthClick}
                />
              </div>

              <div className="month-container">
                <div className="viewChanger">
                  <div className="viewChanger-current">
                    {jumpToCurrent()}
                  </div>
                  <div className="viewChanger-container">
                    {viewChanger()}
                  </div>
                </div>
                <div className="weekdays">
                  {this.createWeekDay()}
                </div>
                <div className="weekNumber">
                  {this.createWeekNumber()}
                </div>
                <div className="month-days">
                  { monthTable }
                </div>
              </div>
              <Infoboxes />
            </div>
          )}
      </div>
    );
  }
}

export default Monthview;
