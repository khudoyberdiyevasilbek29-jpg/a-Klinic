import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Role, VisitStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function DoctorDashboard() {
  const user = await requireRole([Role.DOCTOR]);

  const doctor = await prisma.doctor.findFirst({
    where: { userId: user.id }
  });

  if (!doctor) {
    return (
      <main className="flex min-h-screen items-center justify-center px-4">
        <p className="text-sm text-slate-300">
          No doctor profile is associated with this account.
        </p>
      </main>
    );
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const visits = await prisma.visit.findMany({
    where: {
      doctorId: doctor.id,
      createdAt: {
        gte: today
      }
    },
    orderBy: { queueNumber: "asc" },
    include: {
      patient: true,
      service: true,
      treatments: {
        include: { services: true }
      }
    }
  });

  const followUps = await prisma.visit.findMany({
    where: {
      doctorId: doctor.id,
      followUpDate: {
        gte: today
      }
    },
    orderBy: { followUpDate: "asc" },
    include: {
      patient: true
    }
  });

  return (
    <main className="mx-auto flex min-h-screen max-w-6xl flex-col gap-6 px-4 pb-10 pt-8">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-sky-400">
            Doctor Panel
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">
            Dr. {doctor.name}
          </h1>
          <p className="text-xs text-slate-400">
            Today&apos;s assigned patients, their records and
            follow-ups.
          </p>
        </div>
      </header>

      <section className="grid gap-5 md:grid-cols-[minmax(0,3fr)_minmax(0,2fr)]">
        <div className="card space-y-4">
          <h2 className="section-heading">Today&apos;s patients</h2>
          <div className="space-y-2 text-xs">
            {visits.map((visit) => (
              <article
                key={visit.id}
                className="space-y-2 rounded-xl bg-slate-900/70 p-3"
              >
                <div className="flex items-center justify-between gap-2">
                  <div>
                    <p className="text-sm font-medium text-slate-50">
                      #{visit.queueNumber.toString().padStart(3, "0")} ·{" "}
                      {visit.patient.fullName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {visit.service?.name ?? "Service not set"} ·{" "}
                      {visit.patient.phone}
                    </p>
                  </div>
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
                      "In Room"}
                    {visit.status === VisitStatus.COMPLETED &&
                      "Completed"}
                  </span>
                </div>
                <DoctorVisitForm visitId={visit.id} />
                {visit.treatments.length > 0 && (
                  <div className="mt-2 border-t border-slate-800 pt-2 text-[11px] text-slate-300">
                    <p className="mb-1 text-[10px] font-semibold uppercase tracking-wide text-slate-500">
                      Treatments this visit
                    </p>
                    <ul className="space-y-1">
                      {visit.treatments.map((t) => (
                        <li key={t.id}>
                          {t.description}
                          {t.services.length > 0 && (
                            <span className="text-slate-500">
                              {" "}
                              ·{" "}
                              {t.services
                                .map((s) => s.name)
                                .join(", ")}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </article>
            ))}
            {visits.length === 0 && (
              <p className="text-xs text-slate-400">
                No assigned patients today.
              </p>
            )}
          </div>
        </div>

        <div className="space-y-4">
          <div className="card space-y-3">
            <h2 className="section-heading">Upcoming follow-ups</h2>
            <div className="space-y-2 text-xs">
              {followUps.map((visit) => (
                <div
                  key={visit.id}
                  className="flex items-center justify-between rounded-xl bg-slate-900/80 px-3 py-2"
                >
                  <div>
                    <p className="font-medium text-slate-100">
                      {visit.patient.fullName}
                    </p>
                    <p className="text-[11px] text-slate-400">
                      {visit.patient.phone}
                    </p>
                  </div>
                  <div className="text-right text-[11px] text-slate-300">
                    <p>
                      {visit.followUpDate
                        ? new Date(
                            visit.followUpDate
                          ).toLocaleDateString()
                        : null}
                    </p>
                  </div>
                </div>
              ))}
              {followUps.length === 0 && (
                <p className="text-xs text-slate-400">
                  No scheduled follow-ups.
                </p>
              )}
            </div>
          </div>
          <div className="card space-y-3">
            <h2 className="section-heading">Patient history</h2>
            <p className="text-xs text-slate-400">
              From the doctor panel, you can open any patient&apos;s
              historical visits, diagnoses, treatments and services,
              all keyed by phone number.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
}

function DoctorVisitForm({ visitId }: { visitId: number }) {
  return (
    <form
      method="post"
      action={`/api/doctor/visits/${visitId}`}
      className="grid grid-cols-1 gap-2 text-xs md:grid-cols-2"
    >
      <input type="hidden" name="visitId" value={visitId} />
      <div className="md:col-span-2">
        <label className="label">Diagnosis</label>
        <textarea
          name="diagnosis"
          className="input min-h-[60px]"
          placeholder="Short diagnosis..."
        />
      </div>
      <div className="md:col-span-2">
        <label className="label">Treatment & notes</label>
        <textarea
          name="treatmentNotes"
          className="input min-h-[60px]"
          placeholder="Suggested treatment, medication, lifestyle notes..."
        />
      </div>
      <div>
        <label className="label">Status</label>
        <select name="status" className="input">
          <option value="WAITING">Waiting</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>
      <div>
        <label className="label">Follow-up date</label>
        <input
          type="date"
          name="followUpDate"
          className="input"
        />
      </div>
      <div className="md:col-span-2 pt-1">
        <button
          type="submit"
          className="btn-ghost w-full justify-center"
        >
          Save visit
        </button>
      </div>
    </form>
  );
}

