import { Form, Input, InputNumber, Button, Modal, message } from 'antd';
import { useAppDispatch } from '../hooks/redux';
import { createItem, updateItem } from '../redux/slices/itemsSlice';
import { Item } from '../interfaces/item.interface';

interface ItemFormProps {
  visible: boolean;
  onCancel: () => void;
  initialValues?: Item;
}

export const ItemForm = ({ visible, onCancel, initialValues }: ItemFormProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();

  const onFinish = async (values: any) => {
    try {
      if (initialValues) {
        await dispatch(updateItem({ 
          id: initialValues.id, 
          data: values 
        })).unwrap();
        message.success('Item updated');
      } else {
        await dispatch(createItem(values)).unwrap();
        message.success('Item created');
      }
      form.resetFields();
      onCancel();
    } catch  {
      message.error('Operation failed');
    }
  };

  return (
    <Modal
      title={initialValues ? 'Edit Item' : 'New Item'}
      open={visible}
      onCancel={onCancel}
      footer={null}
    >
      <Form
        form={form}
        onFinish={onFinish}
        initialValues={initialValues}
      >
        <Form.Item
          name="name"
          label="Name"
          rules={[{ required: true }]}
        >
          <Input />
        </Form.Item>

        <Form.Item
          name="description"
          label="Description"
        >
          <Input.TextArea />
        </Form.Item>

        <Form.Item
          name="price"
          label="Price"
          rules={[{ required: true }]}
        >
          <InputNumber min={0} />
        </Form.Item>

        <Form.Item
          name="count"
          label="Count"
          rules={[{ required: true }]}
        >
          <InputNumber min={1} />
        </Form.Item>

        {!initialValues && (
          <Form.Item
            name="categoryId"
            label="Category ID"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        )}

        <Form.Item>
          <Button onClick={onCancel}>Cancel</Button>
          <Button type="primary" htmlType="submit" style={{ marginLeft: 8 }}>
            {initialValues ? 'Update' : 'Create'}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
}; 