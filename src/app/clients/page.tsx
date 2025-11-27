"use client";

import { useState, useEffect } from "react";

interface Pet {
  id: string;
  namaHewan: string;
  spesies: string;
}

interface Client {
  id: string;
  nama: string;
  alamat?: string | null;
  noTelp?: string | null;
  createdAt: string;
  pets: Pet[];
  _count: {
    examinations: number;
  };
}

export default function ClientsPage() {
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const emptyForm = {
    id: "",
    nama: "",
    alamat: "",
    noTelp: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/clients");

      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }

      const data = await res.json();
      setClients(data);
    } catch (error) {
      console.error("Error fetching clients:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch clients"
      );
    } finally {
      setLoading(false);
    }
  };

  // CREATE or UPDATE
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing && formData.id) {
        // UPDATE
        const res = await fetch(`/api/clients/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to update client");
        }

        const updated = await res.json();
        setClients((prev) =>
          prev.map((c) => (c.id === updated.id ? updated : c))
        );
        alert("Client updated successfully!");
      } else {
        // CREATE
        const res = await fetch("/api/clients", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to create client");
        }

        const created = await res.json();
        setClients((prev) => [created, ...prev]);
        alert("Client created successfully!");
      }

      resetForm();
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  };

  // DELETE
  const handleDelete = async (id: string, name: string) => {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/clients/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete client");
      }

      setClients((prev) => prev.filter((c) => c.id !== id));
      alert("Client deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Delete failed");
    }
  };

  // Edit mode
  function startEdit(client: Client) {
    setFormData({
      id: client.id,
      nama: client.nama,
      alamat: client.alamat || "",
      noTelp: client.noTelp || "",
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setFormData(emptyForm);
    setIsEditing(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading clients...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={fetchClients}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">👤 Clients Management</h1>

      {/* CREATE/UPDATE FORM */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">
          {isEditing ? "Edit Client" : "Add New Client"}
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Nama *
            </label>
            <input
              type="text"
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              value={formData.nama}
              onChange={(e) =>
                setFormData({ ...formData, nama: e.target.value })
              }
              placeholder="John Doe"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              Alamat
            </label>
            <textarea
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              value={formData.alamat}
              onChange={(e) =>
                setFormData({ ...formData, alamat: e.target.value })
              }
              placeholder="Jl. Merdeka No.  123, Jakarta"
              rows={3}
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">
              No. Telepon
            </label>
            <input
              type="tel"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
              value={formData.noTelp}
              onChange={(e) =>
                setFormData({ ...formData, noTelp: e.target.value })
              }
              placeholder="08123456789"
            />
          </div>

          <div className="flex gap-2">
            <button
              type="submit"
              disabled={submitting}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : isEditing
                ? "Update Client"
                : "Add Client"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border border-gray-300 rounded-lg hover:bg-gray-100 transition"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* CLIENT LIST */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">
          All Clients ({clients.length})
        </h2>

        {clients.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No clients yet.</p>
            <p className="text-gray-400 mt-2">Add your first client above!</p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {clients.map((client) => (
              <div
                key={client.id}
                className="border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {client.nama}
                  </h3>
                  <span className="text-2xl">👤</span>
                </div>

                {client.alamat && (
                  <p className="text-gray-600 mb-1 text-sm">
                    📍 {client.alamat}
                  </p>
                )}

                {client.noTelp && (
                  <p className="text-gray-600 mb-1">📱 {client.noTelp}</p>
                )}

                <div className="mt-3 pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    🐾 {client.pets.length} pet(s)
                  </p>
                  <p className="text-sm text-gray-600">
                    📋 {client._count.examinations} examination(s)
                  </p>
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => startEdit(client)}
                    className="flex-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200 transition text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(client.id, client.nama)}
                    className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200 transition text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Added:{" "}
                  {new Date(client.createdAt).toLocaleDateString("id-ID", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
