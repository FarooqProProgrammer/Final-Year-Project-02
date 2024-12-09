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
import { useDeleteTaskMutation, useGetAllTaskQuery } from '@/store/services/apiSlice'
import { PencilIcon, Trash2 } from 'lucide-react'

const Projects = () => {



    const router = useRouter();


    const { data, refetch } = useGetAllTaskQuery()

    const [deleteTask, { isLoading }] = useDeleteTaskMutation();



    useEffect(() => {
        console.log(data)
    }, [data])


    const handleDeleteTask = async (id: string) => {
        try {
            await deleteTask(id).unwrap();
            console.log(`Task ${id} deleted successfully`);
            refetch()
        } catch (error) {
            console.error('Error deleting task:', error);
        }
    }





    return (
        <section className='sm:px-20 space-y-4'>
            <div className='flex justify-end items-center'>
                <Button onClick={() => router.push("/task/create-task")}>Create Task</Button>
            </div>
            <Table className='bg-white rounded-2xl'>
                <TableHeader className='border-b-2 border-gray-600'>
                    <TableRow>
                        <TableHead >Task Name</TableHead>
                        <TableHead>Task Status</TableHead>
                        <TableHead>Project</TableHead>
                        <TableHead>Asignee</TableHead>

                    </TableRow>
                </TableHeader>
                <TableBody>
                    {data?.map((item, index) => (
                        <TableRow key={index}>
                            <TableCell className="font-medium">{item?.taskName}</TableCell>
                            <TableCell className="font-medium">{item?.taskStatus}</TableCell>
                            <TableCell className="font-medium">{item?.project?.projectTitle}</TableCell>

                            <TableCell className="font-medium">{item?.assignee?.username}</TableCell>
                            <TableCell className="font-medium flex justify-center items-center">
                                <div className="flex justify-center items-center gap-5">
                                    <Trash2 className='cursor-pointer' onClick={()=>handleDeleteTask(item?._id)} />
                                    <PencilIcon className='cursor-pointer' onClick={()=>router.push(`/task/update-task/${item?._id}`)} />
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
