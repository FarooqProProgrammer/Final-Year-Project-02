"use client"
import { useGetAllUserDetailsQuery } from '@/store/services/apiSlice'
import React, { useEffect } from 'react'

import {
    Table,
    TableBody,
    TableCaption,
    TableCell,
    TableFooter,
    TableHead,
    TableHeader,
    TableRow
} from "@/components/ui/table"  // Ensure this path is correct

import { Button } from '@/components/ui/button'  // Ensure this path is correct

const Users = () => {
    const { data: users, isLoading } = useGetAllUserDetailsQuery()

    useEffect(() => {
        if (users) {
            console.log(users)
        }
    }, [users])

    if (isLoading) {
        return <div>Loading...</div>
    }

    return (
        <div className='sm:px-20'>
            <Button>Create User</Button>
            <Table className="bg-white">
                <TableCaption>List of all users.</TableCaption>
                <TableHeader>
                    <TableRow>
                        <TableHead className="w-[100px]">#</TableHead>
                        <TableHead>Username</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Role</TableHead>
                        <TableHead className="text-right">Admin</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {users?.users?.map((user, index) => (
                        <TableRow key={user._id}>
                            <TableCell className="font-medium">{index + 1}</TableCell>
                            <TableCell>{user.username}</TableCell>
                            <TableCell>{user.email}</TableCell>
                            <TableCell>{user.roles?.join(', ')}</TableCell>
                            <TableCell className="text-right">{user.isAdmin ? "Yes" : "No"}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
                <TableFooter>
                    <TableRow>
                        <TableCell colSpan={5} className="text-right">
                            Total Users: {users?.users?.length || 0}
                        </TableCell>
                    </TableRow>
                </TableFooter>
            </Table>
        </div>
    )
}

export default Users
