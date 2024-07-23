import { Link } from "@builder.io/qwik-city";
import CraftlandsLogo from "../../public/branding/logo.svg?jsx";
import DropDown from "../../public/dropdown.svg?jsx";
import Menu from "../../public/menu.svg?jsx";
import "../custom.css";
import React from "react";
import DropDownComponent from "./DropDownComponent";
import { Label } from "@headlessui/react";
import MobileHamburgerMenu from "./MobileHamburgerMenu";

const Navbar = () => {
  const client = [
    { label: "Client Area", href: "https://billing.craftlands.host/login", des: 'Billing & Support' },
    { label: "Game Panel", href: "https://panel.craftlands.host/auth/login", des: 'Game Management' }
  ];

  const minecraft = [
    { label: "Europe", href: "https://craftlands.host/minecraftEU" },
    { label: "USA", href: "https://craftlands.host/minecraftUSA" },
  ];

  const resources = [
    { label: "RGBcraftlands", href: "https://tools.craftlands.fun/resources/rgb" },
    { label: "Animated Tab", href: "https://tools.craftlands.fun/resources/animtab" },
    { label: "Spark Profile", href: "https://tools.craftlands.fun/resources/sparkprofile" },
  ];

  const important = [
    { label: "Partners", href: "https://craftlands.host/partners" },
    { label: "Contact Us", href: "https://discord.com/invite/8Nerq5Kavk" },
    { label: "Terms & Service", href: "https://craftlands.host/terms-of-service" },
    { label: "Privacy Policy", href: "https://craftlands.host/privacy-policy" },
    { label: "SLA", href: "https://craftlands.host/SLA" },
    { label: "Status", href: "https://status.craftlands.host/" },
  ];

  const mobile = [
    { label: "Europe", href: "https://craftlands.host/minecraftEU" },
    { label: "USA", href: "https://craftlands.host/minecraftUSA" },
    { label: "RGBcraftlands", href: "#" },
    { label: "Animated Tab", href: "#" },
    { label: "Spark Profile", href: "#" },
    { label: "Partners", href: "https://craftlands.host/partners" },
    { label: "Contact Us", href: "https://discord.com/invite/8Nerq5Kavk" },
    { label: "Terms & Service", href: "https://craftlands.host/terms-of-service" },
    { label: "Privacy Policy", href: "https://craftlands.host/privacy-policy" },
    { label: "SLA", href: "https://craftlands.host/SLA" },
    { label: "Status", href: "https://status.craftlands.host/" },
    { label: "Client Area", href: "https://billing.craftlands.host/login", des: 'Billing & Support' },
    { label: "Game Panel", href: "https://panel.craftlands.host/auth/login", des: 'Game Management' }
  ]

  return (
    <nav class="flex sticky justify-around min-w-full max-lg:justify-between max-lg:px-8 items-center min-h-[69px] max-lg:min-h-28 bg-[#1c1f37]">
      <Link href="https://craftlands.host">
        <div class="flex justify-center items-center space-x-2">
          <CraftlandsLogo class="w-10 h-10" />
          <span class="text-white font-extrabold text-xl">
            Craft
            <span class="text-[#0195f4] font-extrabold text-xl">Lands</span>
          </span>
        </div>
      </Link>
      <div class="flex  font-light transition-all ease-in-out duration-300 max-lg:hidden">
        <ul class="flex gap-x-8 items-center">
          <li class="hover:text-[#0195f4] text-slate-300 transition-all ease-in-out duration-300">
            <a href="https://craftlands.host">Home</a>
          </li>
          <li class="flex justify-center items-center space-x-1 hover:text-[#0195f4] text-slate-300 transition-all ease-in-out duration-300">
            <DropDownComponent
              buttonLabel="Minecraft Hosting"
              links={minecraft}
              divClass="-right-4 py-2"
              buttonClass="focus:text-[#0195f4]"
            />
            <DropDown class="w-3 h-3" />
          </li>
          <li class="flex justify-center items-center space-x-1 hover:text-[#0195f4] transition-all ease-in-out duration-300">
            <DropDownComponent buttonLabel="Resources" links={resources} buttonClass="focus:text-[#0195f4] hover:text-[#0195f4]" divClass="-right-12 w-[200px] py-2"/>
            <DropDown class="w-3 h-3" />
          </li>
          <li class="flex justify-center items-center space-x-1 hover:text-[#0195f4] transition-all ease-in-out duration-300 focus:text-[#0195f4]">
            <DropDownComponent buttonLabel="Important" links={important} buttonClass="focus:text-[#0195f4]" divClass="-right-20 w-52 py-2"/>
            <DropDown class="w-3 h-3" />
          </li>
        </ul>
        <div class="flex items-center mt-[1px] ml-8 gap-2 bg-[#0195f4] px-8 py-[10px] rounded-lg text-md font-semibold text-white focus:text-white hover:scale-105 transition-all ease-in-out duration-300">
          <DropDownComponent buttonLabel="Client Area" links={client} buttonClass="focus:text-white" divClass="-right-16 w-52 py-2"/>
          <DropDown class="w-3 h-3" />
        </div>
      </div>
        <MobileHamburgerMenu links={mobile} divClass="w-full left-0 -z-50"/>
    </nav>
  );
};

export default Navbar;
