import { cn } from "@/lib/utils";
import { NavLink } from "react-router-dom";

const menuItems = [
  { title: "Getting Started", path: "/" },
  { title: "Project Setup", path: "/setup" },
  { title: "Best Practices", path: "/best-practices" },
  { title: "Model Selection", path: "/models" },
  { title: "Templates", path: "/templates" },
];

export function Sidebar() {
  return (
    <div className="w-64 h-screen bg-white border-r border-gray-200 fixed left-0 top-0 overflow-y-auto">
      <div className="p-6">
        <h1 className="text-2xl font-bold text-primary">CursorGuide</h1>
      </div>
      <nav className="px-4">
        {menuItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) =>
              cn(
                "block px-4 py-2 my-1 rounded-md transition-colors",
                isActive
                  ? "bg-primary text-white"
                  : "text-gray-600 hover:bg-gray-100"
              )
            }
          >
            {item.title}
          </NavLink>
        ))}
      </nav>
    </div>
  );
}