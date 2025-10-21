// ** Third Party Import
import { useTranslation } from 'react-i18next'

const useCustomTranslation = () => {
  // ** Hook
  const { t } = useTranslation();

  return {
    translate: (text) => t(text),
  }
}

export default useCustomTranslation
