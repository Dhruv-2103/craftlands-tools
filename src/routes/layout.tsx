import { component$, Slot, useStore, useVisibleTask$ } from '@builder.io/qwik';
import Nav from '../components/Nav';
import Navbar from '~/components/Navbar';

export default component$(() => {
  const store = useStore({
    cookies: 'true',
  });

  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(async () => {
    // convert cookies to json
    const cookieJSON: any = document.cookie.split(';').reduce((res, c) => {
      const [key, val] = c.trim().split('=').map(decodeURIComponent);
      return Object.assign(res, { [key]: val });
    }, {});
    if (!cookieJSON['cookies']) store.cookies = 'false';
  });

  return <>
    {/* <Nav /> */}
    <Navbar />
    <Slot />
  </>;
});