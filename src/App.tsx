import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from "jwt-decode";


function App() {
  return (
    <div className="flex h-screen items-center justify-center bg-gray-900 text-white">
      <div className="p-10 bg-gray-800 rounded-2xl shadow-xl text-center">
        <h1 className="text-2xl font-bold mb-6">Google Authentication System</h1>
          <GoogleLogin
            onSuccess={(credentialResponse) => {
              console.log("Login Successful:", credentialResponse);

              if (credentialResponse.credential) {
                const decoded = jwtDecode(credentialResponse.credential);
                console.log("Decoded JWT:", decoded);
              }
            }}
            onError={() => {
              console.log("Login Failed");
            }}
        />

      </div>
    </div>
  )
}

export default App