import { useState } from 'react';
import {
  RecaptchaVerifier,
  signInWithPhoneNumber,
  type ConfirmationResult
} from 'firebase/auth';

declare global {
  interface Window {
    recaptchaVerifier: RecaptchaVerifier;
  }
}
import { auth } from '../../lib/utils/firebase'; 
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [verificationCode, setVerificationCode] = useState('');
  const [confirmationResult, setConfirmationResult] = useState<ConfirmationResult | null>(null);
  const [isCodeSent, setIsCodeSent] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  //  reCAPTCHA verifier
  const setupRecaptcha = () => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(auth, 'recaptcha-container', {
        size: 'invisible',
        callback: () => {
          // reCAPTCHA solved
        }
      });
    }
  };

  // Send verification code to phone number
  const handleSendCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phoneNumber) return;

    setIsLoading(true);
    try {
      setupRecaptcha();
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phoneNumber, appVerifier);
      setConfirmationResult(confirmation);
      setIsCodeSent(true);
      alert('Verification code sent to your phone!');
    } catch (error) {
      console.error('Error sending verification code:', error);
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  // Verify the code and complete registration
  const handleVerifyCode = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!confirmationResult || !verificationCode) return;

    setIsLoading(true);
    try {
      await confirmationResult.confirm(verificationCode);
      // User successfully registered and signed in
      navigate('/dashboard');
    } catch (error) {
      console.error('Error verifying code:', error);
      const errorMessage = error instanceof Error ? error.message : 'Invalid verification code';
      alert(`Verification error: ${errorMessage}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Register</h2>

        {!isCodeSent ? (
          // Phone number input form
          <form className="space-y-6" onSubmit={handleSendCode}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Phone Number
              </label>
              <input
                type="tel"
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter your phone number (e.g., +1234567890)"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
              />
              <p className="text-xs text-gray-500 mt-1">
                Include country code (e.g., +91 for India, +1 for US)
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Sending...' : 'Send Verification Code'}
            </button>
          </form>
        ) : (
          // Verification code input form
          <form className="space-y-6" onSubmit={handleVerifyCode}>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Verification Code
              </label>
              <input
                type="text"
                required
                className="w-full px-3 py-2 border rounded-md"
                placeholder="Enter 6-digit code"
                value={verificationCode}
                onChange={(e) => setVerificationCode(e.target.value)}
                maxLength={6}
              />
              <p className="text-xs text-gray-500 mt-1">
                Enter the 6-digit code sent to {phoneNumber}
              </p>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
            >
              {isLoading ? 'Verifying...' : 'Verify & Register'}
            </button>

            <button
              type="button"
              onClick={() => {
                setIsCodeSent(false);
                setVerificationCode('');
                setConfirmationResult(null);
              }}
              className="w-full py-2 px-4 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50"
            >
              Back to Phone Number
            </button>
          </form>
        )}

        {/* reCAPTCHA container */}
        <div id="recaptcha-container"></div>

        <p className="text-center">
          Already have an account?{' '}
          <Link to="/login" className="text-blue-600 hover:text-blue-800">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}