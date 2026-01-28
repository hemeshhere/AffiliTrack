import { useEffect, useState } from "react";
import axios from "axios";

import IconButton from "@mui/material/IconButton";
import { DataGrid } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

import { Modal } from "react-bootstrap";
import { serverEndpoint } from "../../config/config";

const USER_ROLES = ["viewer", "developer"];

function ManageUsers() {
  const [usersData, setUsersData] = useState([]);
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [formLoading, setFormLoading] = useState(false);

  const [showModal, setShowModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);

  const [formData, setFormData] = useState({
    id: "",
    email: "",
    name: "",
    role: "",
  });

  /* ------------------------- Modal Handlers ------------------------- */

  const handleModalShow = (edit = false, data = {}) => {
    if (edit) {
      setFormData({
        id: data._id,
        email: data.email,
        name: data.name,
        role: data.role,
      });
    } else {
      setFormData({ id: "", email: "", name: "", role: "" });
    }

    setIsEdit(edit);
    setShowModal(true);
  };

  const handleModalClose = () => setShowModal(false);

  const handleDeleteModalShow = (id) => {
    setFormData({ id });
    setShowDeleteModal(true);
  };

  const handleDeleteModalClose = () => setShowDeleteModal(false);

  /* ------------------------- Form Handlers ------------------------- */

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!formData.email) newErrors.email = "Email is mandatory";
    if (!formData.name) newErrors.name = "Name is mandatory";
    if (!formData.role) newErrors.role = "Role is mandatory";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;

    try {
      setFormLoading(true);

      const body = {
        email: formData.email,
        name: formData.name,
        role: formData.role,
      };

      if (isEdit) {
        await axios.put(
          `${serverEndpoint}/users/${formData.id}`,
          body,
          { withCredentials: true }
        );
      } else {
        await axios.post(`${serverEndpoint}/users`, body, {
          withCredentials: true,
        });
      }

      fetchUsers();
      handleModalClose();
      setFormData({ id: "", email: "", name: "", role: "" });
    } catch {
      setErrors({ message: "Something went wrong, please try again" });
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteSubmit = async () => {
    try {
      setFormLoading(true);
      await axios.delete(`${serverEndpoint}/users/${formData.id}`, {
        withCredentials: true,
      });

      fetchUsers();
      handleDeleteModalClose();
    } catch {
      setErrors({ message: "Something went wrong, please try again" });
    } finally {
      setFormLoading(false);
    }
  };

  /* ------------------------- API ------------------------- */

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`${serverEndpoint}/users`, {
        withCredentials: true,
      });
      setUsersData(res.data);
    } catch {
      setErrors({
        message: "Unable to fetch users at the moment, please try again",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  /* ------------------------- DataGrid ------------------------- */

  const columns = [
    { field: "email", headerName: "Email", flex: 2 },
    { field: "name", headerName: "Name", flex: 2 },
    { field: "role", headerName: "Role", flex: 2 },
    {
      field: "action",
      headerName: "Action",
      flex: 1,
      renderCell: (params) => (
        <>
          <IconButton onClick={() => handleModalShow(true, params.row)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteModalShow(params.row._id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  /* ------------------------- JSX ------------------------- */

  return (
    <div className="container py-4">
      <div className="d-flex justify-content-between mb-3">
        <h2>Manage Users</h2>
        <button
          className="btn btn-primary btn-sm"
          onClick={() => handleModalShow(false)}
        >
          Add
        </button>
      </div>

      {errors.message && (
        <div className="alert alert-danger">{errors.message}</div>
      )}

      <div style={{ height: 500 }}>
        <DataGrid
          rows={usersData}
          columns={columns}
          getRowId={(row) => row._id}
          loading={loading}
          pageSizeOptions={[20, 50, 100]}
          initialState={{
            pagination: { paginationModel: { page: 0, pageSize: 20 } },
          }}
          disableRowSelectionOnClick
          sx={{ fontFamily: "inherit" }}
        />
      </div>

      {/* Add / Edit Modal */}
      <Modal show={showModal} onHide={handleModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>{isEdit ? "Edit User" : "Add User"}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <form onSubmit={handleSubmit}>
            {["email", "name"].map((field) => (
              <div className="mb-3" key={field}>
                <label className="form-label">
                  {field.charAt(0).toUpperCase() + field.slice(1)}
                </label>
                <input
                  type="text"
                  name={field}
                  value={formData[field]}
                  onChange={handleChange}
                  className={`form-control ${
                    errors[field] ? "is-invalid" : ""
                  }`}
                />
                {errors[field] && (
                  <div className="invalid-feedback">{errors[field]}</div>
                )}
              </div>
            ))}

            <div className="mb-3">
              <label className="form-label">Role</label>
              <select
                name="role"
                value={formData.role}
                onChange={handleChange}
                className={`form-control ${
                  errors.role ? "is-invalid" : ""
                }`}
              >
                <option value="">Select</option>
                {USER_ROLES.map((role) => (
                  <option key={role} value={role}>
                    {role.charAt(0).toUpperCase() + role.slice(1)}
                  </option>
                ))}
              </select>
              {errors.role && (
                <div className="invalid-feedback">{errors.role}</div>
              )}
            </div>

            <div className="d-grid">
              <button
                type="submit"
                className="btn btn-primary"
                disabled={formLoading}
              >
                {formLoading ? "Loading..." : "Submit"}
              </button>
            </div>
          </form>
        </Modal.Body>
      </Modal>

      {/* Delete Modal */}
      <Modal show={showDeleteModal} onHide={handleDeleteModalClose}>
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>Are you sure you want to delete this user?</Modal.Body>
        <Modal.Footer>
          <button
            className="btn btn-secondary"
            onClick={handleDeleteModalClose}
          >
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={handleDeleteSubmit}
            disabled={formLoading}
          >
            {formLoading ? "Deleting..." : "Delete"}
          </button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}

export default ManageUsers;
