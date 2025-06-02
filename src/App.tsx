import './App.css'
import {Provider} from 'react-redux';
import {store} from '@/store/store.ts';
import SignUp from '@/pages/sign-up';
import SignIn from '@/pages/sign-in';
import ForgotPasswordPage from '@/pages/forgot-password';
import VerifyEmailPage from '@/pages/verify-email';
import PasswordResetPage from '@/pages/password-reset';
import ResetSuccessfulPage from '@/pages/reset-successful';
import { BrowserRouter, Routes, Route } from 'react-router';

function App() {

    return (
        <Provider store={store}>
            <BrowserRouter>
            <Routes>
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/password-reset" element={<PasswordResetPage />} />
                <Route path="/reset-successful" element={<ResetSuccessfulPage />} />
                <Route path="/" element={<SignIn />} />
            </Routes>
            </BrowserRouter>
        </Provider>
    )
}

export default App