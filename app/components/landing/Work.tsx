import { Search, ShoppingBag } from 'lucide-react'
import { Em } from './ui'

// Browser chrome around each concept design
function Browser({ url, children }: { url: string; children: React.ReactNode }) {
    return (
        <div className="overflow-hidden rounded-[18px] bg-white shadow-[0_20px_50px_-20px_rgba(20,20,10,.25)] ring-1 ring-black/5 transition-transform duration-500 group-hover:-translate-y-1.5">
            <div className="flex items-center gap-3 border-b border-black/5 bg-[#f7f7f4] px-3 py-2">
                <span className="flex gap-1">
                    {['#ff5f57', '#febc2e', '#28c840'].map((c) => <span key={c} className="size-2 rounded-full" style={{ background: c }} />)}
                </span>
                <span className="flex-1 truncate rounded-md bg-white px-2 py-0.5 text-center text-[9px] text-[#8a8a85]">{url}</span>
            </div>
            <div className="h-[300px] overflow-hidden">{children}</div>
        </div>
    )
}

function CafeSite() {
    return (
        <div className="flex h-full flex-col bg-[#f3ece1] text-[#3b2f24]">
            <div className="flex items-center justify-between px-4 py-3 text-[8px] uppercase tracking-[0.15em]">
                <span className="font-[family-name:var(--font-instrument)] text-sm normal-case tracking-normal">Olive & Ember</span>
                <span className="hidden gap-3 sm:flex"><span>Menu</span><span>About</span><span>Visit</span></span>
            </div>
            <div className="relative mx-3 flex-1 overflow-hidden rounded-xl bg-gradient-to-br from-[#c9a27c] via-[#b9825a] to-[#7d5236] p-4 text-[#fff8ee]">
                <div className="absolute -right-6 -top-6 size-28 rounded-full bg-[#e8c9a3]/40" />
                <div className="absolute bottom-3 right-4 size-16 rounded-full border-[6px] border-[#fff8ee]/70 bg-[#f3ece1]/30" />
                <p className="text-[8px] uppercase tracking-[0.2em]">Café · Dubai Marina</p>
                <p className="mt-2 font-[family-name:var(--font-instrument)] text-[26px] leading-none">Slow coffee,<br /><em>warm</em> plates</p>
                <span className="mt-3 inline-block rounded-full bg-[#fff8ee] px-3 py-1.5 text-[9px] text-[#3b2f24]">Book a table</span>
            </div>
            <div className="grid grid-cols-3 gap-2 p-3 text-[8px]">
                {[['Flat white', '18'], ['Shakshuka', '42'], ['Pistachio cake', '28']].map(([n, p]) => (
                    <div key={n} className="rounded-lg bg-[#fbf7f1] p-2">
                        <div className="mb-1.5 h-8 rounded-md bg-[#e2d2bd]" />
                        {n}<span className="float-right text-[#9a8470]">{p}</span>
                    </div>
                ))}
            </div>
        </div>
    )
}

function StoreSite() {
    const items = [
        ['Linen shirt', '240', 'from-[#e9e2d6] to-[#d7cbb7]'],
        ['Wide trousers', '310', 'from-[#d9dde0] to-[#b9c1c6]'],
        ['Silk scarf', '155', 'from-[#efd5cf] to-[#ddb0a6]'],
        ['Canvas tote', '120', 'from-[#e3e6d6] to-[#c5cbab]'],
    ]
    return (
        <div className="flex h-full flex-col bg-white text-[#1d1d1b]">
            <div className="flex items-center justify-between border-b border-black/5 px-4 py-2.5 text-[9px]">
                <span className="text-[13px] font-medium tracking-[0.25em]">NOOR</span>
                <span className="flex items-center gap-2.5 text-[#6b6b66]">
                    <Search size={11} />
                    <span className="relative"><ShoppingBag size={11} /><span className="absolute -right-1.5 -top-1.5 grid size-2.5 place-items-center rounded-full bg-[#1d1d1b] text-[6px] text-white">2</span></span>
                </span>
            </div>
            <div className="flex gap-2 px-4 py-2 text-[8px] text-[#6b6b66]">
                {['New in', 'Women', 'Men', 'Sale'].map((c, i) => <span key={c} className={`rounded-full px-2 py-0.5 ${i === 0 ? 'bg-[#1d1d1b] text-white' : 'ring-1 ring-black/10'}`}>{c}</span>)}
            </div>
            <div className="grid flex-1 grid-cols-2 gap-2 px-4 pb-3">
                {items.map(([n, p, g]) => (
                    <div key={n} className="flex flex-col">
                        <div className={`flex-1 rounded-lg bg-gradient-to-b ${g}`} />
                        <div className="mt-1 flex justify-between text-[8px]"><span>{n}</span><span className="text-[#6b6b66]">AED {p}</span></div>
                    </div>
                ))}
            </div>
        </div>
    )
}

