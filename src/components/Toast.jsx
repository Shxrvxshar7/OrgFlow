import React from 'react';
import styled, { keyframes } from 'styled-components';

const slideIn = keyframes`
  from {
    transform: translateY(-100%);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

const ToastContainer = styled.div`
  position: fixed;
  top: 20px;
  right: 20px;
  z-index: 1000;
  animation: ${slideIn} 0.3s ease-out;
  min-width: 300px;
  padding: 1rem;
  border-radius: var(--radius-md);
  background: ${props => props.type === 'error' ? 'rgba(244, 67, 54, 0.95)' : 'rgba(76, 175, 80, 0.95)'};
  color: white;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-family: 'Montserrat', sans-serif;
`;

const Icon = styled.div`
  font-size: 1.5rem;
  line-height: 1;
`;

const Content = styled.div`
  flex: 1;
`;

const Title = styled.div`
  font-size: 1rem;
  font-weight: 600;
  margin-bottom: 0.25rem;
`;

const Message = styled.div`
  font-size: 0.875rem;
  opacity: 0.9;
`;

const Toast = ({ type = 'success', title, message, onClose }) => {
  React.useEffect(() => {
    const timer = setTimeout(() => {
      onClose();
    }, 3000);

    return () => clearTimeout(timer);
  }, [onClose]);

  return (
    <ToastContainer type={type}>
      <Icon>{type === 'error' ? '❌' : '✅'}</Icon>
      <Content>
        <Title>{title}</Title>
        <Message>{message}</Message>
      </Content>
    </ToastContainer>
  );
};

export default Toast;
