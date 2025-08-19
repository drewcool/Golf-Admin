import React, { useState, useEffect } from "react";
import Swal from "sweetalert2";
import "dropify/dist/css/dropify.css";
import $ from "jquery";
import "dropify";
import { useNavigate } from "react-router-dom";
import { addCourseApi } from "../utils/uploadApi"; // Adjust this path

const AddCourse = () => {
  const navigate = useNavigate();

  const [courseForm, setCourseForm] = useState({
    name: "",
    address: "",
    city: "",
    state: "",
    description: "",
    holesCount: "18",
    facilities: "",
    contact: "",
    image: null,
    gallery: [],
  });

  const [errors, setErrors] = useState({});
  const [touched, setTouched] = useState({});

  useEffect(() => {
    $(".dropify").dropify();
    return () => {
      try { $(".dropify").dropify("destroy"); } catch {}
    };
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCourseForm((prev) => ({ ...prev, [name]: value }));
    
    // Clear error when field is updated
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleFileChange = (e) => {
    const { name, files } = e.target;
    if (name === "gallery") {
      setCourseForm((prev) => ({ ...prev, gallery: Array.from(files) }));
    } else {
      setCourseForm((prev) => ({ ...prev, [name]: files[0] }));
    }
    
    // Clear error when file is selected
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: "" }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate required fields (matching backend requirements)
    const newErrors = {};
    const requiredFields = ["name", "address", "city", "state", "description"];
    
    requiredFields.forEach(field => {
      if (!courseForm[field]) {
        newErrors[field] = "This field is required";
        setTouched(prev => ({ ...prev, [field]: true }));
      }
    });

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Do you want to add this course?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: "Yes, Continue",
    });

    if (!result.isConfirmed) return;

    // Option A: If backend requires creating course first, call API and pass back the new courseId to holes page.
    // Option B: Skip API now and collect holes first. Below shows Option A with graceful fallback.

    try {
      const formData = new FormData();
      Object.keys(courseForm).forEach((key) => {
        if (key === "gallery") {
          courseForm.gallery.forEach((file) => formData.append("gallery", file));
        } else {
          formData.append(key, courseForm[key]);
        }
      });

      // Call your API (adjust response handling to your backend)
      const res = await addCourseApi(formData);
      
      // Debug: Log the API response
      console.log('=== FULL API RESPONSE DEBUG ===');
      console.log('API Response:', res);
      console.log('Response type:', typeof res);
      console.log('Response keys:', Object.keys(res || {}));
      console.log('Course object:', res?.course);
      console.log('Course _id:', res?.course?._id);
      console.log('Course keys:', Object.keys(res?.course || {}));
      console.log('Response structure:', {
        status: res?.status,
        course: res?.course,
        courseId: res?.course?._id,
        message: res?.message
      });
      
      if (res && res.status) {
        await Swal.fire("Success", res.message || "Course created. Now add holes.", "success");

        // Extract courseId from the course object returned by the API
        const courseId = res.course?._id;
        console.log('=== EXTRACTED COURSE ID ===');
        console.log('Final extracted courseId:', courseId);
        console.log('courseId type:', typeof courseId);
        console.log('courseId truthy check:', !!courseId);
        
        if (!courseId) {
          console.error('❌ ERROR: No courseId found in API response!');
          console.error('Available data:', res);
          console.error('Course object:', res.course);
          Swal.fire("Error", "Course created but no ID returned. Please contact support.", "error");
          return;
        }
        
        console.log('=== NAVIGATION STATE ===');
        const navigationState = {
          courseId: courseId,
          courseName: courseForm.name,
          holesCount: Number(courseForm.holesCount) || 18,
        };
        console.log('Navigation state:', navigationState);
        
        navigate("/courses/new/holes", { state: navigationState });
      } else {
        throw new Error(res?.message || "Unexpected response format");
      }
    } catch (err) {
      console.error("Course submission error:", err);
      Swal.fire("Error", err?.message || "Something went wrong", "error");
    }
  };

  return (
    <main className="app-content">
      <div className="app-title tile p-3">
        <h1><span className="mr-4 fw-bold">Add Course</span></h1>
      </div>
      <div className="row justify-content-center">
        <div className="col-md-10">
          <div className="tile">
            <div className="case-status d-flex justify-content-center" style={{ backgroundColor: "#00489d", color: "#fff", height: "50px" }}>
              <h4 className="mt-2">Add New Course</h4>
            </div>
            <div className="tile-body p-3">
              <form onSubmit={handleSubmit} encType="multipart/form-data">
                {["name", "address", "city", "state", "holesCount", "facilities", "contact"].map((field) => (
                  <div className="mb-3" key={field}>
                    <label className="form-label">
                      {field.charAt(0).toUpperCase() + field.slice(1)}
                      <span className="text-danger">*</span>
                    </label>
                    <input
                      type={field === "holesCount" ? "number" : "text"}
                      className={`form-control ${errors[field] && touched[field] ? 'is-invalid' : ''}`}
                      name={field}
                      value={courseForm[field]}
                      onChange={handleChange}
                      onBlur={() => setTouched(prev => ({ ...prev, [field]: true }))}
                      min={field === "holesCount" ? 1 : undefined}
                    />
                    {errors[field] && touched[field] && (
                      <div className="invalid-feedback">{errors[field]}</div>
                    )}
                  </div>
                ))}

                <div className="mb-3">
                  <label className="form-label">
                    Description
                    <span className="text-danger">*</span>
                  </label>
                  <textarea
                    className={`form-control ${errors.description && touched.description ? 'is-invalid' : ''}`}
                    name="description"
                    value={courseForm.description}
                    onChange={handleChange}
                    onBlur={() => setTouched(prev => ({ ...prev, description: true }))}
                    rows="4"
                  />
                  {errors.description && touched.description && (
                    <div className="invalid-feedback">{errors.description}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">
                    Main Image
                    <span className="text-danger">*</span>
                  </label>
                  <input
                    type="file"
                    className={`dropify ${errors.image && touched.image ? 'is-invalid' : ''}`}
                    name="image"
                    accept="image/*"
                    onChange={handleFileChange}
                    onBlur={() => setTouched(prev => ({ ...prev, image: true }))}
                  />
                  {errors.image && touched.image && (
                    <div className="invalid-feedback">{errors.image}</div>
                  )}
                </div>

                <div className="mb-3">
                  <label className="form-label">Gallery Images</label>
                  <input
                    type="file"
                    className="dropify"
                    name="gallery"
                    accept="image/*"
                    multiple
                    onChange={handleFileChange}
                  />
                </div>

                <button type="submit" className="btn btn-primary">Add Course</button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default AddCourse;
