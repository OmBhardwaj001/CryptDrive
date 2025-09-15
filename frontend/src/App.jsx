import Login from "./components/auth/Login"
import SignupPage from './components/auth/Signup'
import ForgotPasswordPage from './components/auth/ForgotPassword'
import ResetPasswordPage from './components/auth/ResetPassword'

function App() {
    return(
        <>
            <Login/>
            <SignupPage/>
            <ForgotPasswordPage/>
            <ResetPasswordPage/>
        </>
    )

}

export default App
