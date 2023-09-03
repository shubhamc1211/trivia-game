import React, { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { Grid, TextField, Button } from "@mui/material";
import axios from "axios";
import APIs from "utils/APIs";
import "./UserProfileEdit.css"; // Import the CSS file for styling
import { Buffer } from "buffer";
import { useSnackbar } from "notistack";

const ProfilePage = () => {
  //debugger;
  console.log("start...");
  const { id } = useParams();
  const { enqueueSnackbar } = useSnackbar();

  const location = useLocation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  // Initial profile data state
  const [profile, setProfile] = useState();

  const [uploading, setUploading] = useState(false);

  const [selectedImage, setSelectedImage] = useState(null);
  const [base64Image, setBase64Image] = useState(null);
  const [imageUrl, setImageUrl] = useState();

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    const body = { id: id };
    const email = localStorage.getItem("email");
    // console.log(body, email);
    // if (id != localStorage.getItem("userId")) {
    //   navigate(`/login`);
    // }
    await axios
      .post(APIs.API_GET_USER, { id: id, email: email })
      .then((response) => {
        console.log(response);
        setProfile(response.data);
      });

    await axios
      .post(APIs.API_GET_USER_PROFILE_IMAGE, { id })
      .then((response) => {
        console.log(response);
        const imageUrl = response.data;
        const decodedImage = Buffer.from(imageUrl, "base64");
        setImageUrl(
          `data:image/jpeg;base64,${decodedImage.toString("base64")}`
        );
      })
      .catch((error) => {
        console.log("error :", error);
        setImageUrl("");
      });
  };

  const handleImageChange = (event) => {
    //console.log("base64 image:", base64Image);
    // console.log("handleImageChange...");
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64String = await reader.result.split(",")[1];
        setSelectedImage(file);
        await setBase64Image(base64String);

        createImageUrl(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  const createImageUrl = (base64String) => {
    console.log("createImageUrl...", base64String);
    const decodedImage = Buffer.from(base64String, "base64");
    const imageUrl = `data:image/jpeg;base64,${decodedImage.toString(
      "base64"
    )}`;
    setImageUrl(imageUrl);
  };

  const handleUpload = async (e) => {
    // console.log("handleUpload...");
    if (base64Image) {
      // Call the post function here with the base64Image data
      // Replace 'YOUR_API_ENDPOINT' with your actual server endpoint
      //console.log("base64 image:", base64Image);
      // const api_lambda =
      //   "https://zjeffhu0ki.execute-api.us-east-1.amazonaws.com/default/uploadToS3";

      await axios
        .post(APIs.API_PUT_USER_PROFILE_IMAGE, { id, base64Image }) // Replace with your backend endpoint
        .then((response) => {
          // console.log("Profile saved successfully", response);
          enqueueSnackbar("Profile Image updated successfully", {
            variant: "success",
          });
        })
        .catch((error) => {
          // console.error("Error saving profile", error);
          enqueueSnackbar("Not able to updated Profile Image", {
            variant: "error",
          });
          // Handle error case
        });
    }
  };

  // Function to handle input changes
  const handleInputChange = (event) => {
    console.log("handleInputChange...");
    const { name, value } = event.target;
    setProfile((prevProfile) => ({ ...prevProfile, [name]: value }));
  };

  // useEffect(() => {
  //   console.log("useEffect...");
  // }, [imageUrl]);

  // Function to handle save button click
  const handleSave = (e) => {
    e.preventDefault();

    // console.log("handleSave...");
    const userId = localStorage.getItem("userId");
    axios
      .post(APIs.API_UPDATE_USER, { ...profile, id })
      .then((response) => {
        // console.log("Profile saved successfully", response);
        enqueueSnackbar("Profile details updated successfully", {
          variant: "success",
        });
        navigate(`/user/${id}`); // Redirect to /user/:id
      })
      .catch((error) => {
        console.error("Error saving profile", error);
        enqueueSnackbar("Failed to update Profile details", {
          variant: "error",
        });
        // Handle error case
      });
  };

  // console.log("end...");

  return (
    <div className="profile-container">
      <h1>Edit Profile</h1>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={3}>
          <div className="profile-picture-container">
            <img
              src={imageUrl}
              alt="Profile Picture"
              className="profile-picture"
            />
          </div>
          <div className="form-group">
            <input
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              style={{ marginBottom: 10, width: "200px", height: "50px" }}
            />
            <Button variant="contained" color="primary" onClick={handleUpload}>
              Upload
            </Button>
          </div>
        </Grid>
        <Grid item xs={12} sm={9}>
          <form /*onSubmit={(e) => handleSave(e)}*/>
            <div className="form-group">
              <TextField
                id="name"
                name="name"
                label="Name"
                value={profile?.name}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleInputChange}
                required
              />
            </div>
            <div className="form-group">
              <TextField
                id="contact"
                name="contact"
                label="Contact"
                value={profile?.contact}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleInputChange}
              />
            </div>
            <div className="form-group">
              <TextField
                id="email"
                name="email"
                label="Email"
                value={profile?.email}
                fullWidth
                InputLabelProps={{
                  shrink: true,
                }}
                onChange={handleInputChange}
                required
              />
            </div>
            <Grid item xs={12} sm={9} spacing={1}>
              <div className="form-group">
                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <TextField
                      id="flatNumber"
                      name="flatNumber"
                      label="Flat Number"
                      placeholder="Flat Number"
                      value={profile?.flatNumber}
                      fullWidth
                      onChange={handleInputChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="street"
                      name="street"
                      label="Street"
                      placeholder="Street"
                      value={profile?.street}
                      fullWidth
                      onChange={handleInputChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="city"
                      name="city"
                      label="City"
                      placeholder="City"
                      value={profile?.city}
                      fullWidth
                      onChange={handleInputChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="province"
                      name="province"
                      label="Province"
                      placeholder="Province"
                      value={profile?.province}
                      fullWidth
                      onChange={handleInputChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xs={6}>
                    <TextField
                      id="country"
                      name="country"
                      label="Country"
                      placeholder="Country"
                      value={profile?.country}
                      fullWidth
                      onChange={handleInputChange}
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
              </div>
            </Grid>
            <div className="form-group">
              <TextField
                id="dob"
                name="dob"
                label="Date of Birth"
                value={profile?.dob}
                fullWidth
                onChange={handleInputChange}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </div>
            <Button
              type="submit"
              variant="contained"
              onClick={(e) => handleSave(e)}
            >
              Save
            </Button>
          </form>
        </Grid>
      </Grid>
    </div>
  );
};

export default ProfilePage;
