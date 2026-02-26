import SupportForm from '@/app/components/SupportForm'

export default function CreatorSupportPage() {
    return (
        <div className="max-w-4xl mx-auto p-4 md:p-8 pb-24 font-outfit">
            <div className="mb-12">
                <h1 className="text-3xl md:text-4xl font-sans font-black text-[#0EA5E9] mb-2 uppercase tracking-tighter">Support Center</h1>
                <p className="text-sm md:text-base text-gray-500 font-medium">Have a question or running into an issue? We're here to help.</p>
            </div>

            <div className="max-w-2xl">
                <SupportForm />
            </div>
        </div>
    )
}
