import React from 'react'
import PropTypes from 'prop-types'
import _ from 'lodash'

import { hot } from 'react-hot-loader'
import { connect } from 'react-redux'
import { Route, Link, Switch, Redirect, hashHistory } from 'react-router-dom'

import { ConnectedRouter } from 'react-router-redux'

import { loadingSelector, isLoggedInSelector, profileSelector } from './reducers/account'
import { Spinner } from './components'
import { signOut } from './actions'

import Logo from './assets/images/logo.jpg'

import Home from './components/pages/Home'
import Employees from './components/pages/Employees'
import Login from './components/pages/Login'
import Reviews from './components/pages/Reviews'
import ReviewDetails from './components/pages/ReviewDetails'

import PrivateRoute from './PrivateRoute'
import { history } from './history';
import AppBar from '@material-ui/core/AppBar';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import Grid from '@material-ui/core/Grid';
import ButtonGroup from '@material-ui/core/ButtonGroup';

import Box from '@material-ui/core/Box';

class App extends React.Component {
  constructor(props) {
    super(props);
  }
  componentDidMount() {
    // this.props.getBitcoinData()
  }

  signOut = () => {
    this.props.signOut()
  }

  render() {
    const {
      loading,
      isLoggedIn
    } = this.props

    const spinner = loading ? (
      <div className='loading--area'>
        <Spinner center large />
      </div>
    ) : null

    const profile = _.get(this.props, 'profile', null)
    const type = _.get(profile, 'type', '')

    // For admin only
    const employeesButton = type === 'admin' ? (
      <Link to='/employees'>Employees</Link>
    ) : null

    const tabs = isLoggedIn ? (
      <React.Fragment>
        <div className={'switchContainer'}>
          <Grid container spacing={2}>
            <Grid item xs={12}>

              <Link to='/reviews'><Button variant="contained" color="default">Reviews</Button></Link>
              {employeesButton ? <Link to='/employees'><Button variant="contained" color="default">Employee</Button></Link> : ''}

            </Grid>
          </Grid>
        </div>
        {/* <div className='header__menu'>
          
        </div>
        {employeesButton ?
          <div className='header__menu'>
            {employeesButton}
          </div>
          : ''} */}
      </React.Fragment>
    ) : null
    const menu = isLoggedIn ? (
      <AppBar position="static" color="primary">
        <Typography>
          {
            profile &&

            <div className='header__profile'>
              {`Welcome, ${profile.firstName} ${profile.lastName}`}
            </div>

          }
          {/* <div className='header__logo--wrapper'>
            <Link to='/'>
              <img src={Logo} alt='Logo' className='header__logo' />
            </Link>
          </div> */}



          <div onClick={this.signOut} className='header__signout'>
            Sign Out
        </div>


        </Typography>
      </AppBar>
    ) : null

    return (
      <ConnectedRouter history={history}>
        <div className='wrapper'>
          {spinner}
          <div>
            {menu}
            {tabs}
            <Switch>
              <PrivateRoute isLoggedIn={isLoggedIn} exact path='/employees' component={Employees} />
              <PrivateRoute isLoggedIn={isLoggedIn} exact path='/reviews' component={Reviews} />
              <PrivateRoute isLoggedIn={isLoggedIn} exact path='/reviews/:id' component={ReviewDetails} />
              <Route exact path='/login' component={Login} />
              <Redirect from='*' to='/reviews' />
            </Switch>
          </div>
        </div>
      </ConnectedRouter>
    )
  }
}

App.propTypes = {
  loading: PropTypes.bool.isRequired,
  isLoggedIn: PropTypes.string,
  signOut: PropTypes.func
}

function mapStateToProps(state) {
  return {
    loading: loadingSelector(state),
    isLoggedIn: isLoggedInSelector(state),
    profile: profileSelector(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    signOut: () => { dispatch(signOut()) }
  }
}

/* eslint-disable */
let AppWithRedux = connect(
  mapStateToProps,
  mapDispatchToProps
)(App)
/* eslint-enable */

if (module.hot) {
  AppWithRedux = hot(module)(AppWithRedux)
}

export default AppWithRedux