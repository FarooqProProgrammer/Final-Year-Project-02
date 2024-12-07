import React from 'react'
import { SidebarProvider } from '../ui/sidebar'
import { AppSidebar } from '../app-sidebar'
import { Outlet } from 'react-router-dom'
import Header from '../Header'

const DashboardProvider = () => {
    return (
        <SidebarProvider>
            <AppSidebar />
            <main className='w-full'>
   
                <Header />
                <Outlet />
            </main>
        </SidebarProvider>
    )
}

export default DashboardProvider
