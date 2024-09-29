'use client'
import Header from "./header/page";
import Footer from "@/components/ui/footer";
import Content from "./Content/page";
export default function User() {
    return (
        <div className="flex flex-col min-h-screen">
            <Header />
            <main className="flex-grow">
               <Content/>
            </main>
            <Footer />
        </div>
    );
}
