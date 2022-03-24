import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Image from "next/image"
import { Layout } from '../components/layout';


export default function Profile() {
  const { user, error, isLoading } = useUser();

  console.log(user?.nickname)


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user === undefined) return <Layout>
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
  <h1>Please login to see your profile</h1>
  </div>
  </Layout>;

  return (
        <Layout>
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          {/* <Image src={user.picture} alt={user.name} layout='fill' /> */}
          <ul>
          <h3>First name : {user?.given_name}</h3>
          <h3>Last name : {user?.family_name}</h3>
          <h3>Email : {user?.email}</h3>
          </ul>
        </div>
    </Layout>
  );
}
