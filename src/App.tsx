import { useState, type ReactNode } from 'react'
import logo from './assets/logo.jpg'
import { FACEBOOK_URL, MEMORIES, NAV_LINKS, OFFERINGS, SHOWS, VOICES } from './content'

// Images in src/assets/photos fill the slot matching their filename's leading number (e.g. 07-show.jpg → slot 7):
// 1 = About photo, 2–6 = Memories wall, 7–8 = hero corner polaroids. Empty slots keep the placeholder.
const PHOTOS = new Map<number, string>()
for (const [path, url] of Object.entries(
  import.meta.glob<string>('./assets/photos/*.{jpg,jpeg,png,webp}', { eager: true, import: 'default' }),
)) {
  const slot = Number(path.split('/').pop()?.match(/^\d+/)?.[0])
  if (slot) PHOTOS.set(slot, url)
}

const photo = (slot: number): string | undefined => PHOTOS.get(slot)

// Each marquee word is cut from a different scrap of paper
const MARQUEE_WORDS = [
  { text: 'Dance', style: 'bg-paper text-ink font-display font-extrabold text-2xl sm:text-3xl -rotate-2' },
  { text: 'Sing', style: 'bg-pop text-ink font-hand font-bold text-3xl sm:text-4xl rotate-2' },
  { text: 'Perform', style: 'bg-primary text-paper font-display font-extrabold text-2xl sm:text-3xl -rotate-1' },
  { text: 'Act', style: 'bg-mint text-primary-dark font-type text-2xl sm:text-3xl tracking-widest rotate-3' },
  { text: 'Theater', style: 'bg-primary-light text-ink font-display font-extrabold text-2xl sm:text-3xl -rotate-2' },
]

// Per-letter tilt so the hero title looks cut out and glued down by hand
const LETTER_TILT = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-2', '-rotate-2', 'rotate-3', '-rotate-1', 'rotate-2', '-rotate-3']

// Fixed jitter so torn edges look hand-ripped but render the same every time
const TEAR = [6, 2, 9, 4, 11, 3, 7, 1, 10, 5, 8, 2, 12, 4, 6, 1, 9, 3, 11, 5, 7, 2, 10, 4, 8]

/* ---------- Scrapbook pieces ---------- */

// Ripped paper edge filled with currentColor; place at the bottom of a section (or bottom-full above one)
function TornEdge({ className = '' }: { className?: string }) {
  const step = 100 / (TEAR.length - 1)
  const points = TEAR.map((y, i) => `${(i * step).toFixed(2)},${y}`).join(' ')
  return (
    <svg viewBox="0 0 100 14" preserveAspectRatio="none" className={`block w-full h-4 sm:h-6 ${className}`} aria-hidden>
      <polygon fill="currentColor" points={`0,14 ${points} 100,14`} />
    </svg>
  )
}

// Springy easing shared by hover effects (slight overshoot, like paper settling)
const SPRING = 'transition duration-300 ease-[cubic-bezier(.34,1.56,.64,1)]'

// Tape lifts a little when its parent `group` is hovered
function Tape({ className = '' }: { className?: string }) {
  return (
    <span
      className={`tape absolute z-10 h-7 w-24 ${SPRING} group-hover:-translate-y-1 group-hover:scale-110 ${className}`}
      aria-hidden
    />
  )
}

function Polaroid({ caption, src, className = '' }: { caption: string; src?: string; className?: string }) {
  return (
    <figure className={`polaroid relative ${className}`}>
      <div className="relative aspect-square overflow-hidden bg-linear-to-br from-primary-light to-primary">
        {src ? (
          <img src={src} alt={caption} loading="lazy" className="absolute inset-0 h-full w-full object-cover" />
        ) : (
          <>
            <div className="absolute inset-0 halftone-fine opacity-25" aria-hidden />
            <span className="absolute inset-0 flex items-center justify-center font-type text-sm uppercase tracking-widest text-paper/80">
              Photo
            </span>
          </>
        )}
      </div>
      <figcaption className="absolute inset-x-0 bottom-2 text-center font-hand text-2xl text-ink-soft">{caption}</figcaption>
    </figure>
  )
}

// Ransom-note cut-out letters: each letter gets its own paper scrap
const SCRAPS = [
  'bg-ink text-paper font-display -rotate-6',
  'bg-pop text-ink font-hand text-[1.15em] rotate-3',
  'bg-paper text-primary font-type -rotate-2',
  'bg-primary text-paper font-sans italic rotate-6',
]

