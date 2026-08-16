import { Link } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";

import LoadingSpinner from "../../components/common/LoadingSpinner";

import { IoSettingsOutline } from "react-icons/io5";
import { FaUser } from "react-icons/fa";
import { FaHeart } from "react-icons/fa6";

const NotificationPage = () => {
	const queryClient = useQueryClient();
	const { data: notifications, isLoading } = useQuery({
		queryKey: ["notifications"],
		queryFn: async () => {
			try {
				const res = await fetch("/api/notifications");
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
	});

	const { mutate: deleteNotifications } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch("/api/notifications", {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) throw new Error(data.error || "Something went wrong");
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Notifications deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["notifications"] });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	return (
		<>
			<div className='content-column max-w-[680px]'>
				<div className='sticky top-0 z-20 flex items-center justify-between border-b border-white/10 bg-[#0b1120]/85 p-5 backdrop-blur-xl'>
					<div><p className='text-xs font-bold uppercase tracking-[0.2em] text-sky-400'>Activity</p><h1 className='mt-1 text-2xl font-black tracking-tight'>Notifications</h1></div>
					<div className='dropdown '>
						<div tabIndex={0} role='button' className='m-1'>
							<IoSettingsOutline className='h-5 w-5 text-slate-400 transition hover:text-white' />
						</div>
						<ul
							tabIndex={0}
							className='dropdown-content z-[1] menu w-56 rounded-2xl border border-white/10 bg-[#111827] p-2 shadow-2xl'
						>
							<li>
								<a onClick={deleteNotifications}>Delete all notifications</a>
							</li>
						</ul>
					</div>
				</div>
				{isLoading && (
					<div className='flex justify-center h-full items-center'>
						<LoadingSpinner size='lg' />
					</div>
				)}
				{notifications?.length === 0 && <div className='m-5 rounded-3xl border border-dashed border-white/10 p-12 text-center'><p className='text-4xl'>✨</p><p className='mt-3 font-bold'>You are all caught up</p><p className='mt-1 text-sm text-slate-500'>New activity will show up here.</p></div>}
				{notifications?.map((notification) => (
					<div className='mx-4 mt-3 rounded-2xl border border-white/10 bg-white/[0.025] transition hover:bg-white/[0.05]' key={notification._id}>
						<div className='flex gap-3 p-4'>
							{notification.type === "follow" && <FaUser className='w-7 h-7 text-primary' />}
							{notification.type === "like" && <FaHeart className='w-7 h-7 text-red-500' />}
							<Link to={`/profile/${notification.from.username}`}>
								<div className='avatar'>
									<div className='w-8 rounded-full'>
										<img src={notification.from.profileImg || "/avatar-placeholder.png"} />
									</div>
								</div>
								<div className='flex gap-1'>
									<span className='font-bold'>@{notification.from.username}</span>{" "}
									{notification.type === "follow" ? "followed you" : "liked your post"}
								</div>
							</Link>
						</div>
					</div>
				))}
			</div>
		</>
	);
};
export default NotificationPage;
