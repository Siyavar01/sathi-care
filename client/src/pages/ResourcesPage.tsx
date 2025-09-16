import { useEffect, useMemo } from 'react';
import useResourceStore from '../features/resource/resourceSlice';
import type { IResource } from '../types';

const ResourcesPage = () => {
  const { resources, isLoading, isError, message, getAllResources } = useResourceStore();

  useEffect(() => {
    getAllResources();
  }, [getAllResources]);

  const groupedResources = useMemo(() => {
    return resources.reduce((acc, resource) => {
      const category = resource.category;
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(resource);
      return acc;
    }, {} as Record<string, IResource[]>);
  }, [resources]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-pastel-purple via-brand-cream to-pastel-pink p-4 sm:p-6 lg:p-8 bg-[length:200%_200%] animate-gradient-pan">
      <div className="mx-auto max-w-7xl">
        <div className="rounded-2xl bg-white/80 p-8 shadow-2xl backdrop-blur-2xl ring-1 ring-black/5">
          <h1 className="text-3xl font-bold tracking-tight text-brand-charcoal">
            Self-Help Resources
          </h1>
          <p className="mt-2 text-gray-600">
            A curated library of resources to support you on your wellness journey.
          </p>
        </div>

        {isLoading && <p className="mt-8 text-center text-brand-charcoal">Loading resources...</p>}
        {isError && <p className="mt-8 text-center text-red-500">{message}</p>}

        {!isLoading && !isError && (
          <div className="mt-8 space-y-12">
            {Object.entries(groupedResources).map(([category, resourcesInCategory]) => (
              <div key={category}>
                <h2 className="text-2xl font-bold text-brand-charcoal px-8">{category}</h2>
                <div className="mt-4 flex space-x-6 overflow-x-auto py-4 px-8 scrollbar-hide">
                  {resourcesInCategory.map(resource => (
                    <a
                      key={resource._id}
                      href={resource.pdfUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex-shrink-0 w-64 rounded-2xl bg-white/60 shadow-lg backdrop-blur-xl ring-1 ring-black/5 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1"
                    >
                      <div className="overflow-hidden rounded-t-2xl">
                        <img
                          src={resource.imageUrl}
                          alt={resource.title}
                          className="h-40 w-full object-cover transition-transform duration-300 group-hover:scale-105"
                        />
                      </div>
                      <div className="p-4">
                        <h3 className="font-semibold text-brand-charcoal">{resource.title}</h3>
                      </div>
                    </a>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <style>{`
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
};

export default ResourcesPage;