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
  const [formData, setFormData] = useState({
    nama: "",
    alamat: "",
    noTelp: "",
  });

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

      const contentType = res.headers.get("content-type");
      if (!contentType || !contentType.includes("application/json")) {
        throw new Error("Response is not JSON");
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/clients", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create client");
      }

      setFormData({ nama: "", alamat: "", noTelp: "" });
      fetchClients();
    } catch (error) {
      console.error("Error creating client:", error);
      alert(error instanceof Error ? error.message : "Failed to create client");
    }
  };

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
      <h1 className="text-4xl font-bold mb-8">Pet Clinic - Clients</h1>

      {/* Form Add Client */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Client</h2>
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
              placeholder="Jl. Merdeka No. 123, Jakarta"
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
          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Add Client
          </button>
        </form>
      </div>

      {/* Client List */}
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
                <h3 className="text-xl font-semibold mb-2 text-gray-900">
                  {client.nama}
                </h3>

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

                <p className="text-sm text-gray-400 mt-3">
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
