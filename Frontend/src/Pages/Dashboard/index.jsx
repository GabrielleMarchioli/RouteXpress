// src/Dashboard.js
import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, Polyline, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';
import { FaUser } from 'react-icons/fa'; // Importando o ícone de usuário
import { useNavigate } from 'react-router-dom'; // Importando useNavigate

function MoveMapToCurrentLocation({ currentLocation }) {
  const map = useMap();

  useEffect(() => {
    if (currentLocation) {
      map.setView([currentLocation.lat, currentLocation.lng], 14); // Ajuste o zoom conforme necessário
    }
  }, [currentLocation, map]);

  return null;
}

function Dashboard() {
  const [addresses, setAddresses] = useState(['']);
  const [markers, setMarkers] = useState([]);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [suggestions, setSuggestions] = useState([]);
  const [activeSuggestion, setActiveSuggestion] = useState(0);
  const [user, setUser] = useState({ name: 'Perfil do motorista', authorized: true }); // Simulando o usuário logado
  const [logoutMenuVisible, setLogoutMenuVisible] = useState(false);
  const navigate = useNavigate(); // Para navegação

  useEffect(() => {
    // Obtém a localização atual do usuário
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setCurrentLocation({ lat: latitude, lng: longitude });
      });
    }
  }, []);

  const handleAddressChange = (index, value) => {
    const newAddresses = [...addresses];
    newAddresses[index] = value;
    setAddresses(newAddresses);
    setActiveSuggestion(0); // Reseta a sugestão ativa
    fetchSuggestions(value); // Chama a função para buscar sugestões de endereço
  };

  const addNewAddressField = () => {
    setAddresses([...addresses, '']);
    setActiveSuggestion(0); // Reseta a sugestão ativa ao adicionar um novo campo
  };

  const fetchSuggestions = async (input) => {
    if (input.length > 2) { // Começa a buscar sugestões após 3 caracteres
      const viewbox = '-47.5231,-23.5011,-47.4690,-23.4840'; // Defina a área geográfica (box) de Sorocaba
      const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(input)}&format=json&addressdetails=1&limit=5&viewbox=${viewbox}&bounded=1`);
      const data = await response.json();

      // Se a localização atual estiver disponível, calcule as distâncias
      if (currentLocation) {
        const { lat, lng } = currentLocation;

        // Calcule a distância de cada sugestão em relação à localização atual
        const suggestionsWithDistance = data.map(item => {
          const suggestionLat = parseFloat(item.lat);
          const suggestionLng = parseFloat(item.lon);
          const distance = calculateDistance(lat, lng, suggestionLat, suggestionLng);
          return { ...item, distance };
        });

        // Ordena sugestões por distância
        suggestionsWithDistance.sort((a, b) => a.distance - b.distance);

        // Extrai apenas os nomes das sugestões ordenadas
        const formattedSuggestions = suggestionsWithDistance.map(item => item.display_name);
        setSuggestions(formattedSuggestions);
      } else {
        // Caso a localização atual não esteja disponível
        const formattedSuggestions = data.map(item => item.display_name);
        setSuggestions(formattedSuggestions);
      }
    } else {
      setSuggestions([]);
    }
  };

  // Função para calcular a distância entre dois pontos (em km)
  const calculateDistance = (lat1, lon1, lat2, lon2) => {
    const R = 6371; // Raio da Terra em km
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distância em km
  };

  const findRoute = async () => {
    // Lógica para encontrar as coordenadas dos endereços
    const coords = await Promise.all(
      addresses.map(async (address) => {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(address)}&format=json&addressdetails=1`);
        const data = await response.json();
        return data[0]?.lat && data[0]?.lon ? { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) } : null; // Supondo que a resposta contenha as coordenadas
      })
    );

    // Filtra coordenadas válidas
    const validCoords = coords.filter(coord => coord);
    setMarkers(validCoords);
  };

  const handleLogout = () => {
    // Lógica de logout (neste exemplo, apenas simula o logout)
    setUser(null); // Limpa o usuário (simulando logout)
    navigate('/login'); // Redireciona para a tela de login
  };

  return (
    <div className="flex flex-col h-screen bg-gray-100">
      {/* Header */}
      <header className="flex justify-between items-center p-4 bg-gray-900 text-white z-10 relative">
        <p className="text-2xl text-white tracking-widest"><span className="">Route</span><span className="uppercase">X</span>press</p>
        <div className="relative">
          <button className="flex items-center" onClick={() => setLogoutMenuVisible(!logoutMenuVisible)}>
            <FaUser className="mr-2" /> {user?.name}
          </button>
          {logoutMenuVisible && (
            <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded-md shadow-lg z-20">
              <button onClick={handleLogout} className="block w-full text-left p-2 hover:bg-gray-200">Logout</button>
            </div>
          )}
        </div>
      </header>

      {/* Sidebar com as caixas de endereço */}
      <div className="flex-grow flex">
        <div className="w-1/3 p-4 bg-white border-r border-gray-200">
          <h2 className="text-xl font-bold mb-4">Endereços de Entrega</h2>
          {addresses.map((address, index) => (
            <div key={index} className="relative mb-2">
              <input
                type="text"
                value={address}
                onChange={(e) => handleAddressChange(index, e.target.value)}
                placeholder={`Endereço ${index + 1}`}
                className="w-full p-2 border border-gray-300 rounded-md"
              />
              {suggestions.length > 0 && (
                <ul className="absolute z-10 w-full bg-white border border-gray-300 rounded-md">
                  {suggestions.map((suggestion, i) => (
                    <li key={i} className={`p-2 cursor-pointer hover:bg-gray-200 ${activeSuggestion === i ? 'bg-gray-300' : ''}`} onClick={() => {
                      const newAddresses = [...addresses];
                      newAddresses[index] = suggestion; // Preenche o campo com a sugestão
                      setAddresses(newAddresses);
                      setSuggestions([]); // Limpa sugestões após seleção
                    }} onMouseEnter={() => setActiveSuggestion(i)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>
          ))}
          <button
            onClick={addNewAddressField}
            className="mt-2 w-full p-2 bg-blue-600 text-white rounded-md"
          >
            Adicionar novo endereço
          </button>
          <button
            onClick={findRoute}
            className="mt-2 w-full p-2 bg-green-600 text-white rounded-md"
          >
            Encontrar Rota
          </button>
        </div>

        {/* Seção do mapa usando OpenStreetMap e Leaflet */}
        <div className="w-2/3 p-4 flex items-center justify-center"> {/* Centralizando o mapa */}
          <div className="relative" style={{ height: '85vh', width: '105vh' }}> {/* Altura e largura ajustadas para um mapa mais quadrado */}
            <MapContainer
              center={currentLocation || [-23.5011, -47.5231]} // Coordenadas de Sorocaba
              zoom={14} // Ajuste o zoom para a cidade
              style={{ width: '100%', height: '100%' }} // Ajustando o estilo
            >
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
              />
              {currentLocation && (
                <Marker position={currentLocation} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png' })}>
                  <Popup>Você está aqui</Popup>
                </Marker>
              )}
              {markers.map((marker, index) => (
                <Marker key={index} position={marker} icon={L.icon({ iconUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-icon.png', shadowUrl: 'https://unpkg.com/leaflet@1.7.1/dist/images/marker-shadow.png' })}>
                  <Popup>Endereço {index + 1}</Popup>
                </Marker>
              ))}
              <MoveMapToCurrentLocation currentLocation={currentLocation} />
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
