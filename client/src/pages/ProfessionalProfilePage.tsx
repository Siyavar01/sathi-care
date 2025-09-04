import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useProfessionalStore from '../features/professional/professionalSlice.ts';
import type { IUser } from '../types/index.ts';

const ProfessionalProfilePage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const {
    profile,
    isLoading,
    isError,
    isSuccess,
    message,
    createOrUpdateProfile,
    getMyProfile,
    uploadProfilePicture,
    uploadCredential,
    reset,
  } = useProfessionalStore();

  const [formData, setFormData] = useState({
    title: 'Therapist',
    bio: '',
    specializations: '',
    experience: 0,
    languages: '',
    offersProBono: false,
    acceptsInstitutionalOutreach: false,
  });

  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(null);
  const [credentialFile, setCredentialFile] = useState<File | null>(null);
  const [credentialName, setCredentialName] = useState('');

  useEffect(() => {
    if (user?.token) {
      getMyProfile(user.token);
    }
  }, [user?.token, getMyProfile]);

  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }
    if (user.role !== 'professional') {
      toast.error('You must be a professional to access this page.');
      navigate('/');
      return;
    }

    if (isError) {
      toast.error(message);
    }

    if (isSuccess && message) {
      toast.success(message);
    }

    if (profile) {
      setFormData({
        title: profile.title || 'Therapist',
        bio: profile.bio || '',
        specializations: profile.specializations?.join(', ') || '',
        experience: profile.experience || 0,
        languages: profile.languages?.join(', ') || '',
        offersProBono: profile.offersProBono || false,
        acceptsInstitutionalOutreach: profile.acceptsInstitutionalOutreach || false,
      });
    }

    return () => {
      reset();
    };
  }, [user, navigate, isError, isSuccess, message, profile, reset]);

  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      if (e.target.name === 'profilePicture') {
        setProfilePictureFile(e.target.files[0]);
      } else if (e.target.name === 'credential') {
        setCredentialFile(e.target.files[0]);
      }
    }
  };

  const onChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
        const { checked } = e.target as HTMLInputElement;
        setFormData((prevState) => ({ ...prevState, [name]: checked }));
    } else {
        setFormData((prevState) => ({ ...prevState, [name]: value }));
    }
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user?.token) {
      const profileData = {
        ...formData,
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean),
        languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        sessionTypes: profile?.sessionTypes || [],
        availability: profile?.availability || [],
      };

      await createOrUpdateProfile(profileData, user.token);

      if (profilePictureFile) {
        await uploadProfilePicture(profilePictureFile, user.token);
      }

      if (credentialFile && credentialName) {
        const credentialData = { file: credentialFile, name: credentialName };
        await uploadCredential(credentialData, user.token);
        setCredentialFile(null);
        setCredentialName('');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 bg-[length:200%_200%] animate-gradient-pan">
      <div className="mx-auto max-w-4xl py-12 px-4 sm:px-6 lg:px-8">
        <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
            <div className="flex items-center space-x-4">
              {profile?.profilePictureUrl ? (
                  <img src={profile.profilePictureUrl} alt="Profile" className="h-20 w-20 rounded-full object-cover" />
              ) : (
                  <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-400" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                      </svg>
                  </div>
              )}
              <div>
                   <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal">
                      Manage Your Profile
                  </h1>
                  <p className="mt-1 text-gray-600">
                      Keep your information up-to-date.
                  </p>
              </div>
            </div>
            <div className="mt-4 sm:mt-0">
                {profile?.isVerified ? (
                    <span className="inline-flex items-center rounded-full bg-green-100 px-4 py-2 text-sm font-medium text-green-800">
                        Verified
                    </span>
                ) : (
                    <span className="inline-flex items-center rounded-full bg-yellow-100 px-4 py-2 text-sm font-medium text-yellow-800">
                        Pending Verification
                    </span>
                )}
            </div>
          </div>


          <form onSubmit={onSubmit} className="mt-8 space-y-10">
            <fieldset className="space-y-4">
              <legend className="text-xl font-semibold text-brand-charcoal">Basic Information</legend>
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
                <select id="title" name="title" value={formData.title} onChange={onChange} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pastel-purple focus:ring-pastel-purple sm:text-sm">
                  <option>Therapist</option>
                  <option>Psychiatrist</option>
                </select>
              </div>
              <div>
                <label htmlFor="bio" className="block text-sm font-medium text-gray-700">Bio</label>
                <textarea id="bio" name="bio" rows={4} value={formData.bio} onChange={onChange} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pastel-purple focus:ring-pastel-purple sm:text-sm" placeholder="Tell us about yourself, your approach, and your expertise."></textarea>
              </div>
            </fieldset>

            <fieldset className="space-y-4">
              <legend className="text-xl font-semibold text-brand-charcoal">Expertise</legend>
               <div>
                <label htmlFor="specializations" className="block text-sm font-medium text-gray-700">Specializations (comma separated)</label>
                <input type="text" id="specializations" name="specializations" value={formData.specializations} onChange={onChange} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pastel-purple focus:ring-pastel-purple sm:text-sm" placeholder="e.g., Anxiety, CBT, Trauma" />
              </div>
               <div>
                <label htmlFor="experience" className="block text-sm font-medium text-gray-700">Years of Experience</label>
                <input type="number" id="experience" name="experience" value={formData.experience} onChange={onChange} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pastel-purple focus:ring-pastel-purple sm:text-sm" placeholder="e.g., 10" />
              </div>
               <div>
                <label htmlFor="languages" className="block text-sm font-medium text-gray-700">Languages Spoken (comma separated)</label>
                <input type="text" id="languages" name="languages" value={formData.languages} onChange={onChange} required className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pastel-purple focus:ring-pastel-purple sm:text-sm" placeholder="e.g., English, Hindi" />
              </div>
            </fieldset>

            <fieldset className="space-y-4">
                <legend className="text-xl font-semibold text-brand-charcoal">Services & Outreach</legend>
                 <div className="flex items-start">
                    <div className="flex h-5 items-center">
                        <input id="offersProBono" name="offersProBono" type="checkbox" checked={formData.offersProBono} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-pastel-purple focus:ring-pastel-purple" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="offersProBono" className="font-medium text-gray-700">Offer Pro Bono Services</label>
                        <p className="text-gray-500">Enable this if you offer any pro bono sessions.</p>
                    </div>
                </div>
                 <div className="flex items-start">
                    <div className="flex h-5 items-center">
                        <input id="acceptsInstitutionalOutreach" name="acceptsInstitutionalOutreach" type="checkbox" checked={formData.acceptsInstitutionalOutreach} onChange={onChange} className="h-4 w-4 rounded border-gray-300 text-pastel-purple focus:ring-pastel-purple" />
                    </div>
                    <div className="ml-3 text-sm">
                        <label htmlFor="acceptsInstitutionalOutreach" className="font-medium text-gray-700">Accept Institutional Outreach</label>
                        <p className="text-gray-500">Allow schools and organizations to contact you.</p>
                    </div>
                </div>
            </fieldset>

            <fieldset className="space-y-4">
                 <legend className="text-xl font-semibold text-brand-charcoal">Verification Documents</legend>
                <div>
                    <label htmlFor="profile-picture-upload" className="block text-sm font-medium text-gray-700">Profile Picture</label>
                    <input id="profile-picture-upload" name="profilePicture" type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-brand-charcoal file:mr-4 file:rounded-full file:border-0 file:bg-pastel-purple/50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-pastel-purple hover:file:bg-pastel-purple/70" />
                </div>
                <div>
                    <h3 className="text-sm font-medium text-gray-700">Uploaded Credentials</h3>
                    {profile?.credentials && profile.credentials.length > 0 ? (
                        <ul className="mt-2 list-disc list-inside space-y-1">
                            {profile.credentials.map((cred, index) => (
                                <li key={index}><a href={cred.url} target="_blank" rel="noopener noreferrer" className="text-pastel-purple hover:underline">{cred.name}</a></li>
                            ))}
                        </ul>
                    ) : (
                        <p className="mt-2 text-sm text-gray-500">No credentials uploaded yet.</p>
                    )}
                </div>
                <div className="flex items-end space-x-4">
                    <div className="flex-grow">
                        <label htmlFor="credential-name" className="block text-sm font-medium text-gray-700">New Credential Name</label>
                        <input type="text" id="credential-name" value={credentialName} onChange={(e) => setCredentialName(e.target.value)} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pastel-purple focus:ring-pastel-purple sm:text-sm" placeholder="e.g., Medical License" />
                    </div>
                    <div className="flex-grow">
                        <label htmlFor="credential-upload" className="block text-sm font-medium text-gray-700">Upload File</label>
                        <input id="credential-upload" name="credential" type="file" onChange={handleFileChange} className="mt-1 block w-full text-sm text-brand-charcoal file:mr-4 file:rounded-full file:border-0 file:bg-pastel-purple/50 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-pastel-purple hover:file:bg-pastel-purple/70" />
                    </div>
                </div>
            </fieldset>

            <fieldset className="relative space-y-4">
                 {!profile?.isVerified && (
                     <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-gray-200/70 backdrop-blur-sm">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                         </svg>
                         <p className="mt-2 font-semibold text-gray-600">This section unlocks after verification.</p>
                     </div>
                 )}
                <div className={`${!profile?.isVerified && 'opacity-40'}`}>
                    <h2 className="text-xl font-semibold text-brand-charcoal">Services & Availability</h2>
                    <p className="text-sm text-gray-500">Manage your session types and weekly schedule here.</p>
                </div>
            </fieldset>

            <div className="pt-5">
              <div className="flex justify-end">
                <button type="submit" disabled={isLoading} className="rounded-lg bg-pastel-pink px-6 py-3 text-lg font-semibold text-white shadow-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl focus:outline-none focus:ring-2 focus:ring-pastel-pink focus:ring-offset-2 disabled:cursor-not-allowed disabled:bg-pastel-pink/70">
                  {isLoading ? 'Saving...' : 'Save Profile'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfessionalProfilePage;