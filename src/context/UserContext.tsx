import React, { useEffect, useState, createContext, useContext } from 'react';
type Role = 'user' | 'pp_team' | 'approver' | 'admin'; // Added 'approver', kept 'admin' if needed

interface UserContextType {
  role: Role;
  setRole: (role: Role) => void;
  name: string;
  email: string;
  department: string;
  isAuthenticated: boolean;
}
const defaultContext: UserContextType = {
  role: 'user',
  setRole: () => {},
  name: 'Salem Doe',
  email: 'salem.doe@saib.com',
  department: 'Treasury',
  isAuthenticated: true
};
export const UserContext = createContext<UserContextType>(defaultContext);
export const UserProvider: React.FC<{
  children: React.ReactNode;
}> = ({
  children
}) => {
  const [role, setRole] = useState<Role>('user');
  const [name, setName] = useState('Salem Doe');
  const [email, setEmail] = useState('salem.doe@saib.com');

  // Update user data based on role
  useEffect(() => {
    switch (role) {
      case 'pp_team':
        setName('Khalid Al-Otaibi');
        setEmail('khalid.alotaibi@saib.com');
        break;
      case 'approver':
        setName('Ahmed Al-Rashid');
        setEmail('ahmed.alrashid@saib.com');
        break;
      case 'admin':
        setName('System Administrator');
        setEmail('admin@saib.com');
        break;
      default:
        // user
        setName('Salem Doe');
        setEmail('salem.doe@saib.com');
        break;
    }
  }, [role]);

  // Get department based on role
  const getDepartment = (role: Role): string => {
    switch (role) {
      case 'pp_team':
        return 'Policies & Procedures';
      case 'approver':
        return 'Compliance & Approval';
      case 'admin':
        return 'IT Administration';
      default:
        return 'Treasury';
    }
  };
  const userData = {
    name,
    email,
    department: getDepartment(role),
    isAuthenticated: true
  };
  return <UserContext.Provider value={{
    role,
    setRole,
    ...userData
  }}>
      {children}
    </UserContext.Provider>;
};
export const useUser = () => useContext(UserContext);