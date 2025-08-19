import React, { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const CoursesEdit = ({
    setOpenDropdown,
    row,
    openDropdown,
    handleEdit,
    handleDelete
  }) => {
    const navigate = useNavigate();
    const dropdownRef = useRef(null);
    
    useEffect(() => {
      const handleClickOutside = (event) => {
        if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
          if (openDropdown === row._id) {
            setOpenDropdown(null);
          }
        }
      };
      document.addEventListener("mousedown", handleClickOutside);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [openDropdown, setOpenDropdown, row._id]);

    const handleViewDetails = () => {
      navigate("/courses/view-details", { state: { courseData: row } });
      setOpenDropdown(null);
    };

    const handleEditCourse = () => {
      navigate("/courses/edit-course", { state: { courseData: row } });
      setOpenDropdown(null);
    };

  return (
    <div className="dropdown text-center" ref={dropdownRef}>
      <button
        className="dropdown-button"
        onClick={() =>
          setOpenDropdown(openDropdown === row._id ? null : row._id)
        }
        aria-haspopup="true"
        aria-expanded={openDropdown === row._id}
      >
        <i
          className={`fa fa-ellipsis-v ${
            openDropdown === row._id ? "rotate-icon" : ""
          }`}
        ></i>
      </button>
      {openDropdown === row._id && (
        <div className="dropdown-menu show">
          <a
            className="dropdown-item"
            onClick={handleViewDetails}
          >
            <i className="fa fa-eye"></i> View Details
          </a>
          <a
            className="dropdown-item"
            onClick={handleEditCourse}
          >
            <i className="fa fa-edit"></i> Edit
          </a>
          <a
            className="dropdown-item"
            onClick={() => {
              console.log(row._id)
              handleDelete(row._id);
              setOpenDropdown(null);
            }}
          >
            <i className="fa fa-trash"></i> Delete
          </a>
        </div>
      )}
    </div>
  );
};

export default CoursesEdit;
