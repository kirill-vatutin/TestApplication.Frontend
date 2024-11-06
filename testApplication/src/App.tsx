import { Layout, theme } from 'antd';
import { ItemsTable } from './components/ItemsTable';
import { ItemForm } from './components/ItemForm';
import { useState } from 'react';
import { Item } from './interfaces/item.interface';
import './styles/App.css';

const { Header, Content, Footer } = Layout;

function App() {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [editingItem, setEditingItem] = useState<Item | undefined>(undefined);
  const { token } = theme.useToken();

  const handleAddNew = () => {
    setEditingItem(undefined);
    setIsModalVisible(true);
  };

  const handleEdit = (item: Item) => {
    setEditingItem(item);
    setIsModalVisible(true);
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    setEditingItem(undefined);
  };

  return (
    <Layout className="app-layout">
      <Header className="app-header">
        <h1>TestApp</h1>
      </Header>
      <Content className="app-content" style={{ background: token.colorBgLayout }}>
        <ItemsTable onEditItem={handleEdit} onAddNew={handleAddNew} />
        <ItemForm
          visible={isModalVisible}
          onCancel={handleCancel}
          initialValues={editingItem}
        />
      </Content>
      <Footer className="app-footer">
        TestApp ©{new Date().getFullYear()}
      </Footer>
    </Layout>
  );
}

export default App;
