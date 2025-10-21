// import { createContext, useEffect, useState } from 'react'
// import { useAuth } from 'src/hooks/useAuth'
// import { axiosInstance } from 'src/network/adapter'
// import { ApiEndPoints } from 'src/network/endpoints'
// import { toastError } from 'src/utils/utils'

// const defaultProvider = {
//   setting: null,
//   loading: false,
//   setLoading: () => Boolean,
//   fetchData: () => Promise.resolve(),
// }
// // const SettingContext = createContext(defaultProvider)

// const AuthSettingProvider = ({ children }) => {

//   const { user } = useAuth();

//   const [setting, setSetting] = useState(defaultProvider.setting)
//   const [loading, setLoading] = useState(defaultProvider.loading)

//   const onSubmit = (data) => {
//     setLoading(true);
//     let payload = {
//       exchange_rate: data.exchange_rate
//     }
//     axiosInstance
//       .patch(ApiEndPoints.SETTINGS.edit, payload)
//       .then((response) => {
//         //setSettings(response.data.data)
//         fetchData()
//       })
//       .catch((error) => {
//         toastError(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   const fetchData = () => {
//     setLoading(true);
//     axiosInstance
//       .get(ApiEndPoints.SETTINGS.list)
//       .then((response) => {
//         setSetting(response.data.data.settings)
//       })
//       .catch((error) => {
//         toastError(error);
//       })
//       .finally(() => {
//         setLoading(false);
//       });
//   };

//   useEffect(() => {
//     if (user) {
//       fetchData();
//     }
//   }, [user])

//   const values = {
//     settings: onSubmit,
//     setting: setting,
//     loading: loading,
//     fetchData,
//   }

//   return <SettingContext.Provider value={values}>
//     {children}
//   </SettingContext.Provider>;
// }

// export { SettingContext, AuthSettingProvider } 