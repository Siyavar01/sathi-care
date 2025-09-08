import { useState, useEffect, type FormEvent, type ChangeEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import useAuthStore from '../features/auth/authSlice';
import useProfessionalStore from '../features/professional/professionalSlice.ts';
import type { IUser, ISessionType } from '../types/index.ts';

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

  const [sessionTypes, setSessionTypes] = useState<ISessionType[]>([]);
  const [availability, setAvailability] = useState<any[]>([]);

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
    } else if (user.role !== 'professional') {
      toast.error('You are not authorized to access this page.');
      navigate('/');
    }
  }, [user, navigate]);

  useEffect(() => {
    if (isError) {
      toast.error(message);
      reset();
    }

    if (isSuccess && message) {
      toast.success(message);
      if (user?.token) {
        getMyProfile(user.token);
      }
      reset();
    }
  }, [isError, isSuccess, message, reset, user?.token, getMyProfile]);

  useEffect(() => {
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
      setSessionTypes(profile.sessionTypes || []);
      setAvailability(profile.availability || []);
    }
  }, [profile]);

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

  const handleAddSessionType = () => {
    setSessionTypes([...sessionTypes, { _id: `temp_${new Date().getTime()}`, type: '', duration: 30, price: 0, isProBono: false }]);
  };

  const handleSessionTypeChange = (index: number, field: string, value: string | number | boolean) => {
    const newSessionTypes = [...sessionTypes];
    (newSessionTypes[index] as any)[field] = value;
    setSessionTypes(newSessionTypes);
  };

  const handleRemoveSessionType = (index: number) => {
    const newSessionTypes = sessionTypes.filter((_, i) => i !== index);
    setSessionTypes(newSessionTypes);
  };

  const handleAddAvailability = () => {
    setAvailability([...availability, { day: 'Monday', timeSlots: [] }]);
  };

  const handleAvailabilityChange = (dayIndex: number, field: string, value: string) => {
     const newAvailability = [...availability];
     (newAvailability[dayIndex] as any)[field] = value;
     setAvailability(newAvailability);
  };

  const handleRemoveAvailabilityDay = (dayIndex: number) => {
    const newAvailability = availability.filter((_, i) => i !== dayIndex);
    setAvailability(newAvailability);
  };

  const handleAddTimeSlot = (dayIndex: number) => {
      const newAvailability = [...availability];
      newAvailability[dayIndex].timeSlots.push({ startTime: '09:00', endTime: '10:00', sessionTypeId: sessionTypes[0]?._id || '' });
      setAvailability(newAvailability);
  };

  const handleTimeSlotChange = (dayIndex: number, slotIndex: number, field: string, value: string) => {
    const newAvailability = [...availability];
    (newAvailability[dayIndex].timeSlots[slotIndex] as any)[field] = value;
    setAvailability(newAvailability);
  };

  const handleRemoveTimeSlot = (dayIndex: number, slotIndex: number) => {
      const newAvailability = [...availability];
      newAvailability[dayIndex].timeSlots = newAvailability[dayIndex].timeSlots.filter((_: any, i: number) => i !== slotIndex);
      setAvailability(newAvailability);
  };

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (user?.token) {
      const cleanSessionTypes = sessionTypes.map(st => {
        const { _id, ...rest } = st;
        if (String(_id).length === 24) {
          return { _id, ...rest };
        }
        return rest;
      });

      const profileData = {
        ...formData,
        specializations: formData.specializations.split(',').map(s => s.trim()).filter(Boolean),
        languages: formData.languages.split(',').map(l => l.trim()).filter(Boolean),
        sessionTypes: cleanSessionTypes,
        availability,
      };

      await createOrUpdateProfile(profileData, user.token);

      if (profilePictureFile) {
        await uploadProfilePicture(profilePictureFile, user.token);
        setProfilePictureFile(null);
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

            <fieldset className="relative space-y-6">
                <div className={`${!profile?.isVerified ? 'opacity-40 pointer-events-none' : ''}`}>
                    <legend className="text-xl font-semibold text-brand-charcoal">Services & Availability</legend>
                    <p className="text-sm text-gray-500">Define the session types you offer. This will be visible to users for booking.</p>

                    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                      <h3 className="text-lg font-medium text-brand-charcoal">Session Types</h3>
                      {sessionTypes.map((session, index) => (
                        <div key={session._id || index} className="grid grid-cols-1 gap-x-4 gap-y-2 rounded-lg border border-gray-200 p-4 sm:grid-cols-10">
                          <div className="sm:col-span-4">
                            <label className="block text-sm font-medium text-gray-700">Session Name</label>
                            <input type="text" value={session.type} onChange={(e) => handleSessionTypeChange(index, 'type', e.target.value)} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm" placeholder="e.g., Initial Consultation"/>
                          </div>
                          <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Duration (min)</label>
                            <input type="number" value={session.duration} onChange={(e) => handleSessionTypeChange(index, 'duration', parseInt(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/>
                          </div>
                           <div className="sm:col-span-2">
                            <label className="block text-sm font-medium text-gray-700">Price (INR)</label>
                            <input type="number" value={session.price} onChange={(e) => handleSessionTypeChange(index, 'price', parseInt(e.target.value))} className="mt-1 block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/>
                          </div>
                          <div className="sm:col-span-10 flex items-center justify-between pt-2">
                              {formData.offersProBono && (
                                <div className="flex items-center space-x-2">
                                    <input id={`isProBono-${index}`} type="checkbox" checked={session.isProBono} onChange={(e) => handleSessionTypeChange(index, 'isProBono', e.target.checked)} className="h-4 w-4 rounded border-gray-300 text-pastel-purple"/>
                                    <label htmlFor={`isProBono-${index}`} className="text-sm font-medium text-gray-700">This is a pro bono session</label>
                                </div>
                              )}
                              <button type="button" onClick={() => handleRemoveSessionType(index)} className="text-sm font-semibold text-red-600 hover:text-red-800">Remove</button>
                          </div>
                        </div>
                      ))}
                      <button type="button" onClick={handleAddSessionType} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-charcoal shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                        + Add Session Type
                      </button>
                    </div>

                    <div className="space-y-4 rounded-lg border border-gray-200 p-4">
                        <h3 className="text-lg font-medium text-brand-charcoal">Weekly Availability</h3>
                        {availability.map((day, dayIndex) => (
                            <div key={dayIndex} className="space-y-2 rounded-lg border border-gray-200 p-4">
                                <div className="flex items-center justify-between">
                                    <select value={day.day} onChange={(e) => handleAvailabilityChange(dayIndex, 'day', e.target.value)} className="block w-1/3 rounded-md border-gray-300 shadow-sm sm:text-sm">
                                        <option>Monday</option>
                                        <option>Tuesday</option>
                                        <option>Wednesday</option>
                                        <option>Thursday</option>
                                        <option>Friday</option>
                                        <option>Saturday</option>
                                        <option>Sunday</option>
                                    </select>
                                    <button type="button" onClick={() => handleRemoveAvailabilityDay(dayIndex)} className="text-sm font-semibold text-red-600 hover:text-red-800">Remove Day</button>
                                </div>
                                <div className="space-y-2 pt-2">
                                    {day.timeSlots.map((slot: any, slotIndex: number) => (
                                        <div key={slotIndex} className="grid grid-cols-1 sm:grid-cols-4 gap-2 items-center">
                                             <input type="time" value={slot.startTime} onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'startTime', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/>
                                             <input type="time" value={slot.endTime} onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'endTime', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm"/>
                                             <select value={slot.sessionTypeId} onChange={(e) => handleTimeSlotChange(dayIndex, slotIndex, 'sessionTypeId', e.target.value)} className="block w-full rounded-md border-gray-300 shadow-sm sm:text-sm sm:col-span-2">
                                                <option value="">Link to Session Type</option>
                                                {sessionTypes.map(st => <option key={st._id} value={st._id}>{st.type} ({st.duration} min)</option>)}
                                             </select>
                                             <button type="button" onClick={() => handleRemoveTimeSlot(dayIndex, slotIndex)} className="text-red-500 font-bold sm:col-start-4 sm:justify-self-end">X</button>
                                        </div>
                                    ))}
                                </div>
                                 <button type="button" onClick={() => handleAddTimeSlot(dayIndex)} className="text-sm font-semibold text-pastel-purple hover:text-pastel-purple/80 pt-2">+ Add Time Slot</button>
                            </div>
                        ))}
                         <button type="button" onClick={handleAddAvailability} className="rounded-lg bg-white px-4 py-2 text-sm font-semibold text-brand-charcoal shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50">
                            + Add Available Day
                        </button>
                    </div>
                </div>

                {!profile?.isVerified && (
                     <div className="absolute inset-0 z-10 flex flex-col items-center justify-center rounded-lg bg-gray-200/70 backdrop-blur-sm">
                         <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-gray-500" viewBox="0 0 20 20" fill="currentColor">
                             <path fillRule="evenodd" d="M10 1a4.5 4.5 0 00-4.5 4.5V9H5a2 2 0 00-2 2v6a2 2 0 002 2h10a2 2 0 002-2v-6a2 2 0 00-2-2h-.5V5.5A4.5 4.5 0 0010 1zm3 8V5.5a3 3 0 10-6 0V9h6z" clipRule="evenodd" />
                         </svg>
                         <p className="mt-2 font-semibold text-gray-600">This section unlocks after verification.</p>
                     </div>
                 )}
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