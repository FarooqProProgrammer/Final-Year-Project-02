import React, { useState, useEffect } from 'react';
import DataTable, { TableColumn } from 'react-data-table-component';
import { Button } from '../../../components/ui/button';
import { useNavigate } from 'react-router-dom';
import axiosInstance from '../../../lib/axiosConfig';
import { toast } from '../../../hooks/use-toast';

// Define the columns for the DataTable
const Project = () => {
    const [projectsData, setProjectsData] = useState<projects[]>([]); // State for holding projects
    const [filteredData, setFilteredData] = useState<projects[]>([]); // State for filtered projects
    const [loading, setLoading] = useState<boolean>(true); // Loading state
    const [error, setError] = useState<string | null>(null); // Error state
    const [searchQuery, setSearchQuery] = useState<string>(''); // State for search query
    const [selectedProjects, setSelectedProjects] = useState<string[]>([]); // State for selected projects
    const router = useNavigate();

    const fetchProjects = async () => {
        try {
            const response = await axiosInstance.get('/get-all-project');
            setProjectsData(response.data.projects); // Set the fetched data
            setFilteredData(response.data.projects); // Initially set filtered data to all projects
            setLoading(false); // Set loading to false after fetching
        } catch (err) {
            setError('Failed to fetch projects');
            setLoading(false); // Set loading to false even if there is an error
        }
    };

    // Fetch projects data from the server
    useEffect(() => {


        fetchProjects(); // Call the function to fetch data when the component mounts
    }, []);

    // Handle search input change
    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const query = event.target.value;
        setSearchQuery(query);
        filterData(query); // Filter the data based on search query
    };

    // Filter data based on the search query
    const filterData = (query: string) => {
        if (!query) {
            setFilteredData(projectsData); // If search query is empty, show all data
        } else {
            const filtered = projectsData.filter(project =>
                project.projectTitle?.toLowerCase().includes(query.toLowerCase()) || // Search in project title
                project.severity?.toLowerCase().includes(query.toLowerCase()) || // Search in severity
                project.projectStatus?.toLowerCase().includes(query.toLowerCase()) || // Search in project status
                project.userId?.username?.toLowerCase().includes(query.toLowerCase()) // Search in assignee
            );
            setFilteredData(filtered); // Set the filtered data
        }
    };

    // Handle checkbox change (select/deselect a project)
    const handleCheckboxChange = (id: string) => {
        setSelectedProjects(prevState =>
            prevState.includes(id)
                ? prevState.filter(projectId => projectId !== id) // Deselect if already selected
                : [...prevState, id] // Select the project
        );
    };

    // Handle delete action (e.g., API call to delete selected projects)
    const handleDeleteSelected = async () => {
        console.log(selectedProjects)

        const response = await axiosInstance.post("/delete-projects", { ids: selectedProjects })

        if (response.status === 200) {
            toast({
                title: "Delete Success",
                description: "Project Deleted Success"
            })

            fetchProjects()
        }

    };

    // If data is loading, show loading indicator
    if (loading) {
        return <div>Loading...</div>;
    }

    // If there is an error, display the error message
    if (error) {
        return <div>{error}</div>;
    }

    // Define the columns with selectedProjects and handleCheckboxChange passed
    const columns: TableColumn<projects[]> = [
        {
            name: 'Select',
            cell: (row: projects) => (
                <input
                    type="checkbox"
                    checked={selectedProjects.includes(row._id!)}
                    onChange={() => handleCheckboxChange(row._id!)}
                />
            ),
            ignoreRowClick: true, // Prevent clicking the checkbox from selecting the row
            allowOverflow: true,
            button: true,
        },
        {
            name: 'ID',
            selector: (_, index) => index + 1, // Map ID as index + 1
            sortable: true, // Optional: make it sortable
        },
        {
            name: 'Project Title',
            selector: row => row.projectTitle,
        },
        {
            name: 'Severity',
            selector: row => row.severity,
        },
        {
            name: 'Start Date',
            selector: row => row.startDate,
            format: row => new Date(row.startDate).toLocaleDateString(), // Format date
        },
        {
            name: 'End Date',
            selector: row => row.endDate,
            format: row => new Date(row.endDate).toLocaleDateString(), // Format date
        },
        {
            name: 'Project Status',
            selector: row => row.projectStatus,
        },
        {
            name: 'Assignee',
            selector: row => row.userId?.username, // Assuming userId has a username
        },
        {
            name: 'Created At',
            selector: row => row.createdAt,
            format: row => new Date(row.createdAt).toLocaleDateString(), // Format date
        },
        {
            name: 'Updated At',
            selector: row => row.updatedAt,
            format: row => new Date(row.updatedAt).toLocaleDateString(), // Format date
        },
        {
            name: 'Actions',
            cell: (row: projects) => (
                <Button onClick={() => router(`/project/edit-project/${row._id}`)} className="">
                    Edit
                </Button>
            ),
        }

    ];

    return (
        <section className="  py-5 max-w-[90%] mx-auto space-y-5">
            <div className="flex justify-end space-x-4">
                <Button onClick={() => router('/project/create-project')}>Create Project</Button>

                {/* Show delete button if any project is selected */}
                {selectedProjects.length > 0 && (
                    <Button onClick={handleDeleteSelected} className="bg-red-600">
                        Delete Selected
                    </Button>
                )}
            </div>

            {/* Search Bar */}
            <div className="mb-4">
                <input
                    type="text"
                    placeholder="Search Projects..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-4 py-2 border rounded-md"
                />
            </div>

            <div className="border border-gray-300 ">
                <DataTable
                    columns={columns}
                    data={filteredData}
                    pagination
                    responsive
                />
            </div>
        </section>
    );
};

export default Project;
