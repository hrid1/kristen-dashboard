import { Edit } from 'lucide-react'
import React from 'react'

export default function JurnalDetailsPage() {
    return (
        <div className='w-[517px] border border-[#ECEFF3] rounded-lg mt-6'>
            <div className=' p-4'>
                <div className='flex justify-between'>
                    <p className="text-[#1F2937] font-sfdisplay text-[20px] font-semibold leading-[142%] tracking-[0.1px]"
                    >Morning Reflections</p>
                    <div className='flex-col p-[12px] bg-[#C6A664] rounded-lg text-white'><button className='flex gap-[12px]'><Edit className='text-white' /> <p>Edit</p></button></div>
                </div>
                <p className='mt-6'>Today I woke up feeling grateful for the small moments that bring joy. The sunrise reminded me that each day is a new beginning...</p>
                <div className='flex justify-between'>
                    <div className='flex gap-[6px] mt-5 text-white font-sfdisplay text-[12px] font-normal leading-[100%]'>
                        <button className='bg-[#C6A664] px-2 py-1 rounded-lg'>Gratitude</button>
                        <button className='bg-[#C6A664] px-2 py-1 rounded-lg'>Morning</button>
                        <button className='bg-[#C6A664] px-2 py-1 rounded-lg'>+1</button>
                    </div>
                    <div className='mt-7'>
                        <p className="text-[#A5A5AB] font-sfdisplay text-[12px] font-medium leading-[100%] tracking-[1px]"
                        >Posted on: 2025-10-01</p>
                    </div>
                </div>
            </div>
        </div>
    )
}
