import { useState, useEffect } from "react";
import axiosInstance from "../lib/axiosConfig";



const useGetUsers = () => {
  // State to hold users data, loading state, and error state
  const [allUsers, setAllUsers] = useState<users[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch all users
  const fetchAllUsers = async () => {
    setLoading(true); // Set loading state to true when starting fetch
    try {
      const response = await axiosInstance.get("/auth/get-all-users");
      setAllUsers(response.data.users); // Set the data in state
      setLoading(false); // Set loading state to false after data is fetched
    } catch (err: any) {
      setError("Failed to fetch users"); // Set error state if the request fails
      setLoading(false); // Set loading state to false if there's an error
    }
  };

  // UseEffect to fetch users when the component mounts
  useEffect(() => {
    fetchAllUsers();
  }, []); // Empty dependency array ensures it runs only once on mount

  return { allUsers, loading, error };
};

export default useGetUsers;
