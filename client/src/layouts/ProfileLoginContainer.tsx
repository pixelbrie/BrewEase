import React from "react";

interface ProfileLoginContainerProps {
  // You can add any props needed for the profile login container here
  customerId: string; // uid
  displayName: string;
  firstName: string;
  lastName: string;
  loyaltyPoints: number;
  email: string;
  role: string;
  uid: string;
}

function ProfileLoginContainer({
  customerId,
  displayName,
  email,
  role,
  uid,
  firstName,
  lastName,
  loyaltyPoints,
}: ProfileLoginContainerProps) {
  return (
    <div className="flex flex-col items-center justify-center h-full w-full bg-white rounded-lg shadow-lg">
      <p className="text-lg text-center text-neutral-400">
        <p>Display Name: {displayName}</p>
        <p>First Name: {firstName}</p>
        <p>Last Name: {lastName}</p>
        <p>Email: {email}</p>
        <p>Role: {role}</p>
        <p>UID: {uid}</p>
        <p>Loyalty Points: {loyaltyPoints}</p>
      </p>
    </div>
  );
}

export default ProfileLoginContainer;
