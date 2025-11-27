import React, { useState, useEffect } from "react";
import {
  FaShoppingCart,
  FaBoxOpen,
  FaUsers,
  FaTags,
  FaBan,
  FaCheck,
} from "react-icons/fa";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { useNavigate } from "react-router-dom";
import { useUser } from "./UserContext";
import "./css/AdminDashboard.css";

const api = "http://localhost:9000";

const StatCard = ({ title, value, Icon }) => (
  <div className="dashboard-card">
    <div>
      <p className="dashboard-card-title">{title}</p>
      <p className="dashboard-card-value">{value}</p>
    </div>
    <Icon className="dashboard-card-icon" />
  </div>
);

export default function AdminDashboard() {
  const { user } = useUser();
  const navigate = useNavigate();

  const [stats, setStats] = useState({
    ordersToday: 0,
    totalProducts: 0,
    customers: 0,
    couponsActive: 0,
  });
  const [salesData, setSalesData] = useState([]);

  /* order & customer data */
  const [orders, setOrders] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const [tab, setTab] = useState("products");

  /* ─── Gate ─── */
  useEffect(() => {
    if (!user || user.email !== "tejas.s.s.gowda13@gmail.com")
      navigate("/sign-in");
  }, [user, navigate]);

  /* ─── Fetch KPI + sales ─── */
  useEffect(() => {
    const fetchData = async () => {
      const [statsRes, salesRes] = await Promise.all([
        fetch(`${api}/admin/stats`),
        fetch(`${api}/admin/sales/weekly`),
      ]);
      setStats(await statsRes.json());
      setSalesData(await salesRes.json());
    };
    fetchData();
  }, []);

  /* ─── Fetch orders & customers once ─── */
  useEffect(() => {
    const loadLists = async () => {
      const [oRes, cRes] = await Promise.all([
        fetch(`${api}/admin/orders`),
        fetch(`${api}/admin/customers`),
      ]);
      setOrders(await oRes.json());
      setCustomers(await cRes.json());
    };
    loadLists();
  }, []);

  /* update order status */
  const updateStatus = async (id, status) => {
    const res = await fetch(`${api}/admin/orders/${id}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status }),
    });
    const updated = await res.json();
    setOrders((prev) =>
      prev.map((o) => (o._id === updated._id ? updated : o))
    );
    setSelectedOrder(updated);
  };

  /* toggle block customer */
  const toggleBlock = async (id) => {
    const res = await fetch(`${api}/admin/customers/${id}/block`, {
      method: "PATCH",
    });
    const { blocked } = await res.json();
    setCustomers((prev) =>
      prev.map((c) => (c._id === id ? { ...c, blocked } : c))
    );
  };

  /* helper renderers */
  const statusOptions = ["Pending", "Processing", "Shipped", "Delivered"];

  /* ──────────────────────────────────────── */
  return (
    <div className="admin-dashboard">
      <h1>Admin&nbsp;Dashboard</h1>

      {/* KPI cards */}
      <div className="dashboard-cards">
        <StatCard title="Orders Today" value={stats.ordersToday} Icon={FaShoppingCart} />
        <StatCard title="Total Products" value={stats.totalProducts} Icon={FaBoxOpen} />
        <StatCard title="Customers"      value={stats.customers}     Icon={FaUsers} />
        <StatCard title="Coupons Active" value={stats.couponsActive} Icon={FaTags} />
      </div>

      {/* Sales chart */}
      <div className="chart-wrapper">
        <h2>Sales This Week</h2>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={salesData}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="sales" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Tabs */}
      <div className="tabs">
        {["products", "orders", "customers", "coupons"].map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={tab === t ? "tabs-btn active" : "tabs-btn"}
          >
            {t[0].toUpperCase() + t.slice(1)}
          </button>
        ))}
      </div>

      {/* === TAB BODIES === */}
      <div className="tab-body">
        {tab === "products" && <p>Product management UI goes here</p>}

        {tab === "orders" && (
          <>
            <table className="list-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Customer</th>
                  <th>Status</th>
                  <th>Total (₹)</th>
                  <th>Date</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((o) => (
                  <tr key={o._id} onClick={() => setSelectedOrder(o)}>
                    <td>{o._id.slice(-6)}</td>
                    <td>{o.customerInfo?.fullName || "—"}</td>
                    <td>{o.status}</td>
                    <td>{o.totals?.total}</td>
                    <td>{new Date(o.createdAt).toLocaleDateString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* order details modal */}
            {selectedOrder && (
              <div className="modal">
                <div className="modal-content">
                  <button
                    className="close-btn"
                    onClick={() => setSelectedOrder(null)}
                  >
                    ×
                  </button>
                  <h3>Order #{selectedOrder._id}</h3>
                  <p>
                    <b>Status:</b>{" "}
                    <select
                      value={selectedOrder.status}
                      onChange={(e) =>
                        updateStatus(selectedOrder._id, e.target.value)
                      }
                    >
                      {statusOptions.map((s) => (
                        <option key={s}>{s}</option>
                      ))}
                    </select>
                  </p>
                  <p>
                    <b>Customer:</b>{" "}
                    {selectedOrder.customerInfo?.fullName} (
                    {selectedOrder.customerInfo?.email})
                  </p>
                  <p>
                    <b>Address:</b>{" "}
                    {selectedOrder.shippingAddress?.street},{" "}
                    {selectedOrder.shippingAddress?.city}
                  </p>
                  <h4>Items</h4>
                  <ul>
                    {selectedOrder.items.map((it) => (
                      <li key={it.id}>
                        {it.title} × {it.quantity} = ₹
                        {it.price * it.quantity}
                      </li>
                    ))}
                  </ul>
                  <p>
                    <b>Total:</b> ₹{selectedOrder.totals?.total}
                  </p>
                </div>
              </div>
            )}
          </>
        )}

        {tab === "customers" && (
          <table className="list-table">
            <thead>
              <tr>
                <th>Email</th>
                <th>Username</th>
                <th>Blocked</th>
                <th />
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c._id}>
                  <td>{c.email}</td>
                  <td>{c.username}</td>
                  <td>{c.blocked ? "Yes" : "No"}</td>
                  <td>
                    <button
                      className="link-btn"
                      onClick={() => toggleBlock(c._id)}
                    >
                      {c.blocked ? (
                        <>
                          Unblock <FaCheck />
                        </>
                      ) : (
                        <>
                          Block <FaBan />
                        </>
                      )}
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}

        {tab === "coupons" && <p>Coupon editor UI goes here</p>}
      </div>
    </div>
  );
}
