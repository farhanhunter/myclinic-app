"use client";

import { useState, useEffect } from "react";

// Types (same as before)
interface Client {
  id: string;
  nama: string;
  noTelp?: string | null;
}

interface Pet {
  id: string;
  namaHewan: string;
  spesies: string;
}

interface Veterinarian {
  id: string;
  nama: string;
  spesialisasi?: string | null;
}

interface Examination {
  id: string;
  tanggalPemeriksaan: string;
  suhu?: number | null;
  heartRate?: number | null;
  penampilan?: string | null;
  mata?: string | null;
  telinga?: string | null;
  hidung?: string | null;
  mulut?: string | null;
  kulitRambut?: string | null;
  limfonodus?: string | null;
  mukosa?: string | null;
  abdomen?: string | null;
  thoraks?: string | null;
  gastro?: string | null;
  respiratory?: string | null;
  tulangDanOtot?: string | null;
  ekstremitas?: string | null;
  urogenital?: string | null;
  diagnosis?: string | null;
  treatment?: string | null;
  prescription?: string | null;
  notes?: string | null;
  client: Client;
  pet: Pet;
  veterinarian: Veterinarian;
}

export default function ExaminationsPage() {
  const [examinations, setExaminations] = useState<Examination[]>([]);
  const [clients, setClients] = useState<Client[]>([]);
  const [pets, setPets] = useState<Pet[]>([]);
  const [vets, setVets] = useState<Veterinarian[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  // Form state
  const emptyForm = {
    id: "",
    clientId: "",
    petId: "",
    veterinarianId: "",
    tanggalPemeriksaan: new Date().toISOString().split("T")[0],
    suhu: "",
    heartRate: "",
    penampilan: "",
    mata: "",
    telinga: "",
    hidung: "",
    mulut: "",
    kulitRambut: "",
    limfonodus: "",
    mukosa: "",
    abdomen: "",
    thoraks: "",
    gastro: "",
    respiratory: "",
    tulangDanOtot: "",
    ekstremitas: "",
    urogenital: "",
    diagnosis: "",
    treatment: "",
    prescription: "",
    notes: "",
  };

  const [formData, setFormData] = useState(emptyForm);
  const [isEditing, setIsEditing] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    fetchAll();
  }, []);

  const fetchAll = async () => {
    setLoading(true);
    try {
      const [examsRes, clientsRes, petsRes, vetsRes] = await Promise.all([
        fetch("/api/examinations"),
        fetch("/api/clients"),
        fetch("/api/pets"),
        fetch("/api/veterinarians"),
      ]);

      if (!examsRes.ok) throw new Error("Failed to fetch examinations");

      const examsData = await examsRes.json();
      const clientsData = clientsRes.ok ? await clientsRes.json() : [];
      const petsData = petsRes.ok ? await petsRes.json() : [];
      const vetsData = vetsRes.ok ? await vetsRes.json() : [];

      setExaminations(examsData);
      setClients(clientsData);
      setPets(petsData);
      setVets(vetsData);
      setError(null);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "Failed to load data");
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
        const res = await fetch(`/api/examinations/${formData.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to update examination");
        }

        const updated = await res.json();
        setExaminations((prev) =>
          prev.map((e) => (e.id === updated.id ? updated : e))
        );
        alert("Examination updated successfully!");
      } else {
        // CREATE
        const res = await fetch("/api/examinations", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (!res.ok) {
          const errorData = await res.json();
          throw new Error(errorData.error || "Failed to create examination");
        }

        const created = await res.json();
        setExaminations((prev) => [created, ...prev]);
        alert("Examination created successfully!");
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
  const handleDelete = async (id: string) => {
    if (!confirm("Are you sure you want to delete this examination?")) return;

    try {
      const res = await fetch(`/api/examinations/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || "Failed to delete examination");
      }

      setExaminations((prev) => prev.filter((e) => e.id !== id));
      alert("Examination deleted successfully!");
    } catch (error) {
      console.error("Error:", error);
      alert(error instanceof Error ? error.message : "Delete failed");
    }
  };

  // Edit mode
  function startEdit(exam: Examination) {
    setFormData({
      id: exam.id,
      clientId: exam.client.id,
      petId: exam.pet.id,
      veterinarianId: exam.veterinarian.id,
      tanggalPemeriksaan: new Date(exam.tanggalPemeriksaan)
        .toISOString()
        .split("T")[0],
      suhu: exam.suhu ? String(exam.suhu) : "",
      heartRate: exam.heartRate ? String(exam.heartRate) : "",
      penampilan: exam.penampilan || "",
      mata: exam.mata || "",
      telinga: exam.telinga || "",
      hidung: exam.hidung || "",
      mulut: exam.mulut || "",
      kulitRambut: exam.kulitRambut || "",
      limfonodus: exam.limfonodus || "",
      mukosa: exam.mukosa || "",
      abdomen: exam.abdomen || "",
      thoraks: exam.thoraks || "",
      gastro: exam.gastro || "",
      respiratory: exam.respiratory || "",
      tulangDanOtot: exam.tulangDanOtot || "",
      ekstremitas: exam.ekstremitas || "",
      urogenital: exam.urogenital || "",
      diagnosis: exam.diagnosis || "",
      treatment: exam.treatment || "",
      prescription: exam.prescription || "",
      notes: exam.notes || "",
    });
    setIsEditing(true);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }

  function resetForm() {
    setFormData(emptyForm);
    setIsEditing(false);
    setShowForm(false);
  }

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-xl">Loading examinations...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="text-xl text-red-600 mb-4">Error: {error}</div>
          <button
            onClick={fetchAll}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-8 max-w-7xl">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">📋 Medical Examinations</h1>
        <button
          onClick={() => {
            if (showForm && isEditing) {
              resetForm();
            } else {
              setShowForm(!showForm);
            }
          }}
          className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition font-medium"
        >
          {showForm
            ? isEditing
              ? "Cancel Edit"
              : "Hide Form"
            : "➕ New Examination"}
        </button>
      </div>

      {/* FORM (CREATE/UPDATE) */}
      {showForm && (
        <div className="bg-white shadow-md rounded-lg p-6 mb-8">
          <h2 className="text-2xl font-semibold mb-4">
            {isEditing ? "Edit Examination" : "New Examination"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Basic Info - Same as before but with value bindings */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Basic Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Client *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.clientId}
                    onChange={(e) =>
                      setFormData({ ...formData, clientId: e.target.value })
                    }
                  >
                    <option value="">Select Client</option>
                    {clients.map((client) => (
                      <option key={client.id} value={client.id}>
                        {client.nama}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Pet *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.petId}
                    onChange={(e) =>
                      setFormData({ ...formData, petId: e.target.value })
                    }
                  >
                    <option value="">Select Pet</option>
                    {pets.map((pet) => (
                      <option key={pet.id} value={pet.id}>
                        {pet.namaHewan} ({pet.spesies})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Veterinarian *
                  </label>
                  <select
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.veterinarianId}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        veterinarianId: e.target.value,
                      })
                    }
                  >
                    <option value="">Select Veterinarian</option>
                    {vets.map((vet) => (
                      <option key={vet.id} value={vet.id}>
                        {vet.nama} {vet.spesialisasi && `(${vet.spesialisasi})`}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Date *
                  </label>
                  <input
                    type="date"
                    required
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.tanggalPemeriksaan}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tanggalPemeriksaan: e.target.value,
                      })
                    }
                  />
                </div>
              </div>
            </div>

            {/* Vital Signs - Same structure */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Vital Signs
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Temperature (°C)
                  </label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.suhu}
                    onChange={(e) =>
                      setFormData({ ...formData, suhu: e.target.value })
                    }
                    placeholder="38.5"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-1 text-gray-700">
                    Heart Rate (bpm)
                  </label>
                  <input
                    type="number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                    value={formData.heartRate}
                    onChange={(e) =>
                      setFormData({ ...formData, heartRate: e.target.value })
                    }
                    placeholder="90"
                  />
                </div>
              </div>
            </div>

            {/* Physical Examination - Same structure but shortened for space */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Physical Examination
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "penampilan", label: "Appearance" },
                  { key: "mata", label: "Eyes" },
                  { key: "telinga", label: "Ears" },
                  { key: "hidung", label: "Nose" },
                  { key: "mulut", label: "Mouth" },
                  { key: "kulitRambut", label: "Skin & Hair" },
                  { key: "limfonodus", label: "Lymph Nodes" },
                  { key: "mukosa", label: "Mucosa" },
                  { key: "abdomen", label: "Abdomen" },
                  { key: "thoraks", label: "Thorax" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder="Normal"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* System Examination */}
            <div className="border-b pb-4">
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                System Examination
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { key: "gastro", label: "Gastrointestinal" },
                  { key: "respiratory", label: "Respiratory" },
                  { key: "tulangDanOtot", label: "Musculoskeletal" },
                  { key: "ekstremitas", label: "Extremities" },
                  { key: "urogenital", label: "Urogenital" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      {field.label}
                    </label>
                    <input
                      type="text"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                      placeholder="Normal"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Diagnosis & Treatment */}
            <div>
              <h3 className="text-lg font-semibold mb-3 text-gray-700">
                Diagnosis & Treatment
              </h3>
              <div className="space-y-4">
                {[
                  { key: "diagnosis", label: "Diagnosis" },
                  { key: "treatment", label: "Treatment" },
                  { key: "prescription", label: "Prescription" },
                  { key: "notes", label: "Notes" },
                ].map((field) => (
                  <div key={field.key}>
                    <label className="block text-sm font-medium mb-1 text-gray-700">
                      {field.label}
                    </label>
                    <textarea
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-gray-900"
                      value={formData[field.key as keyof typeof formData]}
                      onChange={(e) =>
                        setFormData({
                          ...formData,
                          [field.key]: e.target.value,
                        })
                      }
                      rows={3}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-4">
              <button
                type="submit"
                disabled={submitting}
                className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition font-medium disabled:opacity-50"
              >
                {submitting
                  ? "Saving..."
                  : isEditing
                  ? "Update Examination"
                  : "Save Examination"}
              </button>
              <button
                type="button"
                onClick={resetForm}
                className="px-6 bg-gray-300 text-gray-700 py-2 rounded-lg hover:bg-gray-400 transition font-medium"
              >
                Cancel
              </button>
            </div>
          </form>
        </div>
      )}

      {/* EXAMINATION LIST */}
      <div className="space-y-4">
        <h2 className="text-2xl font-semibold mb-4">
          All Examinations ({examinations.length})
        </h2>

        {examinations.length === 0 ? (
          <div className="text-center py-12 bg-gray-50 rounded-lg">
            <p className="text-gray-500 text-lg">No examinations yet.</p>
            <p className="text-gray-400 mt-2">
              Add your first examination above!
            </p>
          </div>
        ) : (
          <div className="grid gap-4">
            {examinations.map((exam) => (
              <div
                key={exam.id}
                className="border border-gray-200 rounded-lg shadow-sm p-6 hover:shadow-md transition bg-white"
              >
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-semibold text-gray-900">
                      {exam.pet.namaHewan} ({exam.pet.spesies})
                    </h3>
                    <p className="text-sm text-gray-600">
                      Owner: {exam.client.nama}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-700">
                      {new Date(exam.tanggalPemeriksaan).toLocaleDateString(
                        "id-ID",
                        {
                          year: "numeric",
                          month: "long",
                          day: "numeric",
                        }
                      )}
                    </p>
                    <p className="text-sm text-gray-600">
                      Dr. {exam.veterinarian.nama}
                    </p>
                  </div>
                </div>

                {/* Vital Signs Display */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                  {exam.suhu && (
                    <div className="bg-blue-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Temperature</p>
                      <p className="text-lg font-semibold text-blue-600">
                        {exam.suhu}°C
                      </p>
                    </div>
                  )}
                  {exam.heartRate && (
                    <div className="bg-red-50 p-3 rounded">
                      <p className="text-xs text-gray-600">Heart Rate</p>
                      <p className="text-lg font-semibold text-red-600">
                        {exam.heartRate} bpm
                      </p>
                    </div>
                  )}
                </div>

                {/* Diagnosis/Treatment Display */}
                {exam.diagnosis && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Diagnosis:
                    </p>
                    <p className="text-sm text-gray-600">{exam.diagnosis}</p>
                  </div>
                )}

                {exam.treatment && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Treatment:
                    </p>
                    <p className="text-sm text-gray-600">{exam.treatment}</p>
                  </div>
                )}

                {exam.prescription && (
                  <div className="mb-3">
                    <p className="text-sm font-medium text-gray-700">
                      Prescription:
                    </p>
                    <p className="text-sm text-gray-600">{exam.prescription}</p>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-gray-200">
                  <button
                    onClick={() => startEdit(exam)}
                    className="flex-1 bg-yellow-100 text-yellow-700 px-3 py-2 rounded hover:bg-yellow-200 transition text-sm font-medium"
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(exam.id)}
                    className="flex-1 bg-red-100 text-red-700 px-3 py-2 rounded hover:bg-red-200 transition text-sm font-medium"
                  >
                    Delete
                  </button>
                </div>

                {exam.notes && (
                  <div className="mt-3 pt-3 border-t border-gray-200">
                    <p className="text-xs font-medium text-gray-700">Notes:</p>
                    <p className="text-xs text-gray-600">{exam.notes}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
