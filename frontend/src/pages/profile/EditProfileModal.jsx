import { useEffect, useState } from "react";
import useUpdateUserProfile from "../../hooks/useUpdateUserProfile";

const EditProfileModal = ({ authUser }) => {
	const [formData, setFormData] = useState({
		fullName: "",
		username: "",
		email: "",
		bio: "",
		link: "",
		newPassword: "",
		currentPassword: "",
	});

	const { updateProfile, isUpdatingProfile } = useUpdateUserProfile();

	const handleInputChange = (e) => {
		setFormData({ ...formData, [e.target.name]: e.target.value });
	};

	useEffect(() => {
		if (authUser) {
			setFormData({
				fullName: authUser.fullName,
				username: authUser.username,
				email: authUser.email,
				bio: authUser.bio,
				link: authUser.link,
				newPassword: "",
				currentPassword: "",
			});
		}
	}, [authUser]);

	return (
		<>
			<button
				className='secondary-button min-h-0 h-9 px-4 text-sm'
				onClick={() => document.getElementById("edit_profile_modal").showModal()}
			>
				Edit profile
			</button>
			<dialog id='edit_profile_modal' className='modal'>
				<div className='modal-box rounded-3xl border border-white/10 bg-[#0b1120] shadow-2xl'>
					<h3 className='font-bold text-lg my-3'>Update Profile</h3>
					<form
						className='flex flex-col gap-4'
						onSubmit={(e) => {
							e.preventDefault();
							updateProfile(formData);
						}}
					>
						<div className='flex flex-wrap gap-2'>
							<input
								type='text'
								placeholder='Full Name'
								className='min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-3 outline-none focus:border-sky-400/50'
								value={formData.fullName}
								name='fullName'
								onChange={handleInputChange}
							/>
							<input
								type='text'
								placeholder='Username'
								className='min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-3 outline-none focus:border-sky-400/50'
								value={formData.username}
								name='username'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='email'
								placeholder='Email'
								className='min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-3 outline-none focus:border-sky-400/50'
								value={formData.email}
								name='email'
								onChange={handleInputChange}
							/>
							<textarea
								placeholder='Bio'
								className='min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-3 outline-none focus:border-sky-400/50'
								value={formData.bio}
								name='bio'
								onChange={handleInputChange}
							/>
						</div>
						<div className='flex flex-wrap gap-2'>
							<input
								type='password'
								placeholder='Current Password'
								className='min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-3 outline-none focus:border-sky-400/50'
								value={formData.currentPassword}
								name='currentPassword'
								onChange={handleInputChange}
							/>
							<input
								type='password'
								placeholder='New Password'
								className='min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-3 outline-none focus:border-sky-400/50'
								value={formData.newPassword}
								name='newPassword'
								onChange={handleInputChange}
							/>
						</div>
						<input
							type='text'
							placeholder='Link'
							className='min-w-0 flex-1 rounded-xl border border-white/10 bg-white/[0.04] p-3 outline-none focus:border-sky-400/50'
							value={formData.link}
							name='link'
							onChange={handleInputChange}
						/>
						<button className='primary-button h-11'>
							{isUpdatingProfile ? "Updating..." : "Update"}
						</button>
					</form>
				</div>
				<form method='dialog' className='modal-backdrop'>
					<button className='outline-none'>close</button>
				</form>
			</dialog>
		</>
	);
};
export default EditProfileModal;
