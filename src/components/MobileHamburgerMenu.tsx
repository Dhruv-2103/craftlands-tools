import { component$, useStore, useVisibleTask$, $, useSignal  } from "@builder.io/qwik";
import Menu from '../../public/menu.svg?jsx';

interface NavLink {
  label: string;
  href: string;
  des?: string;
}

interface NavbarProps {
  links: NavLink[];
  divClass?: string;
}

interface NavState {
  dropdownOpen: boolean;
}

export default component$<NavbarProps>(({ links, divClass}) => {
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
        <div class="" ref={(el) => (dropdownRef.value = el)} onClick$={() => (state.dropdownOpen = !state.dropdownOpen)}>
            <Menu class="w-[27px] h-[27px] lg:hidden " />
          {/* <button
            // class={`flex focus:outline-none ${class}`}
            class={`focus:outline-none ${buttonClass}`}
            onClick$={() => (state.dropdownOpen = !state.dropdownOpen)}
          >
            {buttonLabel}
          </button> */}
          {state.dropdownOpen && (
            <div 
            class={`absolute ${divClass} top-5 min-w-full lg:hidden mt-3 py-3 bg-[#1c1f37] rounded-sm shadow-lg z-20 transition translate-y-20 duration-300 ease-in-out`}>
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
