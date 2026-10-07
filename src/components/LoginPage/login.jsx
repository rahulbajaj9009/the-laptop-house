import { useState, useEffect } from "react";
import { X, Laptop, Loader2, Smartphone } from "lucide-react";

export default function LoginModal({ isOpen, onClose }) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(30);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const API_BASE = "http://localhost:5000/api"; // ← apna backend URL

  useEffect(() => {
    let interval;
    if (step === 2 && timer > 0) {
      interval = setInterval(() => setTimer((prev) => prev - 1), 1000);
    } else if (timer === 0) {
      setCanResend(true);
    }
    return () => clearInterval(interval);
  }, [step, timer]);

  useEffect(() => {
    if (!isOpen) {
      setStep(1);
      setPhone("");
      setOtp(["", "", "", "", "", ""]);
      setTimer(30);
      setCanResend(false);
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleContinue = async () => {
    if (phone.length < 10) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send OTP");

      setStep(2);
      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  const handleVerify = async () => {
    const enteredOtp = otp.join("");
    if (enteredOtp.length < 6) return;
    setLoading(true);
    setError("");

    try {
      const res = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}`, otp: enteredOtp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Invalid OTP");

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      alert("Login Successful!");
      onClose();
      window.location.reload();
    } catch (err) {
      setError(err.message || "Verification failed");
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    setLoading(true);
    setError("");
    setOtp(["", "", "", "", "", ""]);

    try {
      const res = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ phone: `+91${phone}` }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to resend OTP");

      setTimer(30);
      setCanResend(false);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index, value) => {
    if (value.length > 1) return;
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    if (value && index < 5) {
      document.getElementById(`otp-${index + 1}`)?.focus();
    }
  };

  const handleOtpKeyDown = (index, e) => {
    if (e.key === "Backspace" && !otp[index] && index > 0) {
      document.getElementById(`otp-${index - 1}`)?.focus();
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative bg-white rounded-2xl shadow-2xl w-full max-w-[780px] overflow-hidden flex flex-col md:flex-row animate-in fade-in zoom-in-95 duration-200">
        
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 z-20 w-9 h-9 flex items-center justify-center rounded-full bg-white/80 hover:bg-gray-100 shadow-sm transition-all"
        >
          <X className="w-5 h-5 text-gray-600" />
        </button>

        {/* ==================== LEFT PANEL ==================== */}
        <div className="bg-gradient-to-br from-blue-600 via-blue-600 to-blue-700 text-white p-8 md:p-10 md:w-[300px] flex flex-col justify-between relative overflow-hidden">
          {/* Decorative circles */}
          <div className="absolute -top-10 -right-10 w-40 h-40 bg-white/10 rounded-full" />
          <div className="absolute bottom-20 -left-10 w-32 h-32 bg-white/10 rounded-full" />

          <div className="relative z-10">
            <h2 className="text-3xl font-bold mb-3 tracking-tight">Login</h2>
            <p className="text-blue-100 text-[17px] leading-relaxed opacity-90">
              Get access to your Orders, Wishlist and Recommendations
            </p>
          </div>

          {/* Illustration */}
          <div className="relative z-10 mt-12 flex justify-center">
            <div className="relative">
              <div className="w-44 h-36 bg-blue-500/40 backdrop-blur-sm rounded-2xl border border-white/20 flex items-center justify-center shadow-xl">
                <Laptop className="w-24 h-24 text-blue-100" strokeWidth={1.2} />
              </div>

              {/* Floating icons */}
              <div className="absolute -bottom-4 -left-4 w-12 h-12 bg-rose-400 rounded-xl flex items-center justify-center shadow-lg rotate-[-8deg]">
                <span className="text-white text-xl">♥</span>
              </div>
              <div className="absolute -top-3 -right-3 w-10 h-10 bg-amber-400 rounded-lg flex items-center justify-center shadow-lg rotate-[12deg]">
                <Smartphone className="w-5 h-5 text-white" />
              </div>
            </div>
          </div>
        </div>

        {/* ==================== RIGHT PANEL ==================== */}
        <div className="flex-1 p-8 md:p-10 bg-white">
          {step === 1 ? (
            <>
              <div className="mb-8">
                <h3 className="text-2xl font-semibold text-gray-900 mb-1">
                  Log in for the best experience
                </h3>
                <p className="text-gray-500 text-sm">
                  Enter your phone number to continue
                </p>
              </div>

              {/* Phone Input */}
              <div className="mb-5">
                <div className="relative">
                  <label className="absolute -top-2.5 left-3 bg-white px-1.5 text-xs font-medium text-blue-600">
                    Phone Number
                  </label>
                  <div className="flex items-center border-2 border-blue-500 rounded-xl overflow-hidden focus-within:ring-4 focus-within:ring-blue-100 transition-all">
                    <div className="flex items-center gap-1.5 px-4 py-3.5 bg-gray-50 border-r border-gray-200">
                      <span className="text-sm font-semibold text-gray-700">+91</span>
                    </div>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) =>
                        setPhone(e.target.value.replace(/\D/g, "").slice(0, 10))
                      }
                      placeholder="Enter 10 digit number"
                      className="flex-1 px-4 py-3.5 outline-none text-[15px] text-gray-800 placeholder:text-gray-400"
                      disabled={loading}
                    />
                  </div>
                </div>
              </div>

              {error && (
                <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <button className="text-blue-600 text-sm font-medium hover:underline mb-6">
                Use Email-ID instead
              </button>

              <p className="text-xs text-gray-500 mb-8 leading-relaxed">
                By continuing, you confirm that you are above 18 years of age, and you
                agree to the{" "}
                <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                  Terms of Use
                </span>{" "}
                &{" "}
                <span className="text-blue-600 font-medium cursor-pointer hover:underline">
                  Privacy Policy
                </span>
              </p>

              <button
                onClick={handleContinue}
                disabled={phone.length < 10 || loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                  phone.length >= 10 && !loading
                    ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Sending OTP...
                  </>
                ) : (
                  "Continue"
                )}
              </button>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Enter verification code
                </h3>
                <p className="text-gray-600 text-sm">
                  We've sent a 6-digit code to{" "}
                  <span className="font-semibold text-gray-800">+91-{phone}</span>{" "}
                  <button
                    onClick={() => setStep(1)}
                    className="text-blue-600 font-medium hover:underline ml-1"
                    disabled={loading}
                  >
                    Edit
                  </button>
                </p>
              </div>

              {/* OTP Inputs */}
              <div className="flex gap-3 mb-3 justify-center sm:justify-start">
                {otp.map((digit, index) => (
                  <input
                    key={index}
                    id={`otp-${index}`}
                    type="text"
                    inputMode="numeric"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleOtpChange(index, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(index, e)}
                    className="w-12 h-14 border-2 border-gray-200 rounded-xl text-center text-xl font-bold text-gray-800 outline-none focus:border-blue-600 focus:ring-4 focus:ring-blue-50 transition-all"
                    disabled={loading}
                  />
                ))}
              </div>

              {error && (
                <div className="mb-4 px-3 py-2 bg-red-50 border border-red-100 rounded-lg">
                  <p className="text-red-600 text-sm">{error}</p>
                </div>
              )}

              <div className="text-right text-sm mb-8">
                {canResend ? (
                  <button
                    onClick={handleResend}
                    className="text-blue-600 font-semibold hover:underline"
                    disabled={loading}
                  >
                    Resend Code
                  </button>
                ) : (
                  <span className="text-gray-500">
                    Resend in{" "}
                    <span className="font-semibold text-gray-700">
                      00:{timer.toString().padStart(2, "0")}
                    </span>
                  </span>
                )}
              </div>

              <button
                onClick={handleVerify}
                disabled={otp.join("").length < 6 || loading}
                className={`w-full py-3.5 rounded-xl font-semibold text-white flex items-center justify-center gap-2 transition-all ${
                  otp.join("").length === 6 && !loading
                    ? "bg-blue-600 hover:bg-blue-700 shadow-md hover:shadow-lg"
                    : "bg-gray-200 text-gray-400 cursor-not-allowed"
                }`}
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    Verifying...
                  </>
                ) : (
                  "Verify & Login"
                )}
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  );
}