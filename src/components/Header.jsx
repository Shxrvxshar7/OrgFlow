import React, { useState } from 'react';
import styled from 'styled-components';

const HeaderContainer = styled.header`
  background: linear-gradient(135deg, #1a237e 0%, #0d47a1 100%);
  padding: 1.25rem 2rem;
  display: flex;
  align-items: center;
  justify-content: space-between;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  font-family: 'Montserrat', sans-serif;
  position: relative;
  z-index: 10;

  &::before {
    content: '';
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    height: 3px;
    background: linear-gradient(to right, 
      var(--success) 25%, 
      var(--accent-blue) 25%, 
      var(--accent-blue) 50%, 
      var(--warning) 50%, 
      var(--warning) 75%, 
      var(--info) 75%
    );
  }
`;

const LogoContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 2rem;
  cursor: pointer;
  padding-right: 2rem;
  border-right: 2px solid rgba(255, 255, 255, 0.1);
  transition: all 0.3s;

  &:hover {
    transform: translateX(5px);
  }
`;

const LogoText = styled.div`
  font-size: 2rem;
  font-weight: 700;
  color: white;
  letter-spacing: -1px;
  text-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);

  span {
    opacity: 0.9;
    color: var(--accent-blue);
  }
`;

const TitleContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const Title = styled.h1`
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  margin: 0;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const Subtitle = styled.p`
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  margin: 0.25rem 0 0;
  font-weight: 500;
`;

const ProfileSection = styled.div`
  display: flex;
  align-items: center;
  gap: 1rem;
  position: relative;
`;

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 0.75rem 1.25rem;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s;
  border: 1px solid rgba(255, 255, 255, 0.1);

  &:hover {
    background: rgba(255, 255, 255, 0.15);
    border-color: rgba(255, 255, 255, 0.2);
    transform: translateY(-1px);
  }

  &:active {
    transform: translateY(1px);
  }
`;

const ProfileInfo = styled.div`
  text-align: right;
`;

const ProfileName = styled.div`
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ProfileRole = styled.div`
  color: rgba(255, 255, 255, 0.8);
  font-size: 0.8rem;
  font-weight: 500;
`;

const ProfileInitials = styled.div`
  width: 2.5rem;
  height: 2.5rem;
  border-radius: 12px;
  background: linear-gradient(135deg, var(--accent-blue), #1565c0);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.1rem;
  font-weight: 600;
  color: white;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.1);
`;

const ProfileMenu = styled.div`
  position: absolute;
  top: 100%;
  right: 0;
  margin-top: 0.75rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
  padding: 0.5rem;
  display: ${props => props.isOpen ? 'block' : 'none'};
  z-index: 1000;
  min-width: 180px;
  border: 1px solid rgba(0, 0, 0, 0.1);
  transform-origin: top right;
  animation: ${props => props.isOpen ? 'menuSlideIn 0.2s ease-out' : 'none'};

  @keyframes menuSlideIn {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(-10px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;

const MenuItem = styled.button`
  width: 100%;
  padding: 0.75rem 1rem;
  border: none;
  background: none;
  color: var(--gray-800);
  font-family: 'Montserrat', sans-serif;
  font-size: 0.875rem;
  font-weight: 500;
  text-align: left;
  cursor: pointer;
  border-radius: 8px;
  transition: all 0.2s;
  display: flex;
  align-items: center;
  gap: 0.75rem;

  &:hover {
    background: var(--gray-100);
    color: var(--primary-blue);
  }

  svg {
    width: 18px;
    height: 18px;
    opacity: 0.7;
  }
`;

const ErrorMessage = styled.div`
  position: fixed;
  top: 24px;
  left: 50%;
  transform: translateX(-50%);
  background: var(--error);
  color: white;
  padding: 1rem 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 20px rgba(255, 61, 113, 0.25);
  z-index: 1000;
  font-family: 'Montserrat', sans-serif;
  font-weight: 500;
  animation: slideDown 0.3s ease-out;
  border: 1px solid rgba(255, 255, 255, 0.1);

  @keyframes slideDown {
    from {
      transform: translate(-50%, -100%);
      opacity: 0;
    }
    to {
      transform: translate(-50%, 0);
      opacity: 1;
    }
  }
`;

const Header = ({ errorMessage }) => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const handleLogoClick = () => {
    window.location.reload();
  };

  return (
    <>
      {errorMessage && <ErrorMessage>{errorMessage}</ErrorMessage>}
      <HeaderContainer>
        <LogoContainer onClick={handleLogoClick}>
          <LogoText>
            org<span>flow</span>
          </LogoText>
          <TitleContainer>
            <Title>Organization Chart</Title>
            <Subtitle>Manage your company's structure</Subtitle>
          </TitleContainer>
        </LogoContainer>
        <ProfileSection>
          <ProfileContainer onClick={() => setIsMenuOpen(!isMenuOpen)}>
            <ProfileInfo>
              <ProfileName>John Doe</ProfileName>
              <ProfileRole>Administrator</ProfileRole>
            </ProfileInfo>
            <ProfileInitials>JD</ProfileInitials>
          </ProfileContainer>
          <ProfileMenu isOpen={isMenuOpen}>
            <MenuItem>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
                <circle cx="12" cy="7" r="4"></circle>
              </svg>
              Profile
            </MenuItem>
            <MenuItem>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
                <polyline points="16 17 21 12 16 7"></polyline>
                <line x1="21" y1="12" x2="9" y2="12"></line>
              </svg>
              Logout
            </MenuItem>
          </ProfileMenu>
        </ProfileSection>
      </HeaderContainer>
    </>
  );
};

export default Header;
