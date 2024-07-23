import { $, component$, useStore, useTask$ } from '@builder.io/qwik';
import { routeLoader$, type DocumentHead } from '@builder.io/qwik-city';

import { Gradient } from '~/components/util/HexUtils';
import { presetVersion, presets } from '~/components/util/PresetUtils';
import { convertToHex, convertToRGB, generateOutput, getRandomColor } from '~/components/util/RGBUtils';

import { ChevronDown, ChevronUp, ColorFillOutline, SettingsOutline, Text } from 'qwik-ionicons';

import { Button, ColorInput, Header, NumberInput, Dropdown, TextArea, TextInput, Toggle } from '@luminescent/ui';
import { inlineTranslate, useSpeak } from 'qwik-speak';
import { getCookies, setCookies } from '~/components/util/SharedUtils';
import { isBrowser } from '@builder.io/qwik/build';
import Minecraft from '../../../../public/mincraft.jpeg?jsx';

const formats = [
  '&#$1$2$3$4$5$6$f$c',
  '<#$1$2$3$4$5$6>$f$c',
  '<##$1$2$3$4$5$6>$f$c',
  '&x&$1&$2&$3&$4&$5&$6$f$c',
  '§x§$1§$2§$3§$4§$5§$6$f$c',
  '[COLOR=#$1$2$3$4$5$6]$c[/COLOR]',
  'MiniMessage',
];

const defaults = {
  colors: presets.birdflop,
  text: 'craftlands',
  format: '&#$1$2$3$4$5$6$f$c',
  formatchar: '&',
  customFormat: false,
  prefix: '',
  bold: false,
  italic: false,
  underline: false,
  strikethrough: false,
};

export const useCookies = routeLoader$(async ({ cookie, url }) => {
  return await getCookies(cookie, Object.keys(defaults), url.searchParams) as typeof defaults;
});

