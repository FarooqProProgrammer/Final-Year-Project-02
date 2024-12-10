"use client"
import React, { useEffect, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { useGetAllProductsQuery, useDeleteProjectMutation, useUpdateProjectMutation } from "@/store/services/apiSlice";
import { PencilIcon, Trash2 } from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";

const Projects = () => {
  const { data, refetch } = useGetAllProductsQuery();
  const [deleteProduct] = useDeleteProjectMutation();
  const [updateProduct] = useUpdateProjectMutation();

  const [currentProduct, setCurrentProduct] = useState<any>(null);
  const [projectTitle, setProjectTitle] = useState("");
  const [severity, setSeverity] = useState("");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [projectStatus, setProjectStatus] = useState("");
  const [updateResponse, setUpdateResponse] = useState<string | null>(null);

  const router = useRouter();

  useEffect(() => {
    console.log(data);
  }, [data]);

  const handleDeleteProduct = async (id: string) => {
    try {
      await deleteProduct(id).unwrap();
      console.log(`Project ${id} deleted successfully`);
      refetch();
    } catch (error) {
      console.error("Error deleting project:", error);
    }
  };

  const handleUpdateProduct = (product: any) => {
    setCurrentProduct(product);
    setProjectTitle(product?.projectTitle || "");
    setSeverity(product?.severity || "");
    setStartDate(product?.startDate || "");
    setEndDate(product?.endDate || "");
    setProjectStatus(product?.projectStatus || "");
    setUpdateResponse(null);
  };

  const handleSubmitUpdate = async () => {
    // Convert startDate and endDate to string format if they are date objects
    const formattedStartDate = new Date(startDate).toISOString();
    const formattedEndDate = new Date(endDate).toISOString();

    try {
      const updatedProduct = {
        projectId: currentProduct?._id,
        projectTitle,
        severity,
        startDate: formattedStartDate,
        endDate: formattedEndDate,
        projectStatus,
      };
      await updateProduct(updatedProduct).unwrap();
      setUpdateResponse("Project updated successfully!");
      refetch();
      console.log("Update Response:", updatedProduct);
    } catch (error) {
      setUpdateResponse("Failed to update project. Please try again.");
      console.error("Error updating project:", error);
    }
  };

  return (
    <section className="lg:px-20 sm:px-10 space-y-4">
      <div className="flex justify-end items-center">
        <Button onClick={() => router.push("/projects/create-project")}>
          Create Project
        </Button>
      </div>
      <Table className="bg-white rounded-2xl">
        <TableHeader className="border-b-2 border-gray-600">
          <TableRow>
            <TableHead>Project Title</TableHead>
            <TableHead>Severity</TableHead>
            <TableHead>Start Date</TableHead>
            <TableHead>End Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data?.projects?.map((item, index) => (
            <TableRow key={index}>
              <TableCell className="font-medium">{item?.projectTitle}</TableCell>
              <TableCell className="font-medium">{item?.severity}</TableCell>
              <TableCell className="font-medium"> {new Date(item?.startDate).toLocaleDateString("en-US")}</TableCell>
              <TableCell className="font-medium">{new Date(item?.endDate).toLocaleDateString("en-US")}</TableCell>
              <TableCell className="font-medium">{item?.projectStatus}</TableCell>
              <TableCell className="font-medium flex justify-center items-center">
                <div className="flex justify-center items-center gap-5">
                  <Trash2
                    className="cursor-pointer"
                    onClick={() => handleDeleteProduct(item?._id)}
                  />
                  <Dialog>
                    <DialogTrigger onClick={() => handleUpdateProduct(item)}>
                      <PencilIcon className="cursor-pointer" />
                    </DialogTrigger>
                    <DialogContent>
                      <DialogHeader>
                        <DialogTitle>Update Project {currentProduct?.projectTitle}</DialogTitle>
                        <DialogDescription>
                          <div className="grid w-full max-w-sm items-center gap-1.5">
                            <Label htmlFor="projectTitle">Project Title</Label>
                            <Input
                              type="text"
                              id="projectTitle"
                              placeholder="Project Title"
                              value={projectTitle}
                              onChange={(e) => setProjectTitle(e.target.value)}
                            />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                            <Label htmlFor="severity">Severity</Label>
                            <Input
                              type="text"
                              id="severity"
                              placeholder="Severity"
                              value={severity}
                              onChange={(e) => setSeverity(e.target.value)}
                            />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                            <Label htmlFor="startDate">Start Date</Label>
                            <Input
                              type="date"
                              id="startDate"
                              placeholder="Start Date"
                              value={startDate}
                              onChange={(e) => setStartDate(e.target.value)}
                            />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                            <Label htmlFor="endDate">End Date</Label>
                            <Input
                              type="date"
                              id="endDate"
                              placeholder="End Date"
                              value={endDate}
                              onChange={(e) => setEndDate(e.target.value)}
                            />
                          </div>
                          <div className="grid w-full max-w-sm items-center gap-1.5 mt-3">
                            <Label htmlFor="projectStatus">Project Status</Label>
                            <Input
                              type="text"
                              id="projectStatus"
                              placeholder="Project Status"
                              value={projectStatus}
                              onChange={(e) => setProjectStatus(e.target.value)}
                            />
                          </div>
                          <Button className="mt-4" onClick={handleSubmitUpdate}>
                            Submit
                          </Button>
                          {updateResponse && (
                            <p className="mt-2 text-sm text-center">{updateResponse}</p>
                          )}
                        </DialogDescription>
                      </DialogHeader>
                    </DialogContent>
                  </Dialog>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </section>
  );
};

export default Projects;
