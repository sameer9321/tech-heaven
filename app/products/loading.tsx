import Header from "@/components/Header";

export default function Loading() {
  return (
    <>
      <Header />
      <main>
        <div className="bg-white border-b border-line">
          <div className="container-tt py-6">
            <div className="skeleton h-4 w-40 rounded" />
            <div className="skeleton h-8 w-56 rounded mt-3" />
          </div>
        </div>
        <div className="container-tt py-8 grid lg:grid-cols-[260px_1fr] gap-8">
          <div className="hidden lg:block"><div className="skeleton h-96 rounded-2xl" /></div>
          <div>
            <div className="skeleton h-10 w-full rounded-xl mb-6" />
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-5">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="card overflow-hidden">
                  <div className="skeleton aspect-[4/3]" />
                  <div className="p-4 space-y-3">
                    <div className="skeleton h-3 w-24 rounded" />
                    <div className="skeleton h-4 w-full rounded" />
                    <div className="skeleton h-5 w-28 rounded" />
                    <div className="skeleton h-9 w-full rounded-lg" />
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
