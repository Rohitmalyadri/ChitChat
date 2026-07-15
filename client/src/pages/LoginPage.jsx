import React, { useContext, useState } from 'react'
import assets from '../assets/assets'
import { AuthContext } from '../../context/AuthContext'

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up")
  const [fullName, setFullName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [bio, setBio] = useState("")
  const [isDataSubmitted, setIsDataSubmitted] = useState(false)

  const {login} = useContext(AuthContext)

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currentState == "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true)
      return;
    }

    login(currentState=="Sign up" ? 'signup' : 'login',{fullName,email,password,bio})

  }
  
  return (
      <div className='min-h-screen flex items-center justify-center p-4'>
      
      <div className='glass-panel w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row'>
        
        {/* Left Side - Hero/Branding */}
        <div className='w-full md:w-1/2 p-10 flex flex-col justify-center items-center bg-gradient-to-br from-violet-600/20 to-blue-500/20 relative overflow-hidden'>
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/bgImage.svg')] opacity-10 bg-cover"></div>
          <img src={assets.logo_big} className='w-48 mb-6 relative z-10 drop-shadow-lg' alt="Logo" />
          <h2 className='text-3xl font-bold text-white mb-2 relative z-10'>Welcome Back</h2>
          <p className='text-gray-300 text-center relative z-10'>Connect with friends and the world around you on ChitChat.</p>
        </div>
        
        {/* Right Side - Form */}
        <div className='w-full md:w-1/2 p-8 md:p-12 bg-slate-900/50'>
          <form onSubmit={onSubmitHandler} className='flex flex-col gap-5'>
            <div className='flex justify-between items-center mb-4'>
              <h2 className='text-2xl font-semibold text-white'>
                {currentState}
              </h2>
              {isDataSubmitted && (
                <button 
                  type="button"
                  onClick={() => setIsDataSubmitted(false)} 
                  className='text-sm text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors'
                >
                  <img src={assets.arrow_icon} className='w-4 rotate-180 invert' alt="Back" /> Back
                </button>
              )}
            </div>

            {currentState === 'Sign up' && !isDataSubmitted && (
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 ml-1">Full Name</label>
                <input 
                  onChange={(event) => setFullName(event.target.value)} 
                  value={fullName} 
                  type='text' 
                  className='glass-input p-3 rounded-xl w-full' 
                  placeholder='John Doe' 
                  required 
                />
              </div>
            )}

            {!isDataSubmitted && (
              <>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 ml-1">Email Address</label>
                <input 
                  onChange={(event) => setEmail(event.target.value)} 
                  value={email} 
                  type='email' 
                  placeholder='name@example.com' 
                  required 
                  className='glass-input p-3 rounded-xl w-full'
                />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-xs text-gray-400 ml-1">Password</label>
                <input 
                  onChange={(event) => setPassword(event.target.value)} 
                  value={password} 
                  type='password' 
                  placeholder='••••••••' 
                  required 
                  className='glass-input p-3 rounded-xl w-full'
                />
              </div>
              </>
            )}

            {isDataSubmitted && currentState === "Sign up" && (
              <div className="flex flex-col gap-1 animate-fade-in">
                <label className="text-xs text-gray-400 ml-1">Bio</label>
                <textarea 
                  onChange={(event) => setBio(event.target.value)} 
                  value={bio} 
                  rows={4} 
                  className='glass-input p-3 rounded-xl w-full resize-none' 
                  placeholder='Tell us a little about yourself...' 
                  required
                ></textarea>
              </div>
            )}

            <button type='submit' className='btn-primary py-3.5 rounded-xl font-medium mt-2'>
              {currentState === "Sign up" ? "Create Account" : "Sign In"}
            </button>

            <div className='flex items-start gap-2 text-sm text-gray-400 mt-2'>
              <input type='checkbox' required className="mt-1 accent-violet-500"/>
              <p>I agree to the <span className="text-violet-400 cursor-pointer hover:underline">Terms of Use</span> & <span className="text-violet-400 cursor-pointer hover:underline">Privacy Policy</span>.</p>
            </div>
            
            <div className='mt-4 text-center'>
              {currentState === "Sign up" ? (
                <p className='text-gray-400'>Already have an account? <span onClick={() => { setCurrentState("Login"); setIsDataSubmitted(false) }} className='font-medium text-violet-400 cursor-pointer hover:text-violet-300 transition-colors'>Login here</span></p>
              ) : (
                <p className='text-gray-400'>Don't have an account? <span onClick={() => setCurrentState("Sign up")} className='font-medium text-violet-400 cursor-pointer hover:text-violet-300 transition-colors'>Create one</span></p>
              )}
            </div>

          </form>
        </div>
      </div>
      
      </div>
  )
}

export default LoginPage
