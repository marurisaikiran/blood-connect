import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Home() {
  const { user } = useAuth();

  return (
    <div className="bg-gray-50 min-h-[calc(100vh-64px)]">
      <div className="max-w-4xl mx-auto px-4 py-20 text-center">
        <h1 className="text-4xl sm:text-5xl font-extrabold text-gray-900 mb-4">
          Find Blood &amp; Plasma Donors,{" "}
          <span className="text-brand">Instantly</span>
        </h1>
        <p className="text-gray-600 text-lg mb-8 max-w-2xl mx-auto">
          A community-driven platform connecting patients with verified nearby donors
          in real time — search by blood group and location, or raise an urgent
          request and get matched automatically.
        </p>
        <div className="flex items-center justify-center gap-4">
          <Link
            to="/donors"
            className="bg-brand text-white font-medium px-6 py-3 rounded-lg hover:bg-brand-dark transition"
          >
            Find Donors
          </Link>
          {!user && (
            <Link
              to="/register"
              className="border border-brand text-brand font-medium px-6 py-3 rounded-lg hover:bg-red-50 transition"
            >
              Become a Donor
            </Link>
          )}
        </div>

        <div className="grid sm:grid-cols-3 gap-6 mt-16 text-left">
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-2">1. Search or Request</h3>
            <p className="text-sm text-gray-500">
              Patients select a blood group and either browse a donor list or raise an
              urgent request.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-2">2. Get Matched</h3>
            <p className="text-sm text-gray-500">
              Our system finds verified, available donors near the hospital using
              real-time geolocation.
            </p>
          </div>
          <div className="bg-white rounded-2xl shadow p-6">
            <h3 className="font-semibold text-gray-800 mb-2">3. Connect Fast</h3>
            <p className="text-sm text-gray-500">
              View donor details, contact them directly, and track request status from
              your dashboard.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
