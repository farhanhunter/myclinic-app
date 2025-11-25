import Link from "next/link";

export default function Home() {
  const menuItems = [
    {
      title: "Clients",
      description: "Manage pet owners and their contact information",
      icon: "👤",
      href: "/clients",
      color: "bg-blue-500",
    },
    {
      title: "Pets",
      description: "Manage pets, breeds, and health information",
      icon: "🐾",
      href: "/pets",
      color: "bg-green-500",
    },
    {
      title: "Veterinarians",
      description: "Manage veterinarian staff and specializations",
      icon: "👨‍⚕️",
      href: "/veterinarians",
      color: "bg-purple-500",
    },
    {
      title: "Examinations",
      description: "Record and view medical examinations",
      icon: "📋",
      href: "/examinations",
      color: "bg-orange-500",
    },
  ];

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-16">
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-gray-900 mb-4">
            🏥 Pet Clinic Management System
          </h1>
          <p className="text-xl text-gray-600">
            Comprehensive pet healthcare management solution
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Built with Next.js 16, Prisma, PostgreSQL & Docker
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-4xl mx-auto">
          {menuItems.map((item) => (
            <Link key={item.href} href={item.href}>
              <div className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow cursor-pointer border-2 border-transparent hover:border-blue-500">
                <div className="flex items-start space-x-4">
                  <div
                    className={`${item.color} text-white text-4xl p-3 rounded-lg`}
                  >
                    {item.icon}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-gray-900 mb-2">
                      {item.title}
                    </h2>
                    <p className="text-gray-600">{item.description}</p>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-16 text-center">
          <div className="bg-white rounded-lg shadow-md p-6 max-w-2xl mx-auto">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Quick Access
            </h3>
            <div className="grid grid-cols-4 gap-4 mt-4">
              <Link href="/clients">
                <div className="p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                  <p className="text-3xl font-bold text-blue-600">👤</p>
                  <p className="text-sm text-gray-600 mt-2">Clients</p>
                </div>
              </Link>
              <Link href="/pets">
                <div className="p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                  <p className="text-3xl font-bold text-green-600">🐾</p>
                  <p className="text-sm text-gray-600 mt-2">Pets</p>
                </div>
              </Link>
              <Link href="/veterinarians">
                <div className="p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                  <p className="text-3xl font-bold text-purple-600">👨‍⚕️</p>
                  <p className="text-sm text-gray-600 mt-2">Vets</p>
                </div>
              </Link>
              <Link href="/examinations">
                <div className="p-4 hover:bg-gray-50 rounded-lg transition cursor-pointer">
                  <p className="text-3xl font-bold text-orange-600">📋</p>
                  <p className="text-sm text-gray-600 mt-2">Exams</p>
                </div>
              </Link>
            </div>
          </div>
        </div>

        <div className="mt-8 text-center text-sm text-gray-500">
          <p>
            Developed by{" "}
            <a
              href="https://github.com/farhanhunter"
              target="_blank"
              rel="noopener noreferrer"
              className="text-blue-600 hover:underline"
            >
              @farhanhunter
            </a>
          </p>
          <p className="mt-1">
            {new Date().toLocaleDateString("id-ID", {
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </p>
        </div>
      </div>
    </div>
  );
}
