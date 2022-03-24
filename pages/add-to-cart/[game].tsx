import React from "react";
import { useUser } from '@auth0/nextjs-auth0';
import Image from "next/image"
import { Layout } from '../../components/layout';
import { GetServerSideProps } from 'next'
import { getDatabase } from "../../src/database"

type genre = {
  name: string,
}

type platform = {
  platform: {name: string, logo_url: string}
}

type screenshots = {
  url: string,
}

type games = {
  category: string,
  cover_url: string,
  name: string,
  slug: string,
  games_genres: {genre: genre} [],
  games_platforms: platform [],
  game_screenshots: screenshots []
}
type myReactComponent = {
  game: games;
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetch(`http://videogame-api.fly.dev/games/slug/${context.params?.game}`)
  const game = await response.json();

  const mongodb = await getDatabase();
  const games = await mongodb.db().collection("cart").insertOne({game: game});

  console.log(game)

  return {
    props: {
      games: game,
    },
  }
}

export default function AddToCart() {

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

