import { CiImageOn } from "react-icons/ci";
import { useRef, useState } from "react";
import { IoCloseSharp } from "react-icons/io5";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "react-hot-toast";


const CreatePost = () => {
	const [text, setText] = useState("");
	const [img, setImg] = useState(null);
	const imgRef = useRef(null);

	const {data:authUser} = useQuery({queryKey: ["authUser"]});
	const queryClient = useQueryClient();

	const {mutate:createPost,isError,isPending,error} = useMutation({
	mutationFn: async ({ text, img }) => {
			try {
				const res = await fetch("/api/posts/create", {
					method: "POST",
					headers: {
						"Content-Type": "application/json",
					},
					body: JSON.stringify({ text, img }),
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
			setText("");
			setImg(null);
			toast.success("Post created successfully");
			queryClient.invalidateQueries({ queryKey: ["posts"] });
		},
	});


	const handleSubmit = (e) => {
		e.preventDefault();
		createPost({ text, img });
	};

	const handleImgChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const reader = new FileReader();
			reader.onload = () => {
				setImg(reader.result);
			};
			reader.readAsDataURL(file);
		}
	};

	return (
		<div className='m-4 flex items-start gap-3 rounded-3xl border border-white/10 bg-white/[0.035] p-4 shadow-xl shadow-black/10'>
			<div className='avatar'>
				<div className='w-10 rounded-full ring-2 ring-sky-400/30'>
					<img src={authUser.profileImg || "/avatar-placeholder.png"} />
				</div>
			</div>
			<form className='flex w-full flex-col gap-3' onSubmit={handleSubmit}>
				<textarea
					className='min-h-20 w-full resize-none border-none bg-transparent p-1 text-lg text-white outline-none placeholder:text-slate-500'
					placeholder="What's buzzing?"
					value={text}
					onChange={(e) => setText(e.target.value)}
				/>
				{img && (
					<div className='relative w-full'>
						<IoCloseSharp
							className='absolute top-0 right-0 text-white bg-gray-800 rounded-full w-5 h-5 cursor-pointer'
							onClick={() => {
								setImg(null);
								imgRef.current.value = null;
							}}
						/>
						<img src={img} className='mx-auto max-h-96 w-full rounded-2xl object-contain' />
					</div>
				)}

				<div className='flex justify-between border-t border-white/10 pt-3'>
					<div className='flex gap-1 items-center'>
						<CiImageOn
							className='h-6 w-6 cursor-pointer fill-sky-400 transition hover:scale-110 hover:fill-sky-300'
							onClick={() => imgRef.current.click()}
						/>
						{/* <BsEmojiSmileFill className='fill-primary w-5 h-5 cursor-pointer' /> */}
					</div>
					<input type='file' accept="image/*" hidden ref={imgRef} onChange={handleImgChange} />
					<button disabled={isPending || (!text.trim() && !img)} className='primary-button min-h-0 h-9 px-5 text-sm'>
						{isPending ? "Posting..." : "Post"}
					</button>
				</div>
				{isError && <div className='text-red-500'>{error.message}</div>}
			</form>
		</div>
	);
};
export default CreatePost;
