
import React, { useEffect, useMemo, useState } from "react";
import {
  Activity,
  Bell,
  Box,
  ChartNoAxesCombined,
  ChevronRight,
  ClipboardList,
  CircleHelp,
  Gift,
  LayoutDashboard,
  Menu,
  Package,
  Pencil,
  Pill,
  Plus,
  Search,
  Settings,
  ShoppingCart,
  Trash2,
  Users,
  X,
  RefreshCw,
  Image as ImageIcon,
} from "lucide-react";

// ==========================================
// API CONFIGURATION
// ==========================================

const API_BASE_URL = (
  import.meta.env.VITE_API_URL || "http://localhost:5000"
).replace(/\/$/, "");

const API_URL = `${API_BASE_URL}/api/medicines`;

// ==========================================
// CATEGORY AND SUBCATEGORY DATA
// ==========================================

const CATEGORY_DATA = {
  "Personal Care": [
    "Baby & Mom Care",
    "Bone & Joint",
    "Hair Care",
    "Skin Care",
    "Body Care",
    "Sexual Wellness",
  ],

  "Health Conditions": [
    "Digestive Care",
    "Pain Relief",
    "Respiratory Care",
    "Stomach Care",
  ],

  "Healthcare Devices": [
    "BP Monitor",
    "Nebulizer",
    "Thermometer",
    "Supports",
  ],

  "Vitamins & Supplements": [
    "Baby Care",
    "Calcium",
    "Supplement Powder",
    "Vitamin A To Z",
  ],
};

// ==========================================
// EMPTY MEDICINE FORM
// ==========================================

const emptyMedicine = {
  name: "",
  genericName: "",
  company: "",
  category: "",
  subcategory: "",
  price: "",
  mrp: "",
  images: ["", "", ""],
  composition: "",
  packSize: "",
  stock: "",
  batchNumber: "",
  expiryDate: "",
  dosage: "",
  precautions: "",
};

// ==========================================
// HELPER FUNCTIONS
// ==========================================

function getMedicineId(medicine) {
  return medicine._id || medicine.id;
}

function getMedicineImages(medicine) {
  if (Array.isArray(medicine.images)) {
    return medicine.images;
  }

  if (medicine.image) {
    return [medicine.image];
  }

  return [];
}

async function readResponse(response) {
  const text = await response.text();

  if (!text) return {};

  try {
    return JSON.parse(text);
  } catch {
    return {};
  }
}

function getMedicineList(result) {
  if (Array.isArray(result)) return result;
  if (Array.isArray(result.medicines)) return result.medicines;
  if (Array.isArray(result.data)) return result.data;
  if (Array.isArray(result.data?.medicines)) {
    return result.data.medicines;
  }

  return [];
}

// ==========================================
// MAIN APP
// ==========================================

