"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { supabase } from "@/lib/supabase"; // You should have this set up
import "./globals.css"; // optional: global styles

export default function Home() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  // Check if user is already logged in
  useEffect(() => {
    const checkSession = async () => {
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Check if role is already assigned
      const { data: userData } = await supabase
        .from("users")
        .select("role")
        .eq("id", user.id)
        .single();

      if (!userData) {
        router.push("/select-role");
      } else {
        router.push(userData.role === "faculty" ? "/faculty" : "/student");
      }
    };

    checkSession();
  }, []);

  const handleLogin = async () => {
    setLoading(true);
    const { error } = await supabase.auth.signInWithOtp({ email });
    setLoading(false);

    if (error) {
      alert("Login failed: " + error.message);
    } else {
      alert("Check your email for the magic link to log in.");
    }
  };

  return (
    <main className="min-h-screen flex flex-col items-center justify-center p-4">
      <h1 className="text-3xl font-bold mb-6">Venue Booking Login</h1>

      <input
        className="border p-2 mb-4 w-64"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
      />

      <button
        className="bg-blue-600 text-white px-4 py-2 rounded"
        onClick={handleLogin}
        disabled={loading || !email}
      >
        {loading ? "Sending link..." : "Send Magic Link"}
      </button>
    </main>
  );
}