function RansomWord({ word }: { word: string }) {
  return (
    <span className="inline-flex gap-1 align-middle" aria-label={word}>
      {word.split('').map((ch, i) => (
        <span
          key={i}
          aria-hidden
          className={`inline-block px-2 py-0.5 leading-none stuck ${SCRAPS[i % SCRAPS.length]} ${SPRING} hover:-translate-y-1.5 hover:rotate-0 hover:scale-110`}
        >
          {ch}
        </span>
      ))}
    </span>
  )
}

function Doodle({ kind, className = '' }: { kind: 'star' | 'heart' | 'squiggle' | 'arrow'; className?: string }) {
  const paths = {
    star: 'M24 4 L29 18 L44 18 L32 27 L37 42 L24 33 L11 42 L16 27 L4 18 L19 18 Z',
    heart: 'M24 42 C 8 30, 2 20, 10 12 C 16 6, 22 9, 24 15 C 26 9, 32 6, 38 12 C 46 20, 40 30, 24 42 Z',
    squiggle: 'M2 26 C 8 10, 14 10, 18 26 S 28 42, 34 26 S 42 10, 46 22',
    arrow: 'M4 8 C 20 4, 36 12, 38 34 M30 27 L 38 35 L 45 25',
  }
  return (
    <svg viewBox="0 0 48 48" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" className={className} aria-hidden>
      <path d={paths[kind]} />
    </svg>
  )
}

function SectionTitle({ kicker, children, light = false }: { kicker: string; children: ReactNode; light?: boolean }) {
  return (
    <div className="mb-12">
      <span className={`dymo -rotate-2 px-3 py-1 text-xs sm:text-sm ${light ? 'ring-1 ring-paper/25' : ''} ${SPRING} hover:rotate-0 hover:scale-105`}>{kicker}</span>
      <h2
        className={`mt-4 font-display font-extrabold text-4xl sm:text-6xl tracking-tight leading-[1.05] ${
          light ? 'text-paper' : 'text-ink'
        }`}
      >
        {children}
      </h2>
    </div>
  )
}

// Page-marker tabs hanging from the top edge, one paper color each
const TAB_STYLES = [
  'bg-paper text-ink rotate-1',
  'bg-primary text-paper -rotate-2',
  'bg-mint text-primary-dark rotate-1',
  'bg-pop text-ink -rotate-1',
  'bg-primary-light text-paper rotate-2',
  'bg-ink text-paper -rotate-1 ring-1 ring-paper/25',
]

