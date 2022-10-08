import React, { useEffect, useState } from "react"
import { Result, Button, Spin, DatePicker, Form, TreeSelect, Select } from "antd"
import { Link } from "react-router-dom"

const Applicant = () => {
    const [dataLoaded, setDataLoaded] = useState(false)
    const [loading, setLoading] = useState(false)
    const [form] = Form.useForm();
    const { Option } = Select;
    const { TreeNode, SHOW_PARENT } = TreeSelect
    const [table, setTable] = useState(-1)
    const [sid, setSid] = useState([])
    const [star, setStar] = useState([])
    const [filter, setFilter] = useState({
        airports: [0]
    })

    useEffect(() => {
        _listApplicant()

        return () => { }
    }, [])

    // useEffect(() => {
    //     console.log(loading)
    // }, [loading])

    useEffect(() => {
        if (table !== -1 && table.length > 0) {
            // setDataLoaded(true);
        }
    }, [table])

    const _listApplicant = () => {

    }

    const onFinish = (values) => {
        console.log(values);
        // _searchAirport(values);
    }

    const renderAirportOptions = (data) => {
        if (data !== -1)
            return data?.map(s => (
                <TreeNode value={s.uid} title={s.icao} />
            ))
    }

    return (
        <Spin spinning={loading}>
            <div className="homepage row">
                <h1 className="row1">Coding Assignment</h1>
                <div>
                    <Button disabled={dataLoaded} onClick={()=>{}}>Load Data</Button>
                </div>
            </div>
            <div>
                <Form
                    className="row"
                    form={form}
                    layout={"horizontal"}
                    onFinish={onFinish}
                >
                    <Form.Item
                        name={"airport"}
                        label={"Airport"}
                        style={{ flex: 1 }}
                    >
                        <TreeSelect
                            showSearch
                            allowClear
                            multiple
                            treeDefaultExpandAll
                            treeCheckable
                            placeholder="Select Airports"
                            showCheckedStrategy={SHOW_PARENT}
                            filterTreeNode={(input, treenode) =>
                                treenode.title.toLowerCase().indexOf(input.toLowerCase()) >= 0
                            }
                        // value={filter.clinics}
                        // onChange={handleTreeSelectChange}
                        >
                            <TreeNode value={0} title="All">
                                {renderAirportOptions(table)}
                            </TreeNode>
                        </TreeSelect>
                    </Form.Item>
                    <Form.Item
                        label={"Top"}
                        name={"top"}
                    >
                        <Select defaultValue={2}
                        >
                            <Option value="1">1</Option>
                            <Option value="2">2</Option>
                            <Option value="3">3</Option>
                            <Option value="4">4</Option>
                            <Option value="5">5</Option>
                        </Select>
                    </Form.Item>
                    <Form.Item>
                        <Button
                            type="primary"
                            onClick={() => onFinish(form.getFieldsValue())}
                        >
                            Search
                        </Button>
                    </Form.Item>
                </Form>
            </div>
        </Spin>
    )
}

export default Applicant