import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.41.1";

type ReservaPayload = {
  cliente_id: string;
  profesional_id: string;
  servicio_id: string;
  fecha: string;
  estado?: string;
  notas?: string;
};

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
};

const supabaseUrl = Deno.env.get("SUPABASE_URL");
const serviceRoleKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

if (!supabaseUrl || !serviceRoleKey) {
  console.error(
    "Environment variables SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY are required.",
  );
}

const supabase = createClient(supabaseUrl ?? "", serviceRoleKey ?? "", {
  auth: {
    persistSession: false,
  },
});

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  if (req.method !== "POST") {
    return new Response(
      JSON.stringify({ error: "method_not_allowed" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 405,
      },
    );
  }

  let body: ReservaPayload;
  try {
    body = (await req.json()) as ReservaPayload;
  } catch (_error) {
    return new Response(
      JSON.stringify({ error: "invalid_json" }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      },
    );
  }

  const requiredFields: Array<keyof ReservaPayload> = [
    "cliente_id",
    "profesional_id",
    "servicio_id",
    "fecha",
  ];
  const missingFields = requiredFields.filter(
    (field) => !body[field] || body[field] === "",
  );

  if (missingFields.length > 0) {
    return new Response(
      JSON.stringify({
        error: "missing_fields",
        details: missingFields,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      },
    );
  }

  let fechaIso: string;
  try {
    const fechaParsed = new Date(body.fecha);
    if (Number.isNaN(fechaParsed.getTime())) {
      throw new Error("Invalid date");
    }
    fechaIso = fechaParsed.toISOString();
  } catch (_error) {
    return new Response(
      JSON.stringify({
        error: "invalid_fecha",
        details: "Fecha must be a valid date string.",
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      },
    );
  }

  const estado = body.estado?.trim() || "pendiente";
  const notas = body.notas?.trim() ?? null;

  const { data, error } = await supabase
    .from("reservas")
    .insert({
      cliente_id: body.cliente_id,
      profesional_id: body.profesional_id,
      servicio_id: body.servicio_id,
      fecha: fechaIso,
      estado,
      notas,
    })
    .select()
    .single();

  if (error) {
    console.error("Error inserting reserva:", error);
    return new Response(
      JSON.stringify({
        error: "insert_failed",
        details: error.message,
      }),
      {
        headers: {
          ...corsHeaders,
          "Content-Type": "application/json",
        },
        status: 400,
      },
    );
  }

  return new Response(
    JSON.stringify({
      message: "Reserva creada exitosamente.",
      reserva: data,
    }),
    {
      headers: {
        ...corsHeaders,
        "Content-Type": "application/json",
      },
      status: 201,
    },
  );
});
