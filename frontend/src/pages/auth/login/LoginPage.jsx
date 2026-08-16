import { useState } from "react";
import { Link } from "react-router-dom";

import XSvg from "../../../components/svgs/X";

import { MdOutlineMail } from "react-icons/md";
import { MdPassword } from "react-icons/md";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import toast  from "react-hot-toast";


const LoginPage = () => {
	const [formData, setFormData] = useState({
		username: "",
		password: "",
	});
	const queryClient = useQueryClient();

	const {mutate: loginMutation, isError, isPending, error} = useMutation({
		mutationFn: async({username,password}) => {
			try {
				const res = await fetch("/api/auth/login", {
					method:"POST",
					headers: {
						"Content-Type":"application/json",
					},
					body: JSON.stringify({username,password}),
				});
				const data = await res.json();
				if(!res.ok) throw new Error(data.error || "Failed to create account");
				// console.log(data);
				return data;
			} catch (error) {
				// console.log(error);
				throw error;
			}
		},
		onSuccess: () => {	
			toast.success("Login successful");

			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
	});

	const handleSubmit = (e) => {
		e.preventDefault();
		// console.log(formData);
		loginMutation(formData);
	};

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	return (
		<div className='relative mx-auto flex min-h-screen max-w-7xl overflow-hidden px-5 py-8 lg:px-10'>
			<div className='pointer-events-none absolute left-[-10rem] top-[-12rem] h-96 w-96 rounded-full bg-sky-500/20 blur-[100px]' />
			<div className='pointer-events-none absolute bottom-[-12rem] right-[-8rem] h-96 w-96 rounded-full bg-indigo-500/20 blur-[100px]' />
			<div className='relative hidden flex-1 items-center justify-center lg:flex'>
				<div className='max-w-lg'>
					<div className='mb-8 grid h-24 w-24 place-items-center rounded-[2rem] bg-gradient-to-br from-sky-400 to-indigo-500 shadow-2xl shadow-sky-950/50' style={{ animation: "float 5s ease-in-out infinite" }}>
						<XSvg className='h-16 w-16 fill-white' />
					</div>
					<h2 className='text-5xl font-black leading-tight tracking-tight'>Ideas move faster<br/><span className='bg-gradient-to-r from-sky-300 to-indigo-400 bg-clip-text text-transparent'>when we share.</span></h2>
					<p className='mt-5 max-w-md text-lg leading-8 text-slate-400'>Join conversations, follow people you care about, and share what is buzzing.</p>
				</div>
			</div>

			<div className='relative flex flex-1 items-center justify-center'>
				<div className='glass-card w-full max-w-xl rounded-[2rem] p-6 sm:p-9 lg:p-10'>
				<form className='flex flex-col gap-4' onSubmit={handleSubmit}>
					<div className='mb-2 flex items-center gap-3 lg:hidden'><span className='grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500'><XSvg className='h-7 w-7 fill-white' /></span><span className='text-xl font-black'>Buzz.</span></div>
					<p className='text-xs font-bold uppercase tracking-[0.22em] text-sky-400'>Welcome back</p>
					<h1 className='mb-2 text-4xl font-black tracking-tight text-white'>{"Let's"} go.</h1>
					<label className='field-shell'>
						<MdOutlineMail />
						<input
							type='text'
							className='grow'
							placeholder='username'
							name='username'
							onChange={handleInputChange}
							value={formData.username}
						/>
					</label>

					<label className='field-shell'>
						<MdPassword />
						<input
							type='password'
							className='grow'
							placeholder='Password'
							name='password'
							onChange={handleInputChange}
							value={formData.password}
						/>
					</label>
					<button className='primary-button mt-2 h-12'>
						{isPending ? "Loading..." : "Login"}
					</button>
					{isError && <p className='rounded-xl border border-rose-500/20 bg-rose-500/10 p-3 text-sm text-rose-300'>{error.message}</p>}
				</form>
				<div className='mt-7 border-t border-white/10 pt-6 text-center'>
					<p className='mb-3 text-sm text-slate-400'>{"Don't"} have an account?</p>
					<Link to='/signup'>
						<button className='secondary-button h-12 w-full'>Create an account</button>
					</Link>
				</div>
				</div>
			</div>
		</div>
	);
};
export default LoginPage;
