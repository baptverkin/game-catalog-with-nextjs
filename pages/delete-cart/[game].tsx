import React from 'react';
import { getSession, useUser } from '@auth0/nextjs-auth0';
import Image from "next/image"
import { Layout } from '../../components/layout';
import { GetServerSideProps } from 'next'
import { getDatabase } from '../../src/database';
import Cart from '../cart';

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
  const response = await fetch(`http://videogame-api.fly.dev/games/slug/${context.params?.game}`)
  const game = await response.json();

  const session = getSession(context.req, context.res)
  const mongodb = await getDatabase();
  await mongodb.db().collection(`cart-${session?.user.nickname}`).deleteOne({"game.id": game.id})

  const newDb = await mongodb.db().collection(`cart-${session?.user.nickname}`).find().toArray()

  console.log("test nickname", session?.user.nickname)
  console.log("test mongodb delete", newDb);


  return {
    redirect: {
      permanent: false,
      destination: "/cart"
    }
  }
}

const DeleteCart = () => {

}
export default DeleteCart;
