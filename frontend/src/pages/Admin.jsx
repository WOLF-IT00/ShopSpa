import { useState } from "react";
import { Navigate } from "react-router-dom";
import AdminLayout from "../components/Admin/AdminLayout";
import DashboardTab from "../components/Admin/DashboardTab";
import OrdersTab from "../components/Admin/OrdersTab";
import ServicesTab from "../components/Admin/ServicesTab";
import { Toast } from "../components/Admin/shared";
import { useAuth } from "../context/AuthContext";

function Admin() {
  const { user, loading, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("dashboard");
  const [toast, setToast] = useState({ message: "", type: "success" });

  if (loading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-50 dark:bg-gray-950">
        <p className="text-gray-500">Đang tải...</p>
      </div>
    );
  }

  if (!user || !isAdmin) {
    return <Navigate to="/login" replace />;
  }

  return (
    <>
      <AdminLayout activeTab={activeTab} onTabChange={setActiveTab}>
        {activeTab === "dashboard" && <DashboardTab />}

        {activeTab === "services" && (
          <ServicesTab onToast={(message, type) => setToast({ message, type })} />
        )}

        {activeTab === "orders" && (
          <OrdersTab onToast={(message, type) => setToast({ message, type })} />
        )}
      </AdminLayout>

      <Toast
        message={toast.message}
        type={toast.type}
        onClose={() => setToast({ message: "", type: "success" })}
      />
    </>
  );
}

export default Admin;
