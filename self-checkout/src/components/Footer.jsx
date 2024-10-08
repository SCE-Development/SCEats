import React from "react";

export default function Footer() {
  return (
    <div className="w-full rounded-lg px-3 pb-3 h-[10vh] flex flex-col">
      <footer className="w-full rounded-lg py-6 footer footer-center bg-base-200 h-full">
        <aside>
          <p className="text-xl">© {new Date().getFullYear()} SCEats. All rights reserved.</p>
        </aside>
      </footer>
    </div>
  );
}
