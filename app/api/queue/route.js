export async function GET() {
  const users = [
    {
      name: "Jasmine Adewale",
      divacaId: "DH-694857",
      matricNumber: "140378926",
      status: "Waiting",
      lastVisit: "24-02-2025",
      phoneNumber : "09037976718",
      age: "50",
      email: "jA@gmail.com",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      name: "Tolu Bamidele",
      divacaId: "DH-123456",
      matricNumber: "190283746",
      status: "In consultation",
      lastVisit: "20-01-2025",
      phoneNumber : "09037976718",
      age: "50",
      email: "TB@gmail.com",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
    {
      name: "Ada Umeh",
      divacaId: "DH-789456",
      matricNumber: "120394857",
      status: "Returned to health attendant",
      lastVisit: "12-03-2025",
      phoneNumber : "09037976718",
      age: "50",
      email: "AU@gmail.com",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
  ];

  return new Response(JSON.stringify(users), {
    status: 200,
    headers: {
      'Content-Type': 'application/json',
    },
  });
}
