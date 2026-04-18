import { NextResponse } from "next/server";

export async function POST() {
  return NextResponse.json({
    success: true,
    adminPasswordValue: process.env.ADMIN_PASSWORD || null,
    hasAdminPassword: Boolean(process.env.ADMIN_PASSWORD),
    nodeEnv: process.env.NODE_ENV || null,
  });
}