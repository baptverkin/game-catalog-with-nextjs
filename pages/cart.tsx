import React from "react";
import { getSession, useUser } from '@auth0/nextjs-auth0';
import Image from "next/image"
import { Layout } from '../components/layout';
import { GetServerSideProps } from 'next'
import { getDatabase } from "../src/database"


type genre = {
  name: string,
}

type platform = {
  platform: {name: string, logo_url: string}
}

type screenshots = {
  url: string,
}

type game = {
  category: string,
  cover_url: string,
  name: string,
  slug: string,
  games_genres: {genre: genre} [],
  games_platforms: platform [],
  game_screenshots: screenshots []
}
type games = {
  game: game,
}
type myReactComponent = {
  games: games[];
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const session = getSession(context.req, context.res)
  const mongodb = await getDatabase();
  const getAllGames = await mongodb.db().collection(`cart-${session?.user.nickname}`).find().toArray();
  const games = JSON.parse(JSON.stringify(getAllGames))


  console.log("test cart",games)

  return {
    props: {
      games: games,
    },
  }
}

const Cart: React.FC<myReactComponent> = ({games}) => {

  const { user, error, isLoading } = useUser();

  console.log(games)

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;
  if (user === undefined) return <Layout>
    <div style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>
  <h1>Please login to see your cart</h1>
  </div>
  </Layout>;

  if(games !== []) return (
        <Layout>
          <h2 style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>Hi {user.given_name}, here are all the games in your cart</h2>
          {games.map((game, index) => {
            return (
              <div key={index} style={{display: 'flex',  justifyContent:'left', alignItems:'center'}}>
              <ul>
                  <h3 >{game.game.name}</h3>
              </ul>
        </div>
            )
          })}
    </Layout>
  );

  return (
    <Layout>
      <h2 style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>Hi {user.given_name}, your cart is empty</h2>
    </Layout>
);
}

export default Cart;
