import React, { useContext, useState } from "react";
import assets from "../assets/assets";
import { useNavigate } from "react-router-dom";
import { AuthContext } from "../../context/AuthContext";
import Avatar from "../components/ui/Avatar";

const ProfilePage = () => {
  const { authUser, updateProfile } = useContext(AuthContext);

  const [selectedImage, setSelectedImage] = useState(null);
  const navigate = useNavigate();
  const [name, setName] = useState(authUser?.fullName || "");
  const [bio, setBio] = useState(authUser?.bio || "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      if (!selectedImage) {
        await updateProfile({ fullName: name, bio });
        navigate("/");
        return;
      }

      const reader = new FileReader();
      reader.readAsDataURL(selectedImage);
      reader.onload = async () => {
        const base64Image = reader.result;
        await updateProfile({ profilePic: base64Image, fullName: name, bio });
        navigate("/");
      };
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const previewAvatarSrc = selectedImage
    ? URL.createObjectURL(selectedImage)
    : authUser?.profilePic;

  return (
    <div className="min-h-screen bg-slate-950/60 backdrop-blur-xl flex items-center justify-center p-4 relative">
      <div className="relative z-10 w-full max-w-2xl glass-panel rounded-3xl overflow-hidden shadow-2xl border border-white/10">
        {/* Banner Header */}
        <div className="h-36 bg-gradient-to-r from-violet-900 via-purple-800 to-indigo-900 relative p-6">
          <button
            onClick={() => navigate("/")}
            className="p-2.5 bg-black/30 hover:bg-black/50 rounded-xl text-white transition-all backdrop-blur-md flex items-center gap-1.5 text-xs font-semibold border border-white/10"
          >
            ← Back to Chat
          </button>
        </div>

        <div className="px-6 sm:px-10 pb-8">
          {/* Avatar Upload Position */}
          <div className="relative -mt-16 mb-6 flex justify-center sm:justify-start">
            <div className="relative group">
              <Avatar
                src={previewAvatarSrc}
                name={name || "User"}
                size="xl"
                className="ring-4 ring-slate-950 shadow-2xl"
              />
              <label
                htmlFor="avatar"
                className="absolute bottom-0 right-0 p-2.5 bg-violet-600 hover:bg-violet-700 rounded-full cursor-pointer transition-colors shadow-lg border border-white/20 active:scale-95"
                title="Change photo"
              >
                ✏️
                <input
                  onChange={(e) => setSelectedImage(e.target.files[0])}
                  type="file"
                  id="avatar"
                  accept=".png, .jpg, .jpeg, .webp"
                  hidden
                />
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <div className="grid gap-5 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Full Name</label>
                <input
                  onChange={(e) => setName(e.target.value)}
                  value={name}
                  type="text"
                  required
                  placeholder="Your Name"
                  className="glass-input p-3 rounded-xl text-xs sm:text-sm"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-gray-300">Email Address</label>
                <input
                  value={authUser?.email || ""}
                  type="email"
                  disabled
                  className="glass-input p-3 rounded-xl text-xs sm:text-sm opacity-50 cursor-not-allowed"
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-xs font-semibold text-gray-300">Bio</label>
              <textarea
                onChange={(e) => setBio(e.target.value)}
                value={bio}
                placeholder="Write a short bio to introduce yourself..."
                required
                className="glass-input p-3 rounded-xl text-xs sm:text-sm resize-none"
                rows={4}
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-white/10 gap-3">
              <button
                type="button"
                onClick={() => navigate("/")}
                className="btn-secondary px-6 py-2.5 rounded-xl text-xs font-semibold transition-all"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="btn-primary px-8 py-2.5 rounded-xl text-xs font-bold disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
              >
                {isSubmitting ? "Saving changes..." : "Save Profile"}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;