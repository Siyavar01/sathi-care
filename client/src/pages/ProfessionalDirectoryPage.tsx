import { useEffect, useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import useAuthStore from '../features/auth/authSlice';
import useProfessionalListStore from '../features/professional/professionalListSlice.ts';
import type { IProfessional } from '../types/index.ts';

const ProfessionalDirectoryPage = () => {
  const { user } = useAuthStore();
  const { professionals, isLoading, isError, message, getAllProfessionals, reset } = useProfessionalListStore();

  const [filters, setFilters] = useState({
    specialization: '',
    proBono: false,
    minExperience: 0,
    language: '',
    title: '',
  });

  useEffect(() => {
    const forOutreach = user?.role === 'institution';
    getAllProfessionals({ outreach: forOutreach });

    return () => {
      reset();
    };
  }, [user, getAllProfessionals, reset]);

  const filteredProfessionals = useMemo(() => {
    return professionals.filter(prof => {
      const specializationMatch = filters.specialization ? prof.specializations.some(s => s.toLowerCase().includes(filters.specialization.toLowerCase())) : true;
      const proBonoMatch = filters.proBono ? prof.offersProBono === true : true;
      const experienceMatch = prof.experience >= filters.minExperience;
      const languageMatch = filters.language ? prof.languages.includes(filters.language) : true;
      const titleMatch = filters.title ? prof.title === filters.title : true;
      return specializationMatch && proBonoMatch && experienceMatch && languageMatch && titleMatch;
    });
  }, [professionals, filters]);

  const handleFilterChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    if (type === 'checkbox') {
      const { checked } = e.target as HTMLInputElement;
      setFilters(prev => ({ ...prev, [name]: checked }));
    } else {
      setFilters(prev => ({ ...prev, [name]: value }));
    }
  };

  const renderActionButton = (professional: IProfessional) => {
    const commonButtonClasses = "mt-auto w-full rounded-lg px-4 py-3 text-center font-semibold text-white shadow-md transition-transform duration-200 hover:scale-105";
    if (user?.role === 'institution') {
      return (
        <Link to={`/professionals/${professional._id}/connect`} className={`${commonButtonClasses} bg-pastel-purple`}>
          Inquire for Outreach
        </Link>
      );
    }
    return (
      <Link to={`/professionals/${professional._id}/book`} className={`${commonButtonClasses} bg-pastel-pink`}>
        Book a Session
      </Link>
    );
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 sm:p-6 lg:p-8 bg-[length:200%_200%] animate-gradient-pan">
      <div className="mx-auto max-w-7xl">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight text-brand-charcoal sm:text-5xl">
            Find Your Professional
          </h1>
          <p className="mt-4 text-lg text-gray-700">
            Browse our network of verified therapists and psychiatrists.
          </p>
        </div>

        <div className="mt-10 mx-auto max-w-5xl rounded-2xl bg-white/50 p-6 shadow-lg backdrop-blur-xl ring-1 ring-black/5">
            <div className="grid grid-cols-1 gap-6 md:grid-cols-4 lg:grid-cols-5">
                <div className="md:col-span-2 lg:col-span-2">
                    <label htmlFor="specialization" className="block text-sm font-medium text-brand-charcoal">Specialization</label>
                    <input
                        type="text"
                        name="specialization"
                        id="specialization"
                        value={filters.specialization}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pastel-purple focus:ring-pastel-purple sm:text-sm"
                        placeholder="e.g., Anxiety, CBT"
                    />
                </div>
                <div>
                    <label htmlFor="title" className="block text-sm font-medium text-brand-charcoal">Title</label>
                    <select name="title" id="title" value={filters.title} onChange={handleFilterChange} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pastel-purple focus:ring-pastel-purple sm:text-sm">
                        <option value="">All</option>
                        <option value="Therapist">Therapist</option>
                        <option value="Psychiatrist">Psychiatrist</option>
                    </select>
                </div>
                 <div>
                    <label htmlFor="language" className="block text-sm font-medium text-brand-charcoal">Language</label>
                    <select name="language" id="language" value={filters.language} onChange={handleFilterChange} className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-pastel-purple focus:ring-pastel-purple sm:text-sm">
                        <option value="">All</option>
                        <option value="English">English</option>
                        <option value="Hindi">Hindi</option>
                        <option value="Marathi">Marathi</option>
                        <option value="Punjabi">Punjabi</option>
                         <option value="Gujarati">Gujarati</option>
                    </select>
                </div>
                <div className="md:col-span-4 lg:col-span-5">
                    <label htmlFor="minExperience" className="block text-sm font-medium text-brand-charcoal">Minimum Experience: {filters.minExperience} years</label>
                    <input
                        type="range"
                        name="minExperience"
                        id="minExperience"
                        min="0"
                        max="20"
                        value={filters.minExperience}
                        onChange={handleFilterChange}
                        className="mt-1 block w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                    />
                </div>
                {user?.role !== 'institution' && (
                    <div className="md:col-span-4 lg:col-span-5 flex items-center">
                        <input
                            id="proBono"
                            name="proBono"
                            type="checkbox"
                            checked={filters.proBono}
                            onChange={handleFilterChange}
                            className="h-4 w-4 rounded border-gray-300 text-pastel-purple focus:ring-pastel-purple"
                        />
                        <label htmlFor="proBono" className="ml-2 block text-sm font-medium text-brand-charcoal">
                            Show only professionals offering pro bono services
                        </label>
                    </div>
                )}
            </div>
        </div>

        <div className="mt-12">
          {isLoading && <p className="text-center text-brand-charcoal">Loading professionals...</p>}
          {isError && <p className="text-center text-red-500">{message}</p>}
          {!isLoading && !isError && (
             <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProfessionals.map((prof) => (
                <div key={prof._id} className="flex flex-col rounded-2xl bg-white/80 p-6 shadow-xl backdrop-blur-xl ring-1 ring-black/5 transition-transform duration-300 hover:-translate-y-1">
                  <div className="flex-grow space-y-4 pb-4">
                      <div className="flex items-center space-x-4">
                        <img
                          className="h-20 w-20 flex-shrink-0 rounded-full object-cover"
                          src={prof.profilePictureUrl}
                          alt={`Dr. ${prof.user.name}`}
                        />
                        <div>
                          <h3 className="text-lg font-bold text-brand-charcoal">{prof.user.name}</h3>
                          <p className="text-sm font-medium text-pastel-purple">{prof.title}</p>
                        </div>
                      </div>
                      <p className="text-sm text-gray-600 line-clamp-3">{prof.bio}</p>
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500">Specializations</h4>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {prof.specializations.slice(0, 3).map((spec) => (
                            <span key={spec} className="rounded-full bg-pastel-purple/20 px-3 py-1 text-xs font-medium text-pastel-purple">
                              {spec}
                            </span>
                          ))}
                        </div>
                      </div>
                       <div className="border-t border-gray-200 pt-4 space-y-3 text-sm text-brand-charcoal">
                          <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" /></svg><span>{prof.experience} years of experience</span></div>
                          <div className="flex items-center"><svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 flex-shrink-0 text-gray-400 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M10 2a6 6 0 00-6 6c0 1.887.645 3.65 1.758 5.042a.5.5 0 01.1 0l.003.002.002.002.002.002a.5.5 0 00.34.152h7.6a.5.5 0 00.34-.152l.002-.002.002-.002.003-.002a.5.5 0 01.1 0C15.355 11.65 16 9.887 16 8a6 6 0 00-6-6zm0 11.5a4.5 4.5 0 100-9 4.5 4.5 0 000 9z" /><path d="M4.08 13.372A7.5 7.5 0 0010 15.5a7.5 7.5 0 005.92-2.128.5.5 0 00-.638-.772A6.5 6.5 0 114.718 12.6a.5.5 0 00-.638.772z" /></svg><span>Speaks: {prof.languages.join(', ')}</span></div>
                          {user?.role !== 'institution' && prof.offersProBono && <div className="flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-bold text-green-800"><svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1.5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M3.172 5.172a4 4 0 015.656 0L10 6.343l1.172-1.171a4 4 0 115.656 5.656L10 17.657l-6.828-6.829a4 4 0 010-5.656z" clipRule="evenodd" /></svg><span>Offers Pro Bono Sessions</span></div>}
                      </div>
                  </div>
                  <div className="pt-4">
                    {renderActionButton(prof)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProfessionalDirectoryPage;