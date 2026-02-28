import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Role, PaymentStatus } from "@prisma/client";
import { sendTelegramMessage } from "@/lib/telegram";

export async function POST(req: NextRequest) {
  await requireRole([Role.RECEPTION, Role.ADMIN]);

  const formData = await req.formData();

  const fullName = String(formData.get("fullName") ?? "").trim();
  const phone = String(formData.get("phone") ?? "").trim();
  const serviceIdRaw = formData.get("serviceId");
  const doctorIdRaw = formData.get("doctorId");
  const paymentStatusRaw =
    (formData.get("paymentStatus") as PaymentStatus | null) ??
    "UNPAID";

  if (!fullName || !phone || !serviceIdRaw) {
    return NextResponse.json(
      { error: "Missing required fields" },
      { status: 400 }
    );
  }

  const patient = await prisma.patient.upsert({
    where: { phone },
    update: { fullName },
    create: {
      fullName,
      phone
    }
  });

  const serviceId = Number(serviceIdRaw);
  const doctorId = doctorIdRaw ? Number(doctorIdRaw) : null;

  const service = await prisma.service.findUnique({
    where: { id: serviceId }
  });

  if (!service) {
    return NextResponse.json(
      { error: "Service not found" },
      { status: 400 }
    );
  }

  const maxQueue = await prisma.visit.aggregate({
    _max: { queueNumber: true }
  });
  const queueNumber = (maxQueue._max.queueNumber ?? 0) + 1;

  const visit = await prisma.visit.create({
    data: {
      patientId: patient.id,
      doctorId: doctorId ?? undefined,
      serviceId,
      queueNumber
    },
    include: {
      doctor: true,
      service: true
    }
  });

  if (paymentStatusRaw === "PAID") {
    await prisma.payment.create({
      data: {
        visitId: visit.id,
        amount: service.price,
        status: PaymentStatus.PAID
      }
    });
  } else {
    await prisma.payment.create({
      data: {
        visitId: visit.id,
        amount: service.price,
        status: PaymentStatus.UNPAID
      }
    });
  }

  await sendTelegramMessage(
    [
      "✅ <b>Visit registered</b>",
      `Patient: ${patient.fullName}`,
      `Phone: ${patient.phone}`,
      `Service: ${service.name}`,
      `Doctor: ${
        visit.doctor ? `Dr. ${visit.doctor.name}` : "Not assigned"
      }`,
      `Queue #${visit.queueNumber.toString().padStart(3, "0")}`,
      `Payment: ${
        paymentStatusRaw === "PAID" ? "Paid" : "Unpaid"
      }`
    ].join("\n")
  );

  return NextResponse.redirect(
    new URL("/reception", req.url),
    303
  );
}

export async function GET() {
  const visits = await prisma.visit.findMany({
    include: {
      patient: true,
      doctor: true,
      service: true,
      payment: true
    }
  });

  return NextResponse.json({ visits });
}

