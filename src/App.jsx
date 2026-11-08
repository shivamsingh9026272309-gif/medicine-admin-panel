
import React, { useMemo, useState } from "react";
import {
  Activity, Bell, Box, CalendarDays, ChartNoAxesCombined,
  ChevronDown, ChevronRight, ClipboardList, CircleHelp,
  Building2, Gift, LayoutDashboard, Menu, MoreHorizontal,
  Package, Pencil, Pill, Plus, Search, Settings,
  ShoppingCart, Tag, Trash2, Truck, Users, X
} from "lucide-react";

import "./App.css";

const initialMedicines = [
  {
    id: 1,
    name: "Baby Gentle Wash",
    company: "Johnson & Johnson",
    category: "Baby Care",
    pack: "200 ml",
    price: 199,
    mrp: 249,
    stock: 45
  },
  {
    id: 2,
    name: "Calcium Tablets",
    company: "HealthVit",
    category: "Vitamins",
    pack: "60 Tablets",
    price: 299,
    mrp: 349,
    stock: 120
  },
  {
    id: 3,
    name: "Paracetamol Tablets",
    company: "Cipla",
    category: "Pain Relief",
    pack: "10 Tablets",
    price: 25,
    mrp: 30,
    stock: 8
  },
  {
    id: 4,
    name: "Cough Syrup",
    company: "Himalaya",
    category: "Respiratory Care",
    pack: "100 ml",
    price: 110,
    mrp: 125,
    stock: 0
  },
  {
    id: 5,
    name: "Multivitamin Syrup",
    company: "Abbott",
    category: "Vitamins",
    pack: "200 ml",
    price: 180,
    mrp: 210,
    stock: 62
  }
];

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Medicines", icon: Pill },
  { label: "Orders", icon: ShoppingCart },
  { label: "Customers", icon: Users },
  { label: "Categories", icon: Tag },
  { label: "Inventory", icon: Package },
  { label: "Batch & Expiry", icon: CalendarDays },
  { label: "Offers", icon: Gift },
  { label: "Reports", icon: ChartNoAxesCombined },
  { label: "Settings", icon: Settings }
];

const emptyMedicine = {
  name: "",
  company: "",
  category: "General",
  pack: "",
  price: "",
  mrp: "",
  stock: ""
};

