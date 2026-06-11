import { useAuth } from "../context/AuthContext";
import PatientDashboard from "./PatientDashboard";
import DonorDashboard from "./DonorDashboard";

export default function Dashboard() {
  const { user } = useAuth();

  if (user?.role === "donor") return <DonorDashboard />;
  if (user?.role === "patient") return <PatientDashboard />;

  return (
    <div className="text-center py-10 text-gray-500">
      Unknown role.
    </div>
  );
}
