import React from 'react';
import { useUser } from '@auth0/nextjs-auth0';
import Image from "next/image"
import { Layout } from '../components/layout';


export default function Profile() {
  const { user, error, isLoading } = useUser();


  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user === undefined) return <Layout>
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
  <h1>Please login to add to cart</h1>
  </div>
  </Layout>;

  return (
        <Layout>
        <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
          <ul>
          <h3>Thank you {user?.name}, your game has been added to your cart</h3>
          </ul>
        </div>
    </Layout>
  );
}
