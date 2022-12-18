import React, {useState} from 'react'
import TextArea from 'antd/es/input/TextArea'
import { CheckCircleOutlined } from '@ant-design/icons'
import LayoutContent from '../Components/Utility/layoutContent'
import LayoutContentWrapper from '../Components/Utility/layoutWrapper'
import { Col, Row, Divider, Form, Input, Button, Table, Progress, Typography, Select, Statistic, Tag, Space } from 'antd'

function Dashboard () {

	const [form] = Form.useForm()
	const { Title } = Typography

	const tasksList = JSON.parse(localStorage.getItem('tasks'))
	const [tasks, setTasks] = useState(tasksList ? Array.from(tasksList) : [])
  const [loading, setLoading] = useState(false)
	const status = ['TODO', 'INPROGRESS', 'DONE'] 
	const initialValues = {
		title: '',
		description: '',
		priority: null
	}

	const layout = {
		labelCol: { span: 8 },
		wrapperCol: { span: 16 },
	}

	const taskPercentage = (status) => {
		const tasksNum = tasks.length
		const task = []
		tasks.forEach(t => {
			if (t.status === status) {
				 task.push(task)
			}
		})

		return [task.length, parseInt((task.length / tasksNum) * 100)]
	}

	const allPercentage = () => {
		const doneTask = taskPercentage(status[2])
		const inprogressTask = taskPercentage(status[1])
		return inprogressTask[1] + doneTask[1]
	}

	const statusColor = (s) => {
		switch (s) {
			case status[0]:
				return 'orange'
			case status[1]:
				return 'blue'
			case status[2]:
				return 'green'
			default:
				return null

		}
	}

	const priorityLabel = (p) => {
		switch (p) {
			case 0:
				return ['Low', null]
			case 1:
				return ['Medium', 'cyan']
			case 2:
				return ['High', 'Red']
			default:
				return [null, null]
		}
	}

	const columns = [
		{
			title: 'Task Title',
			dataIndex: 'title',
			sorter: (a, b) => a.title > b.title
		},
		{
			title: 'Task Description',
			dataIndex: 'description'
		},
		{
			title: 'Priority',
			dataIndex: 'priority',
			sorter: (a, b) => a.priority - b.priority,
			render: (priority) => (
				<Tag color={priorityLabel(priority)[1]} key={priority}>
					{priorityLabel(priority)[0]}
				</Tag>
			)
		},
		{
			title: 'Status',
			dataIndex: 'status',
			render: (stat) => (
				<Tag color={statusColor(stat)} key={stat}>
					{stat}
				</Tag>
			)
		},
		{
			title: 'Action',
			key: 'action',
			render: (_, record) => (
			<>
				{record.status !== 'DONE' ?  <Space size="middle">
					<Button
						type={record.status === 'TODO' ? 'default' : 'primary'}
						onClick={() => updateStatus(record.id, record.status === 'TODO' ? status[1] : status[2])}>
             {record.status === 'TODO' ? 'In Progress' : 'Done'}
          </Button>
				</Space> : ''}
			</>
    ),
		}
	]

	const updateStatus = (id, status) => {
		const tasks = []
		tasksList.forEach(t => {
			if (t.id === id) {
				 t.status = status
			}
			tasks.push(t)
		})
		localStorage.setItem('tasks', JSON.stringify(tasks))
		setTasks(tasks)
	}

  const onSubmit = (values) => {
		setLoading(true)
		const params = {...values, 
			id: Date.now(),
			status: status[0]
		}

		try {

			localStorage.setItem('tasks', JSON.stringify([...tasks, params]))
			setTasks([...tasks, params])

			setLoading(false)
			form.resetFields()

		} catch (error) {
			setLoading(false)
    }
  }

  return (
    <LayoutContentWrapper style={{ height: '100%' }}>
      <LayoutContent>
				<Row justify={'center'}>
					<Col justify={'center'} span={12}>
						<Title level={4}>Create Task</Title>
						<Form
							{...layout}
							form={form} 
							name="control-hooks"
							onFinish={onSubmit}
							initialValues={initialValues}
						>
							<Form.Item
								name="title"
								rules={[{ required: true, message: 'Task Title' }]}
							>
								<Input placeholder='Enter Task Title' />
							</Form.Item> 
							<Form.Item
								name="description"
								rules={[{ required: true, message: 'Task Description' }]}
							>
								<TextArea placeholder='Enter Task Description' />
							</Form.Item>
							<Form.Item
								name="priority"	
							>
								<Select
									showSearch
									placeholder="Select Priority"
									optionFilterProp="children"
									filterOption={(input, option) =>
										(option?.label ?? '').toLowerCase().includes(input.toLowerCase())
									}
									options={[
										{
											value: 0,
											label: 'Low',
										},
										{
											value: 1,
											label: 'Medium',
										},
										{
											value: 2,
											label: 'High',
										},
									]}
								/>
							</Form.Item>
							<Button type="primary" htmlType="submit">Save</Button>
            </Form>
					</Col>
					<Col justify={'right'} span={6}>
						<Title level={4}>Progress Percetage</Title>
						<Progress percent={allPercentage()} success={{ percent: taskPercentage(status[2])[1] }} type="circle" />
					</Col>
					<Col justify={'center'} span={6}>
						<Title level={4}>Progress Info</Title>
						<Row gutter={16}>
							<Col span={8}>
								<Statistic title="Done" value={taskPercentage(status[2])[0]} prefix={<CheckCircleOutlined />} />
							</Col>
							<Col span={8}>
								<Statistic title="In Progress" value={taskPercentage(status[1])[0]}/>
							</Col>
							<Col span={8}>
								<Statistic title="To Do" value={taskPercentage(status[0])[0]}/>
							</Col>
						</Row>
					</Col>
				</Row>
				<Divider/>
				<Row justify={'center'}>
					<Col justify={'center'} span={18}>

						<Title level={4}>Tasks List</Title>
						<Table
							columns={columns}
							dataSource={tasks}
							loading={loading}
						/>
					</Col>
				</Row> 
      </LayoutContent>
    </LayoutContentWrapper>
  )
}

export default Dashboard