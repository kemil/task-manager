import React, { Component } from 'react'
import { Layout } from 'antd'
import AppHolder from './commonStyle'
import { ContainerOutlined } from '@ant-design/icons'
import TaskViews from './Page/TaskView'

const { Content, Header, Footer } = Layout
export class App extends Component {
  render() {
    const { height } = this.props
    const appHeight = window.innerHeight
    return (
        <AppHolder>
          <Layout style={{ height: appHeight }}>
            <Layout style={{ flexDirection: 'row', overflowX: 'hidden' }}>
              <Layout
                 className="layout"
                style={{
                  height: height
                }}
              >
                <Header>
                  <ContainerOutlined /> <b>Tasks Manager</b>
                </Header>
                <Content
                  className='isomorphicContent'
                  style={{
                    padding: '70px 0 0',
                    flexShrink: '0',
                    background: '#F4F6FF',
                    position: 'relative'
                  }}
                >
                  <TaskViews/>
                </Content>
                <Footer>Dec 2022</Footer>
              </Layout>
            </Layout>
          </Layout>
        </AppHolder>
    )
  }
}

export default App
