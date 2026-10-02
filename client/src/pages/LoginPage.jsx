import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { AuthContext } from "../../context/AuthContext";

const LoginPage = () => {
  const [currentState, setCurrentState] = useState("Sign up");
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [bio, setBio] = useState("");
  const [isDataSubmitted, setIsDataSubmitted] = useState(false);

  const { login } = useContext(AuthContext);

  const onSubmitHandler = (event) => {
    event.preventDefault();

    if (currentState === "Sign up" && !isDataSubmitted) {
      setIsDataSubmitted(true);
      return;
    }

    login(currentState === "Sign up" ? "signup" : "login", {
      fullName,
      email,
      password,
      bio,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 sm:p-6 bg-slate-950/60 backdrop-blur-xl">
      <div className="glass-panel w-full max-w-4xl rounded-3xl overflow-hidden shadow-2xl flex flex-col md:flex-row border border-white/10">
        {/* Left Side - Hero / Branding */}
        <div className="w-full md:w-1/2 p-8 sm:p-12 flex flex-col justify-between items-center text-center bg-gradient-to-br from-violet-900/40 via-purple-900/20 to-slate-900/60 relative overflow-hidden border-b md:border-b-0 md:border-r border-white/10">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('/bgImage.svg')] opacity-10 bg-cover pointer-events-none" />

          <div className="relative z-10 my-auto flex flex-col items-center">
            <div className="w-20 h-20 bg-violet-600/20 rounded-3xl flex items-center justify-center mb-6 border border-violet-500/30 shadow-inner animate-pulse-glow">
              <img src={assets.logo_icon} className="w-12 h-12" alt="ChitChat Logo" />
            </div>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mb-3">
              ChitChat
            </h1>
            <p className="text-sm text-gray-300 max-w-xs leading-relaxed">
              Connect seamlessly with friends, discover users, and exchange messages in real-time.
            </p>
          </div>

          <div className="relative z-10 text-xs text-gray-400 mt-6 font-medium">
            Fast • Secure • Real-time
          </div>
        </div>

        {/* Right Side - Form */}
        <div className="w-full md:w-1/2 p-6 sm:p-10 bg-slate-900/60 flex flex-col justify-center">
          <form onSubmit={onSubmitHandler} className="flex flex-col gap-4">
            <div className="flex justify-between items-center mb-2">
              <div>
                <h2 className="text-2xl font-extrabold text-white">
                  {currentState === "Sign up"
                    ? isDataSubmitted
                      ? "Tell us about yourself"
                      : "Create an Account"
                    : "Welcome Back"}
                </h2>
                <p className="text-xs text-gray-400 mt-1">
                  {currentState === "Sign up"
                    ? "Join ChitChat today"
                    : "Sign in to continue your conversations"}
                </p>
              </div>

              {isDataSubmitted && (
                <button
                  type="button"
                  onClick={() => setIsDataSubmitted(false)}
                  className="text-xs font-semibold text-violet-400 hover:text-violet-300 flex items-center gap-1 transition-colors glass-panel px-3 py-1.5 rounded-xl border border-white/10"
                >
                  ← Back
                </button>
              )}
            </div>

            {currentState === "Sign up" && !isDataSubmitted && (
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Full Name</label>
                <input
                  onChange={(event) => setFullName(event.target.value)}
                  value={fullName}
                  type="text"
                  className="glass-input p-3 rounded-xl text-xs sm:text-sm"
                  placeholder="e.g. John Doe"
                  required
                />
              </div>
            )}

            {!isDataSubmitted && (
              <>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300">Email Address</label>
                  <input
                    onChange={(event) => setEmail(event.target.value)}
                    value={email}
                    type="email"
                    placeholder="name@example.com"
                    required
                    className="glass-input p-3 rounded-xl text-xs sm:text-sm"
                  />
                </div>
                <div className="flex flex-col gap-1.5">
                  <label className="text-xs font-semibold text-gray-300">Password</label>
                  <input
                    onChange={(event) => setPassword(event.target.value)}
                    value={password}
                    type="password"
                    placeholder="••••••••"
                    required
                    className="glass-input p-3 rounded-xl text-xs sm:text-sm"
                  />
                </div>
              </>
            )}

            {isDataSubmitted && currentState === "Sign up" && (
              <div className="flex flex-col gap-1.5 animate-fade-in">
                <label className="text-xs font-semibold text-gray-300">Short Bio</label>
                <textarea
                  onChange={(event) => setBio(event.target.value)}
                  value={bio}
                  rows={4}
                  className="glass-input p-3 rounded-xl text-xs sm:text-sm resize-none"
                  placeholder="Tell others a little bit about yourself..."
                  required
                />
              </div>
            )}

            <button
              type="submit"
              className="btn-primary py-3.5 rounded-xl font-bold text-xs sm:text-sm mt-3 shadow-lg active:scale-95 transition-all"
            >
              {currentState === "Sign up"
                ? isDataSubmitted
                  ? "Complete & Join"
                  : "Continue"
                : "Sign In"}
            </button>

            <div className="flex items-start gap-2.5 text-xs text-gray-400 mt-2">
              <input type="checkbox" required className="mt-0.5 accent-violet-600 rounded" />
              <p className="leading-snug">
                I agree to the{" "}
                <span className="text-violet-400 font-semibold cursor-pointer hover:underline">
                  Terms of Use
                </span>{" "}
                &{" "}
                <span className="text-violet-400 font-semibold cursor-pointer hover:underline">
                  Privacy Policy
                </span>
                .
              </p>
            </div>

            <div className="mt-3 text-center text-xs text-gray-400">
              {currentState === "Sign up" ? (
                <p>
                  Already have an account?{" "}
                  <span
                    onClick={() => {
                      setCurrentState("Login");
                      setIsDataSubmitted(false);
                    }}
                    className="font-bold text-violet-400 cursor-pointer hover:text-violet-300 transition-colors ml-1"
                  >
                    Sign In
                  </span>
                </p>
              ) : (
                <p>
                  Don't have an account?{" "}
                  <span
                    onClick={() => setCurrentState("Sign up")}
                    className="font-bold text-violet-400 cursor-pointer hover:text-violet-300 transition-colors ml-1"
                  >
                    Create Account
                  </span>
                </p>
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
