import SearchBar from '../components/SearchBar';

export default function SearchLoading() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      {/* Search Header */}
      <section className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="max-w-3xl">
            <SearchBar placeholder="Search again..." />
          </div>
        </div>
      </section>

      {/* Loading State */}
      <section className="max-w-7xl mx-auto px-4 py-8">
        <div className="h-8 w-64 bg-gray-200 rounded animate-pulse mb-6" />
        
        <div className="space-y-4">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="p-6 bg-white rounded-lg border">
              <div className="flex items-start justify-between">
                <div className="w-full">
                  {/* Title skeleton */}
                  <div className="h-6 w-48 bg-gray-200 rounded animate-pulse" />
                  
                  {/* Rating skeleton */}
                  <div className="mt-2 h-4 w-32 bg-gray-200 rounded animate-pulse" />
                  
                  {/* Tags skeleton */}
                  <div className="mt-3 flex space-x-2">
                    <div className="h-6 w-16 bg-gray-200 rounded animate-pulse" />
                    <div className="h-6 w-20 bg-gray-200 rounded animate-pulse" />
                  </div>
                  
                  {/* Address skeleton */}
                  <div className="mt-3 h-4 w-64 bg-gray-200 rounded animate-pulse" />
                </div>
                
                {/* Button skeleton */}
                <div className="h-8 w-24 bg-gray-200 rounded animate-pulse" />
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
} 