import XSvg from "../svgs/X";

import { MdHomeFilled } from "react-icons/md";
import { IoNotifications } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { Link, useLocation } from "react-router-dom";
import { BiLogOut } from "react-icons/bi";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import toast from "react-hot-toast";

const Sidebar = () => {
	const location = useLocation();


	const queryClient = useQueryClient();
	const { mutate: logout } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/auth/logout", {
					method: "POST",
				});
				const data = await res.json();
				// console.log(data);
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
			} catch (error) {
				throw new Error(error);
			}
			},
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ["authUser"] });
		},
		onError: () => {
			toast.error("Logout failed");
		},
	});
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });

	return (
	<div className='w-[72px] shrink-0 md:w-60'>
			<div className='sticky top-0 left-0 flex h-screen flex-col px-3 py-5 md:px-5'>
				<Link to='/' className='mb-7 flex items-center justify-center gap-3 md:justify-start'>
					<span className='grid h-11 w-11 place-items-center rounded-2xl bg-gradient-to-br from-sky-400 to-indigo-500 shadow-lg shadow-sky-950/40'>
						<XSvg className='h-7 w-7 fill-white' />
					</span>
					<span className='hidden text-xl font-black tracking-tight md:block'>Buzz<span className='text-sky-400'>.</span></span>
				</Link>
				<ul className='flex flex-col gap-2'>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/'
							className={`nav-pill w-full ${location.pathname === "/" ? "nav-pill-active" : ""}`}
						>
							<MdHomeFilled className='h-6 w-6 shrink-0' />
							<span className='hidden font-semibold md:block'>Home</span>
						</Link>
					</li>
					<li className='flex justify-center md:justify-start'>
						<Link
							to='/notifications'
							className={`nav-pill w-full ${location.pathname === "/notifications" ? "nav-pill-active" : ""}`}
						>
							<IoNotifications className='h-6 w-6 shrink-0' />
							<span className='hidden font-semibold md:block'>Notifications</span>
						</Link>
					</li>

					<li className='flex justify-center md:justify-start'>
						<Link
							to={`/profile/${authUser?.username}`}
							className={`nav-pill w-full ${location.pathname.startsWith("/profile") ? "nav-pill-active" : ""}`}
						>
							<FaUser className='h-5 w-5 shrink-0' />
							<span className='hidden font-semibold md:block'>Profile</span>
						</Link>
					</li>
				</ul>
				{authUser && (
					<Link
						to={`/profile/${authUser.username}`}
						className='mt-auto flex items-center gap-3 rounded-2xl border border-white/10 bg-white/[0.035] p-2 transition hover:bg-white/[0.07] md:p-3'
					>
						<div className='avatar hidden md:inline-flex'>
							<div className='w-9 rounded-full ring-2 ring-sky-400/30'>
								<img src={authUser?.profileImg || "/avatar-placeholder.png"} />
							</div>
						</div>
						<div className='flex justify-between flex-1'>
							<div className='hidden md:block'>
								<p className='w-24 truncate text-sm font-bold text-white'>{authUser?.fullName}</p>
								<p className='text-slate-500 text-sm'>@{authUser?.username}</p>
							</div>
							<BiLogOut
								className='h-5 w-5 cursor-pointer text-slate-400 transition hover:text-rose-400'
								onClick={(e) => {
									e.preventDefault();
									logout();
								}}
							/>
						</div>
					</Link>
				)}
			</div>
		</div>
	);
};
export default Sidebar;
