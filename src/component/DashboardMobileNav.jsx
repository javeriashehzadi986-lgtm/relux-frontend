import React, { useRef } from "react";
import { Button } from "@/components/ui/button";

export default function DashboardMobileNav({
  title,
  items,
  activeSection,
  onSectionChange,
  getIconFill,
}) {
  const scrollRef = useRef(null);
  const dragRef = useRef({
    pointerId: null,
    startX: 0,
    scrollLeft: 0,
    dragged: false,
  });

  const handlePointerDown = (event) => {
    const el = scrollRef.current;
    if (!el) return;

    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      scrollLeft: el.scrollLeft,
      dragged: false,
    };

    el.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event) => {
    const el = scrollRef.current;
    const state = dragRef.current;
    if (!el || state.pointerId !== event.pointerId) return;

    const delta = event.clientX - state.startX;
    if (Math.abs(delta) > 5) {
      state.dragged = true;
    }

    el.scrollLeft = state.scrollLeft - delta;
  };

  const endPointerDrag = (event) => {
    const el = scrollRef.current;
    const state = dragRef.current;
    if (!el || state.pointerId !== event.pointerId) return;

    if (el.hasPointerCapture(event.pointerId)) {
      el.releasePointerCapture(event.pointerId);
    }

    state.pointerId = null;

    window.setTimeout(() => {
      state.dragged = false;
    }, 0);
  };

  const handleTabClick = (sectionId) => (event) => {
    if (dragRef.current.dragged) {
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    onSectionChange(sectionId);
  };

  return (
    <div className="profile-mobile-nav">
      <h2 className="profile-sidebar-heading profile-mobile-nav-title">{title}</h2>
      <div
        ref={scrollRef}
        className="profile-mobile-nav-scroll"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={endPointerDrag}
        onPointerCancel={endPointerDrag}
      >
        <nav
          className="profile-sidebar-nav profile-sidebar-nav--mobile"
          role="tablist"
          aria-label="Dashboard sections"
        >
          {items.map((item) => {
            const Icon = item.icon;
            const isActive = activeSection === item.id;
            const iconFill =
              typeof getIconFill === "function"
                ? getIconFill(item, isActive)
                : "none";

            return (
              <Button
                key={item.id}
                type="button"
                variant="ghost"
                size="sm"
                role="tab"
                aria-selected={isActive}
                className={`profile-sidebar-link ${
                  isActive ? "profile-sidebar-link--active" : ""
                }`}
                onClick={handleTabClick(item.id)}
              >
                <Icon
                  size={20}
                  strokeWidth={isActive ? 2.25 : 1.75}
                  fill={iconFill}
                />
                <span>{item.label}</span>
              </Button>
            );
          })}
        </nav>
      </div>
    </div>
  );
}
