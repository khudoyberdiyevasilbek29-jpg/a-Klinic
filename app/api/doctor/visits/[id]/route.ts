import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Role, VisitStatus } from "@prisma/client";
import { sendTelegramMessage } from "@/lib/telegram";

type Params = {
  params: { id: string };
};

export async function POST(req: NextRequest, { params }: Params) {
  const user = await requireRole([Role.DOCTOR]);

  const id = Number(params.id);
  if (Number.isNaN(id)) {
    return NextResponse.json(
      { error: "Invalid visit id" },
      { status: 400 }
    );
  }

  const doctor = await prisma.doctor.findFirst({
    where: { userId: user.id }
  });
  if (!doctor) {
    return NextResponse.json(
      { error: "Doctor profile not found" },
      { status: 400 }
    );
  }

  const formData = await req.formData();
  const diagnosis = String(formData.get("diagnosis") ?? "").trim();
  const treatmentNotes = String(
    formData.get("treatmentNotes") ?? ""
  ).trim();
  const statusRaw = String(formData.get("status") ?? "");
  const followUpDateRaw = String(
    formData.get("followUpDate") ?? ""
  );

  const data: {
    diagnosis?: string;
    treatmentNotes?: string;
    status?: VisitStatus;
    followUpDate?: Date | null;
  } = {};

  if (diagnosis) data.diagnosis = diagnosis;
  if (treatmentNotes) data.treatmentNotes = treatmentNotes;
  if (statusRaw && statusRaw in VisitStatus) {
    data.status = statusRaw as VisitStatus;
  }
  if (followUpDateRaw) {
    data.followUpDate = new Date(followUpDateRaw);
  }

  const visit = await prisma.visit.update({
    where: { id, doctorId: doctor.id },
    data,
    include: {
      patient: true
    }
  });

  if (data.followUpDate) {
    await sendTelegramMessage(
      [
        "📌 <b>Follow-up scheduled</b>",
        `Patient: ${visit.patient.fullName}`,
        `Phone: ${visit.patient.phone}`,
        `Doctor: Dr. ${doctor.name}`,
        `Date: ${data.followUpDate.toLocaleDateString()}`
      ].join("\n")
    );
  }

  return NextResponse.redirect(
    new URL("/doctor", req.url),
    303
  );
}

