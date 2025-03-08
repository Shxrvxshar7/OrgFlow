import React, { useState, useEffect } from 'react';
import styled from 'styled-components';
import { DragDropContext } from 'react-beautiful-dnd';
import Header from './components/Header';
import OrganizationChart from './components/OrganizationChart';
import Toast from './components/Toast';
import { employeeData } from './data/employees';

const AppContainer = styled.div`
  min-height: 100vh;
  background: #f5f7fa;
  font-family: 'Montserrat', sans-serif;
`;

const MainContent = styled.div`
  display: flex;
  padding: 1.5rem;
  gap: 1.5rem;
  height: calc(100vh - 80px);
  overflow: hidden;

  @media (max-width: 768px) {
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    height: auto;
    overflow: visible;
  }
`;

const Sidebar = styled.div`
  width: 400px;
  background: white;
  border-radius: 12px;
  padding: 1.5rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 1rem;
  overflow-y: auto;

  @media (max-width: 768px) {
    width: 100%;
    height: auto;
    max-height: ${props => props.isExpanded ? '400px' : '60px'};
    transition: max-height 0.3s ease;
    position: relative;
  }
`;

const ToggleButton = styled.button`
  display: none;
  position: absolute;
  right: 1rem;
  top: 1rem;
  background: var(--primary-blue);
  color: white;
  border: none;
  border-radius: var(--radius-md);
  padding: 0.5rem;
  cursor: pointer;
  z-index: 1;

  @media (max-width: 768px) {
    display: flex;
    align-items: center;
    justify-content: center;
  }

  &:hover {
    background: var(--accent-blue);
  }
`;

const SearchContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;

  @media (max-width: 768px) {
    padding-right: 3rem;
  }
`;

const SearchInput = styled.input`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--gray-900);
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }

  &::placeholder {
    color: var(--gray-400);
  }
`;

const TeamFilter = styled.select`
  width: 100%;
  padding: 0.75rem 1rem;
  border: 1px solid var(--gray-200);
  border-radius: var(--radius-md);
  font-size: 0.875rem;
  color: var(--gray-900);
  background: white;
  cursor: pointer;
  transition: all 0.2s;

  &:focus {
    outline: none;
    border-color: var(--accent-blue);
    box-shadow: 0 0 0 3px rgba(33, 150, 243, 0.1);
  }
`;

const EmployeeList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  flex: 1;
  overflow-y: auto;
  padding-right: 0.5rem;

  &::-webkit-scrollbar {
    width: 8px;
  }

  &::-webkit-scrollbar-track {
    background: var(--gray-100);
    border-radius: 4px;
  }

  &::-webkit-scrollbar-thumb {
    background: var(--gray-300);
    border-radius: 4px;
    border: 2px solid var(--gray-100);

    &:hover {
      background: var(--gray-400);
    }
  }
`;

const EmployeeCard = styled.div`
  padding: 1rem;
  background: ${props => props.selected ? 'var(--gray-100)' : 'transparent'};
  border-radius: var(--radius-md);
  cursor: pointer;
  transition: all 0.2s;
  display: flex;
  align-items: flex-start;
  gap: 1rem;

  &:hover {
    background: var(--gray-100);
  }

  ${props => props.selected && `
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  `}
`;

const ProfileImage = styled.img`
  width: ${props => props.size || '48px'};
  height: ${props => props.size || '48px'};
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid white;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
`;

const EmployeeInfo = styled.div`
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
`;

const EmployeeName = styled.div`
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--gray-900);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmployeeRole = styled.div`
  font-size: 1rem;
  color: var(--gray-600);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
`;

const EmployeeTeam = styled.div`
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--gray-500);
  padding: 0.25rem 0.5rem;
  background: ${props => {
    switch (props.team) {
      case 'Leadership':
        return 'rgba(76, 175, 80, 0.1)';
      case 'Technology':
        return 'rgba(33, 150, 243, 0.1)';
      case 'Business':
        return 'rgba(255, 152, 0, 0.1)';
      case 'Finance':
        return 'rgba(156, 39, 176, 0.1)';
      default:
        return 'rgba(144, 164, 174, 0.1)';
    }
  }};
  border-radius: 12px;
  width: fit-content;
