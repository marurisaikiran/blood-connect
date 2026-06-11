import { useEffect, useState } from "react";
import {
  getNearbyRequests,
  respondToMatch,
  updateAvailability,
} from "../api/endpoints";
import { useAuth } from "../context/AuthContext";

const URGENCY_COLORS = {
  low: "bg-gray-100 text-gray-600",
  medium: "bg-yellow-100 text-yellow-700",
  high: "bg-orange-100 text-orange-700",
  critical: "bg-red-100 text-red-700",
};

export default function DonorDashboard() {
  const { user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [available, setAvailable] = useState(true);
  const [toggling, setToggling] = useState(false);

  const loadRequests = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await getNearbyRequests(25);
      setRequests(res.data.requests);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load nearby requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRequests();
  }, []);

  const handleToggleAvailability = async () => {
    setToggling(true);
    try {
      const res = await updateAvailability(!available);
      setAvailable(res.data.donor.isAvailable);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update availability");
    } finally {
      setToggling(false);
    }
  };

  const handleRespond = async (requestId, response) => {
    setError("");
    setSuccess("");
    try {
      await respondToMatch(requestId, response);
      setSuccess(`Response recorded: ${response}`);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to respond");
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Welcome, {user?.name}
        </h1>
        <button
          onClick={handleToggleAvailability}
          disabled={toggling}
          className={`px-4 py-2 rounded-lg font-medium text-sm transition disabled:opacity-60 ${
            available
              ? "bg-green-100 text-green-700 hover:bg-green-200"
              : "bg-gray-200 text-gray-600 hover:bg-gray-300"
          }`}
        >
          {available ? "Available — tap to mark unavailable" : "Unavailable — tap to mark available"}
        </button>
      </div>

      {error && (
        <div className="bg-red-50 text-red-600 text-sm rounded-lg px-4 py-2 mb-4">
          {error}
        </div>
      )}
      {success && (
        <div className="bg-green-50 text-green-700 text-sm rounded-lg px-4 py-2 mb-4">
          {success}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-800">
            Nearby Blood Requests
          </h2>
          <button
            onClick={loadRequests}
            className="text-brand text-sm font-medium hover:underline"
          >
            Refresh
          </button>
        </div>

        {loading ? (
          <p className="text-gray-500 text-sm">Loading...</p>
        ) : requests.length === 0 ? (
          <p className="text-gray-500 text-sm">
            No matching requests near you right now.
          </p>
        ) : (
          <div className="space-y-3">
            {requests.map((r) => (
              <div
                key={r._id}
                className="border border-gray-200 rounded-lg p-4 flex flex-col gap-2"
              >
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-800">
                    {r.bloodGroup} · {r.unitsNeeded} unit(s)
                  </span>
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full capitalize ${URGENCY_COLORS[r.urgency]}`}
                  >
                    {r.urgency}
                  </span>
                </div>
                <p className="text-sm text-gray-600">{r.hospitalName}</p>
                {r.description && (
                  <p className="text-sm text-gray-500">{r.description}</p>
                )}
                <p className="text-xs text-gray-400">
                  {(r.distanceMeters / 1000).toFixed(2)} km away
                </p>
                <div className="flex gap-2 mt-1">
                  <button
                    onClick={() => handleRespond(r._id, "accepted")}
                    className="bg-green-600 text-white text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-green-700 transition"
                  >
                    Accept
                  </button>
                  <button
                    onClick={() => handleRespond(r._id, "declined")}
                    className="bg-gray-200 text-gray-700 text-sm font-medium px-3 py-1.5 rounded-lg hover:bg-gray-300 transition"
                  >
                    Decline
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
