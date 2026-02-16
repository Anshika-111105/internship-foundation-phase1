import { useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";
import { GameBoard } from './components/GameBoard';

function App() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      {!user ? (
        <div className="p-10 bg-gray-800 rounded-2xl shadow-xl text-center">
          <h1 className="text-2xl font-bold mb-6">Google Authenticator Phase</h1>
          <GoogleLogin
            onSuccess={credentialResponse => {
              const decoded: any = jwtDecode(credentialResponse.credential!);
              setUser({ name: decoded.name, email: decoded.email });
              console.log("Login Success:", decoded);
            }}
            onError={() => console.log('Login Failed')}
          />
        </div>
      ) : (
        <div className="w-full max-w-2xl animate-in fade-in slide-in-from-bottom-4 duration-500">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-green-400">
              Welcome, {user.name}
            </h1>
            <p className="text-gray-400">Ready for your daily challenge?</p>
          </div>
          
          {/* This is Phase 2 Engine */}
          <GameBoard userEmail={user.email} />
          
          <button 
            onClick={() => setUser(null)}
            className="mt-8 text-sm text-gray-500 hover:text-red-400 transition-colors"
          >
            Sign Out
          </button>
        </div>
      )}
    </div>
  );
}

export default App;