"use client"
import Link from "next/link";
import {
  Activity,
  ArrowUpRight,
  CreditCard,
  DollarSign,
  Users,
} from "lucide-react";

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import Currency from "@/components/currancy";
import { useGetAllProductsQuery, useGetProjectCountsQuery, useGetTotalCountsQuery, useLazyGetReportQuery } from "@/store/services/apiSlice";
import { useEffect } from "react";

export default function Dashboard() {

  const [triggerGetReport] = useLazyGetReportQuery();


  const { data, isLoading } = useGetTotalCountsQuery();
  const { data: projectData, isLoading: projectLoading } = useGetAllProductsQuery();

  useEffect(() => {
    console.log(projectData)
  }, [projectData])


  const handleDownloadReport = async () => {
    try {
      // Make the API call to fetch the report
      const response = await triggerGetReport().unwrap();
      console.log(response.fileUrl); // Ensure that the fileUrl is present in the response

      // Create an anchor element
      const a = document.createElement('a');
      a.href = response.fileUrl; // Set the href to the URL received from the response
      a.target = '_blank'; // Open the link in a new tab
      a.click(); // Simulate a click to open the link

    } catch (error) {
      console.error("Error downloading the report:", error);
    }
  };






  return (
    <main className="flex flex-1 flex-col gap-4 p-4 md:gap-8 md:p-8">
      <div>
        <Button onClick={handleDownloadReport}>Download Report</Button>
      </div>
      <div className="grid gap-4 md:grid-cols-2 md:gap-8 lg:grid-cols-4">
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Projects</CardTitle>

          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Currency value={data?.project} />
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Task</CardTitle>

          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Currency value={data?.TaskCount} />
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Completed Task</CardTitle>

          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Currency value={data?.completedTask} />
            </div>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-0">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total In Progress Task</CardTitle>

          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              <Currency value={data?.InProgress} />
            </div>
          </CardContent>
        </Card>
      </div>
      <div className="grid gap-4 md:gap-8 lg:grid-cols-2 xl:grid-cols-3">
        <Card className="xl:col-span-2" x-chunk="dashboard-01-chunk-4">
          <CardHeader className="flex flex-row items-center">
            <div className="grid gap-2">
              <CardTitle>Projects</CardTitle>
              <CardDescription>
                Recent Projects.
              </CardDescription>
            </div>
            <Button asChild size="sm" className="ml-auto gap-1">
              <Link href="/projects">
                View All
                <ArrowUpRight className="h-4 w-4" />
              </Link>
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Project Title</TableHead>
                  <TableHead className="hidden xl:table-column">Type</TableHead>
                  <TableHead className="hidden xl:table-column">
                    Status
                  </TableHead>
                  <TableHead className="hidden xl:table-column">Date</TableHead>
                  <TableHead className="text-right">End Date</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {
                  projectData?.projects?.map((item, index) => {
                    return (
                      <TableRow key={index}>
                        <TableCell>
                          <div className="hidden text-sm text-muted-foreground md:inline">
                          {item?.projectTitle}
                          </div>
                        </TableCell>
                        <TableCell></TableCell>
                        <TableCell className="text-end">
                          <div className="hidden   text-sm text-muted-foreground md:inline">
                          {item?.endDate}
                          </div>
                        </TableCell>

                
                      </TableRow>
                    )
                  })
                }
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        <Card x-chunk="dashboard-01-chunk-5">
          <CardHeader>
            <CardTitle>Recent Sales</CardTitle>
          </CardHeader>
          <CardContent className="grid gap-8">
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/01.png" alt="Avatar" />
                <AvatarFallback>OM</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Olivia Martin
                </p>
                <p className="text-sm text-muted-foreground">
                  olivia.martin@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$1,999.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/02.png" alt="Avatar" />
                <AvatarFallback>JL</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Jackson Lee</p>
                <p className="text-sm text-muted-foreground">
                  jackson.lee@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$39.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/03.png" alt="Avatar" />
                <AvatarFallback>IN</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">
                  Isabella Nguyen
                </p>
                <p className="text-sm text-muted-foreground">
                  isabella.nguyen@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$299.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/04.png" alt="Avatar" />
                <AvatarFallback>WK</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">William Kim</p>
                <p className="text-sm text-muted-foreground">will@email.com</p>
              </div>
              <div className="ml-auto font-medium">+$99.00</div>
            </div>
            <div className="flex items-center gap-4">
              <Avatar className="hidden h-9 w-9 sm:flex">
                <AvatarImage src="/avatars/05.png" alt="Avatar" />
                <AvatarFallback>SD</AvatarFallback>
              </Avatar>
              <div className="grid gap-1">
                <p className="text-sm font-medium leading-none">Sofia Davis</p>
                <p className="text-sm text-muted-foreground">
                  sofia.davis@email.com
                </p>
              </div>
              <div className="ml-auto font-medium">+$39.00</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
