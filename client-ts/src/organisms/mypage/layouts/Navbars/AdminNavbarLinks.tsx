import React, { useState } from 'react';
import AdminNavbarLInksDetail from './AdminNavbarLinksDetail';

export default function AdminNavbarLInks(): JSX.Element {
  const [type] = useState<'creator' | 'marketer'>(
    window.document.location.pathname.includes('/creator/') ? 'creator' : 'marketer'
  );

  return (
    <div>
      <AdminNavbarLInksDetail type={type} />
    </div>
  );
}
