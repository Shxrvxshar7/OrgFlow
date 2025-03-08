import React, { useState } from 'react';
import { Tree, TreeNode } from 'react-organizational-chart';
import styled from 'styled-components';
import { Droppable, Draggable } from 'react-beautiful-dnd';

const StyledNode = styled.div`
  padding: ${props => props.isCEO ? '1.25rem' : '1rem'};
  border-radius: var(--radius-lg);
  min-width: ${props => props.isCEO ? '240px' : '200px'};
  text-align: center;
  box-shadow: ${props => props.isCEO ? 'var(--shadow-lg)' : 'var(--shadow-md)'};
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  margin: 8px;
  background: ${props => {
    switch (props.team) {
      case 'Leadership':
        return 'linear-gradient(135deg, #4CAF50 0%, #45a049 100%)';
      case 'Technology':
        return 'linear-gradient(135deg, #2196F3 0%, #1976d2 100%)';
      case 'Business':
        return 'linear-gradient(135deg, #FF9800 0%, #f57c00 100%)';
      case 'Finance':
        return 'linear-gradient(135deg, #9C27B0 0%, #7b1fa2 100%)';
      default:
        return 'linear-gradient(135deg, #90A4AE 0%, #78909C 100%)';
    }
  }};
  color: white;
  user-select: none;
  cursor: ${props => props.isCEO ? 'not-allowed' : 'grab'};
  position: relative;
  transform-origin: center;
  z-index: 1;
  
  @media (max-width: 768px) {
    min-width: ${props => props.isCEO ? '200px' : '160px'};
    padding: ${props => props.isCEO ? '1rem' : '0.75rem'};
    margin: 6px;
  }
  
  &:hover {
    transform: ${props => props.isCEO ? 'none' : 'scale(1.05)'};
    box-shadow: ${props => props.isCEO ? 'var(--shadow-lg)' : 'var(--shadow-xl)'};
  }

  &:active {
    cursor: ${props => props.isCEO ? 'not-allowed' : 'grabbing'};
    transform: ${props => props.isCEO ? 'none' : 'scale(0.98)'};
  }
  
  ${props => props.selected && `
    border: 2px solid var(--accent-blue);
    box-shadow: 0 0 0 4px rgba(74, 144, 226, 0.3);
  `}
  
  ${props => props.isDragging && !props.isCEO && `
    opacity: 0.7;
    transform: scale(1.05) rotate(2deg);
    box-shadow: var(--shadow-xl);
  `}
  
  ${props => props.isInvalid && `
    cursor: not-allowed;
    opacity: 0.5;
  `}
`;

const DropZone = styled.div`
  position: absolute;
  top: -30px;
  left: -30px;
  right: -30px;
  bottom: -30px;
  border-radius: var(--radius-xl);
  pointer-events: all;
  z-index: -1;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${props => props.isDraggingOver && !props.isInvalid && `
    background: rgba(74, 144, 226, 0.15);
    border: 3px dashed var(--accent-blue);
    box-shadow: 0 0 0 10px rgba(74, 144, 226, 0.05);
  `}
  
  ${props => props.isDraggingOver && props.isInvalid && `
    background: rgba(255, 61, 113, 0.15);
    border: 3px dashed var(--error);
    box-shadow: 0 0 0 10px rgba(255, 61, 113, 0.05);
  `}
`;

const DropIndicator = styled.div`
  position: absolute;
  top: -40px;
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
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  pointer-events: none;
  z-index: 2;
  box-shadow: var(--shadow-md);
`;

const NodeContent = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.5rem;

  @media (max-width: 768px) {
    gap: 0.35rem;
  }
`;

const ProfileImage = styled.img`
  width: ${props => props.isCEO ? '56px' : '48px'};
  height: ${props => props.isCEO ? '56px' : '48px'};
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.8);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  object-fit: cover;

  @media (max-width: 768px) {
    width: ${props => props.isCEO ? '48px' : '40px'};
    height: ${props => props.isCEO ? '48px' : '40px'};
  }
`;

const NodeName = styled.div`
  font-size: ${props => props.isCEO ? '1.5rem' : '1.25rem'};
  font-weight: 600;
  color: white;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    font-size: ${props => props.isCEO ? '1.25rem' : '1rem'};
  }
`;

const NodeDesignation = styled.div`
  font-size: ${props => props.isCEO ? '1.125rem' : '1rem'};
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);

  @media (max-width: 768px) {
    font-size: ${props => props.isCEO ? '1rem' : '0.875rem'};
  }
`;

const NodeTeam = styled.div`
  font-size: 1rem;
  font-weight: 500;
  color: rgba(255, 255, 255, 0.9);
  background: rgba(0, 0, 0, 0.1);
  padding: 0.25rem 0.75rem;
  border-radius: 12px;

  @media (max-width: 768px) {
    font-size: 0.875rem;
    padding: 0.2rem 0.5rem;
  }
`;

const NodeId = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const NodeManager = styled.div`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin-top: 0.25rem;

  @media (max-width: 768px) {
    font-size: 0.75rem;
  }
`;

const ChartContainer = styled.div`
  height: 100%;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  padding: 0.5rem;
  overflow: auto;
  font-family: 'Montserrat', sans-serif;
  -webkit-overflow-scrolling: touch; /* Smooth scrolling on iOS */

  .react-organizational-chart {
    width: fit-content;
    display: flex;
    justify-content: center;
    padding-top: 0.5rem;
    transform-origin: top center;
    transform: scale(${props => props.zoom || 0.8});
    margin: 0 auto;
    transition: transform 0.3s ease;

    @media (max-width: 768px) {
      padding-top: 1rem;
      margin: 1rem auto;
    }

    .org-chart-node {
      margin: 0 10px;
      position: relative;

      @media (max-width: 768px) {
        margin: 0 6px;
      }
    }

    .org-chart-node:not(:only-child) {
      padding-top: 12px;
    }

    .org-chart-node::before {
      content: '';
      height: ${props => props.isCEO ? '0' : '12px'};
      border-left: 2px solid var(--gray-300);
      position: absolute;
      top: -12px;
      left: 50%;
      transform: translateX(-50%);
    }

    .org-chart-node .org-chart-node::before {
      content: '';
      height: 12px;
      border-left: 2px solid var(--gray-300);
    }

    .org-chart-node .org-chart-node {
      border-left: 2px solid var(--gray-300);
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
                    <StyledNode
                      id={`employee-${node.id}`}
                      isCEO={isCEO}
                      team={node.team}
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
                      <NodeContent>
                        <ProfileImage 
                          src={node.profileUrl || `https://xsgames.co/randomusers/assets/avatars/${node.gender}/1.jpg`}
                          alt={node.name}
                          isCEO={isCEO}
                        />
                        <NodeName isCEO={isCEO}>{node.name}</NodeName>
                        <NodeDesignation isCEO={isCEO}>{node.designation}</NodeDesignation>
                        <NodeTeam>{node.team}</NodeTeam>
                        <NodeId>ID: {node.id}</NodeId>
                        <NodeManager>
                          Manager: {node.manager ? `${getEmployeeNameById(node.manager)} (ID: ${node.manager})` : 'None'}
                        </NodeManager>
                      </NodeContent>
                    </StyledNode>
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
    <ChartContainer zoom={zoom} isCEO={hierarchy?.designation?.toLowerCase().includes('ceo')}>
      {hierarchy && (
        <Tree
          lineWidth="2px"
          lineColor="var(--gray-300)"
          lineBorderRadius="4px"
        >
          {renderTree(hierarchy)}
        </Tree>
      )}
    </ChartContainer>
  );
};

export default OrganizationChart;