export default function App() {
  const [activePage, setActivePage] = useState("Dashboard");
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const [medicines, setMedicines] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);

  const [notice, setNotice] = useState("");
  const [form, setForm] = useState(emptyMedicine);

  // ========================================
  // LOAD MEDICINES
  // ========================================

  async function fetchMedicines() {
    try {
      setLoading(true);

      const response = await fetch(API_URL);
      const result = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message || "Medicines load nahi hui."
        );
      }

      setMedicines(getMedicineList(result));
    } catch (error) {
      console.error(error);
      setNotice(error.message || "Backend connection failed.");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    fetchMedicines();
  }, []);

  // ========================================
  // SEARCH
  // ========================================

  const filteredMedicines = useMemo(() => {
    const search = searchTerm.toLowerCase().trim();

    if (!search) return medicines;

    return medicines.filter((medicine) =>
      [
        medicine.name,
        medicine.genericName,
        medicine.company,
        medicine.category,
        medicine.subcategory,
        medicine.batchNumber,
      ]
        .filter(Boolean)
        .some((value) =>
          String(value).toLowerCase().includes(search)
        )
    );
  }, [medicines, searchTerm]);

  // ========================================
  // DASHBOARD STATISTICS
  // ========================================

  const totalStock = medicines.reduce(
    (total, item) => total + Number(item.stock || 0),
    0
  );

  const totalValue = medicines.reduce(
    (total, item) =>
      total +
      Number(item.price || 0) *
        Number(item.stock || 0),
    0
  );

  const lowStock = medicines.filter(
    (item) => Number(item.stock || 0) <= 10
  ).length;

  // ========================================
  // FORM HANDLERS
  // ========================================

  function handleChange(event) {
    const { name, value } = event.target;

    setForm((previous) => ({
      ...previous,
      [name]: value,

      // Category change = reset old subcategory
      ...(name === "category"
        ? { subcategory: "" }
        : {}),
    }));
  }

  function handleImageChange(index, value) {
    setForm((previous) => {
      const updatedImages = [...previous.images];

      updatedImages[index] = value;

      return {
        ...previous,
        images: updatedImages,
      };
    });
  }

  function resetForm() {
    setForm({
      ...emptyMedicine,
      images: ["", "", ""],
    });
  }

  // ========================================
  // ADD MEDICINE
  // ========================================

  function openAddModal() {
    setEditingId(null);
    resetForm();
    setModalOpen(true);
    setNotice("");
  }

  // ========================================
  // EDIT MEDICINE
  // ========================================

  function openEditModal(medicine) {
    setEditingId(getMedicineId(medicine));

    const images = getMedicineImages(medicine);

    setForm({
      name: medicine.name || "",
      genericName: medicine.genericName || "",
      company: medicine.company || "",
      category: medicine.category || "",
      subcategory: medicine.subcategory || "",

      price: medicine.price ?? "",
      mrp: medicine.mrp ?? "",

      images: [
        images[0] || "",
        images[1] || "",
        images[2] || "",
      ],

      composition: medicine.composition || "",
      packSize: medicine.packSize || medicine.pack || "",
      stock: medicine.stock ?? "",
      batchNumber: medicine.batchNumber || "",

      expiryDate: medicine.expiryDate
        ? String(medicine.expiryDate).slice(0, 10)
        : "",

      dosage: medicine.dosage || "",
      precautions: medicine.precautions || "",
    });

    setModalOpen(true);
    setNotice("");
  }

  // ========================================
  // SAVE MEDICINE
  // ========================================

  async function saveMedicine(event) {
    event.preventDefault();

    if (!form.name.trim()) {
      setNotice("Medicine name required hai.");
      return;
    }

    if (!form.category) {
      setNotice("Please select category.");
      return;
    }

    if (!form.subcategory) {
      setNotice("Please select subcategory.");
      return;
    }

    if (form.price === "" || Number(form.price) < 0) {
      setNotice("Valid selling price enter karein.");
      return;
    }

    try {
      setSaving(true);
      setNotice("");

      const medicineData = {
        name: form.name.trim(),
        genericName: form.genericName.trim(),
        company: form.company.trim(),

        category: form.category,
        subcategory: form.subcategory,

        price: Number(form.price || 0),
        mrp: Number(form.mrp || 0),

        images: form.images
          .map((image) => image.trim())
          .filter(Boolean),

        composition: form.composition.trim(),
        packSize: form.packSize.trim(),

        stock: Number(form.stock || 0),
        batchNumber: form.batchNumber.trim(),

        expiryDate: form.expiryDate || null,

        dosage: form.dosage.trim(),
        precautions: form.precautions.trim(),
      };

      const isEditing = Boolean(editingId);

      const response = await fetch(
        isEditing
          ? `${API_URL}/${editingId}`
          : API_URL,
        {
          method: isEditing ? "PUT" : "POST",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify(medicineData),
        }
      );

      const result = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message || "Medicine save nahi hui."
        );
      }

      await fetchMedicines();

      setNotice(
        isEditing
          ? "Medicine successfully updated."
          : "Medicine successfully added."
      );

      setModalOpen(false);
      setEditingId(null);
      resetForm();
    } catch (error) {
      console.error(error);

      setNotice(
        error.message || "Medicine save karne me error aaya."
      );
    } finally {
      setSaving(false);
    }
  }

  // ========================================
  // DELETE MEDICINE
  // ========================================

  async function deleteMedicine(id) {
    const confirmed = window.confirm(
      "Kya aap is medicine ko delete karna chahte hain?"
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: "DELETE",
      });

      const result = await readResponse(response);

      if (!response.ok) {
        throw new Error(
          result.message || "Medicine delete nahi hui."
        );
      }

      await fetchMedicines();

      setNotice("Medicine successfully deleted.");
    } catch (error) {
      setNotice(error.message || "Delete failed.");
    }
  }

  // ========================================
  // NAVIGATION
  // ========================================

  const menuItems = [
    { title: "Dashboard", icon: LayoutDashboard },
    { title: "Medicines", icon: Pill },
    { title: "Orders", icon: ClipboardList },
    { title: "Customers", icon: Users },
    { title: "Categories", icon: Box },
    { title: "Inventory", icon: Package },
    { title: "Reports", icon: ChartNoAxesCombined },
    { title: "Offers", icon: Gift },
  ];

  // ========================================
  // FORM FIELD COMPONENT
  // ========================================

  function Field({
    label,
    name,
    placeholder,
    type = "text",
    required = false,
    full = false,
  }) {
    return (
      <div className={`form-field ${full ? "full" : ""}`}>
        <label>
          {label} {required ? "*" : ""}
        </label>

        <input
          type={type}
          name={name}
          value={form[name]}
          onChange={handleChange}
          placeholder={placeholder}
          required={required}
          min={type === "number" ? "0" : undefined}
        />
      </div>
    );
  }

  // ========================================
  // UI
  // ========================================

  return (
    <div className="app">

      <style>{`
        * {
          box-sizing: border-box;
        }

        body {
          margin: 0;
          font-family: Inter, Arial, sans-serif;
          background: #f6f7fb;
          color: #202438;
        }

        button, input, select, textarea {
          font: inherit;
        }

        button {
          cursor: pointer;
        }

        .app {
          min-height: 100vh;
        }

        .sidebar {
          width: 245px;
          background: #171b2d;
          color: white;
          position: fixed;
          inset: 0 auto 0 0;
          padding: 22px 15px;
          z-index: 20;
          overflow-y: auto;
          transition: transform .2s;
        }

        .sidebar.closed {
          transform: translateX(-100%);
        }

        .brand {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 22px;
          font-weight: 800;
          padding: 5px 10px 30px;
        }

        .brand-icon {
          background: #e94b5c;
          border-radius: 10px;
          padding: 9px;
          display: flex;
        }

        .menu-label {
          color: #8990a8;
          font-size: 11px;
          font-weight: 700;
          padding: 12px;
          letter-spacing: 1px;
        }

        .nav-item {
          display: flex;
          align-items: center;
          gap: 13px;
          width: 100%;
          border: 0;
          background: transparent;
          color: #b8bfd1;
          padding: 12px;
          border-radius: 9px;
          margin: 3px 0;
          text-align: left;
          font-size: 14px;
        }

        .nav-item:hover,
        .nav-item.active {
          background: #30364d;
          color: white;
        }

        .nav-item.active {
          border-left: 3px solid #f05b69;
        }

        .main {
          margin-left: 245px;
          min-height: 100vh;
          transition: margin .2s;
        }

        .main.expanded {
          margin-left: 0;
        }

        .topbar {
          height: 72px;
          background: white;
          border-bottom: 1px solid #edf0f5;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 28px;
          position: sticky;
          top: 0;
          z-index: 10;
        }

        .top-left, .top-right {
          display: flex;
          align-items: center;
          gap: 16px;
        }

        .icon-button {
          border: 0;
          background: #f5f6fa;
          width: 38px;
          height: 38px;
          display: grid;
          place-items: center;
          border-radius: 9px;
          color: #4c5265;
        }

        .top-title {
          font-weight: 700;
          font-size: 17px;
        }

        .avatar {
          width: 36px;
          height: 36px;
          border-radius: 50%;
          background: #ffe5e8;
          color: #d84253;
          display: grid;
          place-items: center;
          font-weight: 800;
        }

        .content {
          padding: 28px;
          max-width: 1500px;
          margin: auto;
        }

        .page-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 15px;
          margin-bottom: 24px;
          flex-wrap: wrap;
        }

        .page-heading h1 {
          margin: 0 0 6px;
          font-size: 25px;
        }

        .muted {
          color: #858b9d;
          font-size: 13px;
        }

        .primary-btn {
          border: 0;
          background: #e94b5c;
          color: white;
          padding: 11px 17px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-weight: 600;
        }

        .primary-btn:hover {
          background: #d83c4e;
        }

        .secondary-btn {
          border: 1px solid #e5e8ef;
          background: white;
          color: #444b60;
          padding: 10px 14px;
          border-radius: 8px;
          display: inline-flex;
          align-items: center;
          gap: 7px;
        }

        .stats-grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 17px;
          margin-bottom: 24px;
        }

        .stat-card {
          background: white;
          border: 1px solid #edf0f5;
          border-radius: 12px;
          padding: 20px;
        }

        .stat-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          color: #7e8496;
          font-size: 13px;
        }

        .stat-icon {
          width: 40px;
          height: 40px;
          display: grid;
          place-items: center;
          border-radius: 10px;
          background: #fff0f1;
          color: #e94b5c;
        }

        .stat-value {
          font-size: 25px;
          font-weight: 800;
          margin-top: 13px;
        }

        .stat-note {
          color: #8b91a1;
          font-size: 12px;
          margin-top: 5px;
        }

        .panel {
          background: white;
          border: 1px solid #edf0f5;
          border-radius: 12px;
          padding: 20px;
          margin-bottom: 22px;
        }

        .panel-heading {
          display: flex;
          justify-content: space-between;
          align-items: center;
          gap: 12px;
          margin-bottom: 18px;
          flex-wrap: wrap;
        }

        .panel-heading h2 {
          margin: 0;
          font-size: 17px;
        }

        .search-box {
          display: flex;
          align-items: center;
          gap: 8px;
          border: 1px solid #e6e9f0;
          background: white;
          border-radius: 8px;
          padding: 0 11px;
          min-width: 240px;
        }

        .search-box input {
          border: 0;
          outline: 0;
          padding: 11px 0;
          width: 100%;
          min-width: 0;
        }

        .table-wrap {
          overflow-x: auto;
        }

        table {
          width: 100%;
          border-collapse: collapse;
          min-width: 760px;
        }

        th {
          background: #f8f9fc;
          color: #858b9d;
          font-size: 11px;
          text-transform: uppercase;
          letter-spacing: .5px;
          text-align: left;
          padding: 13px 12px;
        }

        td {
          padding: 14px 12px;
          border-bottom: 1px solid #f0f1f5;
          font-size: 13px;
        }

        .medicine-name {
          font-weight: 700;
          color: #30364b;
        }

        .medicine-sub {
          color: #9298a7;
          font-size: 11px;
          margin-top: 4px;
        }

        .pill-status {
          display: inline-block;
          border-radius: 20px;
          padding: 5px 9px;
          font-size: 11px;
          background: #edf8f1;
          color: #26834d;
        }

        .pill-status.low {
          background: #fff2e5;
          color: #c47b24;
        }

        .action-btn {
          border: 0;
          background: #f5f6fa;
          color: #555c70;
          padding: 7px;
          border-radius: 7px;
          margin-right: 5px;
        }

        .action-btn.delete {
          color: #dc4858;
        }

        .empty-state {
          text-align: center;
          color: #858b9d;
          padding: 35px;
        }

        .notice {
          padding: 12px 15px;
          border-radius: 8px;
          margin-bottom: 18px;
          background: #fff4e7;
          color: #9b651e;
          font-size: 13px;
        }

        .modal-backdrop {
          position: fixed;
          inset: 0;
          z-index: 50;
          background: rgba(17, 21, 35, .55);
          display: flex;
          justify-content: center;
          align-items: center;
          padding: 18px;
        }

        .modal {
          background: white;
          border-radius: 14px;
          width: 100%;
          max-width: 850px;
          max-height: 92vh;
          overflow-y: auto;
          box-shadow: 0 20px 70px #0003;
        }

        .modal-header {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 20px 24px;
          border-bottom: 1px solid #edf0f5;
          position: sticky;
          top: 0;
          background: white;
          z-index: 2;
        }

        .modal-header h2 {
          margin: 0;
          font-size: 19px;
        }

        .modal-body {
          padding: 22px 24px;
        }

        .form-grid {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 16px;
        }

        .form-field {
          display: flex;
          flex-direction: column;
          gap: 7px;
        }

        .form-field.full {
          grid-column: 1 / -1;
        }

        .form-field label {
          font-size: 12px;
          font-weight: 700;
          color: #555c70;
        }

        .form-field input,
        .form-field select,
        .form-field textarea {
          width: 100%;
          border: 1px solid #e2e5ec;
          border-radius: 8px;
          padding: 11px 12px;
          outline: none;
          color: #30364b;
          background: white;
          min-width: 0;
        }

        .form-field input:focus,
        .form-field select:focus,
        .form-field textarea:focus {
          border-color: #e94b5c;
        }

        .form-field select:disabled {
          background: #f4f5f8;
          color: #999;
          cursor: not-allowed;
        }

        .form-field textarea {
          resize: vertical;
          min-height: 75px;
        }

        .section-label {
          grid-column: 1 / -1;
          font-size: 13px;
          font-weight: 800;
          color: #33394d;
          padding-top: 8px;
          border-bottom: 1px solid #edf0f5;
          padding-bottom: 8px;
        }

        .modal-footer {
          display: flex;
          justify-content: flex-end;
          gap: 10px;
          padding: 16px 24px;
          border-top: 1px solid #edf0f5;
          position: sticky;
          bottom: 0;
          background: white;
        }

        .loading {
          text-align: center;
          padding: 30px;
          color: #858b9d;
        }

        .category-info {
          color: #8b91a1;
          font-size: 11px;
          margin-top: 3px;
        }

        @media(max-width: 950px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr);
          }

          .sidebar {
            transform: translateX(-100%);
          }

          .sidebar.mobile-open {
            transform: translateX(0);
          }

          .main {
            margin-left: 0;
          }
        }

        @media(max-width: 600px) {
          .content {
            padding: 17px 13px;
          }

          .topbar {
            padding: 0 14px;
          }

          .stats-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 10px;
          }

          .stat-card {
            padding: 14px;
          }

          .stat-value {
            font-size: 20px;
          }

          .form-grid {
            grid-template-columns: 1fr;
          }

          .form-field.full,
          .section-label {
            grid-column: auto;
          }

          .modal-body {
            padding: 17px;
          }

          .modal-header,
          .modal-footer {
            padding: 15px 17px;
          }

          .page-heading h1 {
            font-size: 22px;
          }

          .search-box {
            min-width: 100%;
          }
        }
      `}</style>

      {/* SIDEBAR */}

      <aside
        className={`sidebar ${
          sidebarOpen ? "mobile-open" : "closed"
        }`}
      >
        <div className="brand">
          <span className="brand-icon">
            <Pill size={23} />
          </span>
          <span>Pharamgo</span>
        </div>

        <div className="menu-label">MAIN MENU</div>

        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <button
              key={item.title}
              className={`nav-item ${
                activePage === item.title ? "active" : ""
              }`}
              onClick={() => {
                setActivePage(item.title);
                setSidebarOpen(false);
                setNotice("");
              }}
            >
              <Icon size={18} />
              <span>{item.title}</span>

              {activePage === item.title && (
                <ChevronRight
                  size={15}
                  style={{ marginLeft: "auto" }}
                />
              )}
            </button>
          );
        })}

        <div className="menu-label" style={{ marginTop: 25 }}>
          SETTINGS
        </div>

        <button className="nav-item">
          <Settings size={18} />
          Settings
        </button>

        <button className="nav-item">
          <CircleHelp size={18} />
          Help & Support
        </button>
      </aside>

      {/* MAIN AREA */}

      <main
        className={`main ${
          !sidebarOpen ? "expanded" : ""
        }`}
      >

        {/* TOPBAR */}

        <header className="topbar">
          <div className="top-left">
            <button
              className="icon-button"
              onClick={() => setSidebarOpen(!sidebarOpen)}
            >
              <Menu size={19} />
            </button>

            <span className="top-title">{activePage}</span>
          </div>

          <div className="top-right">
            <button className="icon-button">
              <Bell size={18} />
            </button>

            <div className="avatar">P</div>
          </div>
        </header>

        {/* CONTENT */}

        <section className="content">

          {notice && (
            <div className="notice">
              {notice}
            </div>
          )}

          {/* DASHBOARD */}

          {activePage === "Dashboard" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Dashboard</h1>
                  <div className="muted">
                    Welcome to Pharamgo Admin Panel
                  </div>
                </div>

                <button
                  className="primary-btn"
                  onClick={openAddModal}
                >
                  <Plus size={18} />
                  Add Medicine
                </button>
              </div>

              <div className="stats-grid">
                <div className="stat-card">
                  <div className="stat-top">
                    Total Medicines
                    <span className="stat-icon">
                      <Pill size={20} />
                    </span>
                  </div>

                  <div className="stat-value">
                    {medicines.length}
                  </div>

                  <div className="stat-note">
                    Medicines in database
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    Total Stock
                    <span className="stat-icon">
                      <Package size={20} />
                    </span>
                  </div>

                  <div className="stat-value">
                    {totalStock}
                  </div>

                  <div className="stat-note">
                    Available units
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    Low Stock
                    <span className="stat-icon">
                      <Activity size={20} />
                    </span>
                  </div>

                  <div className="stat-value">
                    {lowStock}
                  </div>

                  <div className="stat-note">
                    Medicines with stock 10 or less
                  </div>
                </div>

                <div className="stat-card">
                  <div className="stat-top">
                    Stock Value
                    <span className="stat-icon">
                      <ChartNoAxesCombined size={20} />
                    </span>
                  </div>

                  <div className="stat-value">
                    ₹{totalValue.toLocaleString("en-IN")}
                  </div>

                  <div className="stat-note">
                    Based on selling price
                  </div>
                </div>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <h2>Recent Medicines</h2>

                  <button
                    className="secondary-btn"
                    onClick={() => setActivePage("Medicines")}
                  >
                    View All
                    <ChevronRight size={16} />
                  </button>
                </div>

                {loading ? (
                  <div className="loading">
                    Loading medicines...
                  </div>
                ) : medicines.length === 0 ? (
                  <div className="empty-state">
                    No medicines found.
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Category</th>
                          <th>Price</th>
                          <th>Stock</th>
                        </tr>
                      </thead>

                      <tbody>
                        {medicines.slice(0, 5).map((medicine) => (
                          <tr key={getMedicineId(medicine)}>
                            <td>
                              <div className="medicine-name">
                                {medicine.name}
                              </div>
                              <div className="medicine-sub">
                                {medicine.company}
                              </div>
                            </td>

                            <td>
                              {medicine.category}
                              <div className="medicine-sub">
                                {medicine.subcategory}
                              </div>
                            </td>

                            <td>₹{medicine.price}</td>
                            <td>{medicine.stock}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* MEDICINES PAGE */}

          {activePage === "Medicines" && (
            <>
              <div className="page-heading">
                <div>
                  <h1>Medicine Management</h1>
                  <div className="muted">
                    Add, edit, search and manage medicines
                  </div>
                </div>

                <button
                  className="primary-btn"
                  onClick={openAddModal}
                >
                  <Plus size={18} />
                  Add Medicine
                </button>
              </div>

              <div className="panel">
                <div className="panel-heading">
                  <h2>All Medicines ({medicines.length})</h2>

                  <div
                    style={{
                      display: "flex",
                      gap: 8,
                      flexWrap: "wrap",
                    }}
                  >
                    <div className="search-box">
                      <Search size={17} />

                      <input
                        type="text"
                        placeholder="Search medicines..."
                        value={searchTerm}
                        onChange={(e) =>
                          setSearchTerm(e.target.value)
                        }
                      />
                    </div>

                    <button
                      className="secondary-btn"
                      onClick={fetchMedicines}
                    >
                      <RefreshCw size={16} />
                    </button>
                  </div>
                </div>

                {loading ? (
                  <div className="loading">
                    Loading medicines...
                  </div>
                ) : filteredMedicines.length === 0 ? (
                  <div className="empty-state">
                    No medicines found.
                  </div>
                ) : (
                  <div className="table-wrap">
                    <table>
                      <thead>
                        <tr>
                          <th>Medicine</th>
                          <th>Company</th>
                          <th>Category</th>
                          <th>Subcategory</th>
                          <th>Price</th>
                          <th>MRP</th>
                          <th>Stock</th>
                          <th>Actions</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filteredMedicines.map((medicine) => (
                          <tr key={getMedicineId(medicine)}>
                            <td>
                              <div className="medicine-name">
                                {medicine.name}
                              </div>

                              <div className="medicine-sub">
                                {medicine.genericName}
                              </div>
                            </td>

                            <td>{medicine.company}</td>
                            <td>{medicine.category}</td>
                            <td>{medicine.subcategory}</td>
                            <td>₹{medicine.price}</td>
                            <td>₹{medicine.mrp}</td>

                            <td>
                              <span
                                className={`pill-status ${
                                  Number(medicine.stock || 0) <= 10
                                    ? "low"
                                    : ""
                                }`}
                              >
                                {medicine.stock || 0}
                              </span>
                            </td>

                            <td>
                              <button
                                className="action-btn"
                                onClick={() =>
                                  openEditModal(medicine)
                                }
                                title="Edit"
                              >
                                <Pencil size={15} />
                              </button>

                              <button
                                className="action-btn delete"
                                onClick={() =>
                                  deleteMedicine(
                                    getMedicineId(medicine)
                                  )
                                }
                                title="Delete"
                              >
                                <Trash2 size={15} />
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </div>
            </>
          )}

          {/* OTHER PAGES */}

          {!["Dashboard", "Medicines"].includes(activePage) && (
            <div className="page-heading">
              <div>
                <h1>{activePage}</h1>
                <div className="muted">
                  {activePage} management
                </div>
              </div>
            </div>
          )}

          {activePage === "Categories" && (
            <div className="panel">
              <h2>Available Categories</h2>

              {Object.entries(CATEGORY_DATA).map(
                ([category, subcategories]) => (
                  <div
                    key={category}
                    style={{
                      padding: "15px 0",
                      borderBottom: "1px solid #eee",
                    }}
                  >
                    <strong>{category}</strong>

                    <div className="medicine-sub">
                      {subcategories.join(" • ")}
                    </div>
                  </div>
                )
              )}
            </div>
          )}

          {activePage === "Inventory" && (
            <div className="panel">
              <h2>Inventory Overview</h2>
              <p>Total Stock: {totalStock}</p>
              <p>Low Stock Medicines: {lowStock}</p>
            </div>
          )}

          {activePage === "Orders" && (
            <div className="panel">
              <h2>Orders</h2>
              <div className="empty-state">
                Order API integration is pending.
              </div>
            </div>
          )}

          {activePage === "Customers" && (
            <div className="panel">
              <h2>Customers</h2>
              <div className="empty-state">
                Customer API integration is pending.
              </div>
            </div>
          )}

          {activePage === "Reports" && (
            <div className="panel">
              <h2>Reports</h2>
              <p>Total Medicines: {medicines.length}</p>
              <p>Total Stock: {totalStock}</p>
              <p>
                Stock Value: ₹
                {totalValue.toLocaleString("en-IN")}
              </p>
            </div>
          )}

          {activePage === "Offers" && (
            <div className="panel">
              <h2>Offers</h2>
              <div className="empty-state">
                Offers management will be added later.
              </div>
            </div>
          )}

        </section>
      </main>

      {/* ========================================
          ADD / EDIT MEDICINE MODAL
      ======================================== */}

      {modalOpen && (
        <div
          className="modal-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setModalOpen(false);
            }
          }}
        >
          <div className="modal">

            <div className="modal-header">
              <h2>
                {editingId
                  ? "Edit Medicine"
                  : "Add New Medicine"}
              </h2>

              <button
                className="icon-button"
                onClick={() => setModalOpen(false)}
              >
                <X size={21} />
              </button>
            </div>

            <form onSubmit={saveMedicine}>
              <div className="modal-body">

                <div className="form-grid">

                  <div className="section-label">
                    Basic Information
                  </div>

                  <Field
                    label="Medicine Name"
                    name="name"
                    placeholder="Enter medicine name"
                    required
                  />

                  <Field
                    label="Generic Name"
                    name="genericName"
                    placeholder="Enter generic name"
                  />

                  <Field
                    label="Company"
                    name="company"
                    placeholder="Enter company name"
                  />

                  {/* CATEGORY DROPDOWN */}

                  <div className="form-field">
                    <label>Category *</label>

                    <select
                      name="category"
                      value={form.category}
                      onChange={handleChange}
                      required
                    >
                      <option value="">
                        Select Category
                      </option>

                      {Object.keys(CATEGORY_DATA).map(
                        (category) => (
                          <option
                            key={category}
                            value={category}
                          >
                            {category}
                          </option>
                        )
                      )}
                    </select>
                  </div>

                  {/* AUTOMATIC SUBCATEGORY DROPDOWN */}

                  <div className="form-field">
                    <label>Subcategory *</label>

                    <select
                      name="subcategory"
                      value={form.subcategory}
                      onChange={handleChange}
                      disabled={!form.category}
                      required
                    >
                      <option value="">
                        {form.category
                          ? "Select Subcategory"
                          : "First Select Category"}
                      </option>

                      {(
                        CATEGORY_DATA[form.category] || []
                      ).map((subcategory) => (
                        <option
                          key={subcategory}
                          value={subcategory}
                        >
                          {subcategory}
                        </option>
                      ))}
                    </select>

                    <div className="category-info">
                      {form.category
                        ? `${
                            CATEGORY_DATA[form.category].length
                          } subcategories available`
                        : "Select a category first"}
                    </div>
                  </div>

                  <div className="section-label">
                    Pricing & Inventory
                  </div>

                  <Field
                    label="Selling Price (₹)"
                    name="price"
                    placeholder="Enter selling price"
                    type="number"
                    required
                  />

                  <Field
                    label="MRP (₹)"
                    name="mrp"
                    placeholder="Enter MRP"
                    type="number"
                  />

                  <Field
                    label="Pack Size"
                    name="packSize"
                    placeholder="Example: 100 ml / 10 tablets"
                  />

                  <Field
                    label="Stock Quantity"
                    name="stock"
                    placeholder="Enter available stock"
                    type="number"
                  />

                  <Field
                    label="Batch Number"
                    name="batchNumber"
                    placeholder="Enter batch number"
                  />

                  <Field
                    label="Expiry Date"
                    name="expiryDate"
                    type="date"
                  />

                  <div className="section-label">
                    Medicine Images
                  </div>

                  {form.images.map((image, index) => (
                    <div
                      className="form-field full"
                      key={index}
                    >
                      <label>
                        <ImageIcon
                          size={14}
                          style={{
                            display: "inline",
                            verticalAlign: "middle",
                          }}
                        />{" "}
                        Medicine Image {index + 1} URL
                      </label>

                      <input
                        type="url"
                        value={image}
                        onChange={(e) =>
                          handleImageChange(
                            index,
                            e.target.value
                          )
                        }
                        placeholder="Enter image URL"
                      />
                    </div>
                  ))}

                  <div className="section-label">
                    Medicine Details
                  </div>

                  <div className="form-field full">
                    <label>Composition</label>

                    <textarea
                      name="composition"
                      value={form.composition}
                      onChange={handleChange}
                      placeholder="Enter medicine composition"
                    />
                  </div>

                  <div className="form-field full">
                    <label>Dosage</label>

                    <textarea
                      name="dosage"
                      value={form.dosage}
                      onChange={handleChange}
                      placeholder="Enter dosage information"
                    />
                  </div>

                  <div className="form-field full">
                    <label>Precautions</label>

                    <textarea
                      name="precautions"
                      value={form.precautions}
                      onChange={handleChange}
                      placeholder="Enter precautions"
                    />
                  </div>

                </div>
              </div>

              <div className="modal-footer">
                <button
                  type="button"
                  className="secondary-btn"
                  onClick={() => setModalOpen(false)}
                  disabled={saving}
                >
                  Cancel
                </button>

                <button
                  type="submit"
                  className="primary-btn"
                  disabled={saving}
                >
                  {saving
                    ? "Saving..."
                    : editingId
                    ? "Update Medicine"
                    : "Save Medicine"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

