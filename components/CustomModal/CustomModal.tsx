import React from 'react';
import { Modal, ScrollArea, Group, type ModalProps } from '@mantine/core';

interface CustomModalProps extends ModalProps {
  actions: React.ReactNode;
} 

export function CustomModal({ opened, onClose, title, children, actions, ...rest }: CustomModalProps) {
  return (
    <Modal
      opened={opened}
      onClose={onClose}
      withCloseButton={false}
      size="lg"
      centered
      overlayProps={{ opacity: 0.55, blur: 3 }}
      styles={{
        body: {
          padding: 0,
        },
      }}
      {...rest}
    >
      <div style={{ display: 'flex', flexDirection: 'column', height: '70vh' }}>
        {/* Sticky Header */}
        <div
          style={{
            position: 'sticky',
            top: 0,
            background: 'white',
            zIndex: 1,
            padding: '16px 24px',
            borderBottom: '1px solid #eee',
            fontWeight: 600,
            fontSize: '1.2rem',
          }}
        >
          {title}
        </div>

        {/* Scrollable Content */}
        <ScrollArea style={{ flex: 1, padding: '16px 24px' }}>
          {children}
        </ScrollArea>

        {/* Button Group at Bottom */}
        <Group
          justify="flex-end"
          style={{
            position: 'sticky',
            bottom: 0,
            background: 'white',
            padding: '16px 24px',
            borderTop: '1px solid #eee',
            zIndex: 1,
          }}
        >
          {actions}
        </Group>
      </div>
    </Modal>
  );
}