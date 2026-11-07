
import React, { useState } from "react";
import {
  LayoutDashboard, Pill, ShoppingCart, Users,
  Tags, Package, CalendarDays, Gift,
  ChartColumn, Settings, Bell, Search,
  Plus, Menu, X, Pencil, Trash2, Eye,
  Building2, Clock, AlertTriangle, Boxes,
  LogOut, ChevronDown, Save
} from "lucide-react";

const initialMedicines = [
  {
    id: 1,
    name: "Baby Gentle Wash",
    generic: "Baby Body Wash",
    company: "Johnson & Johnson",
    category: "Baby & Mom Care",
    mrp: 199,
    price: 149,
    stock: 100,
    pack: "200 ml",
    status: "Active"
  },
  {
    id: 2,
    name: "Calcium Tablets",
    generic: "Calcium Carbonate",
    company: "Himalaya",
    category: "Vitamins & Supplements",
    mrp: 249,
    price: 199,
    stock: 50,
    pack: "30 Tablets",
    status: "Active"
  },
  {
    id: 3,
    name: "Paracetamol Tablets",
    generic: "Paracetamol",
    company: "Cipla",
    category: "Pain Relief",
    mrp: 45,
    price: 35,
    stock: 200,
    pack: "10 Tablets",
    status: "Active"
  },
  {
    id: 4,
    name: "Cough Syrup",
    generic: "Dextromethorphan",
    company: "Pharma Company",
    category: "Respiratory Care",
    mrp: 120,
    price: 99,
    stock: 75,
    pack: "100 ml",
    status: "Active"
  },
  {
    id: 5,
    name: "Multivitamin Syrup",
    generic: "Vitamins & Minerals",
    company: "Health Company",
    category: "Vitamins & Supplements",
    mrp: 220,
    price: 179,
    stock: 5,
    pack: "200 ml",
    status: "Active"
  }
];

const menuItems = [
  { name: "Dashboard", icon: LayoutDashboard },
  { name: "Medicines", icon: Pill },
  { name: "Orders", icon: ShoppingCart },
  { name: "Customers", icon: Users },
  { name: "Categories", icon: Tags },
  { name: "Inventory", icon: Package },
  { name: "Batch & Expiry", icon: CalendarDays },
  { name: "Offers", icon: Gift },
  { name: "Reports", icon: ChartColumn },
  { name: "Settings", icon: Settings }
];

