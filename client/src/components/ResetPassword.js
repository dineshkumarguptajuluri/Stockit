import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';  // Import toastify styles
import '../styles/ResetPassword.css'; // Make sure the CSS file is imported correctly

function ResetPassword() {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [step, setStep] = useState(1);
    const [dinnu, setDinnu] = useState('');
    const navigate = useNavigate();

    const handleEmailSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:4000/resetPassword', { email });
            setDinnu(response.data.otp);  // assuming the API sends back the otp or a confirmation of it being sent
            setStep(2);
            toast.info('OTP has been sent to your email.');
        } catch (error) {
            console.error('Error sending OTP', error);
            toast.error('Unable send Otp');
        }
    };

    const handleOtpSubmit = async (e) => {
        e.preventDefault();
        try {
           if (otp === dinnu) {
               toast.success("OTP is confirmed, please enter your new password.");
               setStep(3);
           } else {
               toast.error("Wrong OTP entered. Please try again.");
               setStep(1);
               setOtp('');
               setEmail('');
           }
        } catch (error) {
            console.error('Error verifying OTP', error);
            toast.error('Error verifying OTP.');
        }
    };

    const handlePasswordChange = async (e) => {
        e.preventDefault();
        try {
            await axios.post('http://localhost:4000/changePassword', { email, newPassword });
            toast.success('Password successfully updated.');
            navigate('/');
        } catch (error) {
            console.error('Error updating password', error);
            toast.error('Failed to update password. Please try again.');
        }
    };

    return (
        <div className="reset-password-container">
            <ToastContainer position="top-center" autoClose={5000} hideProgressBar={false} newestOnTop={false} closeOnClick rtl={false} pauseOnFocusLoss draggable pauseOnHover />
            {[1, 2, 3, 4, 5].map(n => <div key={n} className="background-circle"></div>)}
            <div className="reset-password-form">
                {step === 1 && (
                    <form onSubmit={handleEmailSubmit}>
                        <div className="form-group">
                            <input
                                type="email"
                                className="form-control"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-reset">Send OTP</button>
                    </form>
                )}

                {step === 2 && (
                    <form onSubmit={handleOtpSubmit}>
                        <div className="form-group">
                            <input
                                type="text"
                                className="form-control"
                                value={otp}
                                onChange={(e) => setOtp(e.target.value)}
                                placeholder="Enter OTP"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-reset">Verify OTP</button>
                    </form>
                )}

                {step === 3 && (
                    <form onSubmit={handlePasswordChange}>
                        <div className="form-group">
                            <input
                                type="password"
                                className="form-control"
                                value={newPassword}
                                onChange={(e) => setNewPassword(e.target.value)}
                                placeholder="Enter new password"
                                required
                            />
                        </div>
                        <button type="submit" className="btn-reset">Update Password</button>
                    </form>
                )}
            </div>
        </div>
    );
}

export default ResetPassword;
