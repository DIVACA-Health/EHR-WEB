// app/api/visits/route.js
export async function GET() {
    const mockData = [
      { week: 'Week 1', visits: 280 },
      { week: 'Week 2', visits: 200 },
      { week: 'Week 3', visits: 900 },
      { week: 'Week 4', visits: 300 },
      { week: 'Week 5', visits: 590 },
      { week: 'Week 6', visits: 1000 },
      { week: 'Week 7', visits: 810 },
    ];
  
    return new Response(JSON.stringify(mockData), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  }
  