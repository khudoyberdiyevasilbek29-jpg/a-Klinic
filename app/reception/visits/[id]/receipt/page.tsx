import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";
import { notFound } from "next/navigation";

type Props = {
  params: { id: string };
};

export default async function ReceiptPage({ params }: Props) {
  await requireRole([Role.RECEPTION, Role.ADMIN, Role.DOCTOR]);

  const id = Number(params.id);
  if (Number.isNaN(id)) notFound();

  const visit = await prisma.visit.findUnique({
    where: { id },
    include: {
      patient: true,
      doctor: true,
      service: true,
      payment: true
    }
  });

  if (!visit) notFound();

  return (
    <main className="mx-auto max-w-xl bg-white px-6 py-8 text-slate-900 print:px-0 print:py-0">
      <div className="no-print mb-4 flex justify-between text-xs text-slate-500">
        <p>Visit receipt preview</p>
        <button
          onClick={() => window.print()}
          className="rounded-full border border-slate-300 px-3 py-1 text-xs"
        >
          Print / Save as PDF
        </button>
      </div>
      <div className="border border-slate-200 p-6 text-sm leading-relaxed">
        <header className="mb-6 flex items-start justify-between">
          <div>
            <h1 className="text-lg font-semibold text-slate-900">
              A Klinic
            </h1>
            <p className="text-xs text-slate-500">
              24 Aurora Avenue, New City
            </p>
            <p className="text-xs text-slate-500">
              +1 (555) 012-3456 · hello@aklinic.health
            </p>
          </div>
          <div className="text-right text-xs text-slate-600">
            <p>
              <span className="font-medium">Visit #</span>{" "}
              {visit.id}
            </p>
            <p>
              <span className="font-medium">Queue</span>{" "}
              {visit.queueNumber.toString().padStart(3, "0")}
            </p>
            <p>
              <span className="font-medium">Date</span>{" "}
              {new Date(visit.createdAt).toLocaleString()}
            </p>
          </div>
        </header>

        <section className="mb-4 grid grid-cols-2 gap-4">
          <div>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Patient
            </h2>
            <p className="font-medium text-slate-900">
              {visit.patient.fullName}
            </p>
            <p className="text-xs text-slate-600">
              {visit.patient.phone}
            </p>
          </div>
          <div>
            <h2 className="mb-1 text-xs font-semibold uppercase tracking-wide text-slate-500">
              Doctor
            </h2>
            <p className="font-medium text-slate-900">
              {visit.doctor
                ? `Dr. ${visit.doctor.name}`
                : "Not assigned"}
            </p>
            <p className="text-xs text-slate-600">
              {visit.service?.name ?? "Service not set"}
            </p>
          </div>
        </section>

        <section className="mb-4">
          <h2 className="mb-2 text-xs font-semibold uppercase tracking-wide text-slate-500">
            Services
          </h2>
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-slate-200 text-left">
                <th className="pb-1">Description</th>
                <th className="pb-1 text-right">Amount</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-1">
                  {visit.service?.name ?? "Clinic visit"}
                </td>
                <td className="py-1 text-right">
                  $
                  {visit.payment
                    ? (visit.payment.amount / 100).toFixed(2)
                    : "0.00"}
                </td>
              </tr>
            </tbody>
          </table>
        </section>

        <section className="mb-4 flex justify-end text-xs">
          <div className="w-1/2 space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Total</span>
              <span className="font-semibold text-slate-900">
                $
                {visit.payment
                  ? (visit.payment.amount / 100).toFixed(2)
                  : "0.00"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Payment status</span>
              <span className="font-semibold text-slate-900">
                {visit.payment?.status === "PAID"
                  ? "Paid"
                  : "Unpaid"}
              </span>
            </div>
          </div>
        </section>

        <section className="mt-6 border-t border-slate-200 pt-3 text-xs text-slate-500">
          <p>
            Thank you for choosing A Klinic. This document acts as
            both a visit summary and a receipt. Please bring it
            with you to any follow-up visits.
          </p>
        </section>
      </div>
    </main>
  );
}