`;

const ChartContainer = styled.div`
  flex: 1;
  background: white;
  border-radius: 12px;
  padding: 0.75rem;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  overflow: auto;
  position: relative;
  
  @media (max-width: 768px) {
    height: calc(100vh - 500px);
    min-height: 400px;
  }

  &::-webkit-scrollbar {
    width: 12px;
    height: 12px;
  }
  
  &::-webkit-scrollbar-track {
    background: var(--gray-100);
    border-radius: 6px;
  }
  
  &::-webkit-scrollbar-thumb {
    background: var(--gray-400);
    border-radius: 6px;
    border: 3px solid var(--gray-100);
    
    &:hover {
      background: var(--gray-500);
    }
  }
`;

const ZoomControls = styled.div`
  display: none;
  position: absolute;
  bottom: 1rem;
  right: 1rem;
  background: white;
  border-radius: var(--radius-md);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
  overflow: hidden;

  @media (max-width: 768px) {
    display: flex;
  }
`;

const ZoomButton = styled.button`
  background: white;
  border: 1px solid var(--gray-200);
  padding: 0.75rem;
  cursor: pointer;
  color: var(--gray-700);
  font-size: 1.25rem;
  display: flex;
  align-items: center;
  justify-content: center;

  &:hover {
    background: var(--gray-100);
  }

  &:first-child {
    border-right: none;
  }
