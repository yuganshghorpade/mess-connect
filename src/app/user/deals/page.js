
import Header from "../header/page"
import Footer from "@/components/ui/footer"
export default function Deals(){
    return(
        <div>
            <div className="flex flex-col min-h-screen">
    <Header />
    
    <main className="flex-grow">
    <div>
      <h2>Nearby Daily Menus</h2>
      <ul>
        {dailyMenus.map((menu, index) => (
          <li key={index}>
            <h3>{menu.mess.name}</h3>
            <p>{menu.description}</p>
            <p>{menu.menuItems.join(", ")}</p>
            <p>Distance: {menu.mess.distance.toFixed(2)} meters away</p>
          </li>
        ))}
      </ul>
    </div>
    </main>
  
    <Footer />
  </div>
        </div>
    )
}