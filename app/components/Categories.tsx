import { categories } from '../data/categories'
import Link from 'next/link'

export default function Categories() {
    return (
        <section className="px-6 py-12 max-w-6xl mx-auto">
            <h2 className="text-3xl font-bold text-[#3E4C37] mb-2">Choose a category</h2>
            <p className="text-gray-600 mb-8">Select what you need help with.</p>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categories.map((cat, idx) => (
                    <Link
                        href={`/category/${cat.slug}`}
                        key={idx}
                        className="block group touch-manipulation active:scale-95 transition-transform duration-100"
                    >
                        <div className="bg-white p-6 rounded-3xl shadow-sm group-hover:shadow-md group-active:bg-[#F3F0E9] transition-colors duration-200 h-full flex flex-col items-start cursor-pointer">
                            <div className="w-12 h-12 bg-[#F3F0E9] rounded-xl flex items-center justify-center mb-4 text-[#333333] group-hover:bg-[#EBE7DE] transition-colors">
                                <cat.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-bold text-[#333333] mb-2">{cat.title}</h3>
                            <p className="text-gray-500 text-sm leading-relaxed">{cat.desc}</p>
                        </div>
                    </Link>
                ))}
            </div>
        </section>
    )
}
