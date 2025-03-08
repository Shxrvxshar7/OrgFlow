import React, { useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const ChartNode = styled.div`
  background: ${props => {
    switch (props.team) {
      case 'Leadership':
        return 'linear-gradient(135deg, #98FB98 0%, #90EE90 100%)';  // Mint green
      case 'Technology':
        return 'linear-gradient(135deg, #ADD8E6 0%, #87CEEB 100%)';  // Light blue
      case 'Business':
        return 'linear-gradient(135deg, #FFDAB9 0%, #FFE4B5 100%)';  // Peach
      case 'Finance':
        return 'linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%)';  // Lavender
      default:
        return 'linear-gradient(135deg, #F0F8FF 0%, #F5F5F5 100%)';  // Light neutral
    }
  }};
  border-radius: var(--radius-md);
  padding: 0.5rem;
  min-width: 150px;
  color: #222;  // Dark text for better contrast on light backgrounds
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
  box-shadow: var(--shadow-md);
  position: relative;
  transition: all 0.2s ease;

  ${props => {
    // Special color overrides for specific employees
    if (props.employeeId === '1') {  // Mark Hill (CEO)
      return `background: linear-gradient(135deg, #E0FFE0 0%, #C8F0C8 100%);`;  // Slightly stronger light green
    }
    if (props.employeeId === '4') {  // John Green (CFO)
      return `background: linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%);`;  // Finance (Lavender)
    }
    if (props.employeeId === '11') {  // Emma Wilson
      return `background: linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%);`;  // Finance (Lavender)
    }
    return '';
  }}

  ${props => props.isDragging && `
    box-shadow: var(--shadow-xl);
    transform: scale(1.02);
  `}

  ${props => props.isDroppable && `
    &::after {
      content: '';
      position: absolute;
      inset: 0;
      border: 2px dashed rgba(0, 0, 0, 0.3);  // Dark border for light backgrounds
      border-radius: var(--radius-md);
      pointer-events: none;
    }
  `}
`;

const ProfileImage = styled.img`
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  object-fit: cover;
`;

const EmployeeName = styled.div`
  font-size: 0.875rem;
  font-weight: 600;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const EmployeeRole = styled.div`
  font-size: 0.75rem;
  opacity: 0.9;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const TeamBadge = styled.div`
  font-size: 0.75rem;
  padding: 0.125rem 0.5rem;
  background: rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-xl);
  margin-top: 0.25rem;
`;

const EmployeeId = styled.div`
  font-size: 0.75rem;
  opacity: 0.7;
`;

const ManagerInfo = styled.div`
  font-size: 0.75rem;
  opacity: 0.8;
`;

const ChartLevel = styled.div`
  display: flex;
  gap: 0.75rem;
  justify-content: center;
  padding: 0.75rem 0;
  position: relative;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 50%;
    height: 0.75rem;
    width: 1px;
    background: var(--gray-200);
  }

  &::after {
    content: '';
    position: absolute;
    top: 0;
    left: 20%;
    right: 20%;
    height: 1px;
    background: var(--gray-200);
  }

  &:first-child {
    &::before, &::after {
      display: none;
    }
  }
`;

const ChartContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 1rem;
  overflow: auto;
  font-family: 'Montserrat', sans-serif;
  -webkit-overflow-scrolling: touch;

  .react-organizational-chart {
    width: fit-content;
    display: flex;
    justify-content: center;
    padding-top: 1rem;
    transform-origin: top center;
    transform: scale(${props => props.zoom});
    margin: 0 auto;
    transition: transform 0.2s ease;

    .org-chart-node {
      margin: 0 0.5rem;
      position: relative;
    }

    .org-chart-node:not(:only-child) {
      padding-top: 0.75rem;
    }

    .org-chart-node::before {
      content: '';
      height: 0.75rem;
      border-left: 2px solid #333;  // Darker and thicker connector line
      position: absolute;
      top: -0.75rem;
      left: 50%;
      transform: translateX(-50%);
    }

    .org-chart-node .org-chart-node::before {
      content: '';
      height: 0.75rem;
      border-left: 2px solid #333;  // Darker and thicker connector line
    }

    .org-chart-node .org-chart-node {
      border-left: 2px solid #333;  // Darker and thicker connector line
    }

    .org-chart-node .org-chart-node:last-child {
      border-left: none;
    }

    .org-chart-node .org-chart-node:first-child::before {
      border-radius: 4px 0 0 0;
    }

    .org-chart-node .org-chart-node:last-child::before {
      border-radius: 0 4px 0 0;
    }
  }
`;

