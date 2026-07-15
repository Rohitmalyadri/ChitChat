import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom"
import { AuthContext } from "../../context/AuthContext";

const ProfilePage = () => {

  const { authUser, updateProfile } = useContext(AuthContext)

  const [selectedImage, setSelectedImage] = useState(null)
  const navigate = useNavigate()
  const [name, setName] = useState(authUser.fullName)
  const [bio, setBio] = useState(authUser.bio)
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true)

    try {
      if (!selectedImage) {
        await updateProfile({ fullName: name, bio })
        navigate('/')
        return
      }

      const render = new FileReader
      render.readAsDataURL(selectedImage)
      render.onload = async () => {
        const base64Image = render.result
        await updateProfile({ profilePic: base64Image, fullName: name, bio })
        navigate('/')
      }
    } catch (error) {
      console.error(error)
    } finally {
      setIsSubmitting(false)
    }

  }

  return (
    <div className="min-h-screen bg-[url('/bgImage.svg')] bg-cover bg-center flex items-center justify-center p-4 relative">
      <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm"></div>

      <div className="relative z-10 w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl">
        <div className="h-32 bg-gradient-to-r from-violet-600 to-indigo-600 relative">
          <button
            onClick={() => navigate('/')}
            className="absolute top-4 left-4 p-2 bg-black/20 hover:bg-black/40 rounded-full text-white transition-colors"
          >
            <img src={assets.arrow_icon} className="w-5 rotate-180 invert" alt="Back" />
          </button>
        </div>

        <div className="px-8 pb-8">
          <div className="relative -mt-16 mb-6 flex justify-center sm:justify-start">
            <div className="relative group">
              <img
                src={selectedImage ? URL.createObjectURL(selectedImage) : (authUser?.profilePic || assets.avatar_icon)}
                className="w-32 h-32 rounded-full object-cover border-4 border-[#0f172a] bg-[#0f172a]"
                alt="Profile"
              />
              <label htmlFor="avatar" className="absolute bottom-0 right-0 p-2 bg-violet-600 rounded-full cursor-pointer hover:bg-violet-700 transition-colors shadow-lg">
                <img src={assets.plus_icon || assets.menu_icon} className="w-4 h-4 invert" alt="Upload" /> {/* Fallback icon if plus_icon missing */}
                <input onChange={(e) => setSelectedImage(e.target.files[0])} type="file" id="avatar" accept=".png, .jpg, .jpeg" hidden />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <div className="grid gap-6 sm:grid-cols-2">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Full Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  required
                  placeholder="Your Name"
                  className="glass-input p-3 rounded-xl w-full"
                />
              </div>
              <div className="flex flex-col gap-2">
                <label className="text-sm font-medium text-gray-300 ml-1">Email</label>
                <input
                  value={authUser.email}
                  type="email"
                  disabled
                  className="glass-input p-3 rounded-xl w-full opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col gap-2">
              <label className="text-sm font-medium text-gray-300 ml-1">Bio</label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                placeholder="Write a short bio..."
                required
                className="glass-input p-3 rounded-xl w-full resize-none"
                rows={4}
              ></textarea>
            </div>

            <div className="flex justify-end pt-4">
              <button
                type="button"
                onClick={() => navigate('/')}
                className="px-6 py-2.5 rounded-xl text-gray-300 hover:text-white hover:bg-white/5 transition-colors mr-3"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8 py-2.5 rounded-xl font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? 'Saving...' : 'Save Changes'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;