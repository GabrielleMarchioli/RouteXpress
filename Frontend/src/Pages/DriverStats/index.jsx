import React from "react";
import { FiSettings, FiMap, FiTruck } from "react-icons/fi";

function Dashboard() {
  return (
    <div className="flex bg-gray-100 h-screen">
      {/* Sidebar */}
      <div className="w-16 h-screen bg-gray-900 text-white flex flex-col items-center py-4">
        <div className="mb-8">
          <FiTruck size={24} />
        </div>
        <div className="flex flex-col gap-6">
          <FiMap size={24} />
          <FiSettings size={24} />
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-6 grid grid-cols-2 gap-6">
        {/* Vehicle Info */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h2 className="text-xl font-semibold mb-4">Volkswagen Transporter</h2>
          <img
            src="public/van.jpg"
            alt="Van"
            className="w-64 h-auto mb-4 rounded-lg"
          />
          <ul className="text-sm text-gray-700">
            <li>
              <strong>Carga útil:</strong> 1.308 kg
            </li>
            <li>
              <strong>Volume de carga:</strong> 6,56 m³
            </li>
            <li>
              <strong>Comprimento da carga:</strong> 297 cm
            </li>
            <li>
              <strong>Altura:</strong> 170 cm
            </li>
          </ul>
          <button className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
            Documentos
          </button>
        </div>

        {/* Driver Stats */}
        <div className="p-6 bg-white shadow-md rounded-lg">
          <h3 className="text-lg font-semibold mb-4">Estatísticas do Motorista</h3>
          <div>
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Em trânsito</span>
              <span>36%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-lg h-2">
              <div
                className="bg-blue-500 rounded-lg h-2"
                style={{ width: "36%" }}
              ></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Descansando</span>
              <span>22%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-lg h-2">
              <div
                className="bg-orange-500 rounded-lg h-2"
                style={{ width: "22%" }}
              ></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Carregando</span>
              <span>15%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-lg h-2">
              <div
                className="bg-green-500 rounded-lg h-2"
                style={{ width: "15%" }}
              ></div>
            </div>
          </div>
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-700 mb-2">
              <span>Esperando</span>
              <span>27%</span>
            </div>
            <div className="w-full bg-gray-300 rounded-lg h-2">
              <div
                className="bg-purple-500 rounded-lg h-2"
                style={{ width: "27%" }}
              ></div>
            </div>
          </div>
        </div>

        {/* Routes */}
        <div className="p-6 bg-white shadow-md rounded-lg col-span-2">
          <h3 className="text-lg font-semibold mb-4">Rotas</h3>
          <div className="mb-4">
            <p>
              <strong>A caminho:</strong> José do Patrocínio - 2 pacotes
            </p>
            <p>Distância total: 8,6 km</p>
          </div>
          <div className="h-40 bg-gray-200 rounded-lg flex items-center justify-center">
            <span>Mapa Aqui</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
