import Link from "next/link";

const doctors = [
  {
    name: "Dr. Amelia Carter",
    specialty: "Internal Medicine",
    tagline: "Complex diagnostics with human warmth."
  },
  {
    name: "Dr. Noah Reyes",
    specialty: "Cardiology",
    tagline: "Preventive heart care for modern lives."
  },
  {
    name: "Dr. Lina Okafor",
    specialty: "Family Medicine",
    tagline: "Long-term care for every generation."
  }
];

const services = [
  {
    name: "General Consultation",
    description: "First-line assessment for any health concern.",
    price: "$40"
  },
  {
    name: "Executive Checkup",
    description: "Full-body diagnostics for busy professionals.",
    price: "$180"
  },
  {
    name: "Cardio Screening",
    description: "Early detection for cardiovascular risks.",
    price: "$95"
  },
  {
    name: "Teleconsultation",
    description: "Secure remote visits with your doctor.",
    price: "$35"
  }
];

export default function LandingPage() {
  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col px-4 pb-16 pt-10 sm:px-6 lg:px-8 lg:pt-12">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-2xl bg-emerald-500 text-slate-950 shadow-lg shadow-emerald-500/40">
            <span className="text-lg font-bold">A</span>
          </div>
          <div>
            <p className="text-sm font-semibold tracking-tight text-slate-50">
              A Klinic
            </p>
            <p className="text-xs text-slate-400">
              Digital-first medical practice
            </p>
          </div>
        </div>
        <nav className="hidden items-center gap-6 text-xs text-slate-300 sm:flex">
          <a href="#about" className="hover:text-emerald-300">
            About
          </a>
          <a href="#doctors" className="hover:text-emerald-300">
            Doctors
          </a>
          <a href="#services" className="hover:text-emerald-300">
            Services
          </a>
          <a href="#contact" className="hover:text-emerald-300">
            Contact
          </a>
          <a href="#booking" className="hover:text-emerald-300">
            Online Booking
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <Link href="/login" className="btn-ghost text-xs sm:text-sm">
            Staff Login
          </Link>
          <a href="#booking" className="btn-primary text-xs sm:text-sm">
            Book Visit
          </a>
        </div>
      </header>

      <section className="mt-10 grid gap-8 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)] md:items-center">
        <div className="space-y-6">
          <div className="badge">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
            Live, real-world clinic workflow
          </div>
          <div className="space-y-4">
            <h1 className="text-3xl font-semibold tracking-tight text-slate-50 sm:text-4xl md:text-5xl">
              A modern clinic
              <span className="block text-emerald-400">
                built around your visit.
              </span>
            </h1>
            <p className="max-w-xl text-sm leading-relaxed text-slate-300 sm:text-base">
              From reception to diagnosis, every step of your visit is
              orchestrated through a single, secure system. No lost
              files, no repeated questions—just clean, connected care.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="pill">Real-time queue</span>
            <span className="pill">Doctor panels</span>
            <span className="pill">Smart follow-ups</span>
            <span className="pill">Secure records</span>
          </div>

          <div className="grid gap-4 sm:grid-cols-3">
            <div className="card space-y-1">
              <p className="text-xs text-slate-400">
                Patients today (simulated)
              </p>
              <p className="text-2xl font-semibold text-emerald-400">
                18
              </p>
            </div>
            <div className="card space-y-1">
              <p className="text-xs text-slate-400">
                Avg. wait time
              </p>
              <p className="text-2xl font-semibold text-slate-50">
                09 min
              </p>
            </div>
            <div className="card space-y-1">
              <p className="text-xs text-slate-400">
                Returning patients
              </p>
              <p className="text-2xl font-semibold text-slate-50">
                72%
              </p>
            </div>
          </div>
        </div>

        <div className="card relative overflow-hidden">
          <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,_rgba(52,211,153,0.22),transparent_60%),radial-gradient(circle_at_bottom,_rgba(96,165,250,0.22),transparent_55%)] opacity-70" />
          <div className="relative space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-400">
              Live clinic snapshot
            </h2>
            <div className="space-y-3 text-xs">
              <div className="flex items-center justify-between rounded-xl bg-slate-900/70 px-3 py-2">
                <div>
                  <p className="font-medium text-slate-100">
                    Reception Queue
                  </p>
                  <p className="text-[11px] text-slate-400">
                    Waiting / In Progress / Completed
                  </p>
                </div>
                <div className="flex items-center gap-3 text-[11px]">
                  <span className="chip bg-amber-500/10 text-amber-300">
                    Waiting 4
                  </span>
                  <span className="chip bg-sky-500/10 text-sky-300">
                    In room 3
                  </span>
                  <span className="chip bg-emerald-500/10 text-emerald-300">
                    Done 11
                  </span>
                </div>
              </div>
              <div className="rounded-xl bg-slate-900/70 p-3">
                <div className="mb-2 flex items-center justify-between text-[11px] text-slate-400">
                  <p>Today&apos;s schedule</p>
                  <p>Simulated data</p>
                </div>
                <div className="space-y-2 text-xs">
                  <div className="flex items-center justify-between rounded-lg bg-slate-900/80 px-2 py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="pill bg-emerald-500/10 text-emerald-300">
                        #17
                      </span>
                      <span className="font-medium text-slate-100">
                        General Consultation
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Dr. Carter
                    </span>
                  </div>
                  <div className="flex items-center justify-between rounded-lg bg-slate-900/80 px-2 py-1.5">
                    <div className="flex items-center gap-2">
                      <span className="pill bg-sky-500/10 text-sky-300">
                        #18
                      </span>
                      <span className="font-medium text-slate-100">
                        Cardio Screening
                      </span>
                    </div>
                    <span className="text-[11px] text-slate-400">
                      Dr. Reyes
                    </span>
                  </div>
                </div>
              </div>
              <p className="text-[11px] text-slate-400">
                Behind this interface is a full clinic-grade CRM,
                doctor panel, admin analytics, payment tracking and
                Telegram-powered notifications.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section
        id="about"
        className="mt-14 grid gap-6 md:grid-cols-2"
      >
        <div className="card space-y-3">
          <h2 className="section-heading">About the clinic</h2>
          <p className="text-sm text-slate-300">
            A Klinic blends the warmth of a neighborhood practice
            with the discipline of a software product. Every visit,
            every prescription, every follow-up is tracked as clean
            structured data—so nothing falls through the cracks.
          </p>
          <p className="text-sm text-slate-300">
            Our internal CRM mirrors how real clinics work: reception
            manages queues and payments, doctors focus on medicine,
            and admins see live performance in a single view.
          </p>
        </div>
        <div className="card space-y-3">
          <h2 className="section-heading">Real-world workflow</h2>
          <ul className="space-y-2 text-sm text-slate-300">
            <li>• Walk-ins and online bookings handled in one queue</li>
            <li>• Patients identified by phone number across visits</li>
            <li>• Doctors see only their assigned patients</li>
            <li>• Follow-ups tracked and surfaced automatically</li>
            <li>• Receipts and payments tied to each visit</li>
          </ul>
        </div>
      </section>

      <section
        id="doctors"
        className="mt-14 space-y-5"
      >
        <h2 className="section-heading">Doctors</h2>
        <div className="grid gap-5 md:grid-cols-3">
          {doctors.map((doc) => (
            <article key={doc.name} className="card space-y-3">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-medium text-slate-50">
                    {doc.name}
                  </h3>
                  <p className="text-xs text-emerald-300">
                    {doc.specialty}
                  </p>
                </div>
                <span className="h-10 w-10 rounded-2xl bg-slate-800/90" />
              </div>
              <p className="text-sm text-slate-300">
                {doc.tagline}
              </p>
              <p className="text-xs text-slate-400">
                Every doctor works inside a dedicated panel that
                surfaces today&apos;s patients, visit history and
                follow-up schedule.
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="services"
        className="mt-14 space-y-5"
      >
        <h2 className="section-heading">Services</h2>
        <div className="grid gap-5 md:grid-cols-4">
          {services.map((service) => (
            <article key={service.name} className="card space-y-3">
              <div>
                <h3 className="font-medium text-slate-50">
                  {service.name}
                </h3>
                <p className="text-xs text-slate-400">
                  from {service.price}
                </p>
              </div>
              <p className="text-sm text-slate-300">
                {service.description}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section
        id="contact"
        className="mt-14 grid gap-6 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]"
      >
        <div className="card space-y-4">
          <h2 className="section-heading">Contact</h2>
          <div className="space-y-2 text-sm text-slate-300">
            <p>
              <span className="text-slate-400">Phone:</span>{" "}
              +1 (555) 012-3456
            </p>
            <p>
              <span className="text-slate-400">Email:</span>{" "}
              hello@aklinic.health
            </p>
            <p>
              <span className="text-slate-400">Address:</span> 24
              Aurora Avenue, New City
            </p>
          </div>
          <p className="text-xs text-slate-400">
            All booking confirmations, visit notifications and
            follow-up reminders are delivered via secure Telegram
            messages.
          </p>
        </div>
        <OnlineBookingCard />
      </section>
    </main>
  );
}

function OnlineBookingCard() {
  return (
    <section
      id="booking"
      className="card space-y-4 border-emerald-500/30 bg-gradient-to-b from-emerald-500/10 via-slate-900/80 to-slate-950"
    >
      <div className="flex items-center justify-between gap-2">
        <div>
          <h2 className="section-heading">Online Booking</h2>
          <p className="text-xs text-slate-300">
            Reserve a time slot—our reception will see it instantly.
          </p>
        </div>
        <span className="badge">Live → Reception CRM</span>
      </div>
      <BookingForm />
    </section>
  );
}

function BookingForm() {
  return (
    <form
      action="/api/booking"
      method="post"
      className="grid grid-cols-1 gap-3 text-sm md:grid-cols-2"
    >
      <div className="md:col-span-2">
        <label className="label">Full name</label>
        <input
          name="fullName"
          className="input"
          placeholder="Patient full name"
          required
        />
      </div>
      <div>
        <label className="label">Phone number</label>
        <input
          name="phone"
          className="input"
          placeholder="+1 (555) 012-3456"
          required
        />
      </div>
      <div>
        <label className="label">Preferred date & time</label>
        <input
          type="datetime-local"
          name="scheduledAt"
          className="input"
          required
        />
      </div>
      <div>
        <label className="label">Service</label>
        <select name="serviceId" className="input" defaultValue="">
          <option value="" disabled>
            Select a service
          </option>
          <option value="1">General Consultation</option>
          <option value="2">Executive Checkup</option>
          <option value="3">Cardio Screening</option>
          <option value="4">Teleconsultation</option>
        </select>
      </div>
      <div>
        <label className="label">Preferred doctor (optional)</label>
        <select name="doctorId" className="input" defaultValue="">
          <option value="">Any available</option>
          <option value="1">Dr. Amelia Carter</option>
          <option value="2">Dr. Noah Reyes</option>
          <option value="3">Dr. Lina Okafor</option>
        </select>
      </div>
      <div className="md:col-span-2 flex items-center justify-between gap-3 pt-2">
        <p className="text-xs text-slate-400">
          Your booking enters the same queue as walk-in patients.
          You&apos;ll receive a Telegram confirmation.
        </p>
        <button type="submit" className="btn-primary">
          Book appointment
        </button>
      </div>
    </form>
  );
}

