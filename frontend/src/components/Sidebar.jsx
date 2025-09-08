import React, { useEffect, useState } from "react";
import {
  LINK_CLASSES,
  PRODUCTIVITY_CARD,
  SIDEBAR_CLASSES,
  TIP_CARD,
  menuItems,
} from "../assets/constant";
import { Lightbulb, Menu, Sparkle, X } from "lucide-react";
import { NavLink } from "react-router-dom";

const Sidebar = ({ user = {}, tasks = [] }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const totalTasks = tasks?.length || 0;
  const completedTasks =
    tasks?.filter(
      (t) =>
        t.completed === true ||
        t.completed === 1 ||
        (typeof t.completed === "string" && t.completed.toLowerCase() === "yes")
    ).length || 0;

  const productivity =
    totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

  const username = user?.name || "User";
  const initials = username.charAt(0).toUpperCase();

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "auto";
    return () => {
      document.body.style.overflow = "auto";
    };
  }, [mobileOpen]);

  const renderMenuItems = (isMobile = false) => (
    <ul className="space-y-2">
      {menuItems?.map((items) => (
        <li key={items?.text || Math.random()}>
          <NavLink
            to={items?.path || "#"}
            className={({ isActive }) =>
              [
                LINK_CLASSES?.base,
                isActive ? LINK_CLASSES?.active : LINK_CLASSES?.inactive,
                isMobile ? "justify-start" : "lg:justify-start",
              ].join(" ")
            }
            onClick={() => setMobileOpen(false)}
          >
            <span className={LINK_CLASSES?.icon}>{items?.icon}</span>
            <span className={LINK_CLASSES?.text}>{items?.text}</span>
          </NavLink>
        </li>
      ))}
    </ul>
  );

  return (
    <>
      {/* Desktop Sidebar */}
      <div className={SIDEBAR_CLASSES?.desktop}>
        <div className="p-5 border-b border-purple-100 lg:block hidden">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-red-600 rounded-full flex items-center justify-center text-white shadow-md font-bold">
              {initials}
            </div>

            <div>
              <h2 className="text-lg font-semibold text-gray-700">
                Laadle, {username}
              </h2>
              <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                <Sparkle className="w-3 h-3" /> Stay productive!
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 space-y-6 overflow-y-auto flex-1">
          <div className={PRODUCTIVITY_CARD?.container}>
            <div className={PRODUCTIVITY_CARD?.header}>
              <h3 className={PRODUCTIVITY_CARD?.label}>Productivity</h3>
              <span className={PRODUCTIVITY_CARD?.badge}>{productivity}%</span>
            </div>
            <div className={PRODUCTIVITY_CARD?.barBg}>
              <div
                className={PRODUCTIVITY_CARD?.barFg}
                style={{ width: `${productivity}%` }}
              ></div>
            </div>
          </div>

          {renderMenuItems()}

          <div className="mt-auto pt-6 lg:block hidden">
            <div className={TIP_CARD.container}>
              <div className="flex items-center gap-2">
                <div className={TIP_CARD.iconWrapper}>
                  <Lightbulb className="w-5 h-5 text-rose-500" />
                </div>

                <div>
                  <h3 className={TIP_CARD.title}>LLM</h3>
                  <p className={TIP_CARD.text}>
                    Leverage the power of LLMs to boost your productivity.
                  </p>
                  <a
                    href="https://chatgpt.com/"
                    className=" block mt-2 text-sm text-rose-600 hover:underline"
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    Learn more
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Sidebar Button */}
      {!mobileOpen && (
        <button
          onClick={() => setMobileOpen(true)}
          className={SIDEBAR_CLASSES.mobileButton}
        >
          <Menu className="w-5 h-5" />
        </button>
      )}

      {/* Mobile Sidebar Drawer */}
      {mobileOpen && (
        <div className="fixed inset-0 z-40">
          <div
            className={SIDEBAR_CLASSES.mobileDrawerBackdrop}
            onClick={() => setMobileOpen(false)}
          ></div>
          <div
            className={SIDEBAR_CLASSES.mobileDrawer}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex justify-between items-center mb-4 border-b pb-2">
              <h2 className="text-lg font-semibold text-gray-700">Menu</h2>
              <button
                onClick={() => setMobileOpen(false)}
                className="text-gray-500 hover:text-rose-700"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-gradient-to-br from-rose-400 to-red-600 rounded-full flex items-center justify-center text-white shadow-md font-bold">
                {initials}
              </div>

              <div>
                <h2 className="text-lg font-semibold text-gray-700">
                  Laadle, {username}
                </h2>
                <p className="text-sm text-red-600 font-medium flex items-center gap-1">
                  <Sparkle className="w-3 h-3" /> Stay productive!
                </p>
              </div>
            </div>

            {renderMenuItems(true)}
          </div>
        </div>
      )}
    </>
  );
};

export default Sidebar;

