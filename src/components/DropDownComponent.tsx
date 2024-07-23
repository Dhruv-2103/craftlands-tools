import { component$, useStore, useVisibleTask$, $, useSignal  } from "@builder.io/qwik";
import { ReactNode } from "react";

interface NavLink {
  label: string;
  href: string;
  des?: string;
}

interface NavbarProps {
  buttonLabel: string;
  links: NavLink[];
  buttonClass?: string;
  divClass?: string;
}

interface NavState {
  dropdownOpen: boolean;
}

export default component$<NavbarProps>(({ buttonLabel, links, buttonClass, divClass}) => {
  const state = useStore<NavState>({
    dropdownOpen: false,
  });

  const dropdownRef = useSignal<HTMLDivElement | null>(null);

  const handleClickOutside = $((event: MouseEvent) => {
    if (dropdownRef.value && !dropdownRef.value.contains(event.target as Node)) {
      state.dropdownOpen = false;
    }
  });
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(() => {
    document.addEventListener('click', handleClickOutside);
    return () => {
      document.removeEventListener('click', handleClickOutside);
    };
  });
  return (
    // <div class="mx-auto flex justify-between items-center">
        <div class="relative" ref={(el) => (dropdownRef.value = el)}>
          <button
            // class={`flex focus:outline-none ${class}`}
            class={`focus:outline-none ${buttonClass}`}
            onClick$={() => (state.dropdownOpen = !state.dropdownOpen)}
          >
            {buttonLabel}
          </button>
          {state.dropdownOpen && (
            <div 
            class={`absolute ${divClass} top-12 mt-2 w-40 bg-[#1c1f37] rounded-sm shadow-lg z-20 opacity-100 transition-opacity duration-300 ease-in-out`}>
              {links.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  class="block px-4 mx-4 py-2.5 text-slate-300 hover:text-white focus:text-[#0195f4]"
                  onClick$={(event) => {
                    (event.currentTarget as HTMLElement).blur();
                  }}
                >
                  {link.label}
                  <span class="flex items-center font-light text-slate-500">{link.des}</span>
                </a>
              ))}
            </div>
          )}
        </div>
      // </div>
  );
});
