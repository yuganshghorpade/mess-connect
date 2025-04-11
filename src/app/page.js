import Image from "next/image";
import Login from "./login/page";
import LandingPage from "@/components/LandingPage";
import Content from "./user/Content/page";

export default function Home() {
  return (<div>
     <LandingPage />
     <Content />
     <footer className="bg-white shadow-inner py-4 text-center text-gray-600 text-sm">
        © {new Date().getFullYear()} Mess Connect. All rights reserved.
      </footer>

    </div>
  );
}
