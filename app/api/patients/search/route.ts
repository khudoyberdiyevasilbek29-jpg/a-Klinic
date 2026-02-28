import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET(req: NextRequest) {
  const url = new URL(req.url);
  const phone = url.searchParams.get("phone")?.trim();

  if (!phone) {
    return NextResponse.json(
      { error: "Phone number required" },
      { status: 400 }
    );
  }

  const patient = await prisma.patient.findUnique({
    where: { phone },
    include: {
      visits: {
        orderBy: { createdAt: "desc" },
        include: {
          doctor: true,
          service: true,
          payment: true
        }
      }
    }
  });

  return NextResponse.json({ patient });
}

