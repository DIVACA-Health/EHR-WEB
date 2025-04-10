// app/api/health-complaints/route.js

export async function GET() {
    const data = [
      { name: 'Malaria', value: 870, color: '#3B82F6' },   // Blue
      { name: 'Headache', value: 550, color: '#F59E0B' },  // Orange
      { name: 'Typhoid', value: 300, color: '#8B5CF6' },   // Purple
      { name: 'Covid', value: 90, color: '#EF4444' },      // Red
      { name: 'Fever', value: 690, color: '#1E3A8A' }      // Dark blue
    ];
  
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }
  