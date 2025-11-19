import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

interface User {
  id: string;
  full_name: string;
  email: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  opening_hours: {
    start: number;
    end: number;
  }
}

interface AuthContextType {
  user: User | null;
  updateUser: (user: User) => void;
  login: (email: string, password: string) => Promise<void>;
  signup: (data: SignupData) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

interface SignupData {
  full_name: string;
  email: string;
  password?: string;
  phone: string;
  street: string;
  number: string;
  complement?: string;
  neighborhood: string;
  city: string;
  state: string;
  zip_code: string;
  opening_hours: {
    start: number;
    end: number;
  }
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;
  const [user, setUser] = useState<User | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    async function validateUser() {
      const storedUser = localStorage.getItem('user');
      if (!storedUser) {
        logout();
        return;
      }
      const user = JSON.parse(storedUser);
      setUser(user);

      try {
        const findUserRes = await axios.get(`${apiBaseUrl}/seller/${user.id}`, {
          withCredentials: true,
        });

        if (!findUserRes.data?.id) {
          logout();
          return;
        }

        navigate('/dashboard')
      } catch (error) {
        logout();
      }
    }

    validateUser()

  }, []);


  const login = async (email: string, password: string) => {
    const loginRes = await axios.post(
      `${apiBaseUrl}/auth/login`,
      {
        email,
        password
      },
      {
        withCredentials: true
      }
    )

    const { user } = loginRes.data;

    const findUserRes = await axios.get(`${apiBaseUrl}/seller/${user.id}`);
    const foundUser: User = {
      ...findUserRes.data,
    };

    setUser(foundUser);
    localStorage.setItem('user', JSON.stringify(foundUser));
    navigate('/dashboard');
  };

  const signup = async (data: SignupData) => {
    const payload = {
      ...data
    }
    const createUserRes = await axios.post(`${apiBaseUrl}/seller`, payload);

    setUser(createUserRes.data);
    localStorage.setItem('user', JSON.stringify(createUserRes.data));
    navigate('/login');
  };

  const logout = async () => {
    await axios.post(`${apiBaseUrl}/auth/logout`, {}, {
      withCredentials: true
    });
    setUser(null);
    localStorage.removeItem('user');

    navigate('/login');
  };

  const updateUser = (user: User) => {
    setUser(user);
    localStorage.setItem('user', JSON.stringify(user));
  }

  return (
    <AuthContext.Provider value={{
      user,
      updateUser,
      login,
      signup,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
