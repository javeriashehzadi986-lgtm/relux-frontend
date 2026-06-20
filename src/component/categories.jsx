import React from 'react'
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
const Categories = () => {
  return (
    <>

      <div><h1>Categories</h1>
        <Button variant="default">Default</Button>
        <Button variant="outline" className="hover:bg-pink-500 hover:text-white transition">Outline</Button>
        <h1 className="text-red-500 text-3xl">
          Hello
        </h1>
        <Input
          type="email"
          placeholder="Enter your email"
        />

        <Checkbox
          id="terms-checkbox-invalid"
          name="terms-checkbox-invalid"
          aria-invalid
        />
      </div></>
  )
}

export default Categories