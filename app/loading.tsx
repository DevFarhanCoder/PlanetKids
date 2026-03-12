export default function Loading() {
  return (
    <div className="min-h-screen bg-white animate-pulse">
      {/* Hero banner skeleton */}
      <div className="w-full h-[220px] md:h-[420px] bg-gradient-to-r from-gray-200 via-gray-100 to-gray-200" />

      {/* Category showcase skeleton */}
      <div className="py-6 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="h-6 w-40 bg-gray-200 rounded-full mx-auto mb-5" />
          <div className="flex gap-3 overflow-hidden justify-center">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="flex-shrink-0 w-[80px] md:w-[100px]">
                <div className="aspect-square rounded-2xl bg-gray-200 mb-2" />
                <div className="h-3 bg-gray-200 rounded-full" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Product grid skeleton */}
      <div className="py-6 bg-gray-50">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="h-7 w-48 bg-gray-200 rounded-full mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(12)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl overflow-hidden border border-gray-100"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded-full" />
                  <div className="h-3 bg-gray-200 rounded-full w-2/3" />
                  <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Second product grid skeleton */}
      <div className="py-6 bg-white">
        <div className="container mx-auto px-4 max-w-[1400px]">
          <div className="h-7 w-48 bg-gray-200 rounded-full mb-6" />
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-2xl overflow-hidden border border-gray-100"
              >
                <div className="aspect-square bg-gray-200" />
                <div className="p-3 space-y-2">
                  <div className="h-3 bg-gray-200 rounded-full" />
                  <div className="h-4 bg-gray-200 rounded-full w-1/2" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
