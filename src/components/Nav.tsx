import { component$ } from '@builder.io/qwik';
import { Link, useLocation } from '@builder.io/qwik-city';
import { Button, ButtonAnchor, LoadingIcon, LogoBirdflop, LogoDiscord, Nav, DropdownRaw } from '@luminescent/ui';

import { CubeOutline, GlobeOutline, LogoGithub, ServerOutline } from 'qwik-ionicons';

import { inlineTranslate, useSpeakConfig } from 'qwik-speak';

import { languages } from '~/speak-config';
import CraftlandsLogo from '../../public/branding/logo.svg?jsx';

export default component$(() => {
  const config = useSpeakConfig();
  const t = inlineTranslate();
  const loc = useLocation();

  return (
    <Nav fixed color='purple'>
      <Link q:slot="start" href="/resources/rgb/" class="flex justify-center items-center space-x-2">
        <CraftlandsLogo class="w-9 h-9" />
          <span class="font-bold -ml-1 text-xl">Craft<span class="text-blue-500">Lands</span></span>
          <div class={{
            'transition-all': true,
            '-ml-6 opacity-0': !loc.isNavigating,
          }}>
            <LoadingIcon width={16} speed="0.4s" />
          </div>
      </Link>

      
      <DropdownRaw id="nav-resources" q:slot='end' size="md" transparent hover
        display={<div class="flex items-center gap-3"><CubeOutline width={24} />Resources</div>}
        class={{ 'hidden sm:flex': true }}>
        <Link q:slot="extra-buttons" href="/resources/rgb">
          <Button transparent class={{ 'w-full': true }}>
            {t('nav.hexGradient@@RGBirdflop')}
          </Button>
        </Link>
        <Link q:slot="extra-buttons" href="/resources/animtab">
          <Button transparent class={{ 'w-full': true }}>
            {t('nav.animatedTAB@@Animated TAB')}
          </Button>
        </Link>
        <Link q:slot="extra-buttons" href="/resources/sparkprofile">
          <Button transparent class={{ 'w-full': true }}>
            {t('nav.sparkProfile@@Spark Profile')}
          </Button>
        </Link>
      </DropdownRaw>
      <DropdownRaw q:slot='end' class={{ 'hidden': !loc.url.pathname.includes('resources') }} id="lang-picker" transparent display={<GlobeOutline width="24" />} size="md" values={config.supportedLocales.map(value => (
        {
          name: languages[value.lang as keyof typeof languages],
          value: value.lang,
        }
      ))} onChange$={(e, el) => {
        document.cookie = `locale=${JSON.stringify(config.supportedLocales.find(locale => locale.lang == el.value))};max-age=86400;path=/`;
        location.reload();
      }}>
      </DropdownRaw>

      <DropdownRaw id="nav-resources" q:slot='mobile' size="md" transparent
        display={<div class="flex items-center gap-3"><CubeOutline width={24} />Resources</div>}>
        <Link q:slot="extra-buttons" href="/resources/rgb">
          <Button transparent class={{ 'w-full': true }}>
            {t('nav.hexGradient@@RGBirdflop')}
          </Button>
        </Link>
        <Link q:slot="extra-buttons" href="/resources/animtab">
          <Button transparent class={{ 'w-full': true }}>
            {t('nav.animatedTAB@@Animated TAB')}
          </Button>
        </Link>
        <Link q:slot="extra-buttons" href="/resources/sparkprofile">
          <Button transparent class={{ 'w-full': true }}>
            {t('nav.sparkProfile@@Spark Profile')}
          </Button>
        </Link>
      </DropdownRaw>
    </Nav>
  );
});
