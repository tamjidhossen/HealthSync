import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  X,
  Eye,
  EyeOff,
  Mail,
  Lock,
  AlertCircle,
  CheckCircle,
  User,
  Phone,
  Calendar,
  Heart,
  UserPlus,
  Stethoscope,
} from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../hooks/useAuth";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./ui/select";

const AuthModal = ({ isOpen, onClose, mode, onModeChange, onSuccess }) => {
  const { login, register, isLoading } = useAuth();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [userType, setUserType] = useState("patient");
  const [formData, setFormData] = useState({
    // Common fields
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",

    // Patient-specific fields
    dateOfBirth: "",
    gender: "",
    bloodGroup: "",

    // Doctor-specific fields
    licenseNumber: "",
  });
  const [localError, setLocalError] = useState(null);
  const [successMessage, setSuccessMessage] = useState(null);

  const resetForm = () => {
    setFormData({
      // Common fields
      fullName: "",
      email: "",
      phone: "",
      password: "",
      confirmPassword: "",

      // Patient-specific fields
      dateOfBirth: "",
      gender: "",
      bloodGroup: "",

      // Doctor-specific fields
      licenseNumber: "",
    });
    setUserType("patient");
    setLocalError(null);
    setSuccessMessage(null);
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    // Clear errors when user starts typing
    if (localError) setLocalError(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLocalError(null);
    setSuccessMessage(null);

    try {
      if (mode === "register") {
        if (formData.password !== formData.confirmPassword) {
          const errorMsg = "Passwords do not match";
          setLocalError(errorMsg);
          toast.error(errorMsg);
          return;
        }

        // Prepare registration data based on user type
        let registrationData;
        if (userType === "patient") {
          registrationData = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            dateOfBirth: formData.dateOfBirth,
            gender: formData.gender,
            bloodGroup: formData.bloodGroup,
          };
        } else {
          registrationData = {
            fullName: formData.fullName,
            email: formData.email,
            phone: formData.phone,
            password: formData.password,
            licenseNumber: formData.licenseNumber,
          };
        }

        const result = await register(registrationData, userType);

        if (result.success) {
          setSuccessMessage(result.message);
          toast.success(result.message);
          resetForm();
          setTimeout(() => {
            onModeChange("login");
            setSuccessMessage(null);
          }, 2000);
        } else {
          setLocalError(result.error);
          toast.error(result.error);
        }
      } else {
        const result = await login({
          email: formData.email,
          password: formData.password,
        });

        if (result.success) {
          resetForm();
          toast.success("Login successful!");
          if (onSuccess) {
            onSuccess(result.user);
          } else {
            onClose();
          }
        } else {
          setLocalError(result.error);
          toast.error(result.error);
        }
      }
    } catch {
      const errorMsg = "An unexpected error occurred. Please try again.";
      setLocalError(errorMsg);
      toast.error(errorMsg);
    }
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        />

        {/* Modal */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 20 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="relative glass-card-subtle rounded-3xl border border-gray-700 p-8 w-full max-w-md max-h-[90vh] overflow-y-auto bg-gray-900/90"
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 w-10 h-10 rounded-full glass-card-subtle border border-gray-700 flex items-center justify-center text-gray-400 hover:text-white hover:border-gray-600 transition-all duration-200"
          >
            <X className="w-5 h-5" />
          </button>

          {/* Header */}
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-white mb-2">
              {mode === "login" ? "Welcome Back" : "Join HealthSync"}
            </h2>
            <p className="text-gray-400">
              {mode === "login"
                ? "Sign in to access your health records"
                : "Create your account to get started"}
            </p>
          </div>

          {/* Error Message */}
          {localError && (
            <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-400 flex-shrink-0" />
              <p className="text-red-300 text-sm">{localError}</p>
            </div>
          )}

          {/* Success Message */}
          {successMessage && (
            <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-xl flex items-center gap-3">
              <CheckCircle className="w-5 h-5 text-green-400 flex-shrink-0" />
              <p className="text-green-300 text-sm">{successMessage}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* User Type Selection for Registration */}
            {mode === "register" && (
              <div className="space-y-2">
                <label className="text-sm mb-5 font-medium text-gray-300">
                  Register as
                </label>
                <Select value={userType} onValueChange={setUserType}>
                  <SelectTrigger className="mt-2 w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-3 text-white focus:border-primary focus:bg-gray-800/70">
                    <SelectValue placeholder="Select user type" />
                  </SelectTrigger>
                  <SelectContent className="bg-gray-800 border border-gray-700">
                    <SelectItem
                      value="patient"
                      className="text-white hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <UserPlus className="w-4 h-4" />
                        Patient
                      </div>
                    </SelectItem>
                    <SelectItem
                      value="doctor"
                      className="text-white hover:bg-gray-700"
                    >
                      <div className="flex items-center gap-2">
                        <Stethoscope className="w-4 h-4" />
                        Doctor
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            )}

            {/* Full Name - Required for registration */}
            {mode === "register" && (
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="fullName"
                  placeholder="Full Name"
                  value={formData.fullName}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-gray-800/70 transition-all duration-200"
                  required
                />
              </div>
            )}

            {/* Email */}
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-gray-800/70 transition-all duration-200"
                required
              />
            </div>

            {/* Phone - Required for registration */}
            {mode === "register" && (
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="tel"
                  name="phone"
                  placeholder="Phone Number"
                  value={formData.phone}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-gray-800/70 transition-all duration-200"
                  required
                />
              </div>
            )}

            {/* Password */}
            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleInputChange}
                className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-gray-800/70 transition-all duration-200"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
              >
                {showPassword ? (
                  <EyeOff className="w-5 h-5" />
                ) : (
                  <Eye className="w-5 h-5" />
                )}
              </button>
            </div>

            {mode === "register" && (
              <div className="text-xs text-gray-500 -mt-2 px-1">
                Password must contain at least 6 characters with uppercase,
                lowercase, and number
              </div>
            )}

            {/* Confirm Password */}
            {mode === "register" && (
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type={showConfirmPassword ? "text" : "password"}
                  name="confirmPassword"
                  placeholder="Confirm Password"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-12 pr-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-gray-800/70 transition-all duration-200"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-5 h-5" />
                  ) : (
                    <Eye className="w-5 h-5" />
                  )}
                </button>
              </div>
            )}

            {/* Patient-specific fields */}
            {mode === "register" && userType === "patient" && (
              <>
                {/* Date of Birth */}
                <div className="relative">
                  <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                  <input
                    type="date"
                    name="dateOfBirth"
                    placeholder="Date of Birth"
                    value={formData.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-gray-800/70 transition-all duration-200"
                    required
                  />
                </div>

                {/* Gender */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Gender
                  </label>
                  <Select
                    value={formData.gender}
                    onValueChange={(value) =>
                      setFormData({ ...formData, gender: value })
                    }
                  >
                    <SelectTrigger className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-3 text-white focus:border-primary focus:bg-gray-800/70">
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border border-gray-700">
                      <SelectItem
                        value="male"
                        className="text-white hover:bg-gray-700"
                      >
                        Male
                      </SelectItem>
                      <SelectItem
                        value="female"
                        className="text-white hover:bg-gray-700"
                      >
                        Female
                      </SelectItem>
                      <SelectItem
                        value="other"
                        className="text-white hover:bg-gray-700"
                      >
                        Other
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                {/* Blood Group */}
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-300">
                    Blood Group
                  </label>
                  <Select
                    value={formData.bloodGroup}
                    onValueChange={(value) =>
                      setFormData({ ...formData, bloodGroup: value })
                    }
                  >
                    <SelectTrigger className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-3 py-3 text-white focus:border-primary focus:bg-gray-800/70">
                      <SelectValue placeholder="Select blood group" />
                    </SelectTrigger>
                    <SelectContent className="bg-gray-800 border border-gray-700">
                      <SelectItem
                        value="A+"
                        className="text-white hover:bg-gray-700"
                      >
                        A+
                      </SelectItem>
                      <SelectItem
                        value="A-"
                        className="text-white hover:bg-gray-700"
                      >
                        A-
                      </SelectItem>
                      <SelectItem
                        value="B+"
                        className="text-white hover:bg-gray-700"
                      >
                        B+
                      </SelectItem>
                      <SelectItem
                        value="B-"
                        className="text-white hover:bg-gray-700"
                      >
                        B-
                      </SelectItem>
                      <SelectItem
                        value="AB+"
                        className="text-white hover:bg-gray-700"
                      >
                        AB+
                      </SelectItem>
                      <SelectItem
                        value="AB-"
                        className="text-white hover:bg-gray-700"
                      >
                        AB-
                      </SelectItem>
                      <SelectItem
                        value="O+"
                        className="text-white hover:bg-gray-700"
                      >
                        O+
                      </SelectItem>
                      <SelectItem
                        value="O-"
                        className="text-white hover:bg-gray-700"
                      >
                        O-
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </>
            )}

            {/* Doctor-specific fields */}
            {mode === "register" && userType === "doctor" && (
              <div className="relative">
                <Heart className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  name="licenseNumber"
                  placeholder="Medical License Number"
                  value={formData.licenseNumber}
                  onChange={handleInputChange}
                  className="w-full bg-gray-800/50 border border-gray-700 rounded-xl px-12 py-3 text-white placeholder-gray-500 focus:outline-none focus:border-primary focus:bg-gray-800/70 transition-all duration-200"
                  required
                />
              </div>
            )}

            {/* Login specific - Remember me */}
            {mode === "login" && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    className="w-4 h-4 rounded border-gray-700 bg-gray-800 text-primary focus:ring-primary focus:ring-offset-0"
                  />
                  <span className="ml-2 text-sm text-gray-400">
                    Remember me
                  </span>
                </label>
                <a
                  href="#"
                  className="text-sm text-primary hover:text-primary/80 transition-colors"
                >
                  Forgot password?
                </a>
              </div>
            )}

            <motion.button
              whileHover={{ scale: isLoading ? 1 : 1.02 }}
              whileTap={{ scale: isLoading ? 1 : 0.98 }}
              type="submit"
              disabled={isLoading}
              className={`w-full py-3 rounded-xl font-medium transition-colors ${
                isLoading
                  ? "bg-gray-600 cursor-not-allowed"
                  : "bg-primary hover:bg-primary/90"
              } text-white`}
            >
              {isLoading
                ? mode === "login"
                  ? "Signing In..."
                  : "Creating Account..."
                : mode === "login"
                ? "Sign In"
                : "Create Account"}
            </motion.button>
          </form>

          {/* Footer */}
          <div className="mt-6 text-center">
            <p className="text-gray-400">
              {mode === "login"
                ? "Don't have an account? "
                : "Already have an account? "}
              <button
                onClick={() => {
                  // Clear form and errors when switching modes
                  resetForm();
                  onModeChange(mode === "login" ? "register" : "login");
                }}
                className="text-primary hover:text-primary/80 font-medium transition-colors"
              >
                {mode === "login" ? "Sign up" : "Sign in"}
              </button>
            </p>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

export default AuthModal;
