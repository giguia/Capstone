import React from 'react'
import UpdateUserAG from '../../components/profile/UpdateUserAG'

const EditUserAG = ({ userId }) => {
    return (
        <div className="EditForm">
            <UpdateUserAG userId={userId} />
        </div>
    );
}

export default EditUserAG
