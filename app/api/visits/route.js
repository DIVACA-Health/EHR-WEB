// app/api/visits/route.js
export async function GET() {
    const mockData = [
      { week: 'Week 1', visits: 280 },
      { week: 'Week 2', visits: 990 },
      { week: 'Week 3', visits: 500 },
      { week: 'Week 4', visits: 850 },
    ];
  
    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  