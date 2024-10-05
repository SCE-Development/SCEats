import React from "react";

export default function Footer() {
  return (
    <div className="w-full rounded-lg px-3 pb-3 h-full max-h-[8vh] flex flex-col">
      <footer className="w-full rounded-lg py-6 footer footer-center bg-base-200 h-full">
        <aside>
          <p>© {new Date().getFullYear()} SCEats. All rights reserved.</p>
        </aside>
      </footer>
    </div>
  );
}
