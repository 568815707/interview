import React from 'react'
import styled from 'styled-components'
import {withRouter} from 'react-router-dom'
import md5 from 'md5'
import {
  Form,
  Icon,
  Input,
  Button,
  message,
  Select,
} from 'antd'
import {Flex} from 'styled'
import {request} from 'utils'
import bg from './image/bg.jpg'

const { Item } = Form
const Option = Select.Option

@withRouter
@Form.create()
export default class Home extends React.Component {
  constructor() {
    super()
    this.state = {
      login: true,
      confirmDirty: false
    }
  }

  validFunction = (rule, value, callback) => {
    const reg = /^1[34578]\d{9}$/
    if (reg.test(value)) {
      callback()
    } else {
      callback('请输入正确的手机号')
    }
  }

  handleSubmit = (evt)=>{
    const {form,history} = this.props
    const {login} = this.state
    evt.preventDefault()
    form.validateFields((err, {user, pwd, confirm_pwd, name}) => {
      if(!err){
        if (login) {//登陆
          request({
            url: '/login',
            method: 'POST',
            data: {
              user,
              pwd: md5(pwd)
            }
          }).then(res=>{
            if(res && res.code === 200){
              localStorage.setItem('token', res.token)
              localStorage.setItem('token_exp', new Date().getTime());
              history.push('/interview')
            }
          })
        } else {//注册
          request({
            url: '/register',
            method: 'POST',
            data: {
              user,
              pwd: md5(pwd),
              name
            }
          }).then(res => {
            if (res) {
              this.setState({ login: true })
            }
          })
        }
      }
    })
  }

  compareToFirstPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && value !== form.getFieldValue('pwd')) {
      callback('两次密码不一致，请重新输入');
    } else {
      callback();
    }
  }

  validateToNextPassword = (rule, value, callback) => {
    const form = this.props.form;
    if (value && this.state.confirmDirty) {
      form.validateFields(['confirm_pwd'], { force: true });
    }
    callback();
  }

  getText(login){
    return login ? '登录' : '注册'
  }



  render() {
    const { getFieldDecorator } = this.props.form;
    const { login } = this.state

    const prefixSelector = getFieldDecorator('prefix', {
      initialValue: '86',
    })(
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
      </Select>
    );

    const confirmItem = login
    ? ''
    : (
      <div>
        <Item>
          {getFieldDecorator('confirm_pwd',{
            rules: [
              {
                required: true,
                message: '请输入确认密码'
              }, {
                validator: this.compareToFirstPassword,
              }
            ]
          })(
            <Input
              type="password"
              prefix={<Icon type='lock'/>}
              placeholder="请输入确认密码"
            />
          )}
        </Item>
        <Item>
          {getFieldDecorator('name',
            {
              rules: [{ required: true, message: '请输入姓名'}]
            })(
              <Input
                prefix={<Icon type='user'/>}
                placeholder="请输入姓名"
              />
            )
          }
        </Item>
      </div>
    )

    return (
      <Container justify="center" align="center">
        <FormBox>
          <FormHeader>{this.getText(login)}</FormHeader>
          <Form onSubmit={this.handleSubmit} >
            <Item extra='注：账号为手机号'>
              {getFieldDecorator('user',{
                rules:[
                  {
                    required: false,
                    message: '请输入账号',
                  }, {
                    validator: this.validFunction
                  }
                ]
              })(
                <Input
                  prefix={<Icon type='user'/>}
                  placeholder="请输入账号"
                  addonBefore={prefixSelector}
                />
              )}
            </Item>
            <Item>
              {getFieldDecorator('pwd',{
                rules: [
                  {
                    required: true,
                    message: '请输入密码'
                  }, {
                    validator: this.validateToNextPassword,
                  }
                ]
              })(
                <Input
                  type="password"
                  prefix={<Icon type='lock'/>}
                  placeholder="请输入密码"
                />
              )}
            </Item>
            {confirmItem}
            <Item>
              <Button
                htmlType="submit"
                type="primary"
                block
              >{this.getText(login)}</Button>
              <RegisterBtn
                onClick={ _ => this.setState({ login: !login })}
              >{this.getText(!login)}</RegisterBtn>
            </Item>
          </Form>
        </FormBox>
      </Container>
    )
  }
}

const Container = styled(Flex)`
  background: url(${bg});
  background-size: cover;
  height: 100%;
  width: 100%;
`

const FormBox = styled.div`
  width: 400px;
  padding: 10px 25px 0;
  margin-top:-50px;
  background-color: ${({theme}) => theme.layout_bg};
  border: 1px solid #dfe3e9;
  border-radius: 8px;
`
const FormHeader = styled.h1`
  text-align: center;
  color: ${({theme}) => theme.base_color};
`
const RegisterBtn = styled.a`
  float: right;
  cursor: pointer;
`

