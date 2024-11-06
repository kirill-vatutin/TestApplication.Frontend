import { Table, Button, Tooltip, message, Modal, Space } from 'antd';
import { PlusOutlined, DownloadOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons';
import type { ColumnsType } from 'antd/es/table';
import { useAppSelector, useAppDispatch } from '../hooks/redux';
import { fetchItems, deleteItem } from '../redux/slices/itemsSlice';
import { Item } from '../interfaces/item.interface';
import { useEffect } from 'react';
import { RootState } from '../redux/store';

interface ItemsTableProps {
  onEditItem: (item: Item) => void;
  onAddNew: () => void;
}

export const ItemsTable = ({ onEditItem, onAddNew }: ItemsTableProps) => {
  const dispatch = useAppDispatch();
  const { items, loading } = useAppSelector((state: RootState) => state.items);

  useEffect(() => {
    dispatch(fetchItems())
      .unwrap()
      .catch(error => message.error('Failed to load items: ' + error));
  }, [dispatch]);

  const handleDownloadExcel = async () => {
    try {
      const response = await fetch('/api/Items/download-excel');
      if (!response.ok) throw new Error('Download failed');
      
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = 'Items.xlsx';
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
      
      message.success('Excel file downloaded successfully');
    } catch  {
      message.error('Failed to download Excel file');
    }
  };

  const handleDelete = async (id: string) => {
    try {
      const confirmed = await Modal.confirm({
        title: 'Delete Item',
        content: 'Are you sure you want to delete this item?',
        okText: 'Yes',
        okType: 'danger',
        cancelText: 'No',
      });

      if (confirmed) {
        await dispatch(deleteItem(id)).unwrap();
        message.success('Item deleted successfully');
      }
    } catch (error) {
      message.error('Failed to delete item: ' + (error as Error).message);
    }
  };

  const columns: ColumnsType<Item> = [
    {
      title: 'Name',
      dataIndex: 'name',
      key: 'name',
      sorter: (a, b) => a.name.localeCompare(b.name),
      ellipsis: true,
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      ellipsis: true,
    },
    {
      title: 'Price',
      dataIndex: 'price',
      key: 'price',
      sorter: (a, b) => a.price - b.price,
      render: (price) => `$${price.toFixed(2)}`,
      align: 'right',
    },
    {
      title: 'Count',
      dataIndex: 'count',
      key: 'count',
      sorter: (a, b) => a.count - b.count,
      align: 'right',
    },
    {
      title: 'Category',
      dataIndex: 'categoryName',
      key: 'categoryName',
      ellipsis: true,
    },
    {
      title: 'Created',
      dataIndex: 'createdTime',
      key: 'createdTime',
      render: (date) => new Date(date).toLocaleDateString(),
      sorter: (a, b) => new Date(a.createdTime).getTime() - new Date(b.createdTime).getTime(),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 120,
      render: (_, record) => (
        <Space>
          <Tooltip title="Edit">
            <Button 
              type="link" 
              icon={<EditOutlined />} 
              onClick={() => onEditItem(record)}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button 
              type="link" 
              danger
              icon={<DeleteOutlined />} 
              onClick={() => handleDelete(record.id)}
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div className="table-container">
      <div className="toolbar">
        <Button 
          type="primary" 
          icon={<PlusOutlined />} 
          onClick={onAddNew}
        >
          Add New
        </Button>
        <Button 
          icon={<DownloadOutlined />} 
          onClick={handleDownloadExcel}
        >
          Export Excel
        </Button>
      </div>
      <Table
        columns={columns}
        dataSource={items}
        loading={loading}
        rowKey="id"
        pagination={false}
      />
    </div>
  );
}; 