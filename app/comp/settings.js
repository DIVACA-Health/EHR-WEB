import PersonalDetails from "../settingstab/personalsettings";
import Notifications from "../settingstab/notification";
import AccessibilitySettings from "../settingstab/accessibility";
import Language from "../settingstab/language";
import Security from "../settingstab/security";
import Connectivity from "../settingstab/connectivity";
import Support from "../settingstab/support";
import { useEffect, useState } from "react";

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState("personal");
  const [user, setUser] = useState(null);

  useEffect(() => {
    // Retrieve user data from localStorage
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  if (!user) return <p>Loading user data...</p>;

  const tabs = [
    { key: "personal", label: "Personal details" },
    { key: "notifications", label: "Notifications" },
    { key: "accessibility", label: "Accessibility settings" },
    { key: "Language", label: "Language & regional settings" },
    { key: "Security", label: "Security & privacy" },
    { key: "Connectivity", label: "Connectivity" },
    { key: "Support", label: "Support" },
  ];

  const renderTab = () => {
    switch (activeTab) {
      case "personal":
        return <PersonalDetails />;
      case "notifications":
        return <Notifications />;
      case "accessibility":
        return <AccessibilitySettings />;
      case "Language":
        return <Language />;
      case "Security":
        return <Security />;
      case "Connectivity":
        return <Connectivity />;
      case "Support":
        return <Support />;
      default:
        return <PersonalDetails />;
    }
  };

  return (
    <div className="pt-5">
      <h1 className="text-xl font-medium mb-5 pl-7">Settings</h1>
      <div className="h-[40px] border-b border-gray-300 flex items-center pl-7 pr-7">
        <div className="flex text-xs text-[#898989] font-light w-[95%] h-full gap-5">
          {tabs.map((tab) => (
            <button
              key={tab.key}
              onClick={() => setActiveTab(tab.key)}
              className={`w-fit h-full p-1 border-b-2 transition-colors duration-200
                ${
                  activeTab === tab.key
                    ? "text-blue-500 border-blue-500"
                    : "text-gray-700 border-transparent hover:text-blue-500 hover:border-blue-500"
                }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      <div className="mt-[30px] pl-7 pr-7 pb-0.5">{renderTab()}</div>
    </div>
  );
};

export default SettingsPage;