export default function App() {
  const [page, setPage] = useState("Medicines");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [medicines, setMedicines] = useState(initialMedicines);
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All Categories");
  const [modal, setModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({
    name: "",
    generic: "",
    company: "",
    category: "Baby & Mom Care",
    mrp: "",
    price: "",
    stock: "",
    pack: "",
    status: "Active"
  });

  const lowStock = medicines.filter(m => m.stock <= 10).length;

  const filtered = medicines.filter(m => {
    const matchesSearch =
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.generic.toLowerCase().includes(search.toLowerCase());

    const matchesCategory =
      category === "All Categories" || m.category === category;

    return matchesSearch && matchesCategory;
  });

  function openAdd() {
    setEditing(null);
    setForm({
      name: "",
      generic: "",
      company: "",
      category: "Baby & Mom Care",
      mrp: "",
      price: "",
      stock: "",
      pack: "",
      status: "Active"
    });
    setModal(true);
  }

  function openEdit(medicine) {
    setEditing(medicine.id);
    setForm({ ...medicine });
    setModal(true);
  }

  function saveMedicine(e) {
    e.preventDefault();

    const item = {
      ...form,
      mrp: Number(form.mrp),
      price: Number(form.price),
      stock: Number(form.stock)
    };

    if (editing !== null) {
      setMedicines(prev =>
        prev.map(m => m.id === editing ? { ...item, id: editing } : m)
      );
    } else {
      setMedicines(prev => [
        ...prev,
        { ...item, id: Date.now() }
      ]);
    }

    setModal(false);
  }

  function deleteMedicine(id) {
    if (window.confirm("Delete this medicine?")) {
      setMedicines(prev => prev.filter(m => m.id !== id));
    }
  }

  function pageTitle() {
    return page === "Medicines"
      ? "Medicines Management"
      : page;
  }

  return (
    <div className="app">

      <aside className={`sidebar ${sidebarOpen ? "" : "collapsed"}`}>
        <div className="brand">
          <div className="brand-icon"><Pill size={32}/></div>
          {sidebarOpen && (
            <div>
              <h2>Pharamgo</h2>
              <small>Health for a Better Life</small>
            </div>
          )}
        </div>

        <nav>
          {menuItems.map(item => {
            const Icon = item.icon;

            return (
              <button
                key={item.name}
                className={`nav-item ${page === item.name ? "selected" : ""}`}
                onClick={() => setPage(item.name)}
                title={item.name}
              >
                <Icon size={21}/>
                {sidebarOpen && <span>{item.name}</span>}
                {item.name === "Orders" && sidebarOpen &&
                  <b className="notification-count">12</b>}
              </button>
            );
          })}
        </nav>

        {sidebarOpen && (
          <>
            <div className="help-box">
              <h4>Need Help?</h4>
              <p>Contact Pharamgo Support</p>
              <p>Call: 1800-123-4567</p>
            </div>

            <button className="logout">
              <LogOut size={19}/> Logout
            </button>
          </>
        )}
      </aside>

      <div className="main-area">

        <header className="topbar">
          <button className="menu-toggle" onClick={() => setSidebarOpen(!sidebarOpen)}>
            <Menu size={25}/>
          </button>

          <div className="page-heading">
            <h2>{pageTitle()}</h2>
            <p>Manage your medicines easily</p>
          </div>

          <div className="top-actions">
            <div className="pharmacy">
              <Building2 size={19}/>
              Pharamgo Pharmacy
            </div>

            <button className="bell">
              <Bell size={23}/>
              <span>2</span>
            </button>

            <div className="admin-profile">
              <div className="avatar">A</div>
              <b>Admin</b>
              <ChevronDown size={16}/>
            </div>
          </div>
        </header>

        <main className="content">

          {page === "Medicines" || page === "Dashboard" ? (
            <>
              <div className="stats">

                <div className="stat-card green">
                  <div className="stat-icon"><Pill size={29}/></div>
                  <div>
                    <p>Total Medicines</p>
                    <h2>{medicines.length}</h2>
                  </div>
                </div>

                <div className="stat-card blue">
                  <div className="stat-icon"><Boxes size={29}/></div>
                  <div>
                    <p>In Stock</p>
                    <h2>{medicines.filter(m => m.stock > 0).length}</h2>
                  </div>
                </div>

                <div className="stat-card orange">
                  <div className="stat-icon"><AlertTriangle size={29}/></div>
                  <div>
                    <p>Low Stock</p>
                    <h2>{lowStock}</h2>
                  </div>
                </div>

                <div className="stat-card purple">
                  <div className="stat-icon"><Clock size={29}/></div>
                  <div>
                    <p>Expiring Soon</p>
                    <h2>25</h2>
                  </div>
                </div>

              </div>

              <div className="section-heading">
                <div>
                  <h2>{page === "Dashboard" ? "Dashboard Overview" : `All Medicines (${filtered.length})`}</h2>
                  <p>Manage your medicine inventory</p>
                </div>

                {page === "Medicines" && (
                  <div className="toolbar">
                    <div className="search-box">
                      <Search size={19}/>
                      <input
                        placeholder="Search medicine..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                      />
                    </div>

                    <select
                      value={category}
                      onChange={e => setCategory(e.target.value)}
                    >
                      <option>All Categories</option>
                      <option>Baby & Mom Care</option>
                      <option>Vitamins & Supplements</option>
                      <option>Pain Relief</option>
                      <option>Respiratory Care</option>
                    </select>

                    <button className="add-button" onClick={openAdd}>
                      <Plus size={19}/> Add Medicine
                    </button>
                  </div>
                )}
              </div>

              {page === "Dashboard" ? (
                <div className="empty-panel">
                  <LayoutDashboard size={45}/>
                  <h3>Welcome to Pharamgo Admin</h3>
                  <p>Your medicine management dashboard is ready.</p>
                  <button className="add-button" onClick={() => setPage("Medicines")}>
                    Manage Medicines
                  </button>
                </div>
              ) : (
                <div className="table-card">
                  <div className="table-scroll">
                    <table>
                      <thead>
                        <tr>
                          <th>Image</th>
                          <th>Name</th>
                          <th>Generic Name</th>
                          <th>MRP</th>
                          <th>Price</th>
                          <th>Stock</th>
                          <th>Status</th>
                          <th>Action</th>
                        </tr>
                      </thead>

                      <tbody>
                        {filtered.map(m => (
                          <tr key={m.id}>
                            <td><div className="medicine-placeholder"><Pill size={25}/></div></td>
                            <td>
                              <b>{m.name}</b>
                              <small>{m.pack}</small>
                            </td>
                            <td>{m.generic}</td>
                            <td>₹{m.mrp}</td>
                            <td><b>₹{m.price}</b></td>
                            <td>
                              <span className={`stock ${m.stock <= 10 ? "low" : ""}`}>
                                {m.stock}
                              </span>
                            </td>
                            <td>
                              <span className={`status ${m.stock <= 10 ? "warning" : ""}`}>
                                {m.stock <= 10 ? "Low Stock" : m.status}
                              </span>
                            </td>
                            <td>
                              <div className="actions">
                                <button className="view" title="View" onClick={() => alert(JSON.stringify(m, null, 2))}><Eye size={16}/></button>
                                <button className="edit" title="Edit" onClick={() => openEdit(m)}><Pencil size={16}/></button>
                                <button className="delete" title="Delete" onClick={() => deleteMedicine(m.id)}><Trash2 size={16}/></button>
                              </div>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {filtered.length === 0 && (
                      <div className="no-data">No medicines found.</div>
                    )}
                  </div>

                  <div className="table-footer">
                    Showing {filtered.length} medicines
                  </div>
                </div>
              )}
            </>
          ) : (
            <div className="empty-panel">
              <Package size={45}/>
              <h2>{page}</h2>
              <p>This section will be developed in the next steps.</p>
            </div>
          )}

        </main>
      </div>

      {modal && (
        <div className="modal-overlay">
          <div className="medicine-modal">

            <div className="modal-header">
              <h3><Pill size={22}/> {editing ? "Edit Medicine" : "Add New Medicine"}</h3>
              <button onClick={() => setModal(false)}><X/></button>
            </div>

            <form onSubmit={saveMedicine}>
              <div className="form-grid">

                <div className="form-field">
                  <label>Medicine Name *</label>
                  <input required value={form.name}
                    onChange={e => setForm({...form, name:e.target.value})}
                    placeholder="Enter medicine name"/>
                </div>

                <div className="form-field">
                  <label>Generic Name</label>
                  <input value={form.generic}
                    onChange={e => setForm({...form, generic:e.target.value})}
                    placeholder="Generic name"/>
                </div>

                <div className="form-field">
                  <label>Category *</label>
                  <select required value={form.category}
                    onChange={e => setForm({...form, category:e.target.value})}>
                    <option>Baby & Mom Care</option>
                    <option>Skin Care</option>
                    <option>Hair Care</option>
                    <option>Pain Relief</option>
                    <option>Respiratory Care</option>
                    <option>Vitamins & Supplements</option>
                    <option>Healthcare Devices</option>
                  </select>
                </div>

                <div className="form-field">
                  <label>Manufacturer</label>
                  <input value={form.company}
                    onChange={e => setForm({...form, company:e.target.value})}
                    placeholder="Company name"/>
                </div>

                <div className="form-field">
                  <label>MRP (₹) *</label>
                  <input required type="number" min="0" value={form.mrp}
                    onChange={e => setForm({...form, mrp:e.target.value})}/>
                </div>

                <div className="form-field">
                  <label>Selling Price (₹) *</label>
                  <input required type="number" min="0" value={form.price}
                    onChange={e => setForm({...form, price:e.target.value})}/>
                </div>

                <div className="form-field">
                  <label>Pack Size</label>
                  <input value={form.pack}
                    onChange={e => setForm({...form, pack:e.target.value})}
                    placeholder="e.g. 200 ml"/>
                </div>

                <div className="form-field">
                  <label>Stock Quantity *</label>
                  <input required type="number" min="0" value={form.stock}
                    onChange={e => setForm({...form, stock:e.target.value})}/>
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="cancel-button" onClick={() => setModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="add-button">
                  <Save size={18}/> {editing ? "Update Medicine" : "Save Medicine"}
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
}
