import Navbar from '../components/public/Navbar'
import dashboardImg from '../assets/fleetmanagerhero.webp'
import trackingImg from '../assets/features/vehicles.jpg'
import driverImg from '../assets/features/drivers.jpg'
import maintenanceImg from '../assets/features/maintenance.webp'
import fedexLogo from '../assets/partners/fedex.png'
import dhlLogo from '../assets/partners/dhl.png'
import upsLogo from '../assets/partners/ups.png'
import amazonLogo from '../assets/partners/amazon.png'
import maerskLogo from '../assets/partners/maersk.png'
import uberLogo from '../assets/partners/uber.png'



export default function Home() {
    return (
        <div
            className="
        min-h-screen
        bg-gradient-to-r
        from-[#020024]
        via-[#090979]
        to-[#00d4ff]
        text-white
        relative
        overflow-hidden
      "
        >
            {/* Navbar must be INSIDE gradient */}
            <Navbar />

            {/* HERO */}
            <section className="max-w-7xl mx-auto px-6 pt-36 pb-32 grid grid-cols-1 md:pt-56 pd-32 md:grid-cols-2 gap-12 items-center">
                <div>
                    <h1 className="text-4xl md:text-6xl font-bold leading-tight mb-6">
                        Smart Fleet Management <br />
                        <span className="block text-cyan-300 mt-2">Built for Scale</span>
                    </h1>

                    <p className="text-lg text-white/80 max-w-xl mb-8">
                        Track vehicles, manage drivers, optimize trips, monitor maintenance,
                        and control geofencing — all from one powerful platform.
                    </p>

                    <div className="flex flex-wrap gap-4">
                        <a href="/register" className="btn-grad">
                            Get Started
                        </a>
                        <a href="/login" className="btn-grad">
                            Sign Up
                        </a>
                    </div>
                </div>

                {/* Hero Image */}
                <div className="relative group perspective-1000">
                    <img
                        src={dashboardImg}
                        alt="FleetManagerPRO Dashboard"
                        className="
                            rounded-2xl
                            shadow-2xl
                            border border-white/20
                            transform-gpu
                            transition-all duration-500 ease-out
                            group-hover:-translate-y-2
                            group-hover:scale-[1.03]
                            group-hover:rotate-x-6
                            group-hover:-rotate-y-6"
                    />
                </div>


            </section>

            {/* FEATURES */}
            <section id="features" className="max-w-7xl mx-auto px-6 pb-24 space-y-12">
                <h2 className="text-3xl md:text-4xl font-semi-boldtext-center mb-12">
                    Features
                </h2>

                <FeatureCard
                    image={trackingImg}
                    title="Vehicle Tracking"
                    desc="Monitor vehicle status, real-time location, speed, and performance. Get detailed analytics on routes, fuel consumption, and optimize fleet efficiency."
                />
                <FeatureCard
                    image={driverImg}
                    title="Driver Management"
                    desc="Assign trips, track driving patterns, and analyze performance metrics. Ensure compliance with driving regulations, improve safety, and incentivize top-performing drivers."
                    reverse
                />
                <FeatureCard
                    image={maintenanceImg}
                    title="Maintenance & Alerts"
                    desc="Schedule regular maintenance, track service history, and receive smart alerts for upcoming checkups or repairs. Reduce downtime and prevent costly breakdowns."
                />
            </section>

             {/* ABOUT + STATS */}
<section className="max-w-7xl mx-auto px-6 min-h-screen flex flex-col justify-center gap-16">
  {/* ABOUT */}
<section
  id="about"
  className="min-h-[60vh] flex items-center"
>
  <div className="max-w-7xl mx-auto px-6 text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-8">
      About
      <span className="block w-16 h-1 bg-cyan-300 mx-auto mt-3 rounded-full"></span>
    </h2>

    <p className="text-white/80 max-w-4xl mx-auto text-base md:text-lg leading-relaxed">
      FleetManagerPRO is a comprehensive fleet management platform designed for companies of all sizes.
      From real-time vehicle tracking to driver performance analytics, route optimization, and maintenance alerts,
      our platform gives you complete control over your fleet operations. Streamline workflows, reduce costs,
      improve safety, and make informed decisions using powerful analytics and automation.
    </p>
  </div>
</section>

  {/* STATISTICS */}
<section
  id="stats"
  className="min-h-[50vh] flex items-center"
>
  <div className="max-w-7xl mx-auto px-6 w-full">
    <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
      Statistics
      <span className="block w-16 h-1 bg-cyan-300 mx-auto mt-3 rounded-full"></span>
    </h2>

    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
      <StatCard number="1,000+" label="Vehicles Tracked" />
      <StatCard number="500,000+" label="Miles Optimized" />
      <StatCard number="10,000+" label="Maintenance Alerts" />
    </div>
  </div>
</section>

{/* PARTNERS */}
<section
  id="partners"
  className="min-h-[60vh] flex items-center"
>
  <div className="max-w-7xl mx-auto px-6 w-full text-center">
    <h2 className="text-3xl md:text-4xl font-bold mb-16">
      Trusted by Industry Leaders
      <span className="block w-20 h-1 bg-cyan-300 mx-auto mt-3 rounded-full"></span>
    </h2>

    <div className="grid grid-cols-2 md:grid-cols-3 gap-10 items-center">
      {[
        { src: fedexLogo, alt: "FedEx" },
        { src: dhlLogo, alt: "DHL" },
        { src: upsLogo, alt: "UPS" },
        { src: amazonLogo, alt: "Amazon" },
        { src: maerskLogo, alt: "Maersk" },
        { src: uberLogo, alt: "Uber" },
      ].map((logo) => (
        <div
          key={logo.alt}
          className="
            bg-white/10 backdrop-blur-md
            border border-white/20
            rounded-xl
            p-6
            flex items-center justify-center
            opacity-70
            hover:opacity-100 hover:scale-105
            transition
          "
        >
          <img
            src={logo.src}
            alt={logo.alt}
            className="max-h-12 object-contain"
          />
        </div>
      ))}
    </div>
  </div>
</section>


</section>


            {/* TESTIMONIALS */}
            <section className="min-h-[60vh] max-w-7xl mx-auto px-6 py-20 mb-24">
                <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
                    What Our Customers Say
                </h2>
                <div className="relative flex overflow-x-auto gap-6 scrollbar-hide">
                    <TestimonialCard
                        name="John D."
                        company="Logistics Manager"
                        text="FleetManagerPRO reduced our downtime by 30% and improved route efficiency significantly."
                    />
                    <TestimonialCard
                        name="Samantha R."
                        company="Fleet Coordinator"
                        text="The driver management module keeps us compliant and helps us track performance easily."
                    />
                    <TestimonialCard
                        name="Michael B."
                        company="Operations Lead"
                        text="Maintenance alerts and scheduling are a lifesaver. Our fleet never misses a service now!"
                    />
                </div>
            </section>

             {/* FOOTER */}
<footer className="bg-white/10 backdrop-blur-md border-t border-white/20 mt-5 text-white text-sm md:text-base pt-16 pb-2">
  {/* Contact Info Grid */}
  <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
    <div className="flex flex-col items-center gap-1">
      <span className="text-xl">📧</span>
      <span>Email</span>
      <a href="mailto:support@fleetmanagerpro.com" className="hover:text-cyan-300 transition">
        support@fleetmanagerpro.com
      </a>
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-xl">📞</span>
      <span>Phone</span>
      <a href="tel:+1234567890" className="hover:text-cyan-300 transition">
        +1 234 567 890
      </a>
    </div>
    <div className="flex flex-col items-center gap-1">
      <span className="text-xl">📍</span>
      <span>Location</span>
      <span>123 Fleet St, Logistics City, USA</span>
    </div>
  </div>

  {/* All Rights Reserved */}
  <div className="mt-16 text-white/60 text-xs md:text-sm text-center">
    &copy; {new Date().getFullYear()} FleetManagerPRO. All rights reserved.
  </div>
</footer>


        </div>
    )
}

function FeatureCard({ image, title, desc, reverse }) {
    return (
        <div
            className={`grid grid-cols-1 md:grid-cols-2 items-center gap-6 md:gap-12 p-6
        bg-white/10 backdrop-blur-md border border-white/20 rounded-xl shadow-lg
        transition hover:bg-white/20 hover:-translate-y-1
        ${reverse ? "md:grid-flow-col-dense" : ""}
      `}
        >
            {/* Image Box */}
            <div className="rounded-xl overflow-hidden">
                <img
                    src={image}
                    alt={title}
                    className="w-full h-auto md:h-[auto] object-contain"
                />
            </div>

            {/* Text */}
            <div className="p-6 md:p-8 text-left">
                <h3 className="text-2xl md:text-3xl lg: text-4xl font-semibold mb-3">{title}</h3>
                <p className="text-white/80 text-sm md:text-base leading-relaxed">
                    {desc}
                </p>
            </div>
        </div>
    );
}

// Stat Card
function StatCard({ number, label }) {
    return (
        <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-8 shadow-lg transition hover:bg-white/20">
            <div className="text-3xl md:text-5xl font-bold text-cyan-300 mb-2">{number}</div>
            <div className="text-white/80 font-medium">{label}</div>
        </div>
    );
}

// Testimonial Card
function TestimonialCard({ name, company, text }) {
    return (
        <div className="min-w-[280px] max-w-sm bg-white/10 backdrop-blur-md border border-white/20 rounded-xl p-6 shadow-lg transition hover:bg-white/20">
            <p className="text-white/80 mb-4">"{text}"</p>
            <div className="font-semibold text-white">{name}</div>
            <div className="text-white/70 text-sm">{company}</div>
        </div>
    );
}