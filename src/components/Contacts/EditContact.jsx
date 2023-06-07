import { useEffect, useState, useContext } from "react";

import { Link, useNavigate, useParams } from "react-router-dom";

import { ContactContext } from "../../context/contactContext";
import { getContact, updateContact } from "../../services/contactService";
import { Spinner } from "../";
import { COMMENT, ORANGE, PURPLE } from "../../helpers/colors";

import * as Yup from "yup";
import { Formik, Form, Field, ErrorMessage } from "formik";
import toast, { Toaster } from "react-hot-toast";

const EditContact = () => {
  const { contactId } = useParams();
  const {
    contacts,
    setContacts,
    setFilteredContacts,
    loading,
    setLoading,
    groups,
  } = useContext(ContactContext);

  const navigate = useNavigate();

  const [contact, setContact] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const { data: contactData } = await getContact(contactId);

        setLoading(false);
        setContact(contactData);
      } catch (err) {
        console.log(err);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const validationAddContactSchema = Yup.object().shape({
    fullname: Yup.string()
      .min(3, "must be at least 3 characters long")
      .required("Name is required"),
    photo: Yup.string().required("Image URL is required"),
    mobile: Yup.number()
      .required("Phone number is required")
      .typeError("Invalid phone number"),
    email: Yup.string().email("Invalid email").required("Email is required"),
    job: Yup.string().required("Job is required"),
    group: Yup.string().required("Group is required"),
  });

  const onContactChange = (event) => {
    setContact({
      ...contact,
      [event.target.name]: event.target.value,
    });
  };

  const submitForm = async (event) => {
    try {
      setLoading(true);
      // Copy State
      // Update State
      // Send Request
      // status == 200 -> do nothing
      // status == error -> setState(copyState)
      const { data, status } = await updateContact(contact, contactId);

      /*
       * NOTE
       * 1- forceRender -> setForceRender(true)
       * 2- Send request server
       * 3- Update local state
       * 4- Update local state before sending request to server
       */

      if (status === 200) {
        setLoading(false);

        const allContacts = [...contacts];
        const contactIndex = allContacts.findIndex(
          (c) => c.id === parseInt(contactId)
        );
        allContacts[contactIndex] = { ...data };
        setContacts(allContacts);
        //  console.log("first")
        setFilteredContacts(allContacts);

        toast.success("Contact updated successfully!");
        setTimeout(() => {
          navigate("/contacts");
        }, 3000);EA
      }
    } catch (err) {
      console.log(err);
      setLoading(false);
      toast.error("Failed to update contact.");
    }
    event.preventDefault();
  };

  return (
    <>
      {loading ? (
        <Spinner />
      ) : (
        <>
          <section className="p-3">
            <div className="container">
              <div className="row my-2">
                <div className="col text-center">
                  <p className="h4 fw-bold" style={{ color: ORANGE }}>
                    Edit Contact
                  </p>
                </div>
              </div>
              <hr style={{ backgroundColor: ORANGE }} />
              <div
                className="row p-2 w-75 mx-auto align-items-center"
                style={{ backgroundColor: "#44475a", borderRadius: "1em" }}
              >
                <div className="col-md-8">
                  <Formik
                    initialValues={{
                      fullname: contact.fullname,
                      photo: contact.photo,
                      mobile: contact.mobile,
                      email: contact.email,
                      job: contact.job,
                      group: contact.group,
                    }}
                    validationSchema={validationAddContactSchema}
                    onSubmit={submitForm}
                  >
                    <Form onChange={onContactChange}>
                      <Toaster position="top-center" reverseOrder={false} />
                      <div className="mb-2">
                        <Field
                          name="fullname"
                          type="text"
                          className="form-control"
                          placeholder="Name"
                          // onChange={onContactChange}
                          // value={contact.fullname}
                        />
                        <ErrorMessage
                          name="fullname"
                          component="div"
                          className="error text-danger text-start"
                        />
                      </div>
                      <div className="mb-2">
                        <Field
                          name="photo"
                          type="text"
                          className="form-control"
                          placeholder="Image URL"
                          // onChange={onContactChange}
                          // value={contact.photo}
                        />
                        <ErrorMessage
                          name="photo"
                          component="div"
                          className="error text-danger text-start"
                        />
                      </div>
                      <div className="mb-2">
                        <Field
                          name="mobile"
                          type="number"
                          className="form-control"
                          placeholder="Phone"
                          // onChange={onContactChange}
                          // value={contact.mobile}
                        />
                        <ErrorMessage
                          name="mobile"
                          component="div"
                          className="error text-danger text-start"
                        />
                      </div>
                      <div className="mb-2">
                        <Field
                          name="email"
                          type="email"
                          className="form-control"
                          placeholder="Email"
                          // onChange={onContactChange}
                          // value={contact.email}
                        />
                        <ErrorMessage
                          name="email"
                          component="div"
                          className="error text-danger text-start"
                        />
                      </div>
                      <div className="mb-2">
                        <Field
                          name="job"
                          type="text"
                          className="form-control"
                          placeholder="Job"
                          // onChange={onContactChange}
                          // value={contact.job}
                        />
                        <ErrorMessage
                          name="job"
                          component="div"
                          className="error text-danger text-start"
                        />
                      </div>
                      <div className="mb-2">
                        <Field
                          name="group"
                          as="select"
                          className="form-control"
                          // onChange={onContactChange}
                          // value={contact.group}
                        >
                          <option value="">Select Group:</option>
                          {groups.length > 0 &&
                            groups.map((group) => (
                              <option key={group.id} value={group.id}>
                                {group.name}
                              </option>
                            ))}
                        </Field>
                        <ErrorMessage
                          name="group"
                          component="div"
                          className="error text-danger text-start"
                        />
                      </div>
                      <div className="mb-2">
                        <button
                          type="submit"
                          className="btn"
                          style={{ backgroundColor: PURPLE }}
                        >
                          Edit
                        </button>
                        <Link
                          to={"/contacts"}
                          className="btn mx-2"
                          style={{ backgroundColor: COMMENT }}
                        >
                          Cancel
                        </Link>
                      </div>
                    </Form>
                  </Formik>
                  {/* <form onSubmit={submitForm}>
                    <Toaster position="top-center" reverseOrder={false} />
                    <div className="mb-2">
                      <input
                        name="fullname"
                        type="text"
                        className="form-control"
                        value={contact.fullname}
                        onChange={onContactChange}
                        required={true}
                        placeholder="Name"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="photo"
                        type="text"
                        value={contact.photo}
                        onChange={onContactChange}
                        className="form-control"
                        required={true}
                        placeholder="image"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="mobile"
                        type="number"
                        className="form-control"
                        value={contact.mobile}
                        onChange={onContactChange}
                        required={true}
                        placeholder="Phone"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="email"
                        type="email"
                        className="form-control"
                        value={contact.email}
                        onChange={onContactChange}
                        required={true}
                        placeholder="Email"
                      />
                    </div>
                    <div className="mb-2">
                      <input
                        name="job"
                        type="text"
                        className="form-control"
                        value={contact.job}
                        onChange={onContactChange}
                        required={true}
                        placeholder="Job"
                      />
                    </div>
                    <div className="mb-2">
                      <select
                        name="group"
                        value={contact.group}
                        onChange={onContactChange}
                        required={true}
                        className="form-control"
                      >
                        <option value="">Select Group : </option>
                        {groups.length > 0 &&
                          groups.map((group) => (
                            <option key={group.id} value={group.id}>
                              {group.name}
                            </option>
                          ))}
                      </select>
                    </div>
                    <div className="mb-2">
                      <input
                        type="submit"
                        className="btn"
                        style={{ backgroundColor: PURPLE }}
                        value="Edit"
                      />
                      <Link
                        to={"/contacts"}
                        className="btn mx-2"
                        style={{ backgroundColor: COMMENT }}
                      >
                        Cancel
                      </Link>
                    </div>
                  </form> */}
                </div>
                <div className="col-md-4">
                  <img
                    src={contact.photo}
                    className="img-fluid rounded"
                    style={{ border: `1px solid ${PURPLE}` }}
                  />
                </div>
              </div>
            </div>

            <div className="text-center mt-5">
              <img
                src={require("../../assets/man-taking-note.png")}
                height="300px"
                style={{ opacity: "60%" }}
              />
            </div>
          </section>
        </>
      )}
    </>
  );
};

export default EditContact;
