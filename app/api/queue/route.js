export async function GET() {
    const queueData = [
      { firstName: 'Jasmine', lastName: 'Adewale', time: '8:09 AM' },
      { firstName: 'Michael', lastName: 'Smith', time: '9:15 AM' },
      { firstName: 'Lola', lastName: 'Okoro', time: '10:30 AM' }
    ];
  
    return Response.json(queueData);
  }
  