import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Role, VisitStatus, PaymentStatus } from "@prisma/client";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function ReceptionDashboard() {
  await requireRole([Role.RECEPTION, Role.ADMIN]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const visits = await prisma.visit.findMany({
    where: {
      createdAt: {
        gte: today
      }
    },
    orderBy: { queueNumber: "asc" },
    include: {
      patient: true,
      doctor: true,
      service: true,
      payment: true
    }
  });

  const nextQueueNumber =
    (await prisma.visit.aggregate({
      _max: { queueNumber: true }
    }))._max.queueNumber ?? 0;

  const services = await prisma.service.findMany({
    where: { active: true },
    orderBy: { name: "asc" }
  });

  const doctors = await prisma.doctor.findMany({
    orderBy: { name: "asc" }
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 pb-10 pt-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-emerald-400">
            Reception CRM
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">
            Front Desk Workflow
          </h1>
          <p className="text-xs text-slate-400">
            Register patients, assign services and doctors, manage
            queue and payments.
          </p>
        </div>
        <div className="flex items-center gap-3 text-xs text-slate-300">
          <Link href="/" className="btn-ghost">
            Public Site
          </Link>
          <Link href="/tv" className="btn-ghost">
            TV Queue View
          </Link>
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="card space-y-4">
          <h2 className="section-heading">Today&apos;s queue</h2>
          <div className="flex flex-wrap gap-3 text-xs text-slate-300">
            <span className="pill bg-emerald-500/10 text-emerald-300">
              Waiting{" "}
              {
                visits.filter(
                  (v) => v.status === VisitStatus.WAITING
                ).length
              }
            </span>
            <span className="pill bg-sky-500/10 text-sky-300">
              In progress{" "}
              {
                visits.filter(
                  (v) => v.status === VisitStatus.IN_PROGRESS
                ).length
              }
            </span>
            <span className="pill bg-slate-700/70 text-slate-200">
              Completed{" "}
              {
                visits.filter(
                  (v) => v.status === VisitStatus.COMPLETED
                ).length
              }
            </span>
          </div>
          <div className="space-y-2 text-xs">
            {visits.map((visit) => (
              <article
                key={visit.id}
                className="flex items-center justify-between gap-3 rounded-xl bg-slate-900/70 px-3 py-2.5"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    <span className="pill bg-slate-800/90 text-slate-100">
                      #{visit.queueNumber.toString().padStart(3, "0")}
                    </span>
                    <p className="font-medium text-slate-50">
                      {visit.patient.fullName}
                    </p>
                  </div>
                  <p className="text-[11px] text-slate-400">
                    {visit.service?.name ?? "Service not set"} ·{" "}
                    {visit.doctor
                      ? `Dr. ${visit.doctor.name}`
                      : "Doctor not assigned"}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 text-[11px] text-slate-300">
                  <span
                    className={
                      visit.status === VisitStatus.WAITING
                        ? "chip bg-amber-500/10 text-amber-300"
                        : visit.status === VisitStatus.IN_PROGRESS
                        ? "chip bg-sky-500/10 text-sky-300"
                        : "chip bg-emerald-500/10 text-emerald-300"
                    }
                  >
                    {visit.status === VisitStatus.WAITING &&
                      "Waiting"}
                    {visit.status === VisitStatus.IN_PROGRESS &&
                      "In Progress"}
                    {visit.status === VisitStatus.COMPLETED &&
                      "Completed"}
                  </span>
                  <span
                    className={
                      visit.payment?.status === PaymentStatus.PAID
                        ? "text-emerald-300"
                        : "text-amber-300"
                    }
                  >
                    {visit.payment?.status === PaymentStatus.PAID
                      ? "Paid"
                      : "Unpaid"}
                  </span>
                  <Link
                    href={`/reception/visits/${visit.id}/receipt`}
                    className="text-[11px] text-sky-300 hover:underline"
                  >
                    Printable check
                  </Link>
                </div>
              </article>
            ))}
            {visits.length === 0 && (
              <p className="text-xs text-slate-400">
                No visits yet today. The next patient will receive
                queue number {nextQueueNumber + 1}.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card space-y-3">
            <h2 className="section-heading">Register new visit</h2>
            <p className="text-xs text-slate-400">
              Search by phone number. If the patient exists, their
              record will be reused; otherwise a new patient will be
              created. Each visit receives its own queue number,
              doctor, service and payment.
            </p>
            <form
              method="post"
              action="/api/reception/visits"
              className="space-y-3 text-sm"
            >
              <div>
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
                <label className="label">Service</label>
                <select
                  name="serviceId"
                  className="input"
                  defaultValue=""
                  required
                >
                  <option value="" disabled>
                    Select service
                  </option>
                  {services.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Doctor</label>
                <select
                  name="doctorId"
                  className="input"
                  defaultValue=""
                >
                  <option value="">Assign later</option>
                  {doctors.map((d) => (
                    <option key={d.id} value={d.id}>
                      {d.name}
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="label">Payment status</label>
                <select
                  name="paymentStatus"
                  className="input"
                  defaultValue="UNPAID"
                >
                  <option value="PAID">Paid</option>
                  <option value="UNPAID">Unpaid</option>
                </select>
              </div>
              <button
                type="submit"
                className="btn-primary w-full justify-center"
              >
                Register visit
              </button>
            </form>
          </div>
          <div className="card space-y-3">
            <h2 className="section-heading">Find patient by phone</h2>
            <form
              method="get"
              action="/api/patients/search"
              className="flex gap-3 text-sm"
            >
              <input
                name="phone"
                className="input"
                placeholder="Enter phone number"
                required
              />
              <button
                type="submit"
                className="btn-ghost whitespace-nowrap"
              >
                Open history
              </button>
            </form>
            <p className="text-xs text-slate-400">
              The full visit history, treatments, services and
              follow-up dates for this phone number are available
              through the shared patient record.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

