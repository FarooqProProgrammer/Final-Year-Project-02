"use client"
import React, { useEffect } from 'react'


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import { Button } from '@/components/ui/button'
import { useRouter } from 'next/navigation'
import { useGetAllProductsQuery } from '@/store/services/apiSlice'
import { PencilIcon, Trash2 } from 'lucide-react'

const Projects = () => {

    const invoices = [
        {
            invoice: "INV001",
            paymentStatus: "Paid",
            totalAmount: "$250.00",
            paymentMethod: "Credit Card",
        },
        {
            invoice: "INV002",
            paymentStatus: "Pending",
            totalAmount: "$150.00",
            paymentMethod: "PayPal",
        },
        {
            invoice: "INV003",
            paymentStatus: "Unpaid",
            totalAmount: "$350.00",
            paymentMethod: "Bank Transfer",
        },
        {
            invoice: "INV004",
            paymentStatus: "Paid",
            totalAmount: "$450.00",
            paymentMethod: "Credit Card",
        },
        {
            invoice: "INV005",
            paymentStatus: "Paid",
            totalAmount: "$550.00",
            paymentMethod: "PayPal",
        },
        {
            invoice: "INV006",
            paymentStatus: "Pending",
            totalAmount: "$200.00",
            paymentMethod: "Bank Transfer",
        },
        {
            invoice: "INV007",
            paymentStatus: "Unpaid",
            totalAmount: "$300.00",
            paymentMethod: "Credit Card",
        },
    ]

    const router = useRouter();


    const { data  } = useGetAllProductsQuery()


    useEffect(()=>{
        console.log(data)
    },[data])


    return (
        <section className='sm:px-20 space-y-4'>
            <div className='flex justify-end items-center'>
                <Button onClick={()=>router.push("/project/create-project")}>Create Project</Button>
            </div>
            <Table className='bg-white rounded-2xl'>
                <TableHeader className='border-b-2 border-gray-600'>
                    <TableRow>
                        <TableHead >Project Title</TableHead>
                        <TableHead>Severity</TableHead>
                        <TableHead>Start Date</TableHead>
                        <TableHead>End Date</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Assignee</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.projects?.map((item,index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item?.projectTitle}</TableCell>
                            <TableCell className="font-medium">{item?.severity}</TableCell>
                            <TableCell className="font-medium">{item?.startDate}</TableCell>
                            <TableCell className="font-medium">{item?.endDate}</TableCell>
                            <TableCell className="font-medium">{item?.projectStatus}</TableCell>
                            <TableCell className="font-medium">{item?.userId?.username}</TableCell>
                            <TableCell className="font-medium flex justify-center items-center">
                                <div className="flex justify-center items-center gap-5">
                                    <Trash2 className='cursor-pointer' />
                                    <PencilIcon className='cursor-pointer' />
                                </div>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
        </section>
    )
}

export default Projects