/* ---------- Header: logo sticker + hanging index tabs ---------- */
function Header() {
  const [open, setOpen] = useState(false)

  return (
    // the bar itself ignores clicks so the page underneath stays usable between the pieces
    <header className="fixed top-0 inset-x-0 z-50 pointer-events-none">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 flex items-start justify-between">
        {/* logo: a sticker taped to the corner of the page */}
        <a
          href="#top"
          className={`group pointer-events-auto relative mt-4 flex items-center gap-2 bg-paper paper stuck py-1.5 pl-1.5 pr-4 -rotate-3 ${SPRING} hover:rotate-0 hover:scale-105`}
        >
          <Tape className="-top-3 -left-3 -rotate-[30deg] w-14! h-6!" />
          <img src={logo} alt="" className="h-8 w-8 sm:h-10 sm:w-10" />
          <span className="font-hand text-xl sm:text-3xl font-bold leading-none whitespace-nowrap">
            Truchorus <span className="text-primary">Performance Co.</span>
          </span>
        </a>

        {/* desktop (lg+): index tabs; each one slides down when hovered, like pulling a page marker */}
        <nav aria-label="Main" className="pointer-events-auto hidden lg:flex items-start gap-2">
          {NAV_LINKS.map((link, i) => (
            <a
              key={link.href}
              href={link.href}
              className={`paper stuck block -translate-y-3 rounded-b-lg px-4 pt-7 pb-3 font-type text-xs uppercase tracking-[0.18em] ${TAB_STYLES[i % TAB_STYLES.length]} ${SPRING} hover:translate-y-0 hover:rotate-0 focus-visible:translate-y-0`}
            >
              {link.label}
            </a>
          ))}
        </nav>

        {/* mobile: sticky-note menu button + notebook-page dropdown */}
        <div className="pointer-events-auto lg:hidden relative mt-4">
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            aria-expanded={open}
            aria-controls="mobile-menu"
            className={`sticky-note bg-pop px-4 py-2 font-hand text-2xl font-bold rotate-3 ${SPRING} active:scale-95`}
          >
            {open ? 'close ✕' : 'menu ✎'}
          </button>
          {open && (
            <nav id="mobile-menu" aria-label="Main" className="absolute right-0 top-16 w-60 rotate-1">
              <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
              <ul className="lined stuck pl-12 pr-6 pt-6 pb-4">
                {NAV_LINKS.map((link) => (
                  <li key={link.href}>
                    <a
                      href={link.href}
                      onClick={() => setOpen(false)}
                      className="marker-swipe font-hand text-3xl leading-[1.75rem] text-ink"
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          )}
        </div>
      </div>
    </header>
  )
}

function App() {
  return (
    <div className="min-h-screen bg-sheet paper text-ink overflow-x-hidden">
      <Header />

      {/* ---------- Hero: green construction paper with cut-out title ---------- */}
      <section id="top" className="relative min-h-svh flex flex-col bg-primary paper text-paper overflow-hidden">
        {/* scrapbook clutter around the edges (desktop) */}
        <div className={`group hidden lg:block absolute left-[4%] bottom-36 w-40 -rotate-12 ${SPRING} hover:rotate-0 hover:-translate-y-2 hover:scale-105`} aria-hidden>
          <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-6" />
          <Polaroid caption="first performance" src={photo(7)} />
        </div>
        <div className={`group hidden lg:block absolute right-[4%] bottom-32 w-48 rotate-6 ${SPRING} hover:rotate-0 hover:-translate-y-2 hover:scale-105`} aria-hidden>
          <Tape className="-top-3 left-6 -rotate-6 [--tape:rgb(255_255_255/0.75)]" />
          <Polaroid caption="we did it!" src={photo(8)} />
        </div>
        <Doodle kind="star" className="hidden sm:block absolute right-[12%] top-28 w-14 text-pop rotate-12 transition duration-700 hover:rotate-[192deg] hover:scale-125" />
        <Doodle kind="heart" className={`hidden sm:block absolute left-[10%] top-28 w-12 text-paper/80 -rotate-12 ${SPRING} hover:scale-130 hover:text-pop`} />
        <Doodle kind="squiggle" className={`hidden sm:block absolute left-[26%] top-28 w-16 text-ink/50 ${SPRING} hover:scale-x-125 hover:text-ink`} />

        <div className="relative flex-1 px-4 sm:px-6 pt-24 pb-12 flex flex-col items-center justify-center text-center">
          <h1
            className="font-display font-extrabold uppercase text-[15vw] leading-[0.85] tracking-tight whitespace-nowrap drop-shadow-[0_4px_0_rgb(0_0_0/0.18)]"
            aria-label="Truchorus"
          >
            {'TRUCHORUS'.split('').map((ch, i) => (
              <span key={i} aria-hidden className={`inline-block cursor-default ${LETTER_TILT[i]} ${i < 3 ? 'text-paper' : 'text-ink'} ${SPRING} hover:-translate-y-[0.08em] hover:rotate-0 hover:scale-105`}>
                {ch}
              </span>
            ))}
          </h1>

          <p className={`dymo mt-[2.5vw] -rotate-2 px-[1.8vw] py-[0.6vw] text-[clamp(0.85rem,2.1vw,2rem)] ${SPRING} hover:rotate-0 hover:scale-105`}>
            Performance Company
          </p>

          {/* tagline on a scrap of notebook paper */}
          <div className={`group relative mt-[4vw] sm:mt-14 rotate-1 ${SPRING} hover:rotate-0 hover:-translate-y-1`}>
            <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-2 [--tape:rgb(255_214_10/0.8)]" />
            <p className="lined stuck px-8 sm:px-12 pl-12 sm:pl-14 pt-5 pb-4 font-hand text-2xl sm:text-4xl text-primary-dark">
              Talentong magkakaugnay, laging magpupugay!
            </p>
          </div>
        </div>

        {/* straight black strip with cut-out paper words stuck along it */}
        <div
          className="group relative mb-10 bg-ink paper py-4 overflow-hidden"
          aria-hidden
        >
          <div className="flex w-max items-center animate-marquee group-hover:[animation-play-state:paused]">
            {Array.from({ length: 4 }).flatMap((_, n) =>
              MARQUEE_WORDS.map((word) => (
                <span key={`${n}-${word.text}`} className="shrink-0 flex items-center gap-6 pr-6">
                  <span
                    className={`inline-block px-4 py-1 uppercase leading-none stuck ${word.style} ${SPRING} hover:rotate-0 hover:-translate-y-1 hover:scale-110`}
                  >
                    {word.text}
                  </span>
                  <Doodle kind="star" className="w-6 text-pop" />
                </span>
              )),
            )}
          </div>
        </div>
        <TornEdge className="absolute bottom-0 inset-x-0 text-sheet" />
      </section>

      {/* ---------- About: a notebook page + taped polaroid ---------- */}
      <section id="about" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <div className="grid md:grid-cols-[1.1fr_1fr] gap-16 items-center">
          <div className={`group relative -rotate-1 ${SPRING} hover:rotate-0 hover:-translate-y-1`}>
            <Tape className="-top-3 left-10 -rotate-6" />
            <Tape className="-top-3 right-10 rotate-6" />
            <div className="lined stuck pl-14 pr-8 py-10 sm:pr-10">
              <SectionTitle kicker="About us">
                Who we <span className="highlight">are</span>
              </SectionTitle>
              <p className="text-lg leading-[1.75rem] text-ink-soft">
                Truchorus Performance Company is a <span className="highlight text-ink">youth performance group</span>{' '}
                from San Pedro, Laguna. We sing, dance, act, do theater, and make our own music — young talents
                coming together on one stage.
              </p>
              <p className="mt-[1.75rem] text-lg leading-[1.75rem] text-ink-soft">
                From community shows to stages like San Pedro&apos;s Youth Night, we perform for one reason: to
                share our love for the stage and inspire others to find theirs.
              </p>
              <p className="mt-6 text-right font-hand text-3xl text-primary">— the Truchorus fam</p>
            </div>
          </div>

          <div className="relative pt-12 md:pt-0">
            <p className="absolute left-2 top-0 md:-left-12 md:-top-10 z-20 flex items-end gap-1 font-hand text-3xl text-primary -rotate-6">
              that&apos;s us!
              <Doodle kind="arrow" className="w-12 h-12 translate-y-5" />
            </p>
            <Doodle kind="star" className="absolute -right-2 -bottom-6 w-12 text-pop z-20 rotate-12 transition duration-700 hover:rotate-[192deg] hover:scale-125" />
            {/* group photo comes from src/assets/photos (slot 1) */}
            <div className={`group relative mx-auto max-w-md rotate-2 ${SPRING} hover:rotate-0 hover:-translate-y-2 hover:scale-[1.02]`}>
              <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
              <Polaroid caption="Balik Sayawit 2022" src={photo(1)} className="[&>div]:aspect-[4/3]" />
              {/* award rosette stuck on the corner */}
              <div className={`absolute -top-8 -right-6 z-20 rotate-12 ${SPRING} hover:rotate-0 hover:scale-110`}>
                {/* ribbon tails */}
                <span className="absolute left-1/2 top-[70%] -translate-x-[110%] rotate-[18deg] h-12 w-7 bg-primary [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]" aria-hidden />
                <span className="absolute left-1/2 top-[70%] translate-x-[10%] -rotate-[18deg] h-12 w-7 bg-primary-dark [clip-path:polygon(0_0,100%_0,100%_100%,50%_78%,0_100%)]" aria-hidden />
                {/* seal */}
                <div className="relative flex h-24 w-24 sm:h-28 sm:w-28 flex-col items-center justify-center rounded-full bg-pop ring-4 ring-paper stuck">
                  <span className="absolute inset-1.5 rounded-full border-2 border-dashed border-primary-dark/40" aria-hidden />
                  <span className="text-primary-dark text-xs leading-none" aria-hidden>★</span>
                  <span className="font-hand font-bold text-lg sm:text-xl leading-none text-primary-dark">Champions!</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- What we do: index cards on green paper ---------- */}
      <section id="what-we-do" className="scroll-mt-24 relative bg-primary paper text-paper">
        <TornEdge className="absolute bottom-full inset-x-0 text-primary translate-y-px" />
        <div className="max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-28">
          <SectionTitle kicker="What we do" light>
            On stage <span className="font-hand font-bold text-pop text-[1.15em]">&amp; beyond</span>
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10 md:gap-8">
            {OFFERINGS.map((item, i) => (
              <article
                key={item.title}
                className={`group relative origin-top ${['-rotate-2', 'rotate-1', '-rotate-1'][i]} hover:animate-swing`}
              >
                {/* push pin */}
                <span
                  className="absolute -top-2 left-1/2 -translate-x-1/2 z-10 h-5 w-5 rounded-full bg-[radial-gradient(circle_at_35%_35%,#ffe766,var(--color-pop)_45%,#c9a400)] shadow-md transition-transform duration-300 group-hover:scale-125"
                  aria-hidden
                />
                <div className="lined stuck pl-12 pr-6 pt-8 pb-6 text-ink">
                  <svg className={`w-9 h-9 text-primary ${SPRING} group-hover:-rotate-12 group-hover:scale-110`} fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden>
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.8} d={item.icon} />
                  </svg>
                  <h3 className="mt-3 font-display font-extrabold text-2xl tracking-tight leading-[1.75rem]">{item.title}</h3>
                  <p className="mt-[1.75rem] leading-[1.75rem] text-ink-soft">{item.body}</p>
                </div>
              </article>
            ))}
          </div>
        </div>
        <TornEdge className="absolute bottom-0 inset-x-0 text-sheet" />
      </section>

      {/* ---------- Shows: ticket stubs ---------- */}
      <section id="shows" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 py-24">
        <SectionTitle kicker="Upcoming">
          Catch us <RansomWord word="LIVE" />
        </SectionTitle>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {SHOWS.map((show, i) => (
            <article
              key={show.title}
              className={`group relative ${['rotate-1', '-rotate-1', 'rotate-2'][i]} ${SPRING} hover:rotate-0 hover:-translate-y-1 drop-shadow-[0_12px_14px_rgb(0_0_0/0.18)]`}
            >
              <div>
                <div className={`ticket-top relative h-44 px-6 pt-5 overflow-hidden ${i === 1 ? 'bg-primary-light' : 'bg-primary'} paper text-paper`}>
                  <p className="font-type text-xs uppercase tracking-[0.3em]">Admit one</p>
                  <p className="mt-1 font-type text-xs uppercase tracking-[0.3em] opacity-80">Truchorus presents</p>
                  <span className="absolute bottom-1 right-5 font-display font-extrabold text-7xl tracking-tighter text-paper/90">
                    0{i + 1}
                  </span>
                  {i === 0 && (
                    <span className="absolute left-6 bottom-6 -rotate-12 transition-transform duration-300 group-hover:scale-110 group-hover:-rotate-6 rounded border-2 border-pop px-2 py-0.5 font-type text-sm uppercase tracking-widest text-pop">
                      Next up
                    </span>
                  )}
                </div>
                {/* stub tears away along the perforation on hover */}
                <div className={`ticket-bottom bg-paper border-t-2 border-dashed border-gray-300 h-28 px-6 py-4 origin-top-left ${SPRING} group-hover:translate-y-2 group-hover:rotate-2`}>
                  <h3 className="font-display font-extrabold text-xl tracking-tight">{show.title}</h3>
                  <p className="mt-2 font-type text-sm text-ink-soft">
                    {show.date} · {show.place}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      </section>

      {/* ---------- Memories: polaroid wall ---------- */}
      <section id="memories" className="scroll-mt-24 max-w-6xl mx-auto px-4 sm:px-6 pt-8 pb-32">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <SectionTitle kicker="Memories">
            From the <span className="highlight">scrapbook</span>
          </SectionTitle>
          <a
            href={FACEBOOK_URL}
            target="_blank"
            rel="noreferrer"
            className="marker-swipe mb-12 font-hand text-3xl text-ink-soft -rotate-2 hover:text-ink transition-colors"
          >
            more on our Facebook page →
          </a>
        </div>

        <div className="relative grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-12 md:gap-x-10">
          {MEMORIES.map((memory, i) => {
            const tilt = ['-rotate-3', 'rotate-2', '-rotate-1', 'rotate-3', '-rotate-2'][i % 5]
            const shift = ['', 'md:translate-y-10', '', 'md:-translate-y-4', 'md:translate-y-6'][i % 5]
            const tape = ['-top-3 left-6 -rotate-12', '-top-3 right-6 rotate-6', '-top-3 left-1/2 -translate-x-1/2 rotate-2'][i % 3]
            return (
              <div
                key={memory.caption}
                className={`group relative ${tilt} ${shift} ${SPRING} hover:rotate-0 hover:z-20 hover:scale-105 hover:-translate-y-2`}
              >
                <Tape className={tape} />
                <Polaroid caption={memory.caption} src={photo(i + 2)} />
              </div>
            )
          })}

          {/* stickers on the page */}
          <div className="relative flex items-center justify-center">
            <div className="burst w-36 h-36 sm:w-44 sm:h-44 bg-pop flex items-center justify-center rotate-12 drop-shadow-md transition duration-700 hover:rotate-[372deg] hover:scale-110">
              <span className="font-display font-extrabold text-primary-dark text-lg sm:text-xl">Mabuhay!</span>
            </div>
            <span className={`absolute bottom-2 left-4 dymo px-3 py-1 text-xs -rotate-6 ${SPRING} hover:rotate-0 hover:scale-110`}>♪ more soon</span>
          </div>
        </div>
      </section>

      {/* ---------- Voices: sticky notes on black paper ---------- */}
      <section className="relative bg-ink paper text-paper">
        <TornEdge className="absolute bottom-full inset-x-0 text-ink translate-y-px" />
        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 pt-24 pb-28">
          <SectionTitle kicker="Testimonials" light>
            What people <span className="font-hand font-bold text-primary-light text-[1.15em]">say</span>
          </SectionTitle>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {VOICES.map((voice, i) => (
              <figure
                key={voice.name}
                className={`group relative ${['-rotate-2', 'rotate-2', '-rotate-1'][i]} ${i === 1 ? 'md:translate-y-8' : ''} ${SPRING} hover:rotate-0 hover:z-10`}
              >
                <Tape className="-top-3 left-1/2 -translate-x-1/2 rotate-3 [--tape:rgb(255_255_255/0.55)]" />
                <div className={`sticky-note aspect-square p-7 flex flex-col justify-between text-ink origin-top transition-all duration-300 group-hover:[transform:perspective(700px)_rotateX(10deg)] group-hover:shadow-2xl ${['bg-pop', 'bg-mint', 'bg-paper'][i]}`}>
                  <blockquote className="font-hand text-3xl leading-tight">“{voice.quote}”</blockquote>
                  <figcaption className="font-type text-sm uppercase tracking-widest text-ink-soft">— {voice.name}</figcaption>
                </div>
              </figure>
            ))}
          </div>
        </div>
        <TornEdge className="absolute bottom-0 inset-x-0 text-sheet" />
      </section>

      {/* ---------- Join: taped green card ---------- */}
      <section id="join" className="scroll-mt-24 max-w-5xl mx-auto px-4 sm:px-6 py-28">
        <div className={`group relative -rotate-1 ${SPRING} hover:rotate-0`}>
          <Tape className="-top-3 -left-4 -rotate-[30deg] [--tape:rgb(20_20_20/0.85)]" />
          <Tape className="-bottom-3 -right-4 -rotate-[30deg] [--tape:rgb(20_20_20/0.85)]" />
          <div className="relative overflow-hidden bg-primary paper stuck px-8 py-14 sm:px-14 text-paper">
            <Doodle kind="star" className="absolute right-10 top-8 w-16 text-pop rotate-12 transition duration-700 group-hover:rotate-[192deg] group-hover:scale-110" />
            <Doodle kind="squiggle" className="absolute right-24 bottom-10 w-20 text-paper/50" />
            <h2 className="relative font-display font-extrabold text-5xl sm:text-6xl tracking-tight leading-[0.95] max-w-2xl">
              Ready to take the <span className="text-ink">stage?</span>
            </h2>
            <p className="relative mt-5 text-lg sm:text-xl max-w-xl text-paper/90">
              Want to join, book a performance, or just say hi? Message us on Facebook.
            </p>
            <div className="relative mt-8 flex flex-wrap items-center gap-5">
              <a
                href={FACEBOOK_URL}
                target="_blank"
                rel="noreferrer"
                className={`dymo px-6 py-3 text-sm -rotate-2 ${SPRING} hover:rotate-0 hover:scale-105 hover:bg-primary-dark active:scale-95 active:shadow-none`}
              >
                Message us →
              </a>
              <span className="font-hand text-3xl text-mint rotate-2">we&apos;d love to meet you!</span>
            </div>
          </div>
        </div>
      </section>

      {/* ---------- Footer ---------- */}
      <footer className="border-t-2 border-dashed border-gray-300">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <img src={logo} alt="" className={`h-9 w-9 rounded-sm -rotate-6 stuck ${SPRING} hover:rotate-6 hover:scale-125`} />
            <p className="font-hand text-3xl">
              Truchorus <span className="text-primary">Mabuhay!</span> 💚🤍
            </p>
          </div>
          <p className="font-type text-sm text-ink-soft">© 2026 Truchorus Performance Company</p>
        </div>
      </footer>
    </div>
  )
}

export default App