export default component$(() => {
  useSpeak({ assets: ['gradient', 'color'] });
  const t = inlineTranslate();
  const cookies = useCookies().value;
  const store = useStore({
    ...defaults,
    ...cookies,
    alerts: [] as {
      class: string,
      text: string,
    }[],
  }, { deep: true });

  const handleSwap = $((currentIndex: number, newIndex: number) => {
    // check if the index is out of bounds
    const colorsLength = store.colors.length;
    if (newIndex < 0) {
      newIndex = colorsLength - 1;
    } else if (newIndex >= colorsLength) {
      newIndex = 0;
    }

    const newColors = [...store.colors];
    const currentColor = `${newColors[currentIndex]}`;
    newColors[currentIndex] = newColors[newIndex];
    newColors[newIndex] = currentColor;
    store.colors = newColors;
  });

  useTask$(({ track }) => {
    isBrowser && setCookies(store);
    Object.keys(store).forEach((key: any) => {
      if (key == 'frames' || key == 'frame' || key == 'alerts') return;
      else track(() => store[key as keyof typeof store]);
    });
  });

  return (
    <section class="flex mx-auto max-w-6xl px-6 items-center justify-center min-h-[calc(100svh)] pt-[12px] max-lg:pt-[10px]">
      <div class="my-10 min-h-[60px] w-full">
      <Minecraft class="w-full max-h-80 mix-blend-plus-darker mb-4"/>
        <h1 class="font-bold text-gray-50 text-2xl sm:text-4xl mb-2">
          RGBcraftlands
        </h1>

        {/* charlimit={256} */}
        <TextArea output id="Output" class={{ 'font-mc min-h-52': true }} value={generateOutput(store.text, store.colors, store.format, store.formatchar, store.prefix, store.bold, store.italic, store.underline, store.strikethrough)}>
          <Header subheader={t('color.outputSubtitle@@Copy-paste this for RGB text!')}>
            {t('color.output@@Output')}
          </Header>
        </TextArea>

        <h1 class={{
          'text-8xl sm:text-8xl max-sm:6xl my-2 break-all max-w-7xl -space-x-[1px] font-mc': true,
          'font-mc-bold': store.bold,
          'font-mc-italic': store.italic,
          'font-mc-bold-italic': store.bold && store.italic,
        }}>
          {(() => {
            const text = store.text ? store.text : 'birdflop';

            let colors = store.colors.map((color: string) => convertToRGB(color));
            if (colors.length < 2) colors = [convertToRGB('#00FFE0'), convertToRGB('#EB00FF')];

            const gradient = new Gradient(colors, text.replace(/ /g, '').length);

            let hex = '';
            return text.split('').map((char: string, i: number) => {
              if (char != ' ') hex = convertToHex(gradient.next());
              return (
                <span key={`char${i}`} style={`color: #${hex};`} class={{
                  'underline': store.underline,
                  'strikethrough': store.strikethrough,
                  'underline-strikethrough': store.underline && store.strikethrough,
                }}>
                  {char}
                </span>
              );
            });
          })()}
        </h1>

        <div id="mobile-navbuttons" class="my-4 sm:hidden">
          <div class="flex gap-2">
            <Button square aria-label="Colors" onClick$={() => {
              document.getElementById('colors')!.classList.replace('hidden', 'flex');
              document.getElementById('inputs')!.classList.replace('flex', 'hidden');
              document.getElementById('formatting')!.classList.replace('flex', 'hidden');
            }}>
              <ColorFillOutline width="24" />
            </Button>
            <Button square aria-label="Inputs" onClick$={() => {
              document.getElementById('colors')!.classList.replace('flex', 'hidden');
              document.getElementById('inputs')!.classList.replace('hidden', 'flex');
              document.getElementById('formatting')!.classList.replace('flex', 'hidden');
            }}>
              <SettingsOutline width="24" />
            </Button>
            <Button square aria-label="Formatting" onClick$={() => {
              document.getElementById('colors')!.classList.replace('flex', 'hidden');
              document.getElementById('inputs')!.classList.replace('flex', 'hidden');
              document.getElementById('formatting')!.classList.replace('hidden', 'flex');
            }}>
              <Text width="24" class="fill-white" />
            </Button>
          </div>
        </div>

        <div class="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-10">
          <div class="hidden sm:flex flex-col gap-3 relative" id="colors">
            <h1 class="hidden sm:flex text-2xl font-bold text-gray-50 gap-4 items-center justify-center">
              <ColorFillOutline width="32" />
              {t('color.colors@@Colors')}
            </h1>
            <Dropdown id="color-preset" class={{ 'w-full': true }} onChange$={
              (event: any) => {
                if (event.target!.value == 'custom') return;
                store.colors = presets[event.target!.value as keyof typeof presets];
              }
            } values={[
              ...Object.keys(presets).map(preset => ({ name: preset, value: preset })),
              { name: t('color.custom@@Custom'), value: 'custom' },
            ]} value={Object.keys(presets).find((preset: any) => presets[preset as keyof typeof presets].toString() == store.colors.toString()) ?? 'custom'}>
              {t('color.colorPreset@@Color Preset')}
            </Dropdown>
            <NumberInput input min={2} max={store.text.length} value={store.colors.length} id="colorsinput" class={{ 'w-full': true }}
              onChange$={(event: any) => {
                if (event.target!.value < 2) return;
                if (event.target!.value > store.text.length) return event.target!.value = store.text.length;
                const newColors = [];
                for (let i = 0; i < event.target!.value; i++) {
                  if (store.colors[i]) newColors.push(store.colors[i]);
                  else newColors.push(getRandomColor());
                }
                store.colors = newColors;
              }}
              onIncrement$={() => {
                const newColors = [...store.colors, getRandomColor()];
                store.colors = newColors;
              }}
              onDecrement$={() => {
                const newColors = [...store.colors];
                newColors.pop();
                store.colors = newColors;
              }}
            >
              {t('color.colorAmount@@Color Amount')}
            </NumberInput>
            <div class="flex flex-col gap-2">
              {store.colors.map((color: string, i: number) => {
                return <div key={`color${i + 1}`} class="flex items-end">
                  <ColorInput
                    id={`color${i + 1}`}
                    value={color}
                    onInput$={(newColor: string) => {
                      const newColors = [...store.colors];
                      newColors[i] = newColor;
                      store.colors = newColors;
                    }}
                    class={{ 'w-full': true }}
                    presetColors={store.colors}
                  >
                    {t('color.hexColor@@Hex Color')} {i + 1}
                  </ColorInput>
                  <div class="bg-gray-800 flex ml-2 rounded-md border border-gray-700">
                    <Button square onClick$={() => handleSwap(i, i - 1)} class={{ 'border-0': true }}>
                      <ChevronUp width="20" />
                    </Button>
                    <div class="bg-gray-700 w-px" />
                    <Button square onClick$={() => handleSwap(i, i + 1)} class={{ 'border-0': true }}>
                      <ChevronDown width="20" />
                    </Button>
                  </div>
                </div>;
              })}
            </div>
          </div>
          <div class="md:col-span-2 lg:col-span-3 sm:grid grid-cols-3 gap-4">
            <div class="flex flex-col gap-3 col-span-2" id="inputs">
              <h1 class="hidden sm:flex text-2xl font-bold text-gray-50 gap-4 items-center justify-center">
                <SettingsOutline width="32" />
                {t('color.inputs@@Inputs')}
              </h1>
              <TextInput id="input" value={store.text} placeholder="craftlands" onInput$={(event: any) => { store.text = event.target!.value; }}>
                {t('color.inputText@@Input Text')}
              </TextInput>

              <div class="flex flex-col md:grid grid-cols-2 gap-2">
                <Dropdown id="format" value={store.customFormat ? 'custom' : store.format} class={{ 'w-full': true }} onChange$={
                  (event: any) => {
                    if (event.target!.value == 'custom') {
                      store.customFormat = true;
                    }
                    else {
                      store.customFormat = false;
                      store.format = event.target!.value;
                    }
                  }
                } values={[
                  ...formats.map(format => ({
                    name: format
                      .replace('$1', 'r').replace('$2', 'r').replace('$3', 'g').replace('$4', 'g').replace('$5', 'b').replace('$6', 'b')
                      .replace('$f', `${store.bold ? store.formatchar + 'l' : ''}${store.italic ? store.formatchar + 'o' : ''}${store.underline ? store.formatchar + 'n' : ''}${store.strikethrough ? store.formatchar + 'm' : ''}`)
                      .replace('$c', ''),
                    value: format,
                  })),
                  {
                    name: store.customFormat ? store.format
                      .replace('$1', 'r').replace('$2', 'r').replace('$3', 'g').replace('$4', 'g').replace('$5', 'b').replace('$6', 'b')
                      .replace('$f', `${store.bold ? store.formatchar + 'l' : ''}${store.italic ? store.formatchar + 'o' : ''}${store.underline ? store.formatchar + 'n' : ''}${store.strikethrough ? store.formatchar + 'm' : ''}`)
                      .replace('$c', '')
                      : t('color.custom@@Custom'),
                    value: 'custom',
                  },
                ]}>
                  {t('color.colorFormat@@Color Format')}
                </Dropdown>
                <TextInput id="prefix" value={store.prefix} placeholder={t('gradient.prefixPlaceholder@@example: \'/nick \'')} onInput$={(event: any) => { store.prefix = event.target!.value; }}>
                  {t('gradient.prefix@@Prefix (Usually used for commands)')}
                </TextInput>
              </div>

              {
                store.customFormat && <>
                  <TextInput id="customformat" value={store.format} placeholder="&#$1$2$3$4$5$6$f$c" onInput$={(event: any) => { store.format = event.target!.value; }}>
                    {t('color.customFormat@@Custom Format')}
                  </TextInput>
                  <div class="pb-4 font-mono">
                    <p>{t('color.placeholders@@Placeholders:')}</p>
                    <p>$1 = <strong class="text-red-400">R</strong>RGGBB</p>
                    <p>$2 = R<strong class="text-red-400">R</strong>GGBB</p>
                    <p>$3 = RR<strong class="text-green-400">G</strong>GBB</p>
                    <p>$4 = RRG<strong class="text-green-400">G</strong>BB</p>
                    <p>$5 = RRGG<strong class="text-blue-400">B</strong>B</p>
                    <p>$6 = RRGGB<strong class="text-blue-400">B</strong></p>
                    <p>$f = {t('color.formatting@@Formatting')}</p>
                    <p>$c = {t('color.character@@Character')}</p>
                  </div>
                </>
              }

              <div class="flex flex-col gap-2">
                <TextInput id="import" name="import" placeholder={t('color.import@@Import (Paste here)')} onInput$={async (event: any) => {
                  let json: any;
                  try {
                    json = JSON.parse(event.target!.value);
                  } catch (error) {
                    const alert = {
                      class: 'text-red-500',
                      text: 'color.invalidPreset@@INVALID PRESET!\nIf this is an old preset, please update it using the <a class="text-blue-400 hover:underline" href="/PresetTools">Preset Tools</a> page, If not please report to the <a class="text-blue-400 hover:underline" href="https://discord.gg/9vUZ9MREVz">Developers</a>.',
                    };
                    store.alerts.push(alert);
                    return setTimeout(() => {
                      store.alerts.splice(store.alerts.indexOf(alert), 1);
                    }, 5000);
                  }
                  Object.keys(json).forEach(key => {
                    if ((store as any)[key] === undefined) return;
                    (store as any)[key] = json[key];
                  });
                  const alert = {
                    class: 'text-green-500',
                    text: 'color.importedPreset@@Successfully imported preset!',
                  };
                  store.alerts.push(alert);
                  setTimeout(() => {
                    store.alerts.splice(store.alerts.indexOf(alert), 1);
                  }, 2000);
                }}>
                  {t('color.presets@@Presets')}
                </TextInput>
                <div class="flex gap-2">
                  <Button id="export" size="sm" onClick$={() => {
                    navigator.clipboard.writeText(JSON.stringify({ version: presetVersion, ...store, alerts: undefined }));
                    const alert = {
                      class: 'text-green-500',
                      text: 'color.exportedPreset@@Successfully exported preset to clipboard!',
                    };
                    store.alerts.push(alert);
                    setTimeout(() => {
                      store.alerts.splice(store.alerts.indexOf(alert), 1);
                    }, 2000);
                  }}>
                    {t('color.export@@Export')}
                  </Button>
                  <Button id="createurl" size="sm" onClick$={() => {
                    const base_url = `${window.location.protocol}//${window.location.host}${window.location.pathname}`;
                    const url = new URL(base_url);
                    const params = { ...store, alerts: undefined };
                    Object.entries(params).forEach(([key, value]) => {
                      url.searchParams.set(key, String(value));
                    });
                    window.history.pushState({}, '', url.href);
                    const alert = {
                      class: 'text-green-500',
                      text: 'color.exportedPresetUrl@@Successfully exported preset to url!',
                    };
                    store.alerts.push(alert);
                    setTimeout(() => {
                      store.alerts.splice(store.alerts.indexOf(alert), 1);
                    }, 2000);
                  }}>
                    {t('color.url@@Export As URL')}
                  </Button>
                </div>
              </div>
              {store.alerts.map((alert: any, i: number) => (
                <p key={`preset-alert${i}`} class={alert.class} dangerouslySetInnerHTML={t(alert.text)} />
              ))}
            </div>
            <div class="mb-4 hidden sm:flex flex-col gap-3" id="formatting">
              <h1 class="hidden sm:flex text-2xl font-bold fill-current text-gray-50 gap-4 items-center justify-center">
                <Text width="32" />
                {t('color.colors@@Formatting')}
              </h1>
              <TextInput id="formatchar" value={store.formatchar} placeholder="&" onInput$={(event: any) => { store.formatchar = event.target!.value; }}>
                {t('color.formatCharacter@@Format Character')}
              </TextInput>
              <Toggle id="bold" checked={store.bold}
                onChange$={(event: any) => { store.bold = event.target!.checked; }}
                label={`${t('color.bold@@Bold')} - ${store.formatchar}l`} />
              <Toggle id="italic" checked={store.italic}
                onChange$={(event: any) => { store.italic = event.target!.checked; }}
                label={`${t('color.italic@@Italic')} - ${store.formatchar}o`} />
              <Toggle id="underline" checked={store.underline}
                onChange$={(event: any) => { store.underline = event.target!.checked; }}
                label={`${t('color.underline@@Underline')} - ${store.formatchar}n`} />
              <Toggle id="strikethrough" checked={store.strikethrough}
                onChange$={(event: any) => { store.strikethrough = event.target!.checked; }}
                label={`${t('color.strikethrough@@Strikethrough')} - ${store.formatchar + 'm'}`} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
});