function DashboardSite() {
    const rows = [
        ['#1042', 'Sara A.', 'Paid', 'bg-[#DDF5A9]'],
        ['#1041', 'Omar K.', 'Shipped', 'bg-[#dbe7f3]'],
        ['#1040', 'Lina M.', 'Pending', 'bg-[#f6e3c6]'],
        ['#1039', 'Yousef R.', 'Paid', 'bg-[#DDF5A9]'],
    ]
    const bars = [40, 62, 48, 75, 58, 90, 70]
    return (
        <div className="flex h-full bg-[#f6f6f3] text-[#151515]">
            <div className="flex w-12 flex-col items-center gap-3 bg-[#151515] py-3">
                <span className="size-4 rounded bg-[#C8EE7E]" />
                {[0, 1, 2, 3].map((i) => <span key={i} className={`size-3.5 rounded ${i === 0 ? 'bg-white/80' : 'bg-white/20'}`} />)}
            </div>
            <div className="flex-1 space-y-2 p-3">
                <div className="flex items-center justify-between text-[10px]">Overview<span className="rounded-full bg-white px-2 py-0.5 text-[8px] text-[#8a8a85]">This week</span></div>
                <div className="grid grid-cols-3 gap-2">
                    {[['Orders', '128'], ['Revenue', 'AED 18.4k'], ['Visitors', '3,920']].map(([k, v]) => (
                        <div key={k} className="rounded-lg bg-white p-2">
                            <p className="text-[7px] text-[#8a8a85]">{k}</p>
                            <p className="text-[11px] tabular-nums">{v}</p>
                        </div>
                    ))}
                </div>
                <div className="flex h-16 items-end gap-1.5 rounded-lg bg-white p-2">
                    {bars.map((h, i) => <span key={i} className={`flex-1 rounded-sm ${i === 5 ? 'bg-[#151515]' : 'bg-[#e3e3dd]'}`} style={{ height: `${h}%` }} />)}
                </div>
                <div className="rounded-lg bg-white p-2 text-[8px]">
                    {rows.map(([id, n, s, c]) => (
                        <div key={id} className="flex items-center justify-between border-b border-black/5 py-1 last:border-0">
                            <span className="tabular-nums text-[#8a8a85]">{id}</span><span>{n}</span>
                            <span className={`rounded-full px-1.5 py-0.5 text-[7px] ${c}`}>{s}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

const concepts = [
    { tag: 'Restaurant website', title: 'Menu and table booking for a café', url: 'oliveandember.ae', Site: CafeSite },
    { tag: 'E-commerce store', title: 'Online shop for a clothing brand', url: 'noor-studio.com', Site: StoreSite },
    { tag: 'Admin dashboard', title: 'Orders, revenue and customers in one place', url: 'admin.noor-studio.com', Site: DashboardSite },
]

export default function Work() {
    return (
        <section id="work" className="mx-auto max-w-[1400px] scroll-mt-20 px-4 pt-20 md:px-6 md:pt-28">
            <div data-reveal className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
                <h2 className="text-[34px] font-light leading-[1.05] tracking-tight md:text-[52px]">
                    What We <Em>Build</Em>
                </h2>
                <p className="max-w-sm text-xs leading-relaxed text-[#8a8a85]">
                    Concept designs showing the kinds of websites we create. Every real project is designed from scratch around the client&apos;s brand and goals.
                </p>
            </div>
            <div className="mt-10 grid gap-6 md:grid-cols-3">
                {concepts.map(({ tag, title, url, Site }, i) => (
                    <a key={tag} href="#inquiry" data-reveal style={{ ['--rd' as string]: `${i * 0.12}s` }} className="group block rounded-[28px] bg-[#f4f4f0] p-3 pb-4 md:p-4">
                        <Browser url={url}><Site /></Browser>
                        <div className="mt-4 flex items-end justify-between gap-3 px-1">
                            <div>
                                <span className="rounded-full bg-[#DDF5A9] px-2.5 py-1 text-[10px]">{tag}</span>
                                <p className="mt-2 text-sm">{title}</p>
                            </div>
                            <span className="text-[10px] text-[#a5a5a0]">Concept</span>
                        </div>
                    </a>
                ))}
            </div>
        </section>
    )
}
