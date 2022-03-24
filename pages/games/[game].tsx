import React from "react";
import { GetServerSideProps } from 'next'
import { Layout } from "../../components/layout";
import Image from "next/image"
import { type } from "os";
import { useDispatch } from 'react-redux';


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

  console.log("test =30=", game);
  console.log("test =31=", game.game_screenshots);


  return {
    props: {
      game: game,
    },
  }
}


const GamePage: React.FC<myReactComponent> = ({game}) => {
  return (
    <Layout>
      <Image src={game.cover_url} alt="game_cover" width="350px" height="500px"/>
    <h2>{game.name}</h2>
    <h4>Genres : {game.games_genres.map((item, index)=>{
      return (
        <div key={index}>
        <p>{item.genre.name}</p>
        </div>
      )
    })}</h4>
    <h4>Platforms : {game.games_platforms.map((item, index)=>{
      return (
        <div key={index}>
        <p>{item.platform.name}</p>
        </div>
      )
    })}</h4>
    {console.log("test==", game.game_screenshots)}
     <h4>Platforms : {game.game_screenshots.map((item, index)=>{
      return (
        <div key={index}>
        <Image src={item.url} alt="game_screenshots" width="350px" height="500px"/>
        </div>
      )
    })}</h4>
    <form method="POST" action={`/add-to-cart/${game.slug}`}>
    <a href="/cartvalidation">
      <button >Add to cart</button>
    </a>
    </form>
    </Layout>
  )
}

export default GamePage;
