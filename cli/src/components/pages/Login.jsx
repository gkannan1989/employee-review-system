import React from 'react'
import PropTypes from 'prop-types'
import { connect } from 'react-redux'
import { withRouter } from 'react-router'
import Logo from './../../assets/images/logo.jpg'
import { loadingSelector, isLoggedInSelector } from './../../reducers/account'
import { getJwtToken } from './../../actions'
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
import CssBaseline from '@material-ui/core/CssBaseline';
import Container from '@material-ui/core/Container';

class Login extends React.Component {
  state = {
    email: '',
    password: ''
  }

  componentDidMount() {
    if (this.props.isLoggedIn) {
      // Redirect if logged in
      this.props.history.push('/')
    }
  }

  onSubmit = () => {
    this.props.getJwtToken(
      { email: this.state.email, password: this.state.password }
    )
  }

  setValue = (value, type) => {
    this.setState({
      [type]: value
    })
  }

  render() {
    return (
      <React.Fragment>
        <CssBaseline />
        <Container maxWidth="sm">
          <div className='login'>
            <div className='login__form'>
              <div className='text-center'>
                <img src={Logo} alt='Logo' className='login__logo' />
              </div>
              <div className='text-center'>
                <div className='input__block'>
                  {/* <input
                onChange={(e) => { this.setValue(e.target.value, 'email') }}
                type='email'
                placeholder='Email'
                className='input--text'
              /> */}
                  <TextField
                    label="Username / Email"
                    onChange={(e) => { this.setValue(e.target.value, 'email') }}
                    required
                    variant="outlined"
                    defaultValue=""
                    id="validation-outlined-input"
                  />
                </div>
                <div className='input__block'>
                  <TextField
                    label="Password"
                    type="password"
                    onChange={(e) => { this.setValue(e.target.value, 'password') }}
                    required
                    variant="outlined"
                    defaultValue=""
                    id="validation-outlined-input"
                  />
                  {/* <input
                onChange={(e) => { this.setValue(e.target.value, 'password') }}
                type='password'
                placeholder='********'
                className='input--text'
              /> */}

                </div>
              </div>
              <div className='text-center btn__block'>
                <Button onClick={this.onSubmit} variant="contained" color="primary">
                  Sign In
                </Button>
                {/* <button  className='login__submit'></button> */}
              </div>
            </div>
          </div>
        </Container>
      </React.Fragment>
    )
  }
}

Login.propTypes = {
  getJwtToken: PropTypes.func,
  isLoggedIn: PropTypes.string
}

function mapStateToProps(state) {
  return {
    loading: loadingSelector(state),
    isLoggedIn: isLoggedInSelector(state)
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getJwtToken: (credentials) => { dispatch(getJwtToken(credentials)) }
  }
}

const LoginComponent = connect(
  mapStateToProps,
  mapDispatchToProps
)(Login)

export default withRouter(LoginComponent)