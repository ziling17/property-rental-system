import { FormEvent } from 'react';
import { CheckCircle2, ChevronRight, Search, ShieldCheck } from 'lucide-react';

interface HeroProps {
  onSearchSubmit: (keyword: string) => void;
  onBrowseClick: () => void;
  onLoginClick: () => void;
  userProfile: { name: string; score: number; role: 'tenant' | 'landlord' | null } | null;
}

export default function Hero({ onSearchSubmit, onBrowseClick, onLoginClick, userProfile }: HeroProps) {
  const handleQuickSearch = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const data = new FormData(e.currentTarget);
    const keyword = data.get('quickSearch') as string;
    onSearchSubmit(keyword || '');
  };

  return (
    <section className="relative min-h-[750px] md:min-h-[800px] flex items-center overflow-hidden">
      {/* Background Image & Ambient Gradient overlays */}
      <div className="absolute inset-0 z-0">
        <img
          className="w-full h-full object-cover object-center"
          src="https://lh3.googleusercontent.com/aida-public/AB6AXuCehshjaBF8aFlQFN8vvg8SgoKAz-jcIqIeYZeRGCOJsiyvrahgpzeB8hvs8IHh8QodWYWGKRgW0PEVvD8eg631DOkOhtIWiHGxW0XYeeaG4ifrI8H1Mttopo9sOBUsfH1XmULJF74KgfwCdMFM4Btu3jGVj305NgkIqjCKcFiXu91ict82TC3eBdwP_wgSo60AWEZ-BeAFqK7rsAPZHtu6uEYURd9Sd860ATBXno9ovP-Q7qaeJjLa3ybZXoM9InYt2F-BkDx0fIk"
          alt="Kuala Lumpur skyline during golden hour"
        />
        {/* Deep, rich multi-stop gradient to fade Kuala Lumpur buildings to matching clean offwhite/white background */}
        <div className="absolute inset-0 bg-gradient-to-r from-white via-white/80 md:via-white/70 to-white/10 dark:from-white/10" />
        <div className="absolute inset-0 bg-gradient-to-t from-[#f8f9ff] via-[#f8f9ff]/30 to-transparent" />
      </div>

      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 md:px-16 py-16 md:py-24">
        <div className="max-w-2xl bg-white/20 backdrop-blur-[2px] p-6 rounded-2xl md:bg-transparent md:backdrop-blur-none md:p-0">

          {/* Tagline Badge */}
          <div className="inline-flex items-center gap-1.5 bg-brand-light-blue py-1.5 px-3.5 rounded-full mb-6 border border-brand-border shadow-sm animate-fade-in">
            <ShieldCheck className="w-4 h-4 text-brand-primary" />
            <span className="text-[11px] font-bold tracking-wider text-brand-primary uppercase">
              MALAYSIA'S MOST SECURE RENTAL PLATFORM
            </span>
          </div>

          {/* Majestic Title */}
          <h1 className="text-4xl md:text-5xl lg:text-5.5xl font-extrabold tracking-tight text-brand-dark leading-tight mb-4">
            Find <span className="text-brand-primary inline-block">Trusted Homes</span> <br className="hidden md:block" />
            in Malaysia
          </h1>

          {/* Supporting Pitch */}
          <p className="text-base md:text-[18px] text-brand-dark-text leading-relaxed mb-8 max-w-lg font-medium">
            Smart Rental Matching & Stability System designed to reduce friction, assure structural security, and bring full financial transparency to your lease agreement.
          </p>

          {/* Quick Search and CTA container */}
          <div className="space-y-5">
            <form onSubmit={handleQuickSearch} className="flex flex-col sm:flex-row gap-3 max-w-md">
              <div className="relative flex-1">
                <Search className="w-5 h-5 text-brand-dark-text/70 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  name="quickSearch"
                  placeholder="Enter location (e.g. Bangsar, Penang)..."
                  className="w-full bg-white text-brand-dark font-sans placeholder:text-brand-dark-text/50 h-12 pl-11 pr-4 rounded-xl border border-brand-border shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-primary/40 focus:border-brand-primary transition-all text-sm"
                  id="hero-search-input"
                />
              </div>
              <button
                type="submit"
                className="bg-white hover:bg-brand-light-blue text-brand-primary font-bold h-12 px-8 rounded-xl border border-brand-border shadow-sm active:scale-[0.98] transition-all text-[15px] flex items-center justify-center cursor-pointer"
                id="hero-login-btn"
              >
                Search
              </button>
            </form>

            <div className="flex flex-wrap gap-4">
              <button
                onClick={onBrowseClick}
                className="bg-brand-primary text-white font-bold h-12 px-8 rounded-xl shadow-md hover:shadow-xl hover:brightness-115 active:scale-[0.98] transition-all text-[15px] flex items-center justify-center cursor-pointer"
                id="hero-browse-btn"
              >
                Browse Properties
              </button>
            </div>
          </div>

          {/* Trust indicators / Active matched items */}
          <div className="mt-12 flex items-center gap-6 animate-fade-in-delayed">
            {/* Avatars collection */}
            <div className="flex -space-x-3">
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuAkRL3hGbiZik5W2UWMs6_ov8gp29Q-0ndeZ6uh2VcrYNDdvq95IM_15CZvAfJV4J53VwcuESKL8UrOxTRSY8g2IvpCfen0lcOiY6M9BS85dkawEFDi20kVWiT6TgssmB9jwFLUKBdlQBBjmLYS-D7Mbr79ycVScV3ZQmeZqu3R_n_JKiX5huLYIbs-qmlk3e8wobH0cGXfW47BTTkZ3TnXjz9T3t4WAn7_OuGDjLYAXO3wPW-Hvik0JewqcgrGgMhAc6RlrtQILx8"
                alt="Matched User A"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuArD3QIhRysnhnnL-0_r0F3hu04Z6GwKwgm3_d33Z0cGnH8Dt0gKADFHe-jqSfQb3KppnunYypb1aNYHDE14GzLBT4jEYseaFtXgk4ome0mbM9tionxuARzDTT6hYgYvmOBYayIgrvY5QIDavkbHYekR8aBpNCg2Rh_TtL0ZafMDUSg_ZpX64lgX1L_5cr-nHWFPHtGF61p3e1zzwESbBykJBNixE59FFY0b8z-htJapdyK0wGVmGPQtgoCnq49r5F5M-trcFEg_iU"
                alt="Matched User B"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
              />
              <img
                src="https://lh3.googleusercontent.com/aida-public/AB6AXuCbiJefy46Eo-WDksgf2h1XjGMIyIhL83kI8wk6cHYlIwgFPMoztzQdG2gZt7ayI7IaKXfj-r-BmaQiGTt3txcSXYQkeUnSPAwytUGFjUvADkqCEK6eX4d7VMA8RyIK_LE91o9-vMDeLTZ4pbziv5BbNBJzubWI6HnXC2k2YNSa0bwVHFay4srlPLk_w4vaXUieW7eYHi77hL-FzTkltEWOO6NHkJNh0x4_xn8zkfI1WHtxn5l7i7Ia1lh3DPuY4JNbdiSGFo63Mwg"
                alt="Matched User C"
                className="w-10 h-10 rounded-full border-2 border-white shadow-sm object-cover"
              />
            </div>

            <p className="text-sm font-semibold text-brand-dark-text">
              <span className="font-extrabold text-brand-dark text-[15px]">5,000+</span> Tenants matched this month
            </p>
          </div>

        </div>
      </div>
    </section>
  );
}
