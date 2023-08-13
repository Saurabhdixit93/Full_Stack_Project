import React, { useState, useEffect } from "react";
import EditDetailsForm from "./EditDetailsForm";
import AdditionalDetailsForm from "./AdditionalDetailsForm";
import makeRequest from "../../Axios/axiosReq";
import { getTokenCookie } from "../../AuthCookie/authToken";

const UserDetails = () => {
  const user = getTokenCookie();
  let userId = "";
  if (user) {
    const tokenPayload = JSON.parse(atob(user.split(".")[1]));
    userId = tokenPayload.userId;
  }
  const [hasDetails, setHasDetails] = useState(false);
  const [existingDetails, setExistingDetails] = useState(null); // Initialize with null

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        await makeRequest(`/user/check-details/${userId}`, "GET", user, null)
          .then((data) => {
            setHasDetails(data.hasDetails);
            if (data.details) {
              setExistingDetails(data.details);
            }
            return;
          })
          .catch((error) => {
            alert("Server Error");
            return;
          });
      } catch (error) {
        console.error("Error checking details:", error);
      }
    };

    fetchDetails();
  }, []);

  return (
    <div>
      {hasDetails ? (
        <EditDetailsForm initialValues={existingDetails} />
      ) : (
        <AdditionalDetailsForm />
      )}
    </div>
  );
};

export default UserDetails;
