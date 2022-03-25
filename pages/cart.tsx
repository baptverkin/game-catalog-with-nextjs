import React from "react";
import { getSession, useUser } from '@auth0/nextjs-auth0';
import Image from "next/image"
import { Layout } from '../components/layout';
import { GetServerSideProps } from 'next'
import { getDatabase } from "../src/database"
import { text } from "stream/consumers";
import Link from "next/link";

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
  const [count, setCount] = React.useState(2);

  // async function deleteCart (): Promise<void>  {
  //   const mongodb = await getDatabase();
  //   const deleteCart = await mongodb.db().collection(`cart-${user?.nickname}`).find().toArray();
  // }
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
          <div className="row">
          <div className="col-8">
          {games.map((game, index) => {
            return (
              <div className="card mb-3" key={index} style={{maxWidth:"1000px", display: 'flex',  justifyContent:'left', alignItems:'left'}}>
                <div className="row g-0">
                  <div className="col-md-4">
                    <Image src={`${game.game.cover_url}`} alt="cover-photo" className="img-fluid rounded-start" width="100px" height="100px"></Image>
                  </div>
                  <div className="col-md-6">
                    <h3 >{game.game.name}</h3>
                      <form method="POST" action={`/api/delete-cart/${game.game.slug}`} >
                        <button >
                          Remove from cart
                          </button>
                      </form>
                  </div>
                  <div className="col-md-2">
                    <h3>{10*count}€</h3>
                    <button>-</button>
                    <input value={count} style={{maxWidth: "50px", textAlign: "center"}}/>
                    <button>+</button>
                  </div>
                </div>

        </div>
            )
          })}
          </div>

          <div className="col-4">
                  <h3>Prix total</h3>
                  <button>Checkout</button>
                </div>

                </div>
    </Layout>
  );

  return (
    <Layout>
      <h2 style={{display: 'flex',  justifyContent:'center', alignItems:'center'}}>Hi {user.given_name}, your cart is empty</h2>
    </Layout>
);
}

export default Cart;
