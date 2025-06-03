import './App.css'
import {Provider} from 'react-redux';
import {store} from '@/store/store.ts';
import SignUp from '@/pages/sign-up';
import SignIn from '@/pages/sign-in';
import RedirectToHome from '@/pages/redirect';
import Home from '@/pages/home';
import Records from '@/pages/records';
import Analytics from '@/pages/analytics';
import Settings from '@/pages/settings';
import WorkSpace from '@/containers/WorkSpace';
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
                <Route path="/" element={<RedirectToHome />} />
                <Route path="/sign-up" element={<SignUp />} />
                <Route path="/sign-in" element={<SignIn />} />
                <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                <Route path="/verify-email" element={<VerifyEmailPage />} />
                <Route path="/password-reset" element={<PasswordResetPage />} />
                <Route path="/reset-successful" element={<ResetSuccessfulPage />} />
                <Route element={<WorkSpace />}>
                    <Route path="home" element={<Home />} /> 
                    <Route path="records" element={<Records />} />
                    <Route path="analytics" element={<Analytics />} />
                    <Route path="settings" element={<Settings />} />
                </Route>
            </Routes>
            </BrowserRouter>
        </Provider>
    )
}

export default App