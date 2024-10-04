'use client'
import { Button } from '@/components/ui/button'
import axios from 'axios'
import React, { useState } from 'react'

function page() {

    const [dailyMenu, setDailyMenu] = useState("")
    const createOrUpdateDailyMenu = async()=>{
        try {
            const response = await axios.post("/api/dailymenu/dailymenu-creation",{
                menu:dailyMenu
            },{
                withCredentials:true
            })
            console.log(response);
        } catch (error) {
            console.error(error)
        }
    }
  return (
    <>
    <input type="text" value={dailyMenu} onChange={(e)=>setDailyMenu(e.target.value)}/>
    <Button onClick={createOrUpdateDailyMenu}>Add/Update you daily Menu</Button>
    </>
  )
}

export default page