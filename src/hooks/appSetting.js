import { useContext } from 'react'
import { SettingContext } from 'src/context/AppSettingContext'

export const useAuth = () => useContext(SettingContext)