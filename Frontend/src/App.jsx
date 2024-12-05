import { BrowserRouter, Route, Routes } from "react-router-dom";
import Cadastro from "./Pages/Cadastro";
import Login from "./Pages/Login";
import Dashboard from "./Pages/Dashboard";
import DriverStats from './Pages/DriverStats';

function App() {
	return (
		<BrowserRouter>
			<Routes>
				<Route path="/" element={<Cadastro />} />
				<Route path="/Cadastro" element={<Cadastro />} />
				<Route path="/Login" element={<Login />} />
				<Route path="/Dashboard" element={<Dashboard />} />
				<Route path= "/DriverStats" element={<DriverStats />} />
			</Routes>
		</BrowserRouter>
	);
}

export default App;
