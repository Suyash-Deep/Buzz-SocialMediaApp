import { FaRegComment } from "react-icons/fa";
import { FaRegHeart } from "react-icons/fa";
import { FaTrash } from "react-icons/fa";
import { useState } from "react";
import { Link } from "react-router-dom";

import { formatPostDate } from "../../utils/index.js";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";


import LoadingSpinner from "./LoadingSpinner";


const Post = ({ post }) => {
	const [comment, setComment] = useState("");
	const { data: authUser } = useQuery({ queryKey: ["authUser"] });
	const queryClient = useQueryClient();

	const postOwner = post.user;

	const isLiked = post.likes.includes(authUser._id);

	const isMyPost = authUser._id === post.user._id;

	const formattedDate = formatPostDate(post.createdAt);
	
	const { mutate: deletePost, isPending: isDeleting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/${post._id}`, {
					method: "DELETE",
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Post deleted successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] }); 

		},
	});
	const { mutate: likePost, isPending: isLiking } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/like/${post._id}`, {
					method: "POST",
				});
				const data = await res.json();
				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: (updatedLikes) => {
			// toast.success("Post Liked successfully");

			// not a good solution because it will fetch all posts
			// queryClient.invalidateQueries({queryKey:["posts"]});

			
			queryClient.setQueryData(["posts"], (oldData) => {
				return oldData.map((p) => {
					if (p._id === post._id) {
						return { ...p, likes: updatedLikes };
					}
					return p;
				});
			});
			
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const { mutate: commentPost, isPending: isCommenting } = useMutation({
		mutationFn: async () => {
			try {
				const res = await fetch(`/api/posts/comment/${post._id}`, {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text: comment }),
				});
				const data = await res.json();

				if (!res.ok) {
					throw new Error(data.error || "Something went wrong");
				}
				return data;
			} catch (error) {
				throw new Error(error);
			}
		},
		onSuccess: () => {
			toast.success("Comment posted successfully");
			setComment("");
			
			queryClient.invalidateQueries({ queryKey: ["posts"] });

			// queryClient.setQueryData(["posts"], (oldData) => {
			// 	return oldData.map((p) => {
			// 		if (p._id === post._id) {
			// 			return { ...p, p: allComments };
			// 		}
			// 		return p;
			// 	});
			// });
		},
		onError: (error) => {
			toast.error(error.message);
		},
	});

	const handleDeletePost = () => {
		deletePost();
	};


	const handlePostComment = (e) => {
		e.preventDefault();
		if (isCommenting) return;
		commentPost();
	};

	const handleLikePost = () => {
		if (isLiking) return;
		
		likePost();
	};

	return (
		<>
			<article className='group mx-4 mb-4 flex items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.025] p-4 transition duration-300 hover:-translate-y-0.5 hover:border-sky-400/20 hover:bg-white/[0.045] hover:shadow-2xl hover:shadow-black/20'>
				<div className='avatar'>
					<Link to={`/profile/${postOwner.username}`} className='w-10 overflow-hidden rounded-full ring-2 ring-white/10 transition group-hover:ring-sky-400/30'>
						<img src={postOwner.profileImg || "/avatar-placeholder.png"} />
					</Link>
				</div>
				<div className='min-w-0 flex-1'>
					<div className='flex min-w-0 items-center gap-2'>
						<Link to={`/profile/${postOwner.username}`} className='truncate font-bold text-slate-100 transition hover:text-sky-300'>
							{postOwner.fullName}
						</Link>
						<span className='flex min-w-0 gap-1 truncate text-sm text-slate-500'>
							<Link to={`/profile/${postOwner.username}`}>@{postOwner.username}</Link>
							<span>·</span>
							<span>{formattedDate}</span>
						</span>
						{isMyPost && (
							<span className='flex justify-end flex-1'>
								{!isDeleting && (
									<FaTrash className='cursor-pointer text-slate-600 transition hover:text-rose-400' onClick={handleDeletePost} />
								)}

								{isDeleting && <LoadingSpinner size='sm' />}
							</span>
						)}
					</div>
					<div className='mt-1 flex flex-col gap-3 overflow-hidden'>
						<span className='whitespace-pre-wrap leading-6 text-slate-200'>{post.text}</span>
						{post.img && (
							<img
								src={post.img}
								className='max-h-[520px] w-full rounded-2xl border border-white/10 bg-black/20 object-contain'
								alt='Post attachment'
							/>
						)}
					</div>
					<div className='mt-4 flex justify-between'>
						<div className='flex w-2/3 items-center justify-between gap-4'>


						<div className='group/action flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition hover:bg-pink-500/10' onClick={handleLikePost}>
								{isLiking && <LoadingSpinner size='sm' />}
								{!isLiked && !isLiking && (
									<FaRegHeart className='h-4 w-4 cursor-pointer text-slate-500 group-hover/action:text-pink-400' />
								)}
								{isLiked && !isLiking && (
									<FaRegHeart className='w-4 h-4 cursor-pointer text-pink-500 ' />
								)}

								<span
									className={`text-sm text-slate-500 group-hover/action:text-pink-400 ${
										isLiked ? "text-pink-500" : ""
									}`}
								>
									{post.likes.length}
								</span>
							</div>
							<div
								className='group/action flex cursor-pointer items-center gap-2 rounded-full px-2 py-1 transition hover:bg-sky-400/10'
								onClick={() => document.getElementById("comments_modal" + post._id).showModal()}
							>
								<FaRegComment className='h-4 w-4 text-slate-500 group-hover/action:text-sky-400' />
								<span className='text-sm text-slate-500 group-hover/action:text-sky-400'>
									{post.comments.length}
								</span>
							</div>
							{/* We're using Modal Component from DaisyUI */}
							<dialog id={`comments_modal${post._id}`} className='modal border-none outline-none'>
								<div className='modal-box rounded-3xl border border-white/10 bg-[#0b1120] shadow-2xl'>
									<h3 className='font-bold text-lg mb-4'>Comments</h3>
									<div className='flex flex-col gap-3 max-h-60 overflow-auto'>
										{post.comments.length === 0 && (
											<p className='text-sm text-slate-500'>
												No comments yet, Be the first one
											</p>
										)}
										{post.comments.map((comment) => (
											<div key={comment._id} className='flex gap-2 items-start'>
												<div className='avatar'>
													<div className='w-8 rounded-full'>
														<img
															src={comment.user.profileImg || "/avatar-placeholder.png"}
														/>
													</div>
												</div>
												<div className='flex flex-col'>
													<div className='flex items-center gap-1'>
														<span className='font-bold'>{comment.user.fullName}</span>
													<span className='text-slate-500 text-sm'>
															@{comment.user.username}
														</span>
													</div>
													<div className='text-sm'>{comment.text}</div>
												</div>
											</div>
										))}
									</div>
									<form
										className='mt-4 flex items-center gap-2 border-t border-white/10 pt-3'
										onSubmit={handlePostComment}
									>
										<textarea
											className='min-h-12 w-full resize-none rounded-xl border border-white/10 bg-white/[0.04] p-3 outline-none focus:border-sky-400/50'
											placeholder='Add a comment...'
											value={comment}
											onChange={(e) => setComment(e.target.value)}
										/>
										<button className='primary-button h-10 px-4 text-sm'>
											{isCommenting ? (
												<span className='loading loading-spinner loading-md'></span>
											) : (
												"Comment"
											)}
										</button>
									</form>
								</div>
								<form method='dialog' className='modal-backdrop'>
									<button className='outline-none'>close</button>
								</form>
							</dialog>
						
	
						</div>
					</div>
				</div>
			</article>
		</>
	);
};
export default Post;