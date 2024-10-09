'use client'
import Footer from "@/components/ui/footer"
import Header from "@/app/owner/header/page"
import SetDailyMenu from "../menuCreation/page"
export default function DailyMenu(){
    return (
        <div>
            <div className="flex flex-col min-h-screen">
  <Header />
  
  <main className="flex-grow">
        <SetDailyMenu/>
  </main>

  <Footer />
</div>
        </div>
    )
}