import { prisma } from "@/lib/prisma";
import { VisitStatus } from "@prisma/client";

export const dynamic = "force-dynamic";

export default async function TvQueueView() {
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
      service: true
    }
  });

  const waiting = visits.filter(
    (v) => v.status === VisitStatus.WAITING
  );
  const inProgress = visits.filter(
    (v) => v.status === VisitStatus.IN_PROGRESS
  );
  const completed = visits.filter(
    (v) => v.status === VisitStatus.COMPLETED
  );

  return (
    <main className="min-h-screen bg-slate-950 px-6 py-6 text-slate-50">
      <header className="mb-4 flex items-center justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.25em] text-emerald-400">
            A Klinic Queue
          </p>
          <h1 className="text-2xl font-semibold text-slate-50">
            Live Waiting Room
          </h1>
        </div>
        <p className="text-xs text-slate-400">
          Auto-refresh via page reload for TV mode
        </p>
      </header>
      <section className="tv-grid text-sm">
        <div className="glass-panel p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-amber-300">
            Waiting
          </h2>
          <div className="space-y-2">
            {waiting.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-xl bg-slate-900/90 px-3 py-2"
              >
                <p className="text-lg font-semibold text-slate-50">
                  {v.queueNumber.toString().padStart(3, "0")}
                </p>
                <div className="text-right text-xs text-slate-300">
                  <p>{v.patient.fullName}</p>
                  <p className="text-[11px] text-slate-500">
                    {v.service?.name ?? "Visit"}
                  </p>
                </div>
              </div>
            ))}
            {waiting.length === 0 && (
              <p className="text-xs text-slate-500">
                No patients waiting.
              </p>
            )}
          </div>
        </div>

        <div className="glass-panel p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-sky-300">
            In Progress
          </h2>
          <div className="space-y-2">
            {inProgress.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-xl bg-slate-900/90 px-3 py-2"
              >
                <p className="text-lg font-semibold text-slate-50">
                  {v.queueNumber.toString().padStart(3, "0")}
                </p>
                <div className="text-right text-xs text-slate-300">
                  <p>{v.patient.fullName}</p>
                  <p className="text-[11px] text-slate-500">
                    {v.doctor
                      ? `Dr. ${v.doctor.name}`
                      : "Doctor"}
                  </p>
                </div>
              </div>
            ))}
            {inProgress.length === 0 && (
              <p className="text-xs text-slate-500">
                No patients in rooms.
              </p>
            )}
          </div>
        </div>

        <div className="glass-panel p-4">
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-emerald-300">
            Completed
          </h2>
          <div className="space-y-2">
            {completed.map((v) => (
              <div
                key={v.id}
                className="flex items-center justify-between rounded-xl bg-slate-900/90 px-3 py-2"
              >
                <p className="text-lg font-semibold text-slate-50">
                  {v.queueNumber.toString().padStart(3, "0")}
                </p>
                <div className="text-right text-xs text-slate-300">
                  <p>{v.patient.fullName}</p>
                  <p className="text-[11px] text-slate-500">
                    {v.service?.name ?? "Visit"}
                  </p>
                </div>
              </div>
            ))}
            {completed.length === 0 && (
              <p className="text-xs text-slate-500">
                No completed visits yet.
              </p>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

