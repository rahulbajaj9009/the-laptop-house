import { useState } from "react";
import { Link } from "react-router-dom";
import { ArrowLeft, UserRound } from "lucide-react";
import { isLoggedIn, requestLogin } from "./loginRequired.js";

function readUser() {
  try {
    return JSON.parse(localStorage.getItem("user") || "null");
  } catch {
    return null;
  }
}

export default function ProfilePage() {
  const [user] = useState(readUser);
  const fields = [
    ["Full name", user?.name || user?.fullName || user?.username],
    ["Mobile number", user?.phone || user?.mobile || user?.phoneNumber],
    ["Email address", user?.email],
  ].filter(([, value]) => value);

  return (
    <main className="min-h-[65vh] bg-slate-50 px-4 py-8 sm:px-8">
      <div className="mx-auto max-w-3xl">
        <Link to="/" className="mb-6 inline-flex items-center gap-2 text-sm font-medium text-slate-600 hover:text-blue-700"><ArrowLeft size={17} /> Back to home</Link>
        {isLoggedIn() ? <>
          <div className="mb-6 flex items-center gap-4">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-blue-700"><UserRound size={28} /></div>
            <div><p className="text-sm font-medium text-blue-700">Your account</p><h1 className="text-3xl font-bold text-slate-950">My Profile</h1></div>
          </div>
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm sm:p-7">
            <h2 className="border-b border-slate-100 pb-4 text-lg font-semibold text-slate-900">Personal information</h2>
            {fields.length ? <dl className="divide-y divide-slate-100">
              {fields.map(([label, value]) => <div key={label} className="grid gap-1 py-4 sm:grid-cols-[180px_1fr] sm:gap-5"><dt className="text-sm text-slate-500">{label}</dt><dd className="break-words text-sm font-medium text-slate-900">{value}</dd></div>)}
            </dl> : <p className="py-5 text-sm text-slate-500">Your account details are not available yet.</p>}
          </section>
        </> : <section className="rounded-2xl border border-slate-200 bg-white px-5 py-14 text-center shadow-sm">
          <UserRound className="mx-auto text-slate-300" size={44} />
          <h1 className="mt-4 text-2xl font-bold text-slate-900">Log in to view your profile</h1>
          <p className="mt-2 text-slate-600">Your account details will appear here after you log in.</p>
          <button type="button" onClick={requestLogin} className="mt-6 rounded-xl bg-blue-600 px-5 py-3 font-semibold text-white hover:bg-blue-700">Login</button>
        </section>}
      </div>
    </main>
  );
}

