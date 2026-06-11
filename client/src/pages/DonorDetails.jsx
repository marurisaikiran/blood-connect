import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { getDonorById } from "../api/endpoints";
import MapView from "../components/MapView";

export default function DonorDetails() {
  const { id } = useParams();
  const [donor, setDonor] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getDonorById(id)
      .then((res) => setDonor(res.data.donor))
      .catch((err) => setError(err.response?.data?.message || "Failed to load donor"))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p className="text-center py-10 text-gray-500">Loading...</p>;
  if (error) return <p className="text-center py-10 text-red-600">{error}</p>;

  const [lng, lat] = donor.location.coordinates;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Link to="/donors" className="text-brand text-sm font-medium hover:underline">
        &larr; Back to donor search
      </Link>

      <div className="grid sm:grid-cols-2 gap-6 mt-4">
        <div className="bg-white rounded-2xl shadow p-6">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold text-gray-800">{donor.userId.name}</h1>
            <span className="bg-brand text-white text-sm font-bold px-3 py-1 rounded-full">
              {donor.bloodGroup}
            </span>
          </div>
          <dl className="space-y-2 text-sm">
            <div className="flex justify-between">
              <dt className="text-gray-500">Phone</dt>
              <dd className="text-gray-800 font-medium">{donor.userId.phone}</dd>
            </div>
            <div className="flex justify-between">
              <dt className="text-gray-500">Hospital / Blood Bank</dt>
              <dd className="text-gray-800 font-medium">{donor.hospitalOrBank}</dd>
            </div>
            {donor.address && (
              <div className="flex justify-between">
                <dt className="text-gray-500">Address</dt>
                <dd className="text-gray-800 font-medium">{donor.address}</dd>
              </div>
            )}
            {donor.city && (
              <div className="flex justify-between">
                <dt className="text-gray-500">City</dt>
                <dd className="text-gray-800 font-medium">{donor.city}</dd>
              </div>
            )}
            <div className="flex justify-between">
              <dt className="text-gray-500">Availability</dt>
              <dd
                className={`font-medium ${donor.isAvailable ? "text-green-600" : "text-gray-400"}`}
              >
                {donor.isAvailable ? "Available" : "Not available"}
              </dd>
            </div>
          </dl>
        </div>

        <MapView donors={[donor]} center={[lat, lng]} zoom={13} height="320px" />
      </div>
    </div>
  );
}
