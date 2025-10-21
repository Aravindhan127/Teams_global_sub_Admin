// ** React Imports
import { createContext, useEffect, useState } from 'react'

// ** Next Import
import { useNavigate, useSearchParams } from 'react-router-dom'

// ** Axios
import axios from 'axios'

// ** Config
import authConfig from '../configs/auth'
import FallbackSpinner from 'src/@core/components/spinner'
import { ApiEndPoints } from 'src/network/endpoints'

// ** Defaults
const defaultProvider = {
  user: null,
  loading: true,
  setUser: () => null,
  setLoading: () => Boolean,
  isInitialized: false,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  setIsInitialized: () => Boolean,
  register: () => Promise.resolve(),
  rolePremission: null,
  setRolePermission: () => null,
  isMasterAdmin: false,
  setIsMasterAdmin: () => Boolean,
  isCompletedProfile: false,
  setIsCompletedProfile: () => Boolean
}
const AuthContext = createContext(defaultProvider)

const AuthProvider = ({ children }) => {
  // ** States
  const [user, setUser] = useState(defaultProvider.user)
  const [loading, setLoading] = useState(defaultProvider.loading)
  const [isInitialized, setIsInitialized] = useState(defaultProvider.isInitialized)
  const [rolePremission, setRolePermission] = useState(defaultProvider.rolePremission)
  const [isMasterAdmin, setIsMasterAdmin] = useState(defaultProvider.isMasterAdmin)
  const [isCompletedProfile, setIsCompletedProfile] = useState(defaultProvider.isCompletedProfile)
  // ** Hooks
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()

  const initAuth = async () => {
    setIsInitialized(true);
    const storedToken = window.localStorage.getItem(authConfig.storageTokenKeyName);
    const type = window.localStorage.getItem('loginType')
    if (storedToken) {
      setLoading(true);

      try {
        const headers = {
          Authorization: `Bearer ${storedToken}`,
        };

        let response;
        if (type === "organisation") {
          response = await axios.get(ApiEndPoints.AUTH.organization_me, { headers });
        } else {
          response = await axios.get(ApiEndPoints.AUTH.college_me, { headers });
        }

        console.log('authuser', response.data.data?.user?.orgDetails);
        const authuser = response.data.data;
        setUser({ ...authuser.user });
        setIsMasterAdmin(authuser?.isMasterAdmin)
        setIsCompletedProfile(authuser?.user?.orgDetails?.isApproved)
        setRolePermission(authuser.role)
      } catch (error) {
        console.error('Error fetching user data:', error);
        localStorage.removeItem(authConfig.storageUserDataKeyName);
        localStorage.removeItem(authConfig.storageTokenKeyName);
        setUser(null);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const user = urlParams.get("user");
    console.log("user", user)
    if (token && user) {
      // Decode and parse user data
      const parsedUser = JSON.parse(decodeURIComponent(user));
      console.log("parsedUser", parsedUser)
      // Save token to localStorage (so it persists)
      window.localStorage.setItem(authConfig.storageTokenKeyName, token);
      window.localStorage.setItem("loginType", parsedUser?.loginType || "organisation"); // Store login type if needed
      setUser(parsedUser);
      // Log in the user using existing handleLogin function
      handleLogin({ token, user: parsedUser, data: { role: parsedUser.role } });

      // Remove token from URL to prevent reuse
      window.history.replaceState({}, document.title, window.location.pathname);
    }
    // else {
    //   // If no token is found, continue with normal auth check
    //   initAuth();
    // }
  }, []);

  useEffect(() => {
    initAuth();
  }, [])

  const handleLogin = ({ token, user, data }) => {
    console.log("check", data.role)
    window.localStorage.setItem(authConfig.storageTokenKeyName, token);
    setUser(user);
    setIsMasterAdmin(data?.isMasterAdmin)
    setIsCompletedProfile(user?.orgDetails?.isApproved)
    setRolePermission(data.role)
    window.localStorage.setItem("loginType", user?.orgDetails?.orgType);
    const redirectUrl = searchParams.get('redirect');
    if (user?.orgDetails?.isApproved === true) {
      navigate(redirectUrl || "/");
    } else {
      navigate(redirectUrl || "/profile");
    }
  }

  const handleLogout = () => {
    setUser(null)
    window.localStorage.removeItem(authConfig.storageUserDataKeyName)
    window.localStorage.removeItem(authConfig.storageTokenKeyName)
    navigate('/login')
  }

  const handleRegister = () => {
  }

  const values = {
    user,
    loading,
    setUser,
    setLoading,
    rolePremission,
    setRolePermission,
    isMasterAdmin,
    setIsMasterAdmin,
    isCompletedProfile,
    setIsCompletedProfile,
    isInitialized,
    setIsInitialized,
    login: handleLogin,
    logout: handleLogout,
    register: handleRegister,
  }

  return <AuthContext.Provider value={values}>
    {loading ? <FallbackSpinner /> : children}
  </AuthContext.Provider>
}

export { AuthContext, AuthProvider }
