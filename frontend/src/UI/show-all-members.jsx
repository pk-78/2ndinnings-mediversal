import { useState } from "react";
import { useAllPatient } from "../query/useAllPatient";
import { useAllStaff } from "../query/useAllStaff";
import { useStaff } from "../query/useStaff";
import BackButton from "./back-button";
import { useNavigate, useParams } from "react-router-dom";
import StaffName from "./StaffDetails";
import StaffDetails from "./StaffDetails";

export default function ShowAllPatient({ role }) {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const { isLoading, allPatient: patients } = useAllPatient();

  const handleChange = (e) => {
    setName(e.target.value.toLowerCase());
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-green-50">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full border-green-500"></div>
        <span className="ml-2 text-green-800">Loading...</span>
      </div>
    );
  }

  function calculateDaysLeft(patients) {
    return patients.map((patient) => {
      const { createdAt, planDuration } = patient;
      const createdDate = new Date(createdAt);
      let planEndDate;

      if (planDuration === "monthly") {
        planEndDate = new Date(createdDate);
        planEndDate.setMonth(planEndDate.getMonth() + 1);
      } else if (planDuration === "yearly") {
        planEndDate = new Date(createdDate);
        planEndDate.setFullYear(planEndDate.getFullYear() + 1);
      }

      const currentDate = new Date();
      const timeDiff = planEndDate - currentDate;
      const daysLeft = Math.ceil(timeDiff / (1000 * 60 * 60 * 24)); // Convert milliseconds to days

      return {
        ...patient,
        daysLeft: daysLeft > 0 ? daysLeft : 0, // If the plan has already ended, return 0
      };
    });
  }

  const result = calculateDaysLeft(patients);

  const filteredPatients = result.filter((patient) =>
    patient.fullName.toLowerCase().includes(name)
  );

  console.log(filteredPatients);

  return (
    <div className="min-h-screen bg-green-50 p-6">
      <BackButton />
      <h1 className="text-3xl font-bold text-green-800 mb-6">Show Member</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="w-full rounded my-2">
          <input
            type="text"
            placeholder="Enter name, phone, or email"
            value={name}
            onChange={handleChange}
            className="shadow my-1 appearance-none border rounded w-full
              py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline border-slate-500"
          />
        </div>
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="px-5 py-3 w-1/8 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-600 uppercase tracking-wider">
                Full Name
              </th>
              <th className="px-5 py-3 w-1/8 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-600 uppercase tracking-wider">
                DOB
              </th>
              <th className="px-5 py-3 w-1/8 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-600 uppercase tracking-wider">
                Phone Number
              </th>
              <th className="px-5 py-3 w-1/8 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-600 uppercase tracking-wider">
                Email
              </th>
              <th className="px-5 py-3 w-1/8 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-600 uppercase tracking-wider">
                Address
              </th>
              <th className="px-5 py-3 w-1/8 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-600 uppercase tracking-wider">
                Emergency Contact Number
              </th>
              <th className="px-5 py-3 w-1/8 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-600 uppercase tracking-wider">
                Care Manager
              </th>
              <th className="px-5 py-3 w-1/8 border-b-2 border-gray-200 bg-gray-100 text-left text-xs text-gray-600 uppercase tracking-wider">
                Membership type
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredPatients.length > 0 ? (
              filteredPatients.map((patient) => (
                <tr
                  key={patient._id}
                  onClick={() => {
                    navigate(`/${role}/member-detail/${patient._id}`);
                  }}
                  className="hover:bg-green-200 cursor-pointer"
                >
                  <td className="px-5 py-3 w-1/7 border-b-2 border-gray-200 text-left text-xs text-gray-600">
                    {patient?.fullName}
                  </td>
                  <td className="px-5 py-3 w-1/7 border-b-2 border-gray-200 text-left text-xs text-gray-600">
                    {patient?.dob.split("T")[0]}
                  </td>
                  <td className="px-5 py-3 w-1/7 border-b-2 border-gray-200 text-left text-xs text-gray-600">
                    {patient?.phone}
                  </td>
                  <td className="px-5 py-3 w-1/7 border-b-2 border-gray-200 text-left text-xs text-gray-600">
                    {patient?.email}
                  </td>
                  <td className="px-5 py-3 w-1/7 border-b-2 border-gray-200 text-left text-xs text-gray-600">
                    {patient?.address}
                  </td>
                  <td className="px-5 py-3 w-1/7 border-b-2 border-gray-200 text-left text-xs text-gray-600">
                    {patient?.emergencyContact}
                  </td>
                  <td className="px-5 py-3 w-1/7 border-b-2 border-gray-200 text-left text-xs text-gray-600">
                    {!patient.careManager ? (
                      <p>No Care Manager Assigned</p>
                    ) : (
                      <StaffDetails id={patient.careManager} />
                    )}
                  </td>
                  <td className="px-5 py-3 w-1/7 border-b-2 border-gray-200 text-left text-xs text-gray-600">
                    {patient?.plan} {"("}
                    {patient?.daysLeft}
                    {")"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="7" className="text-center text-red-600 py-3">
                  No patients found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
