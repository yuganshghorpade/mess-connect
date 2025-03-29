'use client'
import Header from "../header/page"
import CreateTrade from "@/components/CreateTrade"
import ShowTrades from "@/components/ShowTrades"
export default  function Trade(){
      return (
        <div>
           <Header/>
          {/* <CreateTrade/> */}
          
          <ShowTrades/>
          
        </div>
      )
}