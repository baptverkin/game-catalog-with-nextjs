import React from "react";
import { getSession, useUser } from '@auth0/nextjs-auth0';
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
  games: games;
}


export const getServerSideProps: GetServerSideProps = async (context) => {
  const response = await fetch(`http://videogame-api.fly.dev/games/slug/${context.params?.game}`)
  const game = await response.json();

  const session = getSession(context.req, context.res)

  console.group("test3", session)

  const mongodb = await getDatabase();
  const findCollection = await mongodb.db()
  await mongodb.db().collection("cart").insertOne({game: game});


  if(findCollection.collection(`cart-${session?.user.nickname}`)){
    await mongodb.db().collection(`cart-${session?.user.nickname}`).insertOne({game: game});
  }else{
    await mongodb.db().createCollection(`cart-${session?.user.nickname}`);
    await mongodb.db().collection(`cart-${session?.user.nickname}`).insertOne({game: game});
  }
  return {
    props: {
      games: game,
    },
  }
}

const AddToCart: React.FC<myReactComponent> = ({games}) => {

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
          <h3>Thank you {user?.name}, {games.name} has been added to your cart</h3>
          </ul>
        </div>
    </Layout>
  );
}

export default AddToCart;
// function getUser(): { user: any; error: any; isLoading: any; } {
//   console.log(user)
// }

