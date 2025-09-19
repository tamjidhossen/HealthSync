import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router-dom";
import {
  HeartHandshake,
  ArrowRight,
  Menu,
  X,
  Check,
  Activity,
  FileText,
  UserCheck,
} from "lucide-react";
import { useAuth } from "../hooks/useAuth";
import AuthModal from "../components/AuthModal";
import { Ripple } from "../components/ui/ripple";
import { ModeToggle } from "../components/ui/mode-toggle";

const LandingPage = () => {
  const { isLoading, isAuthenticated } = useAuth();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState("login");
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  // Remove automatic redirect - allow authenticated users to visit landing page
  // useEffect(() => {
  //   if (!isLoading && isAuthenticated) {
  //     navigate("/dashboard");
  //   }
  // }, [isAuthenticated, isLoading, navigate]);

  const openAuthModal = (mode) => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const handleAuthSuccess = () => {
    setIsAuthModalOpen(false);
    // Navigate to dashboard - the ProtectedRoute will handle role-based redirection
    navigate("/dashboard");
  };

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-white text-lg">Loading...</p>
        </div>
      </div>
    );
  }

  const features = [
    {
      icon: Activity,
      title: "AI Health Assistant",
      description:
        "Get intelligent health insights and medical record analysis powered by AI.",
    },
    {
      icon: FileText,
      title: "Unified Medical Records",
      description:
        "Access your complete medical history from all healthcare providers in one place.",
    },
    {
      icon: UserCheck,
      title: "Smart Doctor Recommendations",
      description:
        "Find the right specialist based on your symptoms and medical history.",
    },
  ];

  return (
    <div className="min-h-screen bg-gray-900 relative overflow-hidden">
      {/* Overlay for better text readability */}
      <div className="absolute inset-0 bg-gray-900/10 z-1"></div>

      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 px-6 py-4 transition-all duration-300 ease-in-out">
        <div className="max-w-7xl mx-auto">
          <div className="glass-morphism-nav rounded-2xl px-6 py-4 border border-white/10 shadow-2xl">
            <div className="flex items-center justify-between">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="flex items-center space-x-3 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                  <HeartHandshake className="w-6 h-6 text-white" />
                </div>
                <span className="text-xl font-bold text-white tracking-tight">
                  HealthSync
                </span>
              </motion.div>

              {/* Desktop Navigation */}
              <div className="hidden md:flex items-center space-x-8">
                <a
                  href="#features"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  Features
                </a>
                <a
                  href="#about"
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  About
                </a>
                <button
                  onClick={() =>
                    isAuthenticated
                      ? navigate("/dashboard")
                      : openAuthModal("login")
                  }
                  className="text-gray-300 hover:text-white transition-colors"
                >
                  {isAuthenticated ? "Dashboard" : "Login"}
                </button>
                {/* <ModeToggle /> */}
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => openAuthModal("register")}
                  className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                >
                  Get Started
                </motion.button>
              </div>

              {/* Mobile Menu Button */}
              <div className="md:hidden">
                <button
                  onClick={() => setIsMenuOpen(!isMenuOpen)}
                  className="text-white p-2"
                >
                  {isMenuOpen ? (
                    <X className="w-6 h-6" />
                  ) : (
                    <Menu className="w-6 h-6" />
                  )}
                </button>
              </div>
            </div>

            {/* Mobile Navigation */}
            <AnimatePresence>
              {isMenuOpen && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  exit={{ opacity: 0, height: 0 }}
                  className="md:hidden mt-4 pt-4 border-t border-white/10"
                >
                  <div className="flex flex-col space-y-4">
                    <a
                      href="#features"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      Features
                    </a>
                    <a
                      href="#about"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      About
                    </a>
                    <button
                      onClick={() =>
                        isAuthenticated
                          ? navigate("/dashboard")
                          : openAuthModal("login")
                      }
                      className="text-left text-gray-300 hover:text-white transition-colors"
                    >
                      {isAuthenticated ? "Dashboard" : "Login"}
                    </button>
                    <div className="flex items-center justify-between">
                      {/* <ModeToggle /> */}
                      <button
                        onClick={() => openAuthModal("register")}
                        className="bg-primary hover:bg-primary/90 text-white px-6 py-2 rounded-lg font-medium text-left transition-colors"
                      >
                        Get Started
                      </button>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative z-10 px-6 pt-32 pb-20">
        {/* Ripple effect positioned behind hero content */}
        {/* Ripple Animated Background */}
        <div className="absolute inset-0 flex items-center justify-center">
          <Ripple mainCircleSize={400} mainCircleOpacity={0.3} numCircles={8} />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold text-white mb-6 leading-tight tracking-tight">
              Your <span className="font-light text-gray-300">Complete</span>
              <span className="text-primary block font-black">
                Health Journey
              </span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-12 max-w-2xl mx-auto leading-relaxed font-light opacity-90">
              Centralize your medical records with{" "}
              <span className="font-medium text-white">
                AI-powered health insights
              </span>
              , smart doctor recommendations, and seamless healthcare
              management.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openAuthModal("register")}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-4 rounded-xl text-lg font-medium transition-colors flex items-center justify-center space-x-2"
              >
                <span>Get Started</span>
                <ArrowRight className="w-5 h-5" />
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="glass-card-subtle text-white px-8 py-4 rounded-xl text-lg font-medium border border-gray-700 hover:border-gray-600 transition-colors"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="relative z-10 px-6 py-20">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl font-black text-white mb-4 tracking-tight">
              Everything{" "}
              <span className="font-light text-gray-300">you need</span>
            </h2>
            <p className="text-lg md:text-xl text-gray-400 max-w-2xl mx-auto font-light opacity-80">
              Powerful features designed to{" "}
              <span className="font-medium text-gray-200">
                enhance your campus experience
              </span>
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="glass-card-subtle rounded-2xl p-8 border border-gray-800 hover:border-gray-700 transition-colors"
              >
                <div className="w-12 h-12 bg-primary rounded-xl flex items-center justify-center mb-6">
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                <h3 className="text-xl md:text-2xl font-bold text-white mb-3 tracking-tight">
                  {feature.title}
                </h3>
                <p className="text-gray-400 leading-relaxed font-light opacity-90">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="relative z-10 px-6 py-20">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="glass-card-subtle rounded-3xl p-12 border border-gray-800"
          >
            <div className="text-center">
              <h2 className="text-4xl md:text-5xl font-black text-white mb-6 tracking-tight">
                Built for{" "}
                <span className="font-light text-gray-300">Patients</span>, by{" "}
                <span className="text-primary font-bold">
                  Healthcare Innovators
                </span>
              </h2>
              <p className="text-lg md:text-xl text-gray-300 mb-8 leading-relaxed font-light opacity-90">
                HealthSync addresses{" "}
                <span className="font-medium text-white">
                  fragmented healthcare records
                </span>{" "}
                in Bangladesh by providing a centralized platform for medical
                data management, AI-powered insights, and better healthcare
                decisions.
              </p>
              <div className="flex flex-wrap justify-center gap-6 mb-8">
                <div className="flex items-center space-x-2 text-gray-300">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    AI-Powered Health Insights
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="font-medium">
                    Centralized Medical Records
                  </span>
                </div>
                <div className="flex items-center space-x-2 text-gray-300">
                  <Check className="w-5 h-5 text-primary" />
                  <span className="font-medium">Smart Doctor Matching</span>
                </div>
              </div>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => openAuthModal("register")}
                className="bg-primary hover:bg-primary/90 text-white px-8 py-3 rounded-xl font-medium transition-colors"
              >
                Join the Community
              </motion.button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Simple Footer */}
      <footer className="relative z-10 px-6 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="border-t border-gray-800 pt-8">
            <div className="flex flex-col md:flex-row justify-between items-center">
              <div
                className="flex items-center space-x-3 mb-4 md:mb-0 cursor-pointer"
                onClick={() => navigate("/")}
              >
                <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                  <HeartHandshake className="w-5 h-5 text-white" />
                </div>
                <span className="text-lg font-bold text-white tracking-tight">
                  HealthSync
                </span>
              </div>
              <div className="flex items-center space-x-6 text-gray-400 text-sm">
                <a href="#" className="hover:text-white transition-colors">
                  Privacy
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Terms
                </a>
                <a href="#" className="hover:text-white transition-colors">
                  Contact
                </a>
              </div>
            </div>
            <div className="mt-6 text-center text-gray-500 text-sm">
              <p>&copy; 2025 HealthSync. All rights reserved.</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Auth Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        mode={authMode}
        onModeChange={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </div>
  );
};

export default LandingPage;
