import { useState, useEffect } from "react";
import {
	MapContainer,
	TileLayer,
	Marker,
	Popup,
	Polyline,
	useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { FaUser } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

// Função para movimentar o mapa conforme a localização atual
function MoveMapToCurrentLocation({ currentLocation }) {
	const map = useMap();

	useEffect(() => {
		if (currentLocation) {
			map.setView([currentLocation.lat, currentLocation.lng], 14);
		}
	}, [currentLocation, map]);

	return null;
}

function Dashboard() {
	const [products, setProducts] = useState([]);
	const [newProduct, setNewProduct] = useState({
		clientName: "",
		productName: "",
		productCode: "",
		address: "",
	});
	const [currentLocation, setCurrentLocation] = useState(null);
	const [route, setRoute] = useState([]); // Para armazenar a rota otimizada
	const navigate = useNavigate();

	useEffect(() => {
		if (navigator.geolocation) {
			navigator.geolocation.getCurrentPosition((position) => {
				const { latitude, longitude } = position.coords;
				setCurrentLocation({ lat: latitude, lng: longitude });
			});
		}
	}, []);

	const handleProductChange = (field, value) => {
		setNewProduct({ ...newProduct, [field]: value });
	};

	const addProduct = () => {
		if (
			newProduct.clientName &&
			newProduct.productName &&
			newProduct.productCode &&
			newProduct.address
		) {
			setProducts([...products, newProduct]);
			setNewProduct({
				clientName: "",
				productName: "",
				productCode: "",
				address: "",
			});
		} else {
			alert(
				"Por favor, preencha todos os campos antes de adicionar o produto.",
			);
		}
	};

	const removeProduct = (index) => {
		setProducts(products.filter((_, i) => i !== index));
	};

	const findRoute = async () => {
		const coords = await Promise.all(
			products.map(async (product) => {
				const response = await fetch(
					`https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
						product.address,
					)}&format=json`,
				);
				const data = await response.json();
				return data[0]?.lat && data[0]?.lon
					? {
							lat: Number.parseFloat(data[0].lat),
							lng: Number.parseFloat(data[0].lon),
						}
					: null;
			}),
		);

		const validCoords = coords.filter((coord) => coord);

		if (validCoords.length > 1) {
			setRoute(validCoords);
		} else {
			alert(
				"É necessário pelo menos dois endereços válidos para gerar uma rota.",
			);
		}
	};

	const handleLogout = () => {
		localStorage.removeItem("token");
		navigate("/login");
	};

	// Ícone personalizado
	const customIcon = L.icon({
		iconUrl: "https://cdn-icons-png.flaticon.com/512/25/25694.png", // Substitua pela URL do ícone desejado
		iconSize: [30, 30],
	});

	return (
		<div className="flex flex-col h-screen bg-gray-100">
			{/* Header */}
			<header className="flex justify-between items-center p-4 bg-gray-900 text-white">
				<p className="text-2xl tracking-widest">
					<span>Route</span>
					<span className="uppercase">X</span>press
				</p>
				<button
					type="button"
					onClick={() => navigate("/driverStats")}
					className="flex items-center"
				>
					<FaUser className="mr-2" /> Perfil do Motorista
				</button>
			</header>

			<div className="flex-grow flex">
				{/* Sidebar */}
				<div className="w-1/3 p-4 bg-white border-r border-gray-200">
					<h2 className="text-xl font-bold mb-4">Gerenciamento de Produtos</h2>
					<div className="mb-2">
						<input
							type="text"
							value={newProduct.clientName}
							onChange={(e) =>
								handleProductChange("clientName", e.target.value)
							}
							placeholder="Nome do Cliente"
							className="w-full p-2 mb-2 border border-gray-300 rounded-md"
						/>
						<input
							type="text"
							value={newProduct.productName}
							onChange={(e) =>
								handleProductChange("productName", e.target.value)
							}
							placeholder="Produto"
							className="w-full p-2 mb-2 border border-gray-300 rounded-md"
						/>
						<input
							type="text"
							value={newProduct.productCode}
							onChange={(e) =>
								handleProductChange("productCode", e.target.value)
							}
							placeholder="Código do Produto"
							className="w-full p-2 mb-2 border border-gray-300 rounded-md"
						/>
						<input
							type="text"
							value={newProduct.address}
							onChange={(e) => handleProductChange("address", e.target.value)}
							placeholder="Endereço"
							className="w-full p-2 mb-2 border border-gray-300 rounded-md"
						/>
						<button
							type="button"
							onClick={addProduct}
							className="w-full p-2 bg-blue-600 text-white rounded-md"
						>
							Adicionar Produto
						</button>
					</div>

					<h2 className="text-xl font-bold mt-4 mb-2">Produtos Adicionados</h2>
					<ul>
						{products.map((product, index) => (
							<li
								key={index}
								className="p-2 mb-2 border border-gray-300 rounded-md flex justify-between items-center"
							>
								<div>
									<strong>Cliente:</strong> {product.clientName} <br />
									<strong>Produto:</strong> {product.productName} <br />
									<strong>Endereço:</strong> {product.address}
								</div>
								<button
									type="button"
									onClick={() => removeProduct(index)}
									className="p-2 bg-red-600 text-white rounded-md"
								>
									Remover
								</button>
							</li>
						))}
					</ul>
					<button
						type="button"
						onClick={findRoute}
						className="mt-2 w-full p-2 bg-green-600 text-white rounded-md"
					>
						Gerar Melhor Rota
					</button>
				</div>

				{/* Mapa */}
				<div className="w-2/3 p-4">
					<div style={{ height: "85vh", width: "100%" }}>
						<MapContainer
							center={currentLocation || [-23.5011, -47.5231]}
							zoom={14}
							style={{ width: "100%", height: "100%" }}
						>
							<TileLayer
								url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
								attribution="&copy; OpenStreetMap contributors"
							/>
							{currentLocation && (
								<Marker position={currentLocation} icon={customIcon}>
									<Popup>Você está aqui</Popup>
								</Marker>
							)}
							{route.map((point, index) => (
								<Marker key={index} position={point} icon={customIcon}>
									<Popup>Ponto {index + 1}</Popup>
								</Marker>
							))}
							{route.length > 1 && <Polyline positions={route} color="blue" />}
							<MoveMapToCurrentLocation currentLocation={currentLocation} />
						</MapContainer>
					</div>
				</div>
			</div>
		</div>
	);
}

export default Dashboard;
