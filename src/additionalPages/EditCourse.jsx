import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import Swal from "sweetalert2";
import { updateGolfCourseApi } from "../utils/uploadApi";

const EditCourse = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courseData = location.state?.courseData;

  const [formData, setFormData] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    description: "",
    holesCount: 18,
    facilities: "",
    contact: "",
  });

  const [loading, setLoading] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [galleryFiles, setGalleryFiles] = useState([]);

  useEffect(() => {
    if (courseData) {
      setFormData({
        name: courseData.name || "",
        address: courseData.address || "",
        city: courseData.city || "",
        state: courseData.state || "",
        description: courseData.description || "",
        holesCount: courseData.holesCount || 18,
        facilities: Array.isArray(courseData.facilities) ? courseData.facilities.join(", ") : courseData.facilities || "",
        contact: courseData.contact?.phone || "",
      });
    }
  }, [courseData]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImageFile(file);
    }
  };

  const handleGalleryChange = (e) => {
    const files = Array.from(e.target.files);
    setGalleryFiles(files);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validation
    const requiredFields = ["name", "address", "city", "state", "description"];
    const missingFields = requiredFields.filter(field => !formData[field].trim());
    
    if (missingFields.length > 0) {
      Swal.fire("Error", `Please fill in all required fields: ${missingFields.join(", ")}`, "error");
      return;
    }

    try {
      setLoading(true);
      
      // Create FormData for file upload
      const submitData = new FormData();
      
      // Add form fields
      Object.keys(formData).forEach(key => {
        submitData.append(key, formData[key]);
      });
      
      // Add files if selected
      if (imageFile) {
        submitData.append('image', imageFile);
      }
      
      if (galleryFiles.length > 0) {
        galleryFiles.forEach(file => {
          submitData.append('gallery', file);
        });
      }
      
      console.log("Submitting course update:", {
        courseId: courseData._id,
        formData: formData,
        hasImage: !!imageFile,
        galleryCount: galleryFiles.length
      });
      
      const response = await updateGolfCourseApi(courseData._id, submitData);
      
      if (response.status) {
        Swal.fire({
          title: "Success!",
          text: "Golf course updated successfully!",
          icon: "success",
          confirmButtonText: "OK"
        }).then(() => {
          navigate("/golf-courses");
        });
      } else {
        throw new Error(response.message || "Failed to update course");
      }
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire("Error", error.message || "Failed to update golf course", "error");
    } finally {
      setLoading(false);
    }
  };

  if (!courseData) {
    return (
      <div className="app-content">
        <div className="app-title tile p-3">
          <h1><span className="mr-4 fw-bold">Edit Golf Course</span></h1>
        </div>
        <div className="container-fluid">
          <div className="alert alert-warning">
            No course data found. Please go back and select a course to edit.
          </div>
          <button className="btn btn-secondary" onClick={() => navigate("/golf-courses")}>
            Back to Golf Courses
          </button>
        </div>
      </div>
    );
  }

  return (
    <main className="app-content">
      <div className="app-title tile p-3">
        <h1><span className="mr-4 fw-bold">Edit Golf Course - {courseData.name}</span></h1>
      </div>

      <div className="container-fluid">
        <div className="row">
          <div className="col-md-12">
            <div className="tile">
              <div className="tile-body">
                <form onSubmit={handleSubmit}>
                  <div className="row">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="name" className="form-label">Course Name *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="name"
                          name="name"
                          value={formData.name}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="address" className="form-label">Address *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="address"
                          name="address"
                          value={formData.address}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="city" className="form-label">City *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="city"
                          name="city"
                          value={formData.city}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="state" className="form-label">State *</label>
                        <input
                          type="text"
                          className="form-control"
                          id="state"
                          name="state"
                          value={formData.state}
                          onChange={handleInputChange}
                          required
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-12">
                      <div className="form-group">
                        <label htmlFor="description" className="form-label">Description *</label>
                        <textarea
                          className="form-control"
                          id="description"
                          name="description"
                          rows="4"
                          value={formData.description}
                          onChange={handleInputChange}
                          required
                        ></textarea>
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-4">
                      <div className="form-group">
                        <label htmlFor="holesCount" className="form-label">Number of Holes</label>
                        <select
                          className="form-control"
                          id="holesCount"
                          name="holesCount"
                          value={formData.holesCount}
                          onChange={handleInputChange}
                        >
                          <option value={9}>9 Holes</option>
                          <option value={18}>18 Holes</option>
                          <option value={27}>27 Holes</option>
                          <option value={36}>36 Holes</option>
                        </select>
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label htmlFor="facilities" className="form-label">Facilities</label>
                        <input
                          type="text"
                          className="form-control"
                          id="facilities"
                          name="facilities"
                          value={formData.facilities}
                          onChange={handleInputChange}
                          placeholder="e.g., Pro Shop, Restaurant, Driving Range"
                        />
                      </div>
                    </div>
                    <div className="col-md-4">
                      <div className="form-group">
                        <label htmlFor="contact" className="form-label">Contact Phone</label>
                        <input
                          type="text"
                          className="form-control"
                          id="contact"
                          name="contact"
                          value={formData.contact}
                          onChange={handleInputChange}
                          placeholder="Phone number"
                        />
                      </div>
                    </div>
                  </div>

                  <div className="row mt-3">
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="courseImage" className="form-label">Main Image</label>
                        <input
                          type="file"
                          className="form-control"
                          id="courseImage"
                          accept="image/*"
                          onChange={handleImageChange}
                        />
                        {courseData.image && (
                          <small className="form-text text-muted">
                            Current image: {courseData.image}
                          </small>
                        )}
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="form-group">
                        <label htmlFor="courseGallery" className="form-label">Gallery Images</label>
                        <input
                          type="file"
                          className="form-control"
                          id="courseGallery"
                          accept="image/*"
                          multiple
                          onChange={handleGalleryChange}
                        />
                        {courseData.gallery && courseData.gallery.length > 0 && (
                          <small className="form-text text-muted">
                            Current gallery: {courseData.gallery.length} images
                          </small>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="row mt-4">
                    <div className="col-md-12">
                      <div className="d-flex justify-content-end">
                        <button
                          type="button"
                          className="btn btn-secondary me-2"
                          onClick={() => navigate("/golf-courses")}
                          disabled={loading}
                        >
                          Cancel
                        </button>
                        <button
                          type="submit"
                          className="btn btn-primary"
                          disabled={loading}
                        >
                          {loading ? "Updating..." : "Update Course"}
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default EditCourse;
