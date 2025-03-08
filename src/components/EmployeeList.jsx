import React from 'react';
import styled from 'styled-components';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
`;

const SearchInput = styled.input`
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    border-color: var(--primary-red);
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
  }
`;

const TeamSelect = styled.select`
  padding: 12px;
  border: 1px solid var(--border-light);
  border-radius: 8px;
  font-size: 14px;
  outline: none;
  cursor: pointer;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  &:focus {
    border-color: var(--primary-red);
    box-shadow: 0 0 0 3px rgba(255, 107, 107, 0.2);
  }
`;

const EmployeeCard = styled.div`
  background: ${props => props.teamColor || 'var(--white)'};
  color: ${props => props.teamColor ? 'var(--white)' : 'inherit'};
  border-radius: 8px;
  padding: 15px;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  cursor: grab;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: 1px solid var(--border-light);
  position: relative;
  overflow: hidden;
  transform-origin: center;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);

  ${props => props.selected && `
    border-color: var(--primary-red);
    box-shadow: 0 0 0 2px rgba(255, 107, 107, 0.2);
  `}

  ${props => props.isDragging && `
    transform: scale(1.02) rotate(1deg);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
  `}

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: 0 8px 20px rgba(0, 0, 0, 0.1);
    z-index: 1;
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
  }

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    width: 4px;
    height: 100%;
    background: ${props => props.teamColor || 'var(--primary-red)'};
    opacity: ${props => props.teamColor ? 0.8 : 1};
  }
`;

const EmployeeName = styled.h3`
  margin: 0 0 5px;
  font-size: 16px;
  font-weight: 600;
  color: inherit;
`;

const EmployeeDesignation = styled.p`
  margin: 0 0 8px;
  font-size: 14px;
  color: inherit;
  opacity: 0.9;
`;

const EmployeeTeam = styled.span`
  font-size: 12px;
  font-weight: 500;
  padding: 4px 8px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
  color: inherit;
  opacity: 0.9;
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: var(--text-light);
`;

const NoResults = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--text-light);
  font-size: 14px;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
`;

const getTeamColor = (team) => {
  const teamColors = {
    'Leadership': 'linear-gradient(135deg, #4CAF50, #45a049)',
    'Technology': 'linear-gradient(135deg, #2196F3, #1976d2)',
    'Business': 'linear-gradient(135deg, #FF9800, #f57c00)',
    'Finance': 'linear-gradient(135deg, #9C27B0, #7b1fa2)'
  };
  return teamColors[team] || null;
};

const EmployeeList = ({
  employees,
  teams,
  searchTerm,
  setSearchTerm,
  teamFilter,
  setTeamFilter,
  selectedEmployee,
  setSelectedEmployee,
  loading
}) => {
  if (loading) {
    return <LoadingSpinner>Loading employees...</LoadingSpinner>;
  }

  return (
    <ListContainer>
      <SearchContainer>
        <SearchInput
          type="text"
          placeholder="Search employees..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <TeamSelect
          value={teamFilter}
          onChange={(e) => setTeamFilter(e.target.value)}
        >
          <option value="">All Teams</option>
          {teams.map(team => (
            <option key={team} value={team}>{team}</option>
          ))}
        </TeamSelect>
      </SearchContainer>

      <Droppable droppableId="employee-list" isDropDisabled={true}>
        {(provided) => (
          <div ref={provided.innerRef} {...provided.droppableProps}>
            {employees.length === 0 ? (
              <NoResults>No employees found</NoResults>
            ) : (
              employees.map((employee, index) => (
                <Draggable
                  key={employee.id}
                  draggableId={employee.id}
                  index={index}
                >
                  {(provided, snapshot) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      onClick={() => setSelectedEmployee(employee)}
                      style={{
                        ...provided.draggableProps.style,
                        marginBottom: '10px'
                      }}
                    >
                      <EmployeeCard
                        selected={selectedEmployee?.id === employee.id}
                        isDragging={snapshot.isDragging}
                        teamColor={getTeamColor(employee.team)}
                      >
                        <EmployeeName>{employee.name}</EmployeeName>
                        <EmployeeDesignation>
                          {employee.designation}
                        </EmployeeDesignation>
                        <EmployeeTeam>
                          {employee.team}
                        </EmployeeTeam>
                      </EmployeeCard>
                    </div>
                  )}
                </Draggable>
              ))
            )}
            {provided.placeholder}
          </div>
        )}
      </Droppable>
    </ListContainer>
  );
};

export default EmployeeList;
