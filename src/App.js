import { BrowserRouter } from 'react-router-dom';
import "antd/dist/antd.css"
import "./css/App.css"
import RoutePath from './utils/RoutePath';
import HeaderApp from './components/Component-HeaderApp';
import { Content } from 'antd/lib/layout/layout';
import { Layout } from 'antd';

function App() {
  return (
    <BrowserRouter>
      <Layout className="default-theme">
        <HeaderApp />
        <Content className="content">
          <RoutePath />
        </Content>
      </Layout>
    </BrowserRouter>
  );
}

export default App;
