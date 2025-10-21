// ** Hooks Import
import { useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import FallbackSpinner from 'src/@core/components/spinner'

function HomePage() {
    const navigate = useNavigate()

    useEffect(() => {
        navigate('/dashboard', { replace: true })
    }, [navigate])

    return (
        <>
            <FallbackSpinner />
        </>
    )
}

export default HomePage
