import React, { useEffect, useState } from 'react';

const apiUrl = process.env.REACT_APP_API_URL;

const ReferralList = () => {
  const [referrals, setReferrals] = useState([]);

  useEffect(() => {
    fetch(`${apiUrl}/referrals`)
      .then(response => response.json())
      .then(data => setReferrals(data))
      .catch(error => {
        console.error('Ошибка:', error);
      });
  }, []);

  return (
    <div>
      <h1>Referrals</h1>
      <ul>
        {referrals.map((referral, index) => (
          <li key={index}>
            {referral.referral_code}: {referral.count}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReferralList;
