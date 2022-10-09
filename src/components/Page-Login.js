import React, { useContext, useEffect, useState } from "react"
import { Button, Checkbox, Form, Input, notification, Spin, Tabs } from "antd"
import { UserOutlined, LockOutlined, QuestionCircleOutlined } from "@ant-design/icons"
import { Link, useHistory } from "react-router-dom"

import { AppContext } from '../contexts/AppContext'

import * as LoginService from "../service/LoginService"

const Login = (props) => {
    const { appState, actionLogin } = useContext(AppContext)
    const { from } = props.location.state || { from: "/" }
    const history = useHistory()
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false)
    const validateMessages = {
        required: "This field is required.",
        types: {
            email: "This is not a valid email.",
        },
    }

    useEffect(() => {
        if (appState.isLoggedIn) {
            history.push(from)
        } else {
            if (localStorage.getItem("remember") !== null) {
                form.setFieldsValue({
                    username: localStorage.getItem("remember"),
                    remember: true,
                })
            }
            else {
                form.setFieldsValue({
                    remember: false
                })
            }
        }
        return () => { }
    }, [])

    const onFinish = async (values) => {
        try {
            let result = await LoginService.login(values.username, values.password);
            actionLogin(JSON.parse(result));

            if (values.remember) {
                localStorage.setItem("remember", values.username)
            }

            history.push("/");
        } catch (error) {
            console.log("error signing in: ", error);
            notification.error({
                message: error.message
            })
            setLoading(false)
        }

        // const timer = setTimeout(() => {
        //     setLoading(false)
        //     clearTimeout(timer)
        // }, 1000)
    }

    const handleCheckChange = (e) => {
        if (form.getFieldValue("remember") === false) {
            localStorage.removeItem("isap_remember_site")
        }
    }

    return (
        <div className="login">
            <div className="container-login">
                <div className="login-body">
                    <div className="login-header">
                        <QuestionCircleOutlined />
                    </div>
                    <div className="login-subheader">
                        Login
                    </div>
                    <div className="login-content">
                        <Spin spinning={loading}>
                            <Form
                                form={form}
                                name="normal_login"
                                className="login-form"
                                onFinish={onFinish}
                                validateMessages={validateMessages}
                            >
                                <Form.Item
                                    name="username"
                                    rules={[
                                        {
                                            required: true,
                                        },
                                    ]}
                                >
                                    <Input autoComplete="off" prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Phone number, username, or email" />
                                </Form.Item>
                                <Form.Item
                                    name="password"
                                    rules={[
                                        {
                                            required: true,
                                            message: 'Please input your Password.',
                                        },
                                    ]}
                                >
                                    <Input.Password
                                        prefix={<LockOutlined className="site-form-item-icon" />}
                                        type="password"
                                        placeholder="Password"
                                    />
                                </Form.Item>
                                <Form.Item>
                                    <Form.Item name="remember" valuePropName="checked" noStyle>
                                        <Checkbox onChange={handleCheckChange}>Remember me</Checkbox>
                                    </Form.Item>
                                </Form.Item>

                                <Form.Item>
                                    <Button type="primary" htmlType="submit" className="login-form-button">
                                        Log In
                                    </Button>
                                </Form.Item>
                            </Form>
                        </Spin>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login