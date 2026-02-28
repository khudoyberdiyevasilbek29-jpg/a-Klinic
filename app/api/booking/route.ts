import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  const formData = await req.formData();

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const serviceIdRaw = formData.get("serviceId");
  const doctorIdRaw = formData.get("doctorId");
  const scheduledAtRaw = formData.get("scheduledAt");

  if (!fullName || !phone || !scheduledAtRaw) {
    return NextResponse.redirect(
      new URL("/", req.url),
      303
    );
  }

  const scheduledAt = new Date(String(scheduledAtRaw));
  const serviceId = serviceIdRaw ? Number(serviceIdRaw) : null;
  const doctorId = doctorIdRaw ? Number(doctorIdRaw) : null;

  const patient = await prisma.patient.upsert({
    where: { phone },
    update: { fullName },
    create: {
      fullName,
      phone
    }
  });

  const maxQueue = await prisma.visit.aggregate({
    _max: { queueNumber: true }
  });
  const queueNumber = (maxQueue._max.queueNumber ?? 0) + 1;

  const visit = await prisma.visit.create({
    data: {
      patientId: patient.id,
      doctorId: doctorId ?? undefined,
      serviceId: serviceId ?? undefined,
      bookedOnline: true,
      scheduledAt,
      queueNumber
    },
    include: {
      doctor: true,
      service: true
    }
  });

  await sendTelegramMessage(
    [
      "📅 <b>New online booking</b>",
      `Patient: ${patient.fullName}`,
      `Phone: ${patient.phone}`,
      `Service: ${visit.service?.name ?? "Clinic visit"}`,
      `Doctor: ${
        visit.doctor ? `Dr. ${visit.doctor.name}` : "Any available"
      }`,
      `Scheduled: ${scheduledAt.toLocaleString()}`,
      `Queue #${visit.queueNumber.toString().padStart(3, "0")}`
    ].join("\n")
  );

  return NextResponse.redirect(
    new URL("/", req.url),
    303
  );
}

