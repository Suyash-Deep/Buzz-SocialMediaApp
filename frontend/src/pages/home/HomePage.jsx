import { useState } from "react";

import Posts from "../../components/common/Posts";
import CreatePost from "./CreatePost";

const HomePage = () => {
	const [feedType, setFeedType] = useState("forYou");

	return (
		<>
			<div className='content-column max-w-[680px]'>
				{/* Header */}
				<div className='sticky top-0 z-20 border-b border-white/10 bg-[#0b1120]/85 px-4 pt-4 backdrop-blur-xl'>
					<div className='mb-3'>
						<p className='text-xs font-bold uppercase tracking-[0.22em] text-sky-400'>Your world</p>
						<h1 className='text-2xl font-black tracking-tight'>Home feed</h1>
					</div>
					<div className='flex w-full'>
					<div
						className={
							`relative flex flex-1 cursor-pointer justify-center rounded-t-xl p-3 text-sm font-semibold transition hover:bg-white/[0.04] ${feedType === "forYou" ? "text-white" : "text-slate-500"}`
						}
						onClick={() => setFeedType("forYou")}
					>
						For you
						{feedType === "forYou" && (
							<div className='absolute bottom-0 h-1 w-12 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400'></div>
						)}
					</div>
					<div
					className={`relative flex flex-1 cursor-pointer justify-center rounded-t-xl p-3 text-sm font-semibold transition hover:bg-white/[0.04] ${feedType === "following" ? "text-white" : "text-slate-500"}`}
						onClick={() => setFeedType("following")}
					>
						Following
						{feedType === "following" && (
							<div className='absolute bottom-0 h-1 w-12 rounded-full bg-gradient-to-r from-sky-400 to-indigo-400'></div>
						)}
					</div>
					</div>
				</div>

				{/*  CREATE POST INPUT */}
				<CreatePost />

				{/* POSTS */}
				<Posts feedType={feedType} />
			</div>
		</>
	);
};
export default HomePage;