function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [medicines, setMedicines] = useState(initialMedicines);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState(emptyMedicine);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [notice, setNotice] = useState("");

  const filteredMedicines = useMemo(() => {
    return medicines.filter((item) => {
      const matchesSearch =
        `${item.name} ${item.company} ${item.category}`
          .toLowerCase()
          .includes(search.toLowerCase());

      const matchesCategory =
        category === "All Categories" || item.category === category;

      return matchesSearch && matchesCategory;
    });
  }, [medicines, search, category]);

  const categories = [
    ...new Set(medicines.map((item) => item.category))
  ];

  const lowStock = medicines.filter(
    (item) => item.stock > 0 && item.stock <= 10
  ).length;

  const outOfStock = medicines.filter(
    (item) => item.stock === 0
  ).length;

  const totalStock = medicines.reduce(
    (total, item) => total + item.stock,
    0
  );

  function changePage(page) {
    setActivePage(page);
    setSidebarOpen(false);
    setSearch("");
    setNotice("");
  }

  function openAddModal() {
    setEditingId(null);
    setForm(emptyMedicine);
    setModalOpen(true);
  }

  function openEditModal(item) {
    setEditingId(item.id);
    setForm({ ...item });
    setModalOpen(true);
  }

  function saveMedicine(e) {
    e.preventDefault();

    const stock = Number(form.stock);

    const newMedicine = {
      ...form,
      price: Number(form.price),
      mrp: Number(form.mrp),
      stock,
      status:
        stock === 0
          ? "Out of Stock"
          : stock <= 10
          ? "Low Stock"
          : "Active"
    };

    if (editingId) {
      setMedicines((prev) =>
        prev.map((item) =>
          item.id === editingId
            ? { ...newMedicine, id: editingId }
            : item
        )
      );

      setNotice("Medicine updated successfully");
    } else {
      setMedicines((prev) => [
        { ...newMedicine, id: Date.now() },
        ...prev
      ]);

      setNotice("Medicine added successfully");
    }

    setModalOpen(false);
  }

  function deleteMedicine(id) {
    if (window.confirm("Are you sure you want to delete this medicine?")) {
      setMedicines((prev) =>
        prev.filter((item) => item.id !== id)
      );

      setNotice("Medicine deleted successfully");
    }
  }

  const pageSubtitle =
    activePage === "Dashboard"
      ? "Here's what's happening with your pharmacy today."
      : `Manage your ${activePage.toLowerCase()} easily`;

  return (
    <div className="admin-shell">

      {sidebarOpen && (
        <button
          className="mobile-overlay"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside className={`sidebar ${sidebarOpen ? "sidebar-open" : ""}`}>

        <div className="brand">
          <div className="brand-mark">
            <Pill size={23} />
          </div>

          <div className="brand-copy">
            <strong>PHARAMGO</strong>
            <span>ADMIN PANEL</span>
          </div>

          <button
            className="close-sidebar"
            onClick={() => setSidebarOpen(false)}
          >
            <X size={19} />
          </button>
        </div>

        <div className="sidebar-caption">WORKSPACE</div>

        <nav className="nav-list">
          {navigation.map(({ label, icon: Icon }) => (
            <button
              key={label}
              className={`nav-item ${
                activePage === label ? "active" : ""
              }`}
              onClick={() => changePage(label)}
            >
              <Icon size={19} />
              <span>{label}</span>

              {label === "Orders" && (
                <span className="nav-count">2</span>
              )}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="help-card">
            <CircleHelp size={19} />

            <div>
              <strong>Need help?</strong>
              <span>Contact support</span>
            </div>

            <ChevronRight size={16} />
          </div>

          <div className="sidebar-version">
            Pharamgo Admin · v1.0
          </div>
        </div>
      </aside>

      {/* MAIN AREA */}
      <main className="main-area">

        {/* HEADER */}
        <header className="topbar">

          <div className="topbar-left">
            <button
              className="menu-toggle"
              onClick={() => setSidebarOpen(true)}
            >
              <Menu size={22} />
            </button>

            <div>
              <h1>{activePage}</h1>
              <p>{pageSubtitle}</p>
            </div>
          </div>

          <div className="topbar-right">

            <div className="pharmacy-chip">
              <Building2 size={15} />
              <span>Pharamgo Pharmacy</span>
            </div>

            <button className="icon-button notification">
              <Bell size={19} />
              <i />
            </button>

            <button className="profile-button">
              <span className="avatar">A</span>
              <span className="profile-name">Admin</span>
              <ChevronDown size={15} />
            </button>

          </div>
        </header>

        <div className="page-content">

          {notice && (
            <div className="notice">
              <span>{notice}</span>
              <button onClick={() => setNotice("")}>
                <X size={15} />
              </button>
            </div>
          )}

          {/* DASHBOARD */}
          {activePage === "Dashboard" && (
            <>

              <div className="welcome-banner">
                <div>
                  <span className="eyebrow">
                    PHARMACY OVERVIEW
                  </span>

                  <h2>Welcome back, Admin 👋</h2>

                  <p>
                    Here's a quick overview of your pharmacy operations.
                  </p>
                </div>

                <div className="welcome-art">
                  <Pill size={48} />
                </div>
              </div>

              <div className="stats-grid">

                <StatCard
                  title="Total Medicines"
                  value={medicines.length}
                  note="In your catalogue"
                  icon={Pill}
                  tone="green"
                />

                <StatCard
                  title="Total Stock Units"
                  value={totalStock}
                  note="Available inventory"
                  icon={Package}
                  tone="blue"
                />

                <StatCard
                  title="Low Stock Items"
                  value={lowStock}
                  note="Need restocking"
                  icon={Activity}
                  tone="orange"
                />

                <StatCard
                  title="Out of Stock"
                  value={outOfStock}
                  note="Currently unavailable"
                  icon={Box}
                  tone="red"
                />

              </div>

              <div className="dashboard-grid">

                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Quick Actions</h2>
                      <p>Common tasks at your fingertips</p>
                    </div>
                  </div>

                  <div className="quick-actions">

                    <button onClick={() => {
                      changePage("Medicines");
                      openAddModal();
                    }}>
                      <span className="quick-icon">
                        <Plus size={20} />
                      </span>
                      <strong>Add Medicine</strong>
                      <small>Add a product to catalogue</small>
                    </button>

                    <button onClick={() => changePage("Orders")}>
                      <span className="quick-icon blue">
                        <ClipboardList size={20} />
                      </span>
                      <strong>View Orders</strong>
                      <small>Manage customer orders</small>
                    </button>

                    <button onClick={() => changePage("Inventory")}>
                      <span className="quick-icon orange">
                        <Truck size={20} />
                      </span>
                      <strong>Manage Stock</strong>
                      <small>Check inventory levels</small>
                    </button>

                    <button onClick={() => changePage("Reports")}>
                      <span className="quick-icon purple">
                        <ChartNoAxesCombined size={20} />
                      </span>
                      <strong>View Reports</strong>
                      <small>Track pharmacy performance</small>
                    </button>

                  </div>
                </section>

                <section className="panel">
                  <div className="panel-heading">
                    <div>
                      <h2>Recent Medicines</h2>
                      <p>Latest products in your catalogue</p>
                    </div>

                    <button
                      className="text-button"
                      onClick={() => changePage("Medicines")}
                    >
                      View all <ChevronRight size={15} />
                    </button>
                  </div>

                  <div className="recent-list">
                    {medicines.slice(0, 4).map((item) => (
                      <div className="recent-row" key={item.id}>
                        <div className="medicine-avatar">
                          <Pill size={18} />
                        </div>

                        <div className="recent-name">
                          <strong>{item.name}</strong>
                          <span>{item.company}</span>
                        </div>

                        <div className="recent-price">
                          ₹{item.price}
                        </div>
                      </div>
                    ))}
                  </div>
                </section>

              </div>
            </>
          )}

          {/* MEDICINES */}
          {activePage === "Medicines" && (
            <section className="panel">

              <div className="panel-heading">
                <div>
                  <h2>Medicine List</h2>
                  <p>View and manage your medicine catalogue</p>
                </div>

                <button
                  className="primary-button"
                  onClick={openAddModal}
                >
                  <Plus size={17} /> Add Medicine
                </button>
              </div>

              <div className="toolbar">

                <div className="search-box">
                  <Search size={17} />

                  <input
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    placeholder="Search medicine, brand..."
                  />
                </div>

                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                >
                  <option>All Categories</option>

                  {categories.map((item) => (
                    <option key={item}>{item}</option>
                  ))}
                </select>

              </div>

              <MedicineTable
                medicines={filteredMedicines}
                onEdit={openEditModal}
                onDelete={deleteMedicine}
              />

              <div className="table-footer">
                Showing <strong>{filteredMedicines.length}</strong> of{" "}
                <strong>{medicines.length}</strong> medicines
              </div>

            </section>
          )}

          {/* OTHER PAGES */}
          {activePage !== "Dashboard" &&
            activePage !== "Medicines" && (
              <section className="coming-panel">

                <div className="coming-icon">
                  {(() => {
                    const Icon =
                      navigation.find(
                        (item) => item.label === activePage
                      )?.icon || Box;

                    return <Icon size={30} />;
                  })()}
                </div>

                <h2>{activePage}</h2>

                <p>
                  This section will be developed in the next steps.
                </p>

                <button
                  className="secondary-button"
                  onClick={() => changePage("Dashboard")}
                >
                  Back to Dashboard
                </button>

              </section>
            )}

        </div>
      </main>

      {/* ADD / EDIT MEDICINE MODAL */}
      {modalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(e) => {
            if (e.target === e.currentTarget) {
              setModalOpen(false);
            }
          }}
        >

          <form className="medicine-modal" onSubmit={saveMedicine}>

            <div className="modal-heading">
              <div>
                <h2>
                  {editingId ? "Edit Medicine" : "Add New Medicine"}
                </h2>

                <p>Enter medicine details below</p>
              </div>

              <button
                type="button"
                className="icon-button"
                onClick={() => setModalOpen(false)}
              >
                <X size={20} />
              </button>
            </div>

            <div className="form-grid">

              <label>
                Medicine Name *
                <input
                  required
                  value={form.name}
                  onChange={(e) =>
                    setForm({ ...form, name: e.target.value })
                  }
                  placeholder="Medicine name"
                />
              </label>

              <label>
                Company / Brand *
                <input
                  required
                  value={form.company}
                  onChange={(e) =>
                    setForm({ ...form, company: e.target.value })
                  }
                  placeholder="Company name"
                />
              </label>

              <label>
                Category

                <select
                  value={form.category}
                  onChange={(e) =>
                    setForm({ ...form, category: e.target.value })
                  }
                >
                  <option>General</option>
                  <option>Baby Care</option>
                  <option>Vitamins</option>
                  <option>Pain Relief</option>
                  <option>Respiratory Care</option>
                  <option>Skin Care</option>
                  <option>Healthcare Devices</option>
                </select>
              </label>

              <label>
                Pack Size
                <input
                  value={form.pack}
                  onChange={(e) =>
                    setForm({ ...form, pack: e.target.value })
                  }
                  placeholder="e.g. 10 tablets"
                />
              </label>

              <label>
                Selling Price (₹) *
                <input
                  required
                  min="0"
                  type="number"
                  value={form.price}
                  onChange={(e) =>
                    setForm({ ...form, price: e.target.value })
                  }
                />
              </label>

              <label>
                MRP (₹) *
                <input
                  required
                  min="0"
                  type="number"
                  value={form.mrp}
                  onChange={(e) =>
                    setForm({ ...form, mrp: e.target.value })
                  }
                />
              </label>

              <label>
                Stock Quantity *
                <input
                  required
                  min="0"
                  type="number"
                  value={form.stock}
                  onChange={(e) =>
                    setForm({ ...form, stock: e.target.value })
                  }
                />
              </label>

            </div>

            <div className="modal-actions">
              <button
                type="button"
                className="secondary-button"
                onClick={() => setModalOpen(false)}
              >
                Cancel
              </button>

              <button type="submit" className="primary-button">
                {editingId ? "Save Changes" : "Add Medicine"}
              </button>
            </div>

          </form>
        </div>
      )}

    </div>
  );
}

function StatCard({ title, value, note, icon: Icon, tone }) {
  return (
    <div className="stat-card">
      <div className={`stat-icon ${tone}`}>
        <Icon size={20} />
      </div>

      <div className="stat-info">
        <span>{title}</span>
        <strong>{value}</strong>
        <small>{note}</small>
      </div>

      <MoreHorizontal className="stat-more" size={19} />
    </div>
  );
}

function MedicineTable({ medicines, onEdit, onDelete }) {
  if (!medicines.length) {
    return (
      <div className="empty-state">
        <Search size={26} />
        <strong>No medicines found</strong>
        <span>Try changing your search or category filter.</span>
      </div>
    );
  }

  return (
    <div className="table-wrap">
      <table className="medicine-table">

        <thead>
          <tr>
            <th>MEDICINE</th>
            <th>CATEGORY</th>
            <th>PACK</th>
            <th>PRICE / MRP</th>
            <th>STOCK</th>
            <th>STATUS</th>
            <th>ACTIONS</th>
          </tr>
        </thead>

        <tbody>
          {medicines.map((item) => {
            const status =
              item.stock === 0
                ? "Out of Stock"
                : item.stock <= 10
                ? "Low Stock"
                : "Active";

            return (
              <tr key={item.id}>

                <td>
                  <div className="product-cell">
                    <div className="product-thumb">
                      <Pill size={18} />
                    </div>

                    <div>
                      <strong>{item.name}</strong>
                      <span>{item.company}</span>
                    </div>
                  </div>
                </td>

                <td>{item.category}</td>
                <td>{item.pack || "—"}</td>

                <td>
                  <strong>₹{item.price}</strong>
                  <span className="mrp">₹{item.mrp}</span>
                </td>

                <td>{item.stock}</td>

                <td>
                  <span
                    className={`status ${status
                      .toLowerCase()
                      .replaceAll(" ", "-")}`}
                  >
                    {status}
                  </span>
                </td>

                <td>
                  <div className="action-buttons">
                    <button onClick={() => onEdit(item)}>
                      <Pencil size={16} />
                    </button>

                    <button onClick={() => onDelete(item.id)}>
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>

              </tr>
            );
          })}
        </tbody>

      </table>
    </div>
  );
}

export default App;
