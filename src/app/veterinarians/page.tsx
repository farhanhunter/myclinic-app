"use client";

import { useState, useEffect } from "react";

interface Veterinarian {
  id: string;
  nama: string;
  nomorLisensi?: string | null;
  spesialisasi?: string | null;
  noTelp?: string | null;
  email?: string | null;
  createdAt: string;
  _count: {
    examinations: number;
  };
}

export default function VeterinariansPage() {
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    nama: "",
    nomorLisensi: "",
    spesialisasi: "",
    noTelp: "",
    email: "",
  });

  useEffect(() => {
    fetchVets();
  }, []);

  const fetchVets = async () => {
    try {
      setLoading(true);
      setError(null);

      const res = await fetch("/api/veterinarians");
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);

      const data = await res.json();
      setVets(data);
    } catch (error) {
      console.error("Error fetching veterinarians:", error);
      setError(
        error instanceof Error ? error.message : "Failed to fetch veterinarians"
      );
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const res = await fetch("/api/veterinarians", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to create veterinarian");
      }

      setFormData({
        nama: "",
        nomorLisensi: "",
        spesialisasi: "",
        noTelp: "",
        email: "",
      });
      fetchVets();
    } catch (error) {
      console.error("Error creating veterinarian:", error);
      alert(
        error instanceof Error ? error.message : "Failed to create veterinarian"
      );
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading veterinarians...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={fetchVets}
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
      <h1 className="text-4xl font-bold mb-8">👨‍⚕️ Veterinarians</h1>

      {/* Form Add Veterinarian */}
      <div className="bg-white shadow-md rounded-lg p-6 mb-8">
        <h2 className="text-2xl font-semibold mb-4">Add New Veterinarian</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                placeholder="Dr. Budi Santoso"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Nomor Lisensi
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={formData.nomorLisensi}
                onChange={(e) =>
                  setFormData({ ...formData, nomorLisensi: e.target.value })
                }
                placeholder="DRH-12345"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Spesialisasi
              </label>
              <input
                type="text"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={formData.spesialisasi}
                onChange={(e) =>
                  setFormData({ ...formData, spesialisasi: e.target.value })
                }
                placeholder="Hewan Kecil"
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
                placeholder="081234567890"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1 text-gray-700">
                Email
              </label>
              <input
                type="email"
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                value={formData.email}
                onChange={(e) =>
                  setFormData({ ...formData, email: e.target.value })
                }
                placeholder="dr.budi@example.com"
              />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium"
          >
            Add Veterinarian
          </button>
        </form>
      </div>

      {/* Veterinarian List */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">
          All Veterinarians ({vets.length})
        </h2>

        {vets.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No veterinarians yet.</p>
            <p className="text-gray-400 mt-2">
              Add your first veterinarian above!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {vets.map((vet) => (
              <div
                key={vet.id}
                className="border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition bg-white"
              >
                <div className="flex items-start justify-between mb-3">
                  <h3 className="text-xl font-semibold text-gray-900">
                    {vet.nama}
                  </h3>
                  <span className="text-2xl">👨‍⚕️</span>
                </div>

                <div className="space-y-1 mb-3">
                  {vet.nomorLisensi && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Lisensi:</span>{" "}
                      {vet.nomorLisensi}
                    </p>
                  )}
                  {vet.spesialisasi && (
                    <p className="text-sm text-gray-600">
                      <span className="font-medium">Spesialisasi:</span>{" "}
                      {vet.spesialisasi}
                    </p>
                  )}
                  {vet.noTelp && (
                    <p className="text-sm text-gray-600">📱 {vet.noTelp}</p>
                  )}
                  {vet.email && (
                    <p className="text-sm text-gray-600">📧 {vet.email}</p>
                  )}
                </div>

                <div className="pt-3 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    📋 {vet._count.examinations} examination(s)
                  </p>
                </div>

                <p className="text-xs text-gray-400 mt-3">
                  Registered:{" "}
                  {new Date(vet.createdAt).toLocaleDateString("id-ID", {
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
