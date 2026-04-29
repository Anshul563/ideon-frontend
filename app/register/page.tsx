"use client";

import { useState } from "react";
import axios from "axios";

export default function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleRegister = async () => {
    await axios.post("http://localhost:5000/api/auth/register", {
      email,
      password,
    });

    window.location.href = "/login";
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-950 text-white">
      <div className="bg-slate-900 p-8 rounded-xl w-96">
        <h2 className="text-2xl mb-4">Create Account</h2>

        <input
          className="w-full p-2 mb-3 bg-slate-800"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          type="password"
          className="w-full p-2 mb-3 bg-slate-800"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          onClick={handleRegister}
          className="w-full bg-indigo-600 py-2 rounded"
        >
          Register
        </button>
      </div>
    </main>
  );
}