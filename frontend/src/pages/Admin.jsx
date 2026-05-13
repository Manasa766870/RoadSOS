import React from 'react';
import { useTranslation } from '../context/LanguageContext';

const Admin = () => {
  const { t } = useTranslation();

  return (
    <div className="page-container px-4 py-6">
      <h1 className="text-2xl font-bold mb-6">{t('serviceManagement')}</h1>
      <div className="card text-center py-10">
        <h3 className="mb-2">{t('serviceManagement')}</h3>
        <p className="text-muted text-sm max-w-sm mx-auto mb-4">
          {t('adminDescription')}
        </p>
        <button className="btn btn-primary">{t('signInAsAdmin')}</button>
      </div>
    </div>
  );
};

export default Admin;
