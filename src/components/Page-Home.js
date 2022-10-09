import React, { useEffect, useState } from "react"
import { Button, Spin, DatePicker, Form, Table, Empty, Modal, Input, notification, Select, Tag } from "antd"
import { useHistory } from "react-router-dom"
import moment from "moment"
import * as ApplicantService from "../service/ApplicantService"
import * as AccountService from "../service/AccountService"
import * as LoanService from "../service/LoanService"

const Home = () => {
    const history = useHistory()
    const [formApplicant] = Form.useForm()
    const [formLoan] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [table, setTable] = useState(-1)
    const [display, setDisplay] = useState([])
    const { Option } = Select

    const [openCreateApplicant, setOpenCreateApplicant] = useState(false)
    const [openCreateAccount, setOpenCreateAccount] = useState(false)
    const [selectedApplicant, setSelectedApplicant] = useState({})
    const [openCreateLoan, setOpenCreateLoan] = useState(false)
    const [selectedAccount, setSelectedAccount] = useState({})

    useEffect(() => {
        _listApplicant()

        return () => { }
    }, [])

    useEffect(() => {
        if (table !== -1 && table.length > 0) {
            let array = []
            for (let d of table) {
                let allLoans = d.accounts.map(s => s.loans).flat();

                let sum = 0;
                for (let l of allLoans) {
                    sum += (l?.amount ?? 0)
                }

                array.push({
                    ...d,
                    noAccount: d.accounts.length,
                    noLoan: allLoans.length,
                    // amount: allLoans.reduce(((a, b) => (a?.amount ?? 0) + (b?.amount ?? 0)), 0).toFixed(2)
                    amount: sum.toFixed(2)
                })
            }
            setDisplay(array);
        }
    }, [table])

    const handleOnRow = (value, index) => {
        return {
            onClick: (event) => {
                if (event.target.className !== 'noRowClick' && event.target.className !== '') {
                    history.push('applicant/' + value.id)
                }
            },
        }
    }

    const _listApplicant = async () => {
        setLoading(true);
        try {
            let result = await ApplicantService.listApplicant()
            console.log('_listApplicant result', result);

            let data = JSON.parse(result);
            console.log('_listApplicant data', data);

            setTable(data)

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const _createApplicant = async (values) => {
        setLoading(true);
        try {
            let variables = {
                name: values.name.trim()
            }
            let result = await ApplicantService.createApplicant(variables)
            console.log('_createApplicant result', result);

            notification.success({ message: "Applicant created." })
            formApplicant.resetFields()
            setOpenCreateApplicant(false);
            _listApplicant();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const _createAccount = async (values) => {
        setLoading(true);
        try {
            let result = await AccountService.createAccount(values.applicantID)
            console.log('_createAccount result', result);

            notification.success({ message: "Account created." })
            setOpenCreateAccount(false);
            _listApplicant();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const _createLoan = async (values) => {
        setLoading(true);
        try {
            let variables = {
                amount: Number(values.amount),
                start: values.start.utc().format('YYYY-MM-DDT00:00:00'),
                durationDays: Number(values.durationDays),
                type: values.type
            }
            let result = await LoanService.createLoan(values.applicantID, values.accountID, variables)
            console.log('_createLoan result', result);

            notification.success({ message: "Loan created." })
            formLoan.resetFields()
            setOpenCreateLoan(false);
            _listApplicant();
        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleOnClick = (record, state) => {
        switch (state) {
            case 'applicant':
                formApplicant.resetFields()
                setOpenCreateApplicant(true)
                break;
            case 'account':
                setOpenCreateAccount(true)
                setSelectedApplicant(record)
                break;
            case 'loan':
                formLoan.resetFields()
                setOpenCreateLoan(true)
                setSelectedAccount(record)
                setSelectedApplicant(display.find(s => s.id === record.applicantID))
                break;
            default:
                break;
        }
    }

    const onModalFinish = async (values, state) => {
        switch (state) {
            case 'applicant':
                await formApplicant.validateFields()
                _createApplicant({ ...values })
                break;
            case 'account':
                _createAccount({ applicantID: selectedApplicant.id })
                break;
            case 'loan':
                await formLoan.validateFields()
                _createLoan({ applicantID: selectedApplicant.id, accountID: selectedAccount.id, ...values })
                break;
            default:
                break;
        }
    }

    const columns = [
        {
            title: 'Applicant ID',
            dataIndex: 'id'
        },
        {
            title: 'Name',
            dataIndex: 'name'
        },
        {
            title: 'No. of Accounts',
            dataIndex: 'noAccount'
        },
        {
            title: 'No. of Loans',
            dataIndex: 'noLoan'
        },
        {
            title: 'Total Loan Amount ($)',
            dataIndex: 'amount'
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record, index) => {
                return (<Button type="link" onClick={() => { handleOnClick(record, 'account') }}>Create Account</Button>)
            },
        }
    ]

    const accountColumns = [
        {
            title: 'Account ID',
            dataIndex: 'id'
        },
        {
            title: 'No. of Loans',
            dataIndex: 'noLoan',
            render: (text, record, index) => {
                return (record.loans.length)
            }
        },
        {
            title: 'Total Loan Amount ($)',
            dataIndex: 'amount',
            render: (text, record, index) => {
                let sum = 0;
                for (let l of record.loans) {
                    sum += (l?.amount ?? 0)
                }
                // return record.loans && record.loans.length > 0 ? (record.loans?.reduce((a, b) => (a?.amount ?? 0) + (b?.amount ?? 0), 0).toFixed(2)) : ''
                return sum.toFixed(2)
            }
        },
        {
            title: 'Action',
            dataIndex: '',
            key: 'x',
            render: (text, record, index) => {
                return (<Button type="link" onClick={() => { handleOnClick(record, 'loan') }}>Create Loan</Button>)
            },
        }
    ]

    const loanColumns = [
        {
            title: 'Loan ID',
            dataIndex: 'id'
        },
        {
            title: 'Amount ($)',
            dataIndex: 'amount',
            redner: (text, record, index) => {
                return (Number(text).toFixed(2))
            }
        },
        {
            title: 'Duration (Days)',
            dataIndex: 'durationDays'
        },
        {
            title: 'Start Date',
            dataIndex: 'start',
            render: (text, record, index) => {
                return moment.utc(text).format('DD MMM YYYY, HH:mm')
            }
        },
        {
            title: 'Type',
            dataIndex: 'type',
            render: (text, record, index) => {
                let color = text === 'HOME' ? 'green' : (text === 'CAR' ? 'purple' : 'red')
                return (<Tag color={color}>{text}</Tag>)
            }
        }
    ]

    const expandedRowLoanRender = (record) => {
        return (
            record && record.length > 0 ?
                <div>
                    <Table
                        columns={loanColumns}
                        rowKey={record => record.id}
                        dataSource={record ?? []}
                        pagination={false}
                    />
                </div> : <Empty />
        )
    }

    const expandedRowAccountRender = (record) => {
        return (
            record && record.length > 0 ?
                <div>
                    <Table
                        columns={accountColumns}
                        rowKey={record => record.id}
                        dataSource={record}
                        expandable={{
                            expandedRowRender: record => (
                                expandedRowLoanRender(record.loans)
                            ),
                        }}
                        pagination={false}
                    />
                </div> : <Empty />
        )
    }

    return (
        <Spin spinning={loading}>
            <div className="homepage row">
                <h1 className="row1">Coding Assignment</h1>
                <div>
                    <Button onClick={() => { handleOnClick(null, 'applicant') }}>New Applicant</Button>
                </div>
            </div>
            <div>
                <Table
                    className="above-md"
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={display}
                    rowClassName={'table-row-clickable'}
                    expandable={{
                        expandedRowRender: record => (
                            expandedRowAccountRender(record.accounts)
                        ),
                    }}
                    pagination={false}
                />
            </div>
            <Modal
                open={openCreateApplicant}
                title={`Register a new Applicant?`}
                onCancel={() => { setOpenCreateApplicant(false) }}
                onOk={() => { onModalFinish(formApplicant.getFieldsValue(), 'applicant') }}
                okText="Create Applicant"
            >
                <Form
                    form={formApplicant}
                    onFinish={() => onModalFinish(formApplicant.getFieldsValue(), 'applicant')}
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[{
                            required: true
                        }, {
                            message: "Only Accepts Alphabet",
                            pattern: new RegExp('^[a-zA-Z ]+$'),
                        }]}
                    >
                        <Input autoComplete="off" placeholder="Applicant's name" />
                    </Form.Item>
                </Form>
            </Modal>
            <Modal
                open={openCreateAccount}
                title={`Want to create New Account for ${selectedApplicant.name}`}
                onCancel={() => { setOpenCreateAccount(false); setSelectedApplicant({}) }}
                onOk={() => { onModalFinish(null, 'account') }}
            >
                {/* <Form
                    form={formAccount}
                    onFinish={() => onModalFinish(formAccount.getFieldsValue(), 'account')}
                >
                </Form> */}
            </Modal>
            <Modal
                open={openCreateLoan}
                title={`Create New Loan for ${selectedApplicant.name}, Account ID ${selectedAccount.id}`}
                okText="Create"
                onCancel={() => { setOpenCreateLoan(false); setSelectedApplicant({}); setSelectedAccount({}) }}
                onOk={() => { onModalFinish(formLoan.getFieldsValue(), 'loan') }}
            >
                <Form
                    form={formLoan}
                    onFinish={() => onModalFinish(formLoan.getFieldsValue(), 'loan')}
                >
                    <Form.Item
                        label="Amount ($)"
                        name="amount"
                        rules={[{
                            required: true
                        }, {
                            message: "Invalid Amount",
                            pattern: new RegExp('^[+]?([0-9]*[.])?[0-9]+$'),
                        }]}
                    >
                        <Input autoComplete="off" placeholder="Amount to loan" />
                    </Form.Item>
                    <Form.Item
                        label="Start"
                        name="start"
                        rules={[{
                            required: true
                        }]}
                    >
                        <DatePicker format={'DD MMM YYYY'} />
                    </Form.Item>
                    <Form.Item
                        label="Duration (Days)"
                        name="durationDays"
                        rules={[{
                            required: true
                        }, {
                            message: "Invalid Days",
                            pattern: new RegExp('^[+]?([1-9][0-9]*)$'),
                        }]}
                    >
                        <Input autoComplete="off" placeholder="Days to loan" />
                    </Form.Item>
                    <Form.Item
                        label="Type"
                        name="type"
                        rules={[{
                            required: true
                        }]}
                    >
                        <Select
                            placeholder="Loan Type"
                        >
                            <Option key="CAR" value="CAR">Car</Option>
                            <Option key="HOME" value="HOME">Home</Option>
                        </Select>
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    )
}

export default Home