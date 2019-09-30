import React from 'react'
import axios from 'axios'
import PropTypes from 'prop-types'
import ReactCSSTransitionGroup from 'react-addons-css-transition-group'
import { connect } from 'react-redux'
import { Form, Input, Button, Modal, Select } from 'antd';
import { isLoggedInSelector } from './../../reducers/account'
import CardContent from '@material-ui/core/CardContent';
import DeleteIcon from '@material-ui/icons/Delete';
import MaterialButton from '@material-ui/core/Button';
import AddIcon from '@material-ui/icons/Add';
import Fab from '@material-ui/core/Fab';

import Typography from '@material-ui/core/Typography';

const uuidv1 = require('uuid/v1')
const Option = Select.Option
const FormItem = Form.Item

const EmployeeItem = ({
  firstName, _id, lastName, type, confirmDelete
}) => {
  let typeText = null

  if (type === 'admin') {
    typeText = 'Administrator'
  } else if (type === 'employee') {
    typeText = 'Employee'
  }

  return (
    <CardContent>
      <div className='employee__row'>
        <div className='employee__left'>

          <div className='employee__text'>{`${firstName} ${lastName}`}</div>
          <div className='employee__type'>{typeText}</div>

        </div>
        <div>
          <div className='employee__buttons'>
            {/* <button className='btn--active'>
            <i className='fa fa-pencil' aria-hidden='true'></i>
          </button> */}
            <MaterialButton onClick={() => { confirmDelete(_id) }} variant="contained" color="default">
              Delete
              <DeleteIcon />
            </MaterialButton>

          </div>
        </div>
      </div>
    </CardContent >
  )
}

EmployeeItem.propTypes = {
  firstName: PropTypes.string,
  lastName: PropTypes.string,
  type: PropTypes.string,
  _id: PropTypes.string,
  confirmDelete: PropTypes.func
}

class Employees extends React.Component {
  state = {
    employees: [],
    visible: false
  }

  async componentDidMount() {
    this.fetchData()
  }

  setEmployees = (employees) => {
    this.setState({
      employees
    })
  }

  getUsernamyById = id => (this.state.employees.find(e => e._id === id))

  fetchData = async () => {
    const { data } = await axios.get(
      `${process.env.API_URL}/employees`,
      {
        headers: { Authorization: `Bearer ${this.props.jwt}` }
      }
    )
    this.setEmployees(data)
  }

  deleteUser = async (id) => {
    try {
      const { data } = await axios.delete(
        `${process.env.API_URL}/employees/${id}`,
        {
          headers: { Authorization: `Bearer ${this.props.jwt}` }
        }
      )
      this.fetchData()
    } catch (err) {
      console.log(err)
    }
  }

  confirmDelete = (id) => {
    const userObject = this.getUsernamyById(id)
    Modal.confirm({
      title: `Are you sure you want to delete user ${userObject.firstName} ${userObject.lastName}`,
      okText: 'Yes',
      okType: 'danger',
      cancelText: 'No',
      onOk: () => {
        this.deleteUser(id)
      },
    })
  }

  handleOk = () => {
    this.setModalVisibility(false)
    this.fetchData()
  }

  setModalVisibility = (visible) => {
    this.setState({
      visible
    })
  }

  handleSubmit = async (e) => {
    e.preventDefault()
    this.props.form.validateFields(async (err, values) => {
      if (!err) {
        // values
        await axios.post(
          `${process.env.API_URL}/employees`,
          values,
          {
            headers: { Authorization: `Bearer ${this.props.jwt}` }
          }
        )
        this.setModalVisibility(false)
        this.fetchData()
      }
    })
  }

  render() {
    const { getFieldDecorator } = this.props.form
    const list = this.state.employees.map(e => (<EmployeeItem
      confirmDelete={this.confirmDelete}
      key={uuidv1()}
      {...e}
    />))
    return (
      <div className='content__wrapper'>
        <Modal
          title='ADD NEW USER'
          visible={this.state.visible}
          onCancel={() => { this.setModalVisibility(false) }}
          footer={null}
        >
          <Typography>
            <Form onSubmit={this.handleSubmit} className='login-form'>
              <FormItem>
                {getFieldDecorator('firstName', {
                  rules: [{ required: true, message: 'Please enter first name' }],
                })(
                  <Input placeholder='First name' size='large' />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('lastName', {
                  rules: [{ required: true, message: 'Please enter last name' }],
                })(
                  <Input placeholder='Last name' size='large' />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('email', {
                  rules: [{ required: true, message: 'Please enter email' }],
                })(
                  <Input placeholder='Email' size='large' initialValue="" />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('password', {
                  rules: [{ required: true, message: 'Please enter password' }],
                })(
                  <Input placeholder='Password' initialValue="" type='password' size='large' />
                )}
              </FormItem>
              <FormItem>
                {getFieldDecorator('permissions', {
                  initialValue: 'employee',
                  rules: [{ required: true, message: 'Please select permissions' }],
                })(
                  <Select style={{ width: '100%' }} size='large'>
                    <Option value='employee'>Employee</Option>
                    <Option value='admin'>Admin</Option>
                  </Select>
                )}
              </FormItem>
              <FormItem className='text-center'>
                <MaterialButton variant="contained" color="primary" type='primary' htmlType='submit' className='login-form-button'>
                  Create account
              </MaterialButton>
              </FormItem>
            </Form>
          </Typography>
        </Modal>
        <div className='text-right'>

          <Fab color="primary" aria-label="add">
            <AddIcon onClick={() => { this.setModalVisibility(true) }} />
          </Fab>
        </div>
        {list}
      </div>
    )
  }
}

Employees.propTypes = {
  jwt: PropTypes.string
}

function mapStateToProps(state) {
  return {
    jwt: isLoggedInSelector(state)
  }
}

const EmployeesComponent = connect(
  mapStateToProps,
  null
)(Employees)

const WrappedEmployeesComponent = Form.create()(EmployeesComponent)

export default WrappedEmployeesComponent