import React, { useContext, useEffect, useState } from 'react';
import {
  User,
  Activity,
  Edit3,
  Save,
  X,
  Phone,
  MessageCircle,
  Send,
  MapPin,
  PlusCircle,
  Trash2
} from 'lucide-react';
import Button from '../components/common/Button';
import { EmergencyContext } from '../context/EmergencyContext';
import { useTranslation } from '../context/LanguageContext';

const normalizePhone = (phone) => phone.replace(/\D/g, '');

const Profile = () => {
  const { userProfile, updateUserProfile } = useContext(EmergencyContext);
  const { t } = useTranslation();
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState(userProfile);
  const [shareStatus, setShareStatus] = useState('');

  const userId = localStorage.getItem('userId');

useEffect(() => {

  const fetchProfile = async () => {

    try {

      const response = await fetch(
        `http://10.242.239.216:5000/api/auth/profile/${userId}`
      );

      const data = await response.json();

      if (data.success) {

        setFormData(data.user);

        updateUserProfile(data.user);

      }

    } catch (error) {

      console.log(error);

    }
  };

  if (userId) {
    fetchProfile();
  }

}, []);

  const handleSave = async () => {

  try {

    const response = await fetch(
      `http://10.242.239.216:5000/api/auth/profile/${userId}`,
      {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      }
    );

    const data = await response.json();

    if (data.success) {

      updateUserProfile(data.user);

      setFormData(data.user);

      setIsEditing(false);

      setShareStatus('Profile saved successfully.');

    } else {

      setShareStatus('Failed to save profile.');

    }

  } catch (error) {

    console.log(error);

    setShareStatus('Server error.');

  }
};

  const handleCancel = () => {
    setFormData(userProfile);
    setIsEditing(false);
    setShareStatus('');
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleContactChange = (index, field, value) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts[index] = { ...newContacts[index], [field]: value };
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const addContact = () => {
    const nextId = formData.emergencyContacts.length
      ? Math.max(...formData.emergencyContacts.map((c) => c.id)) + 1
      : 1;
    setFormData({
      ...formData,
      emergencyContacts: [
        ...formData.emergencyContacts,
        { id: nextId, name: '', phone: '' }
      ]
    });
  };

  const removeContact = (index) => {
    const newContacts = [...formData.emergencyContacts];
    newContacts.splice(index, 1);
    setFormData({ ...formData, emergencyContacts: newContacts });
  };

  const handleImageUpload = (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setFormData({ ...formData, photo: reader.result });
    };
    reader.readAsDataURL(file);
  };

  const requestLocation = () => {
    return new Promise((resolve, reject) => {
      if (!navigator.geolocation) {
        reject('Geolocation not supported');
        return;
      }
      navigator.geolocation.getCurrentPosition(
        (position) => {
          resolve({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
        },
        (error) => reject(error.message || 'Unable to access location')
      );
    });
  };

  const buildEmergencyText = async () => {
    try {
      const location = await requestLocation();
      return `Emergency! My location is https://maps.google.com/?q=${location.latitude},${location.longitude}.\nName: ${formData.name}.\nBlood Group: ${formData.bloodGroup}.\nMedical info: ${formData.medicalNotes}`;
    } catch (error) {
      return `Emergency! I need help.\nName: ${formData.name}.\nBlood Group: ${formData.bloodGroup}.\nMedical info: ${formData.medicalNotes}.\nLocation unavailable: ${error}`;
    }
  };

  const sendEmergencyContactMessage = async (contact, channel) => {
    const number = normalizePhone(contact.phone);
    if (!number) {
      setShareStatus('Contact number is invalid.');
      return;
    }

    const message = await buildEmergencyText();
    if (channel === 'sms') {
      window.location.href = `sms:${number}?body=${encodeURIComponent(message)}`;
      return;
    }

    if (channel === 'whatsapp') {
      const whatsappNumber = number.startsWith('0') ? number.slice(1) : number;
      window.location.href = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(message)}`;
      return;
    }

    if (channel === 'call') {
      window.location.href = `tel:${number}`;
    }
  };

  const contactList = isEditing ? formData.emergencyContacts : userProfile.emergencyContacts;

  return (
    <div className="page-container px-4 py-6">
      <div className="flex flex-col gap-4 md:flex-row md:justify-between md:items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">{t('emergencyProfile')}</h1>
          <p className="text-sm text-muted mt-1">Update your profile, medical details, and emergency contact actions.</p>
        </div>

        {!isEditing ? (
          <Button variant="outline" className="px-3 py-1" onClick={() => setIsEditing(true)}>
            <Edit3 size={16} className="mr-1" /> {t('edit')}
          </Button>
        ) : (
          <div className="flex flex-wrap gap-2">
            <Button variant="outline" className="px-3 py-1" onClick={handleCancel}>
              <X size={16} className="mr-1" /> {t('cancel')}
            </Button>
            <Button variant="danger" className="px-3 py-1" onClick={handleSave}>
              <Save size={16} className="mr-1" /> {t('save')}
            </Button>
          </div>
        )}
      </div>

      <div className="card mb-6 border-t-4" style={{ borderTopColor: 'var(--accent)' }}>
        <div className="grid gap-4 md:grid-cols-[120px_minmax(0,1fr)] items-start">
          <div className="flex flex-col items-center gap-3 text-center">
            <div className="w-28 h-28 rounded-full overflow-hidden bg-gray-100 border border-slate-200 flex items-center justify-center">
              {formData.photo ? (
                <img src={formData.photo} alt={formData.name || 'Profile'} className="w-full h-full object-cover" />
              ) : (
                <User size={40} className="text-slate-400" />
              )}
            </div>
            {!isEditing ? (
              <h2 className="text-xl font-semibold mt-2">{formData.name}</h2>
            ) : (
              <input
                type="text"
                name="name"
                value={formData.name}
                onChange={handleChange}
                className="w-full mt-1 p-2 border rounded text-center"
                placeholder={t('userProfileNamePlaceholder')}
              />
            )}
            {isEditing && (
              <label className="cursor-pointer text-sm text-accent hover:underline">
                Upload photo
                <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
              </label>
            )}
          </div>

          <div className="space-y-3">
            <div>
              <div className="flex flex-wrap gap-3 text-sm text-muted">
                <div className="flex items-center gap-2">
                  <span className="font-semibold">{t('bloodGroup')}</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="bloodGroup"
                      value={formData.bloodGroup}
                      onChange={handleChange}
                      className="p-1 border rounded w-24"
                    />
                  ) : (
                    <strong>{userProfile.bloodGroup}</strong>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-semibold">Address:</span>
                  {isEditing ? (
                    <input
                      type="text"
                      name="address"
                      value={formData.address}
                      onChange={handleChange}
                      className="p-1 border rounded flex-1 min-w-[220px]"
                    />
                  ) : (
                    <span>{userProfile.address}</span>
                  )}
                </div>
              </div>
            </div>

            <div className="grid gap-3 md:grid-cols-2">
              <div>
                <label className="text-sm font-semibold block mb-1">Allergies</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="allergies"
                    value={formData.allergies}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="E.g. Penicillin, nuts"
                  />
                ) : (
                  <p className="text-sm text-muted">{userProfile.allergies || 'None listed'}</p>
                )}
              </div>
              <div>
                <label className="text-sm font-semibold block mb-1">Medications</label>
                {isEditing ? (
                  <input
                    type="text"
                    name="medications"
                    value={formData.medications}
                    onChange={handleChange}
                    className="w-full p-2 border rounded"
                    placeholder="E.g. Inhaler, insulin"
                  />
                ) : (
                  <p className="text-sm text-muted">{userProfile.medications || 'None listed'}</p>
                )}
              </div>
            </div>

            <div>
              <h3 className="font-semibold text-danger flex items-center mb-2">
                <Activity size={18} className="mr-1" /> {t('medicalNotes')}
              </h3>
              {isEditing ? (
                <textarea
                  name="medicalNotes"
                  value={formData.medicalNotes}
                  onChange={handleChange}
                  className="w-full p-2 border rounded"
                  rows="4"
                  placeholder="Add any medical conditions, medication doses, or special care notes."
                />
              ) : (
                <p className="text-sm bg-danger-light p-3 rounded-md">{userProfile.medicalNotes}</p>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between mb-4 gap-3">
        <h3 className="font-semibold text-lg">{t('emergencyContacts')}</h3>
        {isEditing && (
          <Button variant="outline" className="px-3 py-2" onClick={addContact}>
            <PlusCircle size={16} className="mr-1" /> Add contact
          </Button>
        )}
      </div>

      <div className="flex flex-col gap-3">
        {contactList.map((contact, index) => (
          <div key={contact.id} className="card p-4 border border-slate-200">
            <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
              <div className="space-y-2">
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={contact.name}
                      onChange={(e) => handleContactChange(index, 'name', e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder={t('contactNamePlaceholder')}
                    />
                    <input
                      type="text"
                      value={contact.phone}
                      onChange={(e) => handleContactChange(index, 'phone', e.target.value)}
                      className="w-full p-2 border rounded"
                      placeholder={t('phoneNumberPlaceholder')}
                    />
                  </>
                ) : (
                  <>
                    <div>
                      <p className="font-semibold">{contact.name}</p>
                      <p className="text-sm text-muted">{contact.phone}</p>
                    </div>
                  </>
                )}
              </div>

              <div className="flex flex-wrap gap-2 items-center">
                {!isEditing && (
                  <>
                    <Button
                      variant="outline"
                      className="px-3 py-2"
                      onClick={() => sendEmergencyContactMessage(contact, 'call')}
                    >
                      <Phone size={16} className="mr-1" /> {t('call')}
                    </Button>
                    <Button
                      variant="outline"
                      className="px-3 py-2"
                      onClick={() => sendEmergencyContactMessage(contact, 'sms')}
                    >
                      <MessageCircle size={16} className="mr-1" /> SMS
                    </Button>
                    <Button
                      variant="outline"
                      className="px-3 py-2"
                      onClick={() => sendEmergencyContactMessage(contact, 'whatsapp')}
                    >
                      <Send size={16} className="mr-1" /> WhatsApp
                    </Button>
                  </>
                )}
                {isEditing && (
                  <Button
                    variant="danger"
                    className="px-3 py-2"
                    onClick={() => removeContact(index)}
                  >
                    <Trash2 size={16} className="mr-1" /> Remove
                  </Button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {!isEditing && (
        <div className="mt-6 p-4 bg-blue-50 border border-blue-200 rounded-lg">
          <h3 className="font-semibold mb-2">Emergency share</h3>
          <p className="text-sm text-muted mb-3">
            Send your current location and essential medical details to any contact directly.
          </p>
          <div className="flex flex-wrap gap-3">
            {contactList.map((contact) => (
              <Button
                key={contact.id}
                variant="primary"
                className="px-4 py-2"
                onClick={() => sendEmergencyContactMessage(contact, 'whatsapp')}
              >
                <MapPin size={16} className="mr-1" /> Share location with {contact.name.split(' ')[0] || 'Contact'}
              </Button>
            ))}
          </div>
          {shareStatus && <p className="mt-3 text-sm text-emerald-700">{shareStatus}</p>}
        </div>
      )}
    </div>
  );
};

export default Profile;
