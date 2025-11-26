"use client";

import { useEffect, useState } from "react";

interface Client {
  id: string;
  nama: string;
  noTelp?: string | null;
}

interface Pet {
  id: string;
  clientId: string;
  namaHewan: string;
  spesies: string;
  breed?: string | null;
  beratBadan?: number | null;
  umur?: number | null;
  umurSatuan?: string | null;
  gender: string;
  createdAt: string;
  client?: Client;
  _count?: {
    examinations: number;
  };
}

export default function PetsPage() {
  const [pets, setPets] = useState<Pet[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const emptyForm = {
    id: "",
    clientId: "",
    namaHewan: "",
    spesies: "",
    breed: "",
    beratBadan: "",
    umur: "",
    umurSatuan: "tahun",
    gender: "Jantan",
  };

  const [form, setForm] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Fetch data on mount
  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    setLoading(true);
    try {
      const [petsRes, clientsRes] = await Promise.all([
        fetch("/api/pets"),
        fetch("/api/clients"),
      ]);

      if (!petsRes.ok || !clientsRes.ok) {
        throw new Error("Failed to fetch data");
      }

      const petsData = await petsRes.json();
      const clientsData = await clientsRes.json();

      setPets(petsData);
      setClients(clientsData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load data");
    } finally {
      setLoading(false);
    }
  }

  // CREATE or UPDATE
  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);

    try {
      if (isEditing && form.id) {
        // UPDATE
        const res = await fetch(`/api/pets/${form.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Failed to update pet");

        const updated = await res.json();
        setPets((prev) => prev.map((p) => (p.id === updated.id ? updated : p)));
        alert("Pet updated successfully!");
      } else {
        // CREATE
        const res = await fetch("/api/pets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(form),
        });

        if (!res.ok) throw new Error("Failed to create pet");

        const created = await res.json();
        setPets((prev) => [created, ...prev]);
        alert("Pet created successfully!");
      }

      resetForm();
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Operation failed");
    } finally {
      setSubmitting(false);
    }
  }

  // DELETE
  async function handleDelete(id: string, name: string) {
    if (!confirm(`Are you sure you want to delete ${name}?`)) return;

    try {
      const res = await fetch(`/api/pets/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) throw new Error("Failed to delete pet");

      setPets((prev) => prev.filter((p) => p.id !== id));
      alert("Pet deleted successfully!");
    } catch (err) {
      console.error(err);
      alert(err instanceof Error ? err.message : "Delete failed");
    }
  }

  // Edit mode
  function startEdit(pet: Pet) {
    setForm({
      id: pet.id,
      clientId: pet.clientId,
      namaHewan: pet.namaHewan,
      spesies: pet.spesies,
      breed: pet.breed || "",
      beratBadan: pet.beratBadan ? String(pet.beratBadan) : "",
      umur: pet.umur ? String(pet.umur) : "",
      umurSatuan: pet.umurSatuan || "tahun",
      gender: pet.gender,
    });
    setIsEditing(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setForm(emptyForm);
    setIsEditing(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading...</div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-3xl font-bold mb-6">🐾 Pets Management</h1>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}

      {/* CREATE/UPDATE FORM */}
      <div className="bg-white p-6 rounded-lg shadow mb-8">
        <h2 className="text-xl font-semibold mb-4">
          {isEditing ? "Edit Pet" : "Add New Pet"}
        </h2>

        <form onSubmit={handleSubmit} className="grid md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">
              Owner (Client) *
            </label>
            <select
              required
              value={form.clientId}
              onChange={(e) => setForm({ ...form, clientId: e.target.value })}
              className="w-full border rounded px-3 py-2 text-gray-900"
            >
              <option value="">Select owner</option>
              {clients.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.nama} {c.noTelp ? `(${c.noTelp})` : ""}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Pet Name *</label>
            <input
              required
              value={form.namaHewan}
              onChange={(e) => setForm({ ...form, namaHewan: e.target.value })}
              className="w-full border rounded px-3 py-2 text-gray-900"
              placeholder="Bobby"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Species *</label>
            <select
              required
              value={form.spesies}
              onChange={(e) => setForm({ ...form, spesies: e.target.value })}
              className="w-full border rounded px-3 py-2 text-gray-900"
            >
              <option value="">Select species</option>
              <option value="Anjing">Anjing</option>
              <option value="Kucing">Kucing</option>
              <option value="Kelinci">Kelinci</option>
              <option value="Burung">Burung</option>
              <option value="Lainnya">Lainnya</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Breed</label>
            <input
              value={form.breed}
              onChange={(e) => setForm({ ...form, breed: e.target.value })}
              className="w-full border rounded px-3 py-2 text-gray-900"
              placeholder="Golden Retriever"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">
              Weight (kg)
            </label>
            <input
              type="number"
              step="0.1"
              value={form.beratBadan}
              onChange={(e) => setForm({ ...form, beratBadan: e.target.value })}
              className="w-full border rounded px-3 py-2 text-gray-900"
              placeholder="25.5"
            />
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Age</label>
            <div className="flex gap-2">
              <input
                type="number"
                value={form.umur}
                onChange={(e) => setForm({ ...form, umur: e.target.value })}
                className="w-full border rounded px-3 py-2 text-gray-900"
                placeholder="3"
              />
              <select
                value={form.umurSatuan}
                onChange={(e) =>
                  setForm({ ...form, umurSatuan: e.target.value })
                }
                className="border rounded px-3 py-2 text-gray-900"
              >
                <option value="tahun">Years</option>
                <option value="bulan">Months</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium mb-1">Gender *</label>
            <select
              required
              value={form.gender}
              onChange={(e) => setForm({ ...form, gender: e.target.value })}
              className="w-full border rounded px-3 py-2 text-gray-900"
            >
              <option value="Jantan">Male</option>
              <option value="Betina">Female</option>
            </select>
          </div>

          <div className="md:col-span-2 flex gap-2 mt-4">
            <button
              type="submit"
              disabled={submitting}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
            >
              {submitting
                ? "Saving..."
                : isEditing
                ? "Update Pet"
                : "Create Pet"}
            </button>

            {isEditing && (
              <button
                type="button"
                onClick={resetForm}
                className="px-6 py-2 border rounded hover:bg-gray-100"
              >
                Cancel
              </button>
            )}
          </div>
        </form>
      </div>

      {/* PETS LIST */}
      <div>
        <h2 className="text-xl font-semibold mb-4">All Pets ({pets.length})</h2>

        {pets.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500">
              No pets yet. Add your first pet above!
            </p>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {pets.map((pet) => (
              <div
                key={pet.id}
                className="border rounded-lg p-4 bg-white shadow hover:shadow-md transition"
              >
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {pet.namaHewan}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {pet.spesies} {pet.breed ? `• ${pet.breed}` : ""}
                    </p>
                  </div>
                  <span className="text-2xl">
                    {pet.spesies === "Anjing"
                      ? "🐕"
                      : pet.spesies === "Kucing"
                      ? "🐱"
                      : "🐾"}
                  </span>
                </div>

                <div className="space-y-1 text-sm text-gray-600 mb-3">
                  <p>👤 Owner: {pet.client?.nama || "—"}</p>
                  <p>⚧ Gender: {pet.gender}</p>
                  {pet.umur && (
                    <p>
                      📅 Age: {pet.umur} {pet.umurSatuan}
                    </p>
                  )}
                  {pet.beratBadan && <p>⚖️ Weight: {pet.beratBadan} kg</p>}
                </div>

                <div className="flex gap-2 mt-4">
                  <button
                    onClick={() => startEdit(pet)}
                    className="flex-1 bg-yellow-100 text-yellow-700 px-3 py-1 rounded hover:bg-yellow-200"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(pet.id, pet.namaHewan)}
                    className="flex-1 bg-red-100 text-red-700 px-3 py-1 rounded hover:bg-red-200"
                  >
                    Delete
                  </button>
                </div>

                {pet._count && (
                  <p className="text-xs text-gray-400 mt-2">
                    📋 {pet._count.examinations} examination(s)
                  </p>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
