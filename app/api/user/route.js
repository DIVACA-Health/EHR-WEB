export async function GET() {
  const users = [
    {
      name: "Jasmine Adewale",
      divacaId: "DH-694857",
      matricNumber: "140378926",
      status: "Active",
      lastVisit: "24-02-2025",
      avatar: "https://i.pravatar.cc/100?img=1",
    },
    {
      name: "Tolu Bamidele",
      divacaId: "DH-123456",
      matricNumber: "190283746",
      status: "Inactive",
      lastVisit: "20-01-2025",
      avatar: "https://i.pravatar.cc/100?img=2",
    },
    {
      name: "Ada Umeh",
      divacaId: "DH-789456",
      matricNumber: "120394857",
      status: "Active",
      lastVisit: "12-03-2025",
      avatar: "https://i.pravatar.cc/100?img=3",
    },
    {
      name: "Chika Nwosu",
      divacaId: "DH-987654",
      matricNumber: "130298746",
      status: "Inactive",
      lastVisit: "03-02-2025",
      avatar: "https://i.pravatar.cc/100?img=4",
    },
    {
      name: "Ifeoma Daniels",
      divacaId: "DH-654321",
      matricNumber: "140398756",
      status: "Active",
      lastVisit: "28-01-2025",
      avatar: "https://i.pravatar.cc/100?img=5",
    },
  ];

  return Response.json(users);
}
