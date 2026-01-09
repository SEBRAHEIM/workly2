import StudentNavbar from '@/app/components/StudentNavbar'
import Hero from '@/app/components/Hero'

export const dynamic = 'force-dynamic'
import Categories from '@/app/components/Categories'
import Features from '@/app/components/Features'
import Footer from '@/app/components/Footer'

export default function StudentDashboard() {
    return (
        <div className="min-h-screen">
            <Hero hideCta={true} />
            <Categories />
            <Features hideCta={true} />
            <Footer />
        </div>
    )
}
