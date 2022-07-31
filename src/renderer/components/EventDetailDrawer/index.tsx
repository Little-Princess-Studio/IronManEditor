import React from 'react';
import JSONSchemaForm from '@rjsf/antd';
import { Drawer, Form, Input } from 'antd';
import { isEmpty } from 'lodash-es';
import './index.less';

const TextArea = Input.TextArea;

interface OwnerProps {
  visible: boolean;
  event?: any;
  onClose?: () => void;
}

const EventDetailDrawer: React.FC<OwnerProps> = ({ event, visible, onClose }) => {
  const renderEventDetail = () => {
    if (isEmpty(event)) {
      return null;
    }

    if (event.schema) {
      return <JSONSchemaForm schema={event.schema} />;
    }

    return (
      <Form layout="vertical" style={{ height: '100%' }}>
        <Form.Item noStyle name="raw" initialValue={JSON.stringify(event.rawData, null, '\r')}>
          <TextArea bordered style={{ width: '100%', height: '100%' }} />
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
