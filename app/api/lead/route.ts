import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(req: Request) {
  try {
    const data = await req.json();

    console.log("SUPABASE_URL:", process.env.NEXT_PUBLIC_SUPABASE_URL);
    console.log("SUPABASE_KEY exists:", !!process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY);

    const { error } = await supabase
      .from("leads")
      .insert([
        {
          name: data.contact?.name,
          email: data.contact?.email,
          phone: data.contact?.phone,
          jlpt: data.jlpt,
          location: data.location,
          payload: data,
        },
      ]);

    if (error) throw error;

    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error("Supabase insert error:", err.message);
    return NextResponse.json({ ok: false, error: err.message }, { status: 500 });
  }
}
