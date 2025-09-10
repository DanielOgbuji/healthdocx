import './App.css'
import { Provider } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';
import { store, persistor } from '@/store/store.ts';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import SignUp from '@/pages/sign-up';
import SignIn from '@/pages/sign-in';
import RedirectToHome from '@/pages/redirect';
import Home from '@/pages/home';
import Records from '@/pages/records';
import Analytics from '@/pages/analytics';
import Settings from '@/pages/settings';
import LinkPhone from '@/pages/link-phone';
import WorkSpace from '@/containers/WorkSpace';
import ForgotPasswordPage from '@/pages/forgot-password';
import VerifyEmailPage from '@/pages/verify-email';
import PasswordResetPage from '@/pages/password-reset';
import ResetSuccessfulPage from '@/pages/reset-successful';
import RecordsDetails from '@/pages/record-details';
import { BrowserRouter, Routes, Route } from 'react-router';

function App() {

    return (
        <Provider store={store}>
            <PersistGate loading={null} persistor={persistor}>
                <BrowserRouter>
                    <Routes>
                        <Route path="/" element={<ProtectedRoute><RedirectToHome /></ProtectedRoute>} />
                        <Route path="/sign-up" element={<SignUp />} />
                        <Route path="/sign-in" element={<SignIn />} />
                        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
                        <Route path="/verify-email" element={<VerifyEmailPage />} />
                        <Route path="/password-reset" element={<PasswordResetPage />} />
                        <Route path="/reset-successful" element={<ResetSuccessfulPage />} />
                        <Route element={<WorkSpace />}>
                            <Route path="home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
                            <Route path="records" element={<ProtectedRoute><Records /></ProtectedRoute>} />
                            <Route path="records/details/:id" element={<ProtectedRoute><RecordsDetails /></ProtectedRoute>} />
                            <Route path="analytics" element={<ProtectedRoute><Analytics /></ProtectedRoute>} />
                            <Route path="settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
                            <Route path="link-phone" element={<ProtectedRoute><LinkPhone /></ProtectedRoute>} />
                        </Route>
                    </Routes>
                </BrowserRouter>
            </PersistGate>
        </Provider>
    )
}

export default App
