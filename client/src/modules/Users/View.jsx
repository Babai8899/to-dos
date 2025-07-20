import React, { useContext, useEffect, useState } from 'react'
import axiosInstance from '../../api/axiosInstance'
import AuthContext from '../../hooks/AuthContext';

function View() {

    const { user } = useContext(AuthContext);

    const [userData, setUserData] = useState({
        firstName: "",
        lastName: "",
        emailId: "",
        phone: "",
        dob: "",
    })

    return (
        <div className="container flex justify-center mx-auto my-1">
            <div className="card w-1/2 bg-base-100 shadow-sm border-2 border-base-300 mx-auto my-10 h-96 flex flex-col justify-center items-center gap-4 py-1">
                <h1 className='text-2xl font-bold'>View User</h1>
                <div className="overflow-x-auto w-full">
                    <table className="table table-compact w-full text-xl">

                        <tbody>
                            <tr>
                                <th>First Name</th>
                                <td>{user.firstName}</td>
                            </tr>
                            <tr>
                                <th>Last Name</th>
                                <td>Desktop Support Technician</td>
                            </tr>
                            <tr>
                                <th>Email Id</th>
                                <td>Tax Accountant</td>
                            </tr>
                            <tr>
                                <th>Phone No</th>
                                <td>Tax Accountant</td>
                            </tr>
                            <tr>
                                <th>Date of Birth</th>
                                <td>Tax Accountant</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default View