`;

const App = () => {
  const [employees, setEmployees] = useState([]);
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTeam, setSelectedTeam] = useState('All');
  const [hierarchy, setHierarchy] = useState(null);
  const [toast, setToast] = useState(null);
  const [isSidebarExpanded, setIsSidebarExpanded] = useState(false);
  const [zoom, setZoom] = useState(0.8);

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (employees.length > 0) {
      setHierarchy(buildHierarchy(employees));
    }
  }, [employees]);

  const showToast = (type, title, message) => {
    setToast({ type, title, message });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchEmployees = async () => {
    try {
      if (process.env.NODE_ENV === 'production') {
        // In production, use static data
        setEmployees(employeeData.map(emp => ({
          ...emp,
          profileUrl: `https://xsgames.co/randomusers/assets/avatars/${emp.gender}/1.jpg`
        })));
      } else {
        // In development, use MirageJS
        const response = await fetch('/api/employees');
        const data = await response.json();
        setEmployees(data.employees);
      }
    } catch (error) {
      console.error('Error fetching employees:', error);
      showToast('error', 'Error', 'Failed to fetch employees');
    }
  };

  const handleDragEnd = async (result) => {
    if (!result.destination) return;

    const { draggableId, destination } = result;
    const newManagerId = destination.droppableId;
    const draggedEmployee = employees.find(emp => emp.id === draggableId);
    const newManager = employees.find(emp => emp.id === newManagerId);

    // Don't update if dropped on self or if new manager is an analyst
    if (draggableId === newManagerId || (newManager && newManager.designation.toLowerCase().includes('analyst'))) {
      showToast('error', 'Invalid Operation', 'Cannot assign this manager to the employee');
      return;
    }

    try {
      if (process.env.NODE_ENV === 'production') {
        // In production, update state directly
        const updatedEmployees = employees.map(emp => 
          emp.id === draggableId ? { ...emp, manager: newManagerId, team: newManager.team } : emp
        );
        setEmployees(updatedEmployees);
        setHierarchy(buildHierarchy(updatedEmployees));
        showToast(
          'success',
          'Manager Updated',
          `${draggedEmployee.name} is now reporting to ${newManager.name} in the ${newManager.team} team`
        );
      } else {
        // In development, use MirageJS API
        const response = await fetch(`/api/employees/${draggableId}`, {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ manager: newManagerId })
        });

        if (response.ok) {
          const updatedEmployees = employees.map(emp => 
            emp.id === draggableId ? { ...emp, manager: newManagerId, team: newManager.team } : emp
          );
          setEmployees(updatedEmployees);
          setHierarchy(buildHierarchy(updatedEmployees));
          showToast(
            'success',
            'Manager Updated',
            `${draggedEmployee.name} is now reporting to ${newManager.name} in the ${newManager.team} team`
          );
        } else {
          const error = await response.json();
          showToast('error', 'Update Failed', error.error);
        }
      }
    } catch (error) {
      console.error('Error updating employee manager:', error);
      showToast('error', 'Error', 'Failed to update employee position');
    }
  };

  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);
    
    if (query) {
      const matchedEmployee = employees.find(emp => 
        emp.name.toLowerCase().includes(query.toLowerCase()) ||
        emp.designation.toLowerCase().includes(query.toLowerCase()) ||
        emp.team.toLowerCase().includes(query.toLowerCase())
      );
      
      if (matchedEmployee) {
        setSelectedEmployee(matchedEmployee);
        const element = document.getElementById(`employee-${matchedEmployee.id}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      }
    }
  };

  const handleTeamFilter = (event) => {
    const team = event.target.value;
    setSelectedTeam(team);
    setSearchQuery(''); // Clear search when changing teams
  };

  const filteredEmployees = employees.filter(employee => {
    const searchLower = searchQuery.toLowerCase();
    const matchesSearch = searchQuery === '' || 
      employee.name.toLowerCase().includes(searchLower) ||
      employee.designation.toLowerCase().includes(searchLower) ||
      employee.team.toLowerCase().includes(searchLower);
    
    return matchesSearch && (selectedTeam === 'All' || employee.team === selectedTeam);
  });

  const teams = [...new Set(employees.map(emp => emp.team))].sort();

  const buildHierarchy = (employees) => {
    const employeeMap = new Map(employees.map(emp => [emp.id, { ...emp, children: [] }]));
    const root = { children: [] };

    for (const employee of employees) {
      const node = employeeMap.get(employee.id);
      if (!employee.manager) {
        root.children.push(node);
      } else {
        const manager = employeeMap.get(employee.manager);
        if (manager) {
          manager.children.push(node);
        }
      }
    }

    return root.children[0];
  };

  const handleEmployeeSelect = (employee) => {
    setSelectedEmployee(employee);
    const element = document.getElementById(`employee-${employee.id}`);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  const handleZoom = (delta) => {
    setZoom(prev => Math.max(0.5, Math.min(1.5, prev + delta)));
  };

  return (
    <AppContainer>
      {toast && (
        <Toast
          type={toast.type}
          title={toast.title}
          message={toast.message}
          onClose={() => setToast(null)}
        />
      )}
      <Header />
      <MainContent>
        <Sidebar isExpanded={isSidebarExpanded}>
          <ToggleButton onClick={() => setIsSidebarExpanded(!isSidebarExpanded)}>
            {isSidebarExpanded ? '▼' : '▲'}
          </ToggleButton>
          <div>
            <SearchContainer>
              <SearchInput
                type="text"
                placeholder="Search employees..."
                value={searchQuery}
                onChange={handleSearch}
              />
              <TeamFilter value={selectedTeam} onChange={handleTeamFilter}>
                <option value="All">All Teams</option>
                {teams.map(team => (
                  <option key={team} value={team}>{team}</option>
                ))}
              </TeamFilter>
            </SearchContainer>
          </div>
          <EmployeeList>
            {filteredEmployees.map(employee => (
              <EmployeeCard
                key={employee.id}
                selected={selectedEmployee?.id === employee.id}
                onClick={() => handleEmployeeSelect(employee)}
              >
                <ProfileImage 
                  src={employee.profileUrl || `https://xsgames.co/randomusers/assets/avatars/${employee.gender}/1.jpg`}
                  alt={employee.name}
                  size="48px"
                />
                <EmployeeInfo>
                  <EmployeeName>{employee.name}</EmployeeName>
                  <EmployeeRole>{employee.designation}</EmployeeRole>
                  <EmployeeTeam team={employee.team}>{employee.team}</EmployeeTeam>
                </EmployeeInfo>
              </EmployeeCard>
            ))}
          </EmployeeList>
        </Sidebar>
        <ChartContainer>
          <DragDropContext onDragEnd={handleDragEnd}>
            <OrganizationChart
              hierarchy={hierarchy}
              employees={employees}
              selectedEmployee={selectedEmployee}
              zoom={zoom}
            />
          </DragDropContext>
          <ZoomControls>
            <ZoomButton onClick={() => handleZoom(0.1)} title="Zoom In">+</ZoomButton>
            <ZoomButton onClick={() => handleZoom(-0.1)} title="Zoom Out">-</ZoomButton>
          </ZoomControls>
        </ChartContainer>
      </MainContent>
    </AppContainer>
  );
};

export default App;
