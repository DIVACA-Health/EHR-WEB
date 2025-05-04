// /app/api/v1/vitals/route.js

export async function GET() {
    const vitals = [
      {
        date: "18-04-2025",
        heartRate: 89,
        bloodPressure: "120/80",
        temperature: 98.6,
        weight: 78,
        recordedBy: "Nurse Fayo Martins"
      },
      // Duplicate for demo purposes
      ...Array(7).fill({
        date: "18-04-2025",
        heartRate: 89,
        bloodPressure: "120/80",
        temperature: 98.6,
        weight: 78,
        recordedBy: "Nurse Fayo Martins"
      }),
    ];
  
    return new Response(JSON.stringify(vitals), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  }
  