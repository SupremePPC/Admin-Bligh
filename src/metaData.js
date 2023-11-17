import { useEffect, useState } from "react";
import { fetchMetaData, fetchTitleData } from "./firebaseConfig/firestore";

const UpdateHeaderData = () => {
  const [metaData, setMetaData] = useState(""); // Default state is an empty string initially
  const [pageTitle, setPageTitle] = useState("");

  useEffect(() => {
    // Fetch initial data from your API
    const fetchData = async () => {
      try {
        const initialMetaData = await fetchMetaData();
        const initialTitle = await fetchTitleData();

        // Set the default state
        setMetaData(initialMetaData || "Default Meta Data");
        setPageTitle(initialTitle || "Default Page Title");
      } catch (error) {
        console.error("Error fetching initial data:", error);
      }
    };

    fetchData();
  }, []); // Run only once when the component mounts

  // Function to update the meta data in the HTML head
  const updateMetaData = () => {
    const metaElement = document.querySelector("meta[name='description']");
    if (metaElement) {
      metaElement.setAttribute("content", metaData);
    }
  };

  // Function to update the title in the HTML head
  const updateTitle = () => {
    document.title = pageTitle;
  };

  useEffect(() => {
    updateMetaData();
  }, [metaData]);

  useEffect(() => {
    updateTitle();
  }, [pageTitle]);

  return null;
};

export default UpdateHeaderData;
