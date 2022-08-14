import React from 'react';
import JSONSchemaForm from '@rjsf/antd';
import { Drawer, Form, Input, Button } from 'antd';
import { isEmpty } from 'lodash-es';
import './index.less';

const TextArea = Input.TextArea;

interface OwnerProps {
  visible: boolean;
  event?: any;
  onClose?: () => void;
  onSubmit?: (values) => void;
}

const EventDetailDrawer: React.FC<OwnerProps> = ({ event, visible, onClose, onSubmit }) => {
  const renderEventDetail = () => {
    if (isEmpty(event)) {
      return null;
    }

    if (event.schema) {
      return <JSONSchemaForm schema={event.schema} formData={event.rawData} onSubmit={(values) => onSubmit?.(values.formData)} />;
    }

    return (
      <Form layout="vertical" style={{ height: '100%' }} onFinish={(values) => onSubmit?.(JSON.parse(values.raw))}>
        <Form.Item
          name="raw"
          initialValue={JSON.stringify(event.rawData, null, '\t')}
          rules={[
            {
              validator(_, value) {
                try {
                  JSON.parse(value);
                } catch (err) {
                  return Promise.reject(new Error('invalid json data'));
                }
                return Promise.resolve();
              },
            },
          ]}
        >
          <TextArea bordered rows={30} />
        </Form.Item>
        <Form.Item style={{ marginTop: 16 }}>
          <Button type="primary" htmlType="submit">
            Submit
          </Button>
        </Form.Item>
      </Form>
    );
  };

  return (
    <Drawer visible={visible} onClose={onClose} width={500} placement="right">
      {renderEventDetail()}
    </Drawer>
  );
};

export default EventDetailDrawer;
