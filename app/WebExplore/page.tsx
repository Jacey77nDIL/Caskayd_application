// Main web explore page
import Navbar from "@/components/Navbar";
import FilterBar from "@/components/FilterBar";
import ProfileCarousel from "@/components/ProfileCarousel";
import data from "@/data/influencers.json";

export default function Page() {
  return (
    <main className="min-h-screen bg-black text-white bg-[url('/images/backgroundImage.png')] bg-cover bg-center">
      <Navbar />

      {/* Container for filter + carousel */}
      <div className="container mx-auto px-4 sm:px-6 lg:px-12 mt-8">
        <div className="w-full lg:w-1/2 flex flex-col items-center lg:items-end space-y-6">
          {/* FilterBar aligned right on desktop, centered on mobile */}
          <FilterBar />

          {data && (
            <ProfileCarousel
              profiles={data.map((p: any) => ({
                id: p.id,
                name: p.name,
                image: p.image,
                platforms: p.platforms ?? [],
              }))}
            />
          )}
        </div>
      </div>
    </main>
  );
}
