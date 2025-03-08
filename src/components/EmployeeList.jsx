import React from 'react';
import styled from 'styled-components';
import { Draggable, Droppable } from 'react-beautiful-dnd';

const ListContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-bottom: 20px;
  width: 100%;  // Ensure container takes full width
  background: transparent;  // Ensure no background color interferes with card gradients
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`;

const SearchInput = styled.input`
  padding: 8px 12px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  width: 100%;
  transition: all 0.2s ease;

  &:focus {
    outline: none;
    border-color: var(--gray-400);
    box-shadow: var(--shadow-sm);
  }

  &::placeholder {
    color: var(--gray-400);
  }
`;

const TeamSelect = styled.select`
  padding: 8px 12px;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  width: 100%;
  transition: all 0.2s ease;
  background: white;
  cursor: pointer;

  &:focus {
    outline: none;
    border-color: var(--gray-400);
    box-shadow: var(--shadow-sm);
  }

  & option {
    padding: 8px;
    margin: 4px 0;
  }
`;

const TeamOption = styled.option`
  background: ${props => {
    switch (props.value) {
      case 'Leadership':
        return '#98FB98';  // Mint green
      case 'Technology':
        return '#ADD8E6';  // Light blue
      case 'Business':
        return '#FFDAB9';  // Peach
      case 'Finance':
        return '#E6E6FA';  // Lavender
      default:
        return '#F5F5F5';  // Light neutral
    }
  }};
  color: #222;
`;

const NoResults = styled.div`
  text-align: center;
  padding: 20px;
  color: var(--gray-500);
  font-size: 0.875rem;
  background: white;
  border-radius: var(--radius-md);
  border: 1px dashed var(--gray-200);
`;

const getTeamGradient = (team, employeeId) => {
  // Special color overrides for specific employees
  if (employeeId === '4') {  // John Green (CFO)
    return 'linear-gradient(135deg, #FFDAB9 0%, #FFE4B5 100%)';  // Business (Peach)
  }
  if (employeeId === '11') {  // Emma Wilson
    return 'linear-gradient(135deg, #E6E6FA 0%, #D8BFD8 100%)';  // Finance (Lavender)
  }

  // Default team colors
  switch (team) {
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
};

const EmployeeCard = styled.div`
  background: ${props => getTeamGradient(props.team, props.employeeId)};
  color: #222;  // Dark text for better contrast on light backgrounds
  border-radius: var(--radius-md);
  padding: 15px;
  margin-bottom: 10px;  // Add consistent spacing between cards
  cursor: grab;
  user-select: none;
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  border: none;
  position: relative;
  overflow: hidden;
  transform-origin: center;
  animation: fadeIn 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  box-shadow: var(--shadow-md);
  width: 100%;  // Ensure card takes full width
  backdrop-filter: blur(8px);  // Add subtle blur effect to enhance gradient

  ${props => props.selected && `
    box-shadow: var(--shadow-inner);
    transform: scale(0.98);
  `}

  ${props => props.isDragging && `
    transform: scale(1.02) rotate(1deg);
    box-shadow: var(--shadow-xl);
  `}

  &:hover {
    transform: translateY(-4px) scale(1.02);
    box-shadow: var(--shadow-lg);
    z-index: 1;
  }

  &:active {
    cursor: grabbing;
    transform: scale(0.98);
    box-shadow: var(--shadow-inner);
  }
`;

const EmployeeName = styled.h3`
  margin: 0 0 5px;
  font-size: 0.875rem;
  font-weight: 600;
  font-family: 'Montserrat', sans-serif;
  color: #222;
`;

const EmployeeDesignation = styled.p`
  margin: 0;
  font-size: 0.875rem;
  font-family: 'Montserrat', sans-serif;
  color: #444;
  opacity: 0.9;
`;

const EmployeeTeam = styled.span`
  display: inline-block;
  padding: 6px 12px;
  margin-top: 8px;
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  font-weight: 500;
  font-family: 'Montserrat', sans-serif;
  background: ${props => getTeamGradient(props.team, props.employeeId)};
  color: #222;
  box-shadow: var(--shadow-sm);
  transition: all 0.2s ease;
  backdrop-filter: blur(8px);  // Add subtle blur effect to enhance gradient

  &:hover {
    transform: translateY(-1px);
    box-shadow: var(--shadow-md);
  }
`;

const LoadingSpinner = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
  color: var(--text-light);
`;

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
          <TeamOption value="">All Teams</TeamOption>
          {teams.map(team => (
            <TeamOption key={team} value={team}>{team}</TeamOption>
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
                        team={employee.team}
                        employeeId={employee.id}
                        selected={selectedEmployee?.id === employee.id}
                        isDragging={snapshot.isDragging}
                      >
                        <EmployeeName>{employee.name}</EmployeeName>
                        <EmployeeDesignation>{employee.designation}</EmployeeDesignation>
                        <EmployeeTeam team={employee.team} employeeId={employee.id}>
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
