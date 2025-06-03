import { useState } from 'react';
import {
  createUserWithEmailAndPassword, // For email/password registration
  signInWithPopup, // For Google Sign-In
  GoogleAuthProvider // Provider for Google Sign-In
} from 'firebase/auth';
import { auth } from '../../lib/utils/firebase'; 
import { Link, useNavigate } from 'react-router-dom';

export default function Register() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  

  // Handle email/password registration
  const handleEmailRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await createUserWithEmailAndPassword(auth, email, password);
      
      // User successfully registered and signed in
      navigate('/dashboard'); // Navigate on success
    } catch (error) {
      console.error('Error registering with email and password:', error);
      // Handle errors here (e.g., display error message to the user)
      
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Registration error: ${errorMessage}`);
    }
  };

  // Handle Google Sign-In
  const handleGoogleSignIn = async () => {
    try {
      const provider = new GoogleAuthProvider();
      await signInWithPopup(auth, provider);
      // User successfully signed in with Google
      navigate('/dashboard'); // Navigate on success
    } catch (error) {
      console.error('Error signing in with Google:', error);
      // Handle errors here (e.g., display error message to the user)
      const errorMessage = error instanceof Error ? error.message : 'An unknown error occurred';
      alert(`Google sign-in error: ${errorMessage}`);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="max-w-md w-full space-y-8 p-8 bg-white rounded-lg shadow">
        <h2 className="text-3xl font-bold text-center">Register</h2>

        <form className="space-y-6" onSubmit={handleEmailRegister}>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Email Address
            </label>
            <input
              type="email"
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              required
              className="w-full px-3 py-2 border rounded-md"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-md hover:bg-blue-700"
          >
            Register with Email
          </button>
        </form>

        <div className="text-center my-4">Or</div> {/* Separator */}

        <button
          onClick={handleGoogleSignIn}
          className="w-full py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Register with Google
        </button>


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

