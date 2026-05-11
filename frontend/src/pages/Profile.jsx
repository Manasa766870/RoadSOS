import React, { useContext, useState } from 'react';
import { User, Activity, Edit3, Save, X } from 'lucide-react';
import Button from '../components/common/Button';
import { EmergencyContext } from '../context/EmergencyContext';

const Profile = () => {
  const { userProfile, updateUserProfile } = useContext(EmergencyContext);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);

  const handleSave = () => {
    updateUserProfile(formData);
    setIsEditing(false);
  };

  const handleCancel = () => {
    setFormData(userProfile); // revert changes
    setIsEditing(false);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="page-container px-4 py-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Emergency Profile</h1>
        {!isEditing ? (
          <Button variant="outline" className="px-3 py-1" onClick={() => setIsEditing(true)}>
            <Edit3 size={16} className="mr-1" /> Edit
          </Button>
        ) : (
          <div className="flex gap-2">
            <Button variant="outline" className="px-3 py-1" onClick={handleCancel}>
              <X size={16} className="mr-1" /> Cancel
            </Button>
            <Button variant="danger" className="px-3 py-1" onClick={handleSave}>
              <Save size={16} className="mr-1" /> Save
            </Button>
          </div>
        )}
      </div>

      <div className="card mb-6 border-t-4" style={{ borderTopColor: 'var(--accent)' }}>
        <div className="flex items-center gap-4 mb-4">
          <div className="w-16 h-16 bg-gray-200 rounded-full flex items-center justify-center text-gray-500 shrink-0">
            <User size={32} />
          </div>
          <div className="w-full">
            {isEditing ? (
              <input 
                type="text" 
                name="name" 
                value={formData.name} 
                onChange={handleChange}
                className="w-full mb-2 p-2 border rounded"
              />
            ) : (
              <h2 className="text-xl font-bold">{userProfile.name}</h2>
            )}
            
            <div className="text-muted flex items-center gap-2">
              Blood Group: 
              {isEditing ? (
                <input 
                  type="text" 
                  name="bloodGroup" 
                  value={formData.bloodGroup} 
                  onChange={handleChange}
                  className="p-1 border rounded w-16"
                />
              ) : (
                <strong>{userProfile.bloodGroup}</strong>
              )}
            </div>
          </div>
        </div>

        <div className="mt-4">
          <h3 className="font-semibold text-danger flex items-center mb-2">
            <Activity size={18} className="mr-1"/> Medical Notes
          </h3>
          {isEditing ? (
            <textarea 
              name="medicalNotes" 
              value={formData.medicalNotes} 
              onChange={handleChange}
              className="w-full p-2 border rounded"
              rows="3"
            />
          ) : (
            <p className="text-sm bg-danger-light p-3 rounded-md">{userProfile.medicalNotes}</p>
          )}
        </div>
      </div>

      <h3 className="font-semibold mb-3">Emergency Contacts</h3>
      <div className="flex flex-col gap-3">
        {(isEditing ? formData.emergencyContacts : userProfile.emergencyContacts).map((contact, index) => (
          <div key={contact.id} className="card flex justify-between items-center p-4">
            {isEditing ? (
              <div className="w-full mr-2">
                <input 
                  type="text" 
                  value={contact.name}
                  onChange={(e) => {
                    const newContacts = [...formData.emergencyContacts];
                    newContacts[index].name = e.target.value;
                    setFormData({...formData, emergencyContacts: newContacts});
                  }}
                  className="w-full mb-1 p-1 border rounded"
                  placeholder="Contact Name"
                />
                <input 
                  type="text" 
                  value={contact.phone}
                  onChange={(e) => {
                    const newContacts = [...formData.emergencyContacts];
                    newContacts[index].phone = e.target.value;
                    setFormData({...formData, emergencyContacts: newContacts});
                  }}
                  className="w-full p-1 border rounded text-sm text-muted"
                  placeholder="Phone Number"
                />
              </div>
            ) : (
              <div>
                <h4 className="font-bold">{contact.name}</h4>
                <p className="text-sm text-muted">{contact.phone}</p>
              </div>
            )}
            {!isEditing && <Button variant="outline" onClick={() => window.location.href = `tel:${contact.phone}`}>Call</Button>}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Profile;
