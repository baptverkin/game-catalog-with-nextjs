import React from "react";
import { NextApiRequest, NextApiResponse } from "next";
import { getSession } from "@auth0/nextjs-auth0";
import context from "react-bootstrap/esm/AccordionContext";
import { getDatabase } from "../../../src/database";

async function handler (request: NextApiRequest, response: NextApiResponse) {
  const rep = await fetch(`http://videogame-api.fly.dev/games/slug/${request.query.game}`)
  const game = await rep.json();

  const session = getSession(request, response)
  const mongodb = await getDatabase();
  await mongodb.db().collection(`cart-${session?.user.nickname}`).deleteOne({"game.id": game.id})


  response.redirect("/cart")
}

export default handler;
