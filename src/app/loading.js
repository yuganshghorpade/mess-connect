'use client'
import { ReloadIcon } from "@radix-ui/react-icons"
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button"
export default function Loading(){
    return(
        <>
            <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <motion.div
        className="w-16 h-16 border-4 border-green-500 border-t-transparent rounded-full animate-spin"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
      ></motion.div>
      <p className="mt-4 text-lg text-gray-700">Loading, please wait...</p>
    </div>
        </>
    )
}