const DropZone = styled.div`
  position: absolute;
  top: -20px;
  left: -20px;
  right: -20px;
  bottom: -20px;
  border-radius: var(--radius-md);
  pointer-events: all;
  z-index: -1;
  transition: all 0.2s ease;

  ${props => props.isDraggingOver && !props.isInvalid && `
    background: rgba(74, 144, 226, 0.15);
    border: 2px dashed var(--accent-blue);
    box-shadow: 0 0 0 10px rgba(74, 144, 226, 0.05);
  `}
  
  ${props => props.isDraggingOver && props.isInvalid && `
    background: rgba(255, 61, 113, 0.15);
    border: 2px dashed var(--error);
    box-shadow: 0 0 0 10px rgba(255, 61, 113, 0.05);
  `}
`;

const DropIndicator = styled.div`
  position: absolute;
  top: -30px;
  left: 50%;
  transform: translateX(-50%);
  background: ${props => props.isInvalid ? 'var(--error)' : 'var(--accent-blue)'};
  color: white;
  padding: 8px 16px;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  white-space: nowrap;
  opacity: ${props => props.isVisible ? 1 : 0};
  transform: ${props => props.isVisible ? 'translate(-50%, 0)' : 'translate(-50%, 10px)'};
  transition: all 0.2s ease;
  pointer-events: none;
  z-index: 2;
  box-shadow: var(--shadow-md);
`;

const OrganizationChart = ({ hierarchy, employees, selectedEmployee, zoom = 0.8 }) => {
  const getEmployeeNameById = (id) => {
    const employee = employees.find(emp => emp.id === id);
    return employee ? employee.name : 'None';
  };

  const renderNode = (node) => {
    const isCEO = node.designation.toLowerCase().includes('ceo');

    return (
      <Droppable droppableId={node.id} key={node.id}>
        {(provided, snapshot) => {
          const isInvalid = snapshot.isDraggingOver && (
            node.designation.toLowerCase().includes('analyst') ||
            node.id === snapshot.draggingOverWith
          );

          return (
            <div ref={provided.innerRef} {...provided.droppableProps}>
              <Draggable draggableId={node.id} index={0} isDragDisabled={isCEO}>
                {(provided, snapshot) => (
                  <div
                    ref={provided.innerRef}
                    {...provided.draggableProps}
                    {...provided.dragHandleProps}
                  >
                    <ChartNode
                      id={`employee-${node.id}`}
                      team={node.team}
                      employeeId={node.id}
                      isDragging={snapshot.isDragging}
                      isInvalid={isInvalid}
                      selected={selectedEmployee?.id === node.id}
                    >
                      <DropZone
                        isDraggingOver={snapshot.isDraggingOver}
                        isInvalid={isInvalid}
                      />
                      {snapshot.isDraggingOver && (
                        <DropIndicator isVisible isInvalid={isInvalid}>
                          {isInvalid ? 'Invalid Drop Target' : 'Drop to Change Manager'}
                        </DropIndicator>
                      )}
                      <ProfileImage 
                        src={node.profileUrl || `https://xsgames.co/randomusers/assets/avatars/${node.gender}/1.jpg`}
                        alt={node.name}
                      />
                      <EmployeeName>{node.name}</EmployeeName>
                      <EmployeeRole>{node.designation}</EmployeeRole>
                      <TeamBadge>{node.team}</TeamBadge>
                      <EmployeeId>ID: {node.id}</EmployeeId>
                      <ManagerInfo>
                        Manager: {node.manager ? `${getEmployeeNameById(node.manager)} (ID: ${node.manager})` : 'None'}
                      </ManagerInfo>
                    </ChartNode>
                  </div>
                )}
              </Draggable>
              {provided.placeholder}
            </div>
          );
        }}
      </Droppable>
    );
  };

  const renderTree = (node) => {
    if (!node) return null;
    return (
      <TreeNode label={renderNode(node)}>
        {node.children.map(child => renderTree(child))}
      </TreeNode>
    );
  };

  return (
    <ChartContainer zoom={zoom}>
      {hierarchy && (
        <Tree
          lineWidth="2px"
          lineColor="#333"
          lineBorderRadius="4px"
        >
          {renderTree(hierarchy)}
        </Tree>
      )}
    </ChartContainer>
  );
};

export default OrganizationChart;
