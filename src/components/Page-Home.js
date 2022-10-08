import React, { useEffect, useState } from "react"
import { Result, Button, Spin, DatePicker, Form, TreeSelect, Select, Table, Empty, Modal } from "antd"
import { Link, useHistory } from "react-router-dom"
import moment from "moment"
import * as ApplicantService from "../service/ApplicantService"

const Home = () => {
    const [dataLoaded, setDataLoaded] = useState(false)
    const history = useHistory()
    const [formAccount] = Form.useForm()
    const [formLoan] = Form.useForm()
    const [loading, setLoading] = useState(false)
    const [table, setTable] = useState(-1)
    const [display, setDisplay] = useState([])

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
                console.log(allLoans);
                array.push({
                    ...d,
                    noAccount: d.accounts.length,
                    noLoan: allLoans.length,
                    amount: allLoans.reduce(((a, b) => (a?.amount ?? 0) + (b?.amount ?? 0)), 0).toFixed(2)
                })
            }
            setDisplay(array);
        }
    }, [table])

    const handleNewApplicant = async () => {

    }

    const handleOnRow = (value, index) => {
        return {
            onClick: (event) => {
                // console.log(event.target.className);
                if (event.target.className !== 'noRowClick' && event.target.className !== '') {
                    history.push('applicant/' + value.id)
                }
            },
        }
    }

    const onFinish = (values) => {
        console.log(values);
    }

    const _listApplicant = async () => {
        setLoading(true);
        try {
            // console.log(await Auth.signOut());
            // console.log(await Auth.currentCredentials());
            // console.log(await Auth.currentAuthenticatedUser());
            let result = await ApplicantService.listApplicant()
            console.log('result', result);

            let data = JSON.parse(result);
            console.log('data', data);

            setTable(data)

        } catch (err) {
            console.log(err);
        } finally {
            setLoading(false);
        }
    }

    const handleOnClick = (record, state) => {
        console.log(record)
        switch (state) {
            case 'account':
                setOpenCreateAccount(true)
                setSelectedApplicant(record)
                break;
            case 'loan':
                setOpenCreateLoan(true)
                setSelectedAccount(record)
                setSelectedApplicant(display.find(s=> s.id === record.applicantID))
                break;
            default:
                break;
        }
    }

    const onModalFinish = (values, state) => {
        switch (state) {
            case 'account':
                // link api to create account
                break;
            case 'loan':
                // link api to create loan
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
            title: 'Total Loan Amount',
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
            title: 'Total Loan Amount',
            dataIndex: 'amount',
            render: (text, record, index) => {
                console.log('loan amount', record)
                return record.loans && record.loans.length > 0 ? (record.loans?.reduce((a, b) => (a?.amount ?? 0) + (b?.amount ?? 0)), 0).toFixed(2) : ''
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
            title: 'Amount',
            dataIndex: 'amount'
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
                    <Button disabled={dataLoaded} onClick={handleNewApplicant}>New Applicant</Button>
                </div>
            </div>
            <div>
                <Table
                    className="above-md"
                    columns={columns}
                    rowKey={record => record.id}
                    dataSource={display}
                    // pagination={table.pagination}
                    // loading={table.loading}
                    // scroll={{ x: 1200, y: '55vh' }}
                    // onChange={handleTableChange}
                    // onRow={handleOnRow}
                    rowClassName={'table-row-clickable'}
                    expandable={{
                        expandedRowRender: record => (
                            expandedRowAccountRender(record.accounts)
                        ),
                    }}
                />
            </div>
            <Modal
                open={openCreateAccount}
                title={`Want to create New Account for ${selectedApplicant.name}`}
                onCancel={() => { setOpenCreateAccount(false); setSelectedApplicant({}) }}
                onOk={() => {onModalFinish(null, 'account')}}
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
                onCancel={() => { setOpenCreateLoan(false); setSelectedApplicant({}); setSelectedAccount({}) }}
                onOk={() => {onModalFinish(formLoan.getFieldsValue(), 'loan')}}
            >
                <Form
                    form={formLoan}
                    onFinish={() => onModalFinish(formLoan.getFieldsValue(), 'loan')}
                >
                    <Form.Item>
                        
                    </Form.Item>
                </Form>
            </Modal>
        </Spin>
    )
}

export default Home