import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireRole } from "@/lib/auth";
import { Role } from "@prisma/client";

export async function GET() {
  await requireRole([Role.ADMIN]);

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [patientsToday, visitsToday, revenueToday] =
    await Promise.all([
      prisma.patient.count({
        where: {
          visits: { some: { createdAt: { gte: today } } }
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
      })
    ]);

  return NextResponse.json({
    patientsToday,
    visitsToday,
    revenueToday: (revenueToday._sum.amount ?? 0) / 100
  });
}

