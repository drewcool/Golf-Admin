import React, { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCourseHoles } from "../services/holeApi";
import { mediaUrl } from "../utils/URL";

const ViewCourseDetails = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courseData = location.state?.courseData;

  const [holes, setHoles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHoles = async () => {
      if (courseData?._id) {
        try {
          setLoading(true);
          const response = await getCourseHoles(courseData._id);
          if (response.status && response.data.holes) {
            setHoles(response.data.holes);
          } else {
            setHoles([]);
          }
        } catch (error) {
          console.error("Error fetching holes:", error);
          setError("Failed to load holes data");
          setHoles([]);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchHoles();
  }, [courseData]);

  if (!courseData) {
    return (
      <div className="app-content">
        <div className="app-title tile p-3">
          <h1><span className="mr-4 fw-bold">Course Details</span></h1>
        </div>
        <div className="container-fluid">
          <div className="alert alert-warning">
            No course data found. Please go back and select a course to view.
          </div>
          <button className="btn btn-secondary" onClick={() => navigate("/golf-courses")}>
            Back to Golf Courses
          </button>
        </div>
      </div>
    );
  }

  const renderCoordinateSection = (sectionData, sectionName) => {
    if (!sectionData || !sectionData.enabled || !sectionData.coordinates || sectionData.coordinates.length === 0) {
      return <span className="text-muted">Not configured</span>;
    }

    return (
      <div>
        <strong>{sectionName}:</strong>
        <ul className="list-unstyled ms-3">
          {sectionData.coordinates.map((coord, index) => (
            <li key={index}>
              <small>
                {coord.lat && coord.lng ? `${coord.lat}, ${coord.lng}` : 'Coordinates not set'}
              </small>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const renderTeeBoxes = (teeBoxes) => {
    if (!teeBoxes || teeBoxes.length === 0) {
      return <span className="text-muted">No tee boxes configured</span>;
    }

    return (
      <div>
        {teeBoxes.map((tee, index) => (
          <div key={index} className="mb-2 p-2 border rounded">
            <div className="row">
              <div className="col-md-3">
                <strong>Tee Type:</strong> {tee.teeType || 'N/A'}
              </div>
              <div className="col-md-2">
                <strong>Color:</strong> {tee.color || 'N/A'}
              </div>
              <div className="col-md-2">
                <strong>Par:</strong> {tee.par || 'N/A'}
              </div>
              <div className="col-md-2">
                <strong>Yards:</strong> {tee.yards || 'N/A'}
              </div>
              <div className="col-md-2">
                <strong>Meters:</strong> {tee.meters || 'N/A'}
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <main className="app-content">
      <div className="app-title tile p-3">
        <h1><span className="mr-4 fw-bold">Course Details - {courseData.name}</span></h1>
      </div>

      <div className="container-fluid">
        {/* Course Information */}
        <div className="row mb-4">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header" style={{ background: "#00489d", color: "#fff" }}>
                <h5 className="mb-0">Course Information</h5>
              </div>
              <div className="card-body">
                <div className="row">
                  <div className="col-md-6">
                    <div className="row mb-2">
                      <div className="col-md-4"><strong>Name:</strong></div>
                      <div className="col-md-8">{courseData.name}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-4"><strong>Address:</strong></div>
                      <div className="col-md-8">{courseData.address}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-4"><strong>City:</strong></div>
                      <div className="col-md-8">{courseData.city}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-4"><strong>State:</strong></div>
                      <div className="col-md-8">{courseData.state}</div>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="row mb-2">
                      <div className="col-md-4"><strong>Holes:</strong></div>
                      <div className="col-md-8">{courseData.holesCount}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-4"><strong>Phone:</strong></div>
                      <div className="col-md-8">{courseData.contact?.phone || 'N/A'}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-4"><strong>Email:</strong></div>
                      <div className="col-md-8">{courseData.contact?.email || 'N/A'}</div>
                    </div>
                    <div className="row mb-2">
                      <div className="col-md-4"><strong>Facilities:</strong></div>
                      <div className="col-md-8">
                        {Array.isArray(courseData.facilities) 
                          ? courseData.facilities.join(", ") 
                          : courseData.facilities || 'N/A'}
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12">
                    <div className="row mb-2">
                      <div className="col-md-2"><strong>Description:</strong></div>
                      <div className="col-md-10">{courseData.description}</div>
                    </div>
                  </div>
                </div>
                {courseData.image && (
                  <div className="row mt-3">
                    <div className="col-md-12">
                      <strong>Main Image:</strong>
                      <div className="mt-2">
                        <img
                          src={mediaUrl() + courseData.image}
                          alt="Course"
                          style={{ maxWidth: "200px", maxHeight: "150px", objectFit: "cover" }}
                          className="border rounded"
                        />
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Holes Information */}
        <div className="row">
          <div className="col-md-12">
            <div className="card">
              <div className="card-header" style={{ background: "#00489d", color: "#fff" }}>
                <h5 className="mb-0">Holes Configuration</h5>
              </div>
              <div className="card-body">
                {loading ? (
                  <div className="text-center py-4">
                    <div className="spinner-border" role="status">
                      <span className="visually-hidden">Loading...</span>
                    </div>
                    <p className="mt-2">Loading holes data...</p>
                  </div>
                ) : error ? (
                  <div className="alert alert-danger">
                    {error}
                  </div>
                ) : holes.length === 0 ? (
                  <div className="alert alert-info">
                    No holes have been configured for this course yet.
                  </div>
                ) : (
                  <div className="row">
                    {holes.map((hole, index) => (
                      <div key={index} className="col-md-6 mb-4">
                        <div className="card h-100">
                          <div className="card-header" style={{ background: "#f8f9fa" }}>
                            <h6 className="mb-0">Hole {hole.hole} - Par {hole.par}</h6>
                          </div>
                          <div className="card-body">
                            <div className="mb-2">
                              <strong>Green:</strong> {hole.green?.lat && hole.green?.lng ? `${hole.green.lat}, ${hole.green.lng}` : 'Not set'}
                            </div>
                            
                            <div className="mb-2">
                              {renderCoordinateSection(hole.waterHazard, "Water Hazard")}
                            </div>
                            
                            <div className="mb-2">
                              {renderCoordinateSection(hole.sandBunker, "Sand Bunker")}
                            </div>
                            
                            <div className="mb-2">
                              {renderCoordinateSection(hole.fairway, "Fairway")}
                            </div>
                            
                            <div className="mb-2">
                              <strong>Tee Boxes:</strong>
                              <div className="mt-1">
                                {renderTeeBoxes(hole.teeBoxes)}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="row mt-4">
          <div className="col-md-12">
            <div className="d-flex justify-content-end">
              <button
                className="btn btn-secondary"
                onClick={() => navigate("/golf-courses")}
              >
                Back to Golf Courses
              </button>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
};

export default ViewCourseDetails;
