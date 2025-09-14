const refreshUserData = async () => {
  const token = localStorage.getItem("access_token");
  if (!token) return null;

  try {
    const res = await fetch("/api/v1/users/me", {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${token}`,
      },
    });

    if (!res.ok) throw new Error("Failed to fetch user data");

    const userData = await res.json();

    // Update localStorage
    localStorage.setItem("user", JSON.stringify(userData));

    return userData;
  } catch (err) {
    console.error("Refresh error:", err);
    return null;
  }
};
