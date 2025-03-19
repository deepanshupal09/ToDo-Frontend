"use client";
import React, { useState } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Home, Logout, } from "@mui/icons-material";
import Drawer from "@mui/joy/Drawer";
import { deleteAuth } from "../actions/cookie";
// import logo from "../assets/anchorage_logo1.png";
import Link from "next/link";

function Navbar() {
;
  const router = useRouter();
  const params = usePathname();
  const path = (params as string).split("/")[2];

  const [open, setOpen] = useState(false);

  async function handleLogout() {
    await deleteAuth();
    router.push("/");
  }


  const options = [
    { icon: <Home />  , route: "home", value: "Home" },
  ];

  const toggleDrawer = (inOpen: boolean) => (event: React.KeyboardEvent | React.MouseEvent) => {
    if (
      event.type === "keydown" &&
      ((event as React.KeyboardEvent).key === "Tab" || (event as React.KeyboardEvent).key === "Shift")
    ) {
      return;
    }

    setOpen(inOpen);
  };


  return (
    <div className="fixed bg-white z-50 flex flex-col items-center space-y-5 top-0 left-0 h-screen w-72 max-xl:w-60 border px-10 py-5 max-lg:px-3 max-xl:px-3 max-lg:h-20 max-lg:w-screen max-lg:flex-row max-lg:py-3 max-lg:space-y-1 max-lg:justify-between">
      <div className="flex w-full text-center font-medium text-xl max-lg:w-full">
        {/* <img src={logo.src} alt="logo" style={{ height: "40px" }} /> */}
        Task Manager App
      </div>
      <div className="text-sm space-y-2 w-full  max-lg:hidden">
        {options.map((option, index) => {
          return (
            <Link
            href={`/${option.route}`}
              key={index}
              onClick={() => {
                router.push(`/${option.route}`);
              }}
              className={`flex space-x-3 font-medium rounded-xl ${
                option.route === path ? "bg-[#E8EDF5]" : ""
              } cursor-pointer items-center   py-2 max-lg:hidden`}
            >
              {option.icon}
              <div className="flex space-x-3  items-center">
                <div>{option.value}</div>
              </div>
            </Link>
          );
        })}
        <div
          onClick={handleLogout}
          className="flex space-x-3 font-medium rounded-xl text-red-600 cursor-pointer items-center py-2 max-lg:hidden"
        >
          <Logout />
          <div>Logout</div>
        </div>
      </div>
      <div className="hidden max-lg:flex w-10 items-center justify-center">
        <button className="relative -top-1 right-2 w-10 h-10" onClick={toggleDrawer(true)} aria-label="Menu">
          <div
            className={`absolute top-1/2 left-1/2 w-8 h-1 bg-black transition-transform duration-300 ease-in-out ${
              open ? "rotate-45" : "-translate-y-2"
            } transform origin-center`}
          ></div>
          <div
            className={`absolute top-1/2 left-1/2 w-8 h-1 bg-black transition-opacity duration-300 ease-in-out ${
              open ? "opacity-0" : ""
            }`}
          ></div>
          <div
            className={`absolute top-1/2 left-1/2 w-8 h-1 bg-black transition-transform duration-300 ease-in-out ${
              open ? "-rotate-45" : "translate-y-2"
            } transform origin-center`}
          ></div>
        </button>
      </div>
      <Drawer size="md" variant="outlined" open={open} onClose={toggleDrawer(false)}>
        <div className="p-2">
          <div className="flex items-center my-3 font-medium text-xl max-lg:flex max-lg:items-center">
            {/* <img src={logo.src} alt="l  ogo" style={{ height: "40px" }} /> */}
            <span className="ml-3">ToDo App</span>
          </div>
          <div className="text-sm space-y-3 mt-10">
            {options.map((option, index) => {
              return (
                <div
                  key={index}
                  onClick={() => {
                    router.push(`/admin/${option.route}`);
                    setOpen(false);
                  }}
                  className={`flex space-x-3 font-medium rounded-xl ${
                    option.route === path ? "bg-[#E8EDF5]" : ""
                  } cursor-pointer items-center px-3 py-2 `}
                >
                  {option.icon}
                  <div>{option.value}</div>
                </div>
              );
            })}
            <div
              onClick={handleLogout}
              className="flex space-x-3 font-medium rounded-xl text-red-600 cursor-pointer items-center px-3 py-2 "
            >
              <Logout />
              <div>Logout</div>
            </div>
          </div>
        </div>
      </Drawer>




    </div>
  );
}

export default Navbar;
