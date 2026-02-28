import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function AdminDashboard() {
  await requireRole([Role.ADMIN]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [patientsToday, visitsToday, revenueToday, topDoctors, topServices] =
    await Promise.all([
      prisma.patient.count({
        where: {
          visits: {
            some: {
              createdAt: { gte: today }
            }
          }
        }
      }),
      prisma.visit.count({
        where: {
          createdAt: { gte: today }
        }
      }),
      prisma.payment.aggregate({
        _sum: { amount: true },
        where: {
          status: "PAID",
          createdAt: { gte: today }
        }
      }),
      prisma.visit.groupBy({
        by: ["doctorId"],
        where: {
          doctorId: { not: null },
          createdAt: { gte: today }
        },
        _count: { _all: true },
        orderBy: { _count: { _all: "desc" } },
        take: 5
      }),
      prisma.visit.groupBy({
        by: ["serviceId"],
        where: {
          serviceId: { not: null },
          createdAt: { gte: today }
        },
        _count: { _all: true },
        orderBy: { _count: { _all: "desc" } },
        take: 5
      })
    ]);

  const doctorMap = await prisma.doctor.findMany();
  const serviceMap = await prisma.service.findMany();

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 pb-10 pt-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-fuchsia-400">
            Admin Dashboard
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">
            Clinic Control Center
          </h1>
          <p className="text-xs text-slate-400">
            Manage doctors, services and live performance analytics.
          </p>
        </div>
      </header>

      <section className="grid gap-4 md:grid-cols-4">
        <div className="card space-y-1">
          <p className="text-xs text-slate-400">Patients today</p>
          <p className="text-2xl font-semibold text-slate-50">
            {patientsToday}
          </p>
        </div>
        <div className="card space-y-1">
          <p className="text-xs text-slate-400">Visits today</p>
          <p className="text-2xl font-semibold text-slate-50">
            {visitsToday}
          </p>
        </div>
        <div className="card space-y-1">
          <p className="text-xs text-slate-400">Revenue today</p>
          <p className="text-2xl font-semibold text-emerald-400">
            $
            {(
              (revenueToday._sum.amount ?? 0) / 100
            ).toFixed(2)}
          </p>
        </div>
        <div className="card space-y-1">
          <p className="text-xs text-slate-400">Doctors on duty</p>
          <p className="text-2xl font-semibold text-slate-50">
            {doctorMap.length}
          </p>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="card space-y-3">
          <h2 className="section-heading">Top doctors today</h2>
          <div className="space-y-2 text-xs">
            {topDoctors.map((row) => {
              const doc = doctorMap.find((d) => d.id === row.doctorId);
              if (!doc) return null;
              return (
                <div
                  key={doc.id}
                  className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-slate-100">
                      {doc.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {doc.specialty ?? "Doctor"}
                    </p>
                  </div>
                  <p className="text-xs text-emerald-300">
                    {row._count._all} visits
                  </p>
                </div>
              );
            })}
            {topDoctors.length === 0 && (
              <p className="text-xs text-slate-400">
                No visits recorded today.
              </p>
            )}
          </div>
        </div>
        <div className="card space-y-3">
          <h2 className="section-heading">Most requested services</h2>
          <div className="space-y-2 text-xs">
            {topServices.map((row) => {
              const service = serviceMap.find(
                (s) => s.id === row.serviceId
              );
              if (!service) return null;
              return (
                <div
                  key={service.id}
                  className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-slate-100">
                      {service.name}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      ${service.price / 100}
                    </p>
                  </div>
                  <p className="text-xs text-sky-300">
                    {row._count._all} visits
                  </p>
                </div>
              );
            })}
            {topServices.length === 0 && (
              <p className="text-xs text-slate-400">
                No services used today.
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="grid gap-5 md:grid-cols-2">
        <div className="card space-y-3">
          <h2 className="section-heading">Manage doctors</h2>
          <p className="text-xs text-slate-400">
            In a production deployment, this section would allow CRUD
            operations on doctor profiles and logins. In this
            showcase, doctors are seeded via the database.
          </p>
        </div>
        <div className="card space-y-3">
          <h2 className="section-heading">Manage services</h2>
          <p className="text-xs text-slate-400">
            Service catalog is also maintained via the database.
            Prices feed directly into the payment and analytics
            system.
          </p>
        </div>
      </section>
    </main>
  );
}

