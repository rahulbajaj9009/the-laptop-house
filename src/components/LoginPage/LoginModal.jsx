import { useEffect, useState } from "react";
import { Laptop, Loader2, X } from "lucide-react";

const API_BASE = (import.meta.env.VITE_API_URL || "http://localhost:5000/api").replace(/\/$/, "");
const OTP_DURATION = 180;

export default function LoginModal({ isOpen, onClose }) {
  const [isMounted, setIsMounted] = useState(isOpen);
  const [isVisible, setIsVisible] = useState(false);
  const [method, setMethod] = useState("phone");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [step, setStep] = useState(1);
  const [otp, setOtp] = useState(["", "", "", "", "", ""]);
  const [timer, setTimer] = useState(OTP_DURATION);
  const [canResend, setCanResend] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const normalizedEmail = email.trim().toLowerCase();
  const contact = method === "phone" ? `+91${phone}` : normalizedEmail;
  const isContactValid = method === "phone" ? phone.length === 10 : /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizedEmail);
  const formatTimer = `${String(Math.floor(timer / 60)).padStart(2, "0")}:${String(timer % 60).padStart(2, "0")}`;

  useEffect(() => {
    if (isOpen) {
      setIsMounted(true);
      const frame = window.requestAnimationFrame(() => setIsVisible(true));
      return () => window.cancelAnimationFrame(frame);
    }
    setIsVisible(false);
    const timeout = window.setTimeout(() => setIsMounted(false), 220);
    return () => window.clearTimeout(timeout);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return undefined;
    const closeOnEscape = (event) => { if (event.key === "Escape") onClose(); };
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", closeOnEscape);
    return () => {
      document.body.style.overflow = previousOverflow;
      window.removeEventListener("keydown", closeOnEscape);
    };
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen || step !== 2 || timer <= 0) {
      if (step === 2 && timer <= 0) setCanResend(true);
      return undefined;
    }
    const interval = window.setInterval(() => setTimer((remaining) => remaining - 1), 1000);
    return () => window.clearInterval(interval);
  }, [isOpen, step, timer]);

  useEffect(() => {
    if (!isOpen) {
      setMethod("phone");
      setPhone("");
      setEmail("");
      setStep(1);
      setOtp(["", "", "", "", "", ""]);
      setTimer(OTP_DURATION);
      setCanResend(false);
      setError("");
      setLoading(false);
    }
  }, [isOpen]);

  if (!isMounted) return null;

  const requestBody = () => method === "phone" ? { phone: contact } : { email: contact };

  const sendOtp = async () => {
    if (!isContactValid) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/auth/send-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody()),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "Could not send the verification code.");
      setStep(2);
      setTimer(OTP_DURATION);
      setCanResend(false);
      setOtp(["", "", "", "", "", ""]);
    } catch (requestError) {
      setError(requestError.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async () => {
    const code = otp.join("");
    if (code.length !== 6) return;
    setLoading(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...requestBody(), otp: code }),
      });
      const data = await response.json();
      if (!response.ok) throw new Error(data.message || "The verification code is incorrect.");
      if (!data.token) throw new Error("Login succeeded without a session token. Please contact support.");
      const user = data.user || { name: "", ...(method === "phone" ? { phone: contact } : { email: contact }) };
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(user));
      onClose();
      window.location.reload();
    } catch (requestError) {
      setError(requestError.message || "Verification failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const updateOtp = (index, value) => {
    if (!/^\d?$/.test(value)) return;
    setOtp((current) => current.map((digit, itemIndex) => itemIndex === index ? value : digit));
    if (value && index < 5) document.getElementById(`login-otp-${index + 1}`)?.focus();
  };

  return (
    <div className={`fixed inset-0 z-[100] flex items-center justify-center p-4 transition-opacity duration-200 ${isVisible ? "opacity-100" : "pointer-events-none opacity-0"}`} role="presentation">
      <button type="button" aria-label="Close login" className="absolute inset-0 bg-black/50 backdrop-blur-[2px]" onClick={onClose} />
      <section role="dialog" aria-modal="true" aria-labelledby="login-title" className={`relative flex w-full max-w-[720px] flex-col overflow-hidden rounded-2xl bg-white shadow-2xl transition duration-200 ease-out md:flex-row ${isVisible ? "translate-y-0 scale-100 opacity-100" : "translate-y-3 scale-[0.98] opacity-0"}`}>
        <button type="button" onClick={onClose} aria-label="Close" className="absolute right-4 top-4 z-10 flex h-9 w-9 items-center justify-center rounded-full hover:bg-gray-100"><X className="h-5 w-5 text-gray-600" /></button>
        <div className="flex flex-col justify-between bg-blue-600 p-7 text-white md:w-[270px] md:p-8">
          <div><h2 id="login-title" className="mb-3 text-3xl font-bold">Login</h2><p className="text-blue-100">Access your profile and continue shopping securely.</p></div>
          <div className="mt-7 flex justify-center"><div className="flex h-28 w-36 items-center justify-center rounded-xl bg-blue-500"><Laptop className="h-16 w-16 text-blue-100" strokeWidth={1.5} /></div></div>
        </div>
        <div className="flex-1 p-6 pt-14 sm:p-8 sm:pt-14">
          {step === 1 ? <>
            <h3 className="text-xl font-semibold text-slate-900">Log in for the best experience</h3>
            <p className="mb-5 mt-1 text-sm text-slate-500">Choose how you want to receive your one-time code.</p>
            <div className="mb-5 grid grid-cols-2 rounded-lg bg-slate-100 p-1" role="tablist" aria-label="Login method">
              <button type="button" role="tab" aria-selected={method === "phone"} onClick={() => { setMethod("phone"); setError(""); }} className={`rounded-md px-3 py-2.5 text-sm font-semibold transition ${method === "phone" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>Mobile number</button>
              <button type="button" role="tab" aria-selected={method === "email"} onClick={() => { setMethod("email"); setError(""); }} className={`rounded-md px-3 py-2.5 text-sm font-semibold transition ${method === "email" ? "bg-white text-blue-700 shadow-sm" : "text-slate-600 hover:text-slate-900"}`}>Email address</button>
            </div>
            <label className="mb-4 block text-sm font-medium text-slate-700">{method === "phone" ? "Mobile number" : "Email address"}
              <span className="mt-1.5 flex overflow-hidden rounded-lg border-2 border-blue-500 focus-within:ring-2 focus-within:ring-blue-100">
                {method === "phone" && <span className="border-r bg-slate-50 px-3 py-3 text-sm font-semibold text-slate-700">+91</span>}
                <input type={method === "phone" ? "tel" : "email"} inputMode={method === "phone" ? "numeric" : "email"} autoComplete={method === "phone" ? "tel-national" : "email"} value={method === "phone" ? phone : email} onChange={(event) => method === "phone" ? setPhone(event.target.value.replace(/\D/g, "").slice(0, 10)) : setEmail(event.target.value)} placeholder={method === "phone" ? "Enter 10-digit mobile number" : "name@example.com"} className="min-w-0 flex-1 px-3 py-3 text-sm outline-none" disabled={loading} />
              </span>
            </label>
            {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
            <p className="mb-5 text-xs leading-5 text-slate-500">By continuing, you agree to our Terms of Use and Privacy Policy.</p>
            <button type="button" onClick={sendOtp} disabled={!isContactValid || loading} className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition ${isContactValid && !loading ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-slate-300"}`}>
              {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Sending code...</> : "Send OTP"}
            </button>
          </> : <>
            <h3 className="text-xl font-semibold text-slate-900">Verify your login</h3>
            <p className="mb-5 mt-1 text-sm text-slate-500">Enter the 6-digit code sent to <span className="font-medium text-slate-700">{contact}</span>.</p>
            <div className="mb-5 flex justify-between gap-1.5 sm:gap-2">
              {otp.map((digit, index) => <input key={index} id={`login-otp-${index}`} type="text" inputMode="numeric" autoComplete={index === 0 ? "one-time-code" : "off"} maxLength={1} value={digit} onChange={(event) => updateOtp(index, event.target.value)} aria-label={`OTP digit ${index + 1}`} className="h-12 w-10 rounded-lg border border-slate-300 text-center text-lg font-semibold outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-100 sm:w-11" disabled={loading} />)}
            </div>
            <div className="mb-5 flex items-center justify-between text-sm">
              <span className="text-slate-500">Code expires in <strong className="text-slate-800">{formatTimer}</strong></span>
              {canResend ? <button type="button" onClick={sendOtp} disabled={loading} className="font-semibold text-blue-700 hover:underline">Resend code</button> : <button type="button" onClick={() => { setStep(1); setError(""); }} disabled={loading} className="font-medium text-blue-700 hover:underline">Change {method === "phone" ? "number" : "email"}</button>}
            </div>
            {error && <p role="alert" className="mb-4 text-sm text-red-600">{error}</p>}
            <button type="button" onClick={verifyOtp} disabled={otp.join("").length !== 6 || loading} className={`flex w-full items-center justify-center gap-2 rounded-lg py-3 font-semibold text-white transition ${otp.join("").length === 6 && !loading ? "bg-blue-600 hover:bg-blue-700" : "cursor-not-allowed bg-slate-300"}`}>
              {loading ? <><Loader2 className="h-5 w-5 animate-spin" /> Verifying...</> : "Verify and log in"}
            </button>
          </>}
        </div>
      </section>
    </div>
  );
}
