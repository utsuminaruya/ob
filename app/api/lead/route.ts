import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL as string,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY as string
);

export async function POST(req: Request) {
  try {
    const data = await req.json();

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
