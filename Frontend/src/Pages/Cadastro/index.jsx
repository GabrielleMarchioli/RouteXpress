import axios from "axios";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const Cadastro = () => {
	const [name, setName] = useState();
	const [email, setEmail] = useState();
	const [password, setPassword] = useState();
	const navigate = useNavigate();

	const handleSubmit = (event) => {
		event.preventDefault();

		axios
			.post("http://localhost:3001/register", { name, email, password })
			.then((result) => {
				console.log(result);
				if (result.data === "Already registered") {
					alert("E-mail already registered! Please Login to proceed.");
					navigate("/login");
				} else {
					alert("Registered successfully! Please Login to proceed.");
					navigate("/login");
				}
			})
			.catch((err) => console.log(err));
	};

	return (
		<div className="flex min-h-screen bg-gray-900">
			<div className="w-full lg:w-1/2 flex flex-col justify-center px-8 py-12">
				<div className="w-full max-w-md mx-auto">
					<h2 className="text-4xl font-bold text-white mb-4">
						Cadastre-se e otimize suas entregas!
					</h2>
					<p className="mb-6 text-gray-400">
						Preencha as informações abaixo para criar sua conta e gerenciar suas
						entregas com eficiência.
					</p>

					<form onSubmit={handleSubmit}>
						<div className="mb-4">
							<label className="block text-sm mb-2 text-white" htmlFor="name">
								Nome
							</label>
							<input
								className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 focus:outline-none shadow-xl"
								type="text"
								placeholder="Nome"
								id="exampleInputname"
								onChange={(event) => setName(event.target.value)}
								required
							/>
						</div>

						<div className="mb-4">
							<label className="block text-sm mb-2 text-white" htmlFor="email">
								Email
							</label>
							<input
								className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 focus:outline-none shadow-xl"
								type="email"
								placeholder="Email"
								id="exampleInputEmail1"
								onChange={(event) => setEmail(event.target.value)}
								required
							/>
						</div>

						<div className="mb-4">
							<label
								className="block text-sm mb-2 text-white"
								htmlFor="exampleInputPassword1"
							>
								Senha
							</label>
							<input
								className="w-full px-4 py-2 rounded-lg bg-gray-800 text-gray-200 focus:outline-none shadow-xl"
								type="password"
								placeholder="Senha"
								id="exampleInputPassword1"
								onChange={(event) => setPassword(event.target.value)}
								required
							/>
						</div>

						<button
							type="submit"
							className="w-full bg-gray-200 text-black py-2 mt-5 rounded-lg font-bold shadow-xl"
						>
							Cadastrar
						</button>

						<p className="mt-4 text-sm text-center text-gray-400">
						Já tem uma conta?
						<Link to="/login" className="ml-1 text-gray-200">
							Faça login
						</Link>
						</p>

					</form>
				</div>
			</div>

			<div className="hidden lg:flex lg:w-1/2 flex-col items-center justify-center bg-gray-800 rounded-l-3xl">
				<img
					src="/logoUPX.png"
					alt="Logo RouteXpress"
					className="max-w-md mb-6"
				/>

			<p className="text-2xl text-white tracking-widest">
			<span className="">Route</span>
			<span className="uppercase">X</span>press
			</p>

			</div>
		</div>
	);
};

export default Cadastro;
