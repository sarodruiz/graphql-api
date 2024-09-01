import { ApolloServer } from "@apollo/server"
import { startStandaloneServer } from "@apollo/server/standalone"
import { typeDefs } from "./schema.js"
import db from './_db.js'

const resolvers = {
  Query: {
    games() {
      return db.games
    },
    game(parent, args, context) {
      return db.games.find((game) => game.id === args.id)
    },
    reviews() {
      return db.reviews
    },
    review(parent, args, context) {
      return db.reviews.find((review) => review.id === args.id)
    },
    authors() {
      return db.authors
    },
    author(parent, args, context) {
      return db.authors.find((author) => author.id === args.id)
    }
  },
  Game: {
    reviews(parent, args, context) {
      return db.reviews.filter((review) => review.game_id === parent.id)
    }
  },
  Author: {
    reviews(parent, args, context) {
      return db.reviews.filter((review) => review.author_id === parent.id)
    }
  },
  Review: {
    author(parent, args, context) {
      return db.authors.find((author) => author.id === parent.author_id)
    },
    game(parent, args, context) {
      return db.games.find((game) => game.id === parent.game_id)
    }
  },
  Mutation: {
    deleteGame(parent, args, context) {
      db.games = db.games.filter((game) => game.id !== args.id)
      return db.games
    },
    addGame(parent, args, context) {
      let game = {
        ...args.game,
        id: Math.floor(Math.random() * 10000).toString()
      }
      db.games.push(game)
      return game
    },
    updateGame(parent, args, context) {
      db.games = db.games.map((game) => {
        if (game.id === args.id) {
          return { ...game, ...args.updates }
        }
        return game
      })
      return db.games.find((game) => game.id === args.id)
    }
  }
}

const server = new ApolloServer({
  typeDefs,
  resolvers
})

const { url } = await startStandaloneServer(server, {
  listen: { port: 4000 }
})

console.log('Server ready at port ', 4000)
