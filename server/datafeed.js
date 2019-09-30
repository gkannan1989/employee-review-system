require('dotenv').config()
import 'babel-polyfill'
import mongoose from 'mongoose'

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true })

import User from './models/user'
import Review from './models/review'

const users = [
  {
    "firstName": "Kannan",
    "lastName": "Ganesan",
    "email": "kannan@coder.com",
    "password": "$2b$08$scEV5n6CcvRJS0RhMyFEn.PuxtSX311P5CDx86.qyCWzNicGqTbDu",
    "type": "admin"
  },
  {
    "firstName": "Priya",
    "lastName": "Promodharshini",
    "email": "priya@coder.com",
    "password": "$2b$08$scEV5n6CcvRJS0RhMyFEn.PuxtSX311P5CDx86.qyCWzNicGqTbDu",
    "type": "employee"
  },
  {
    "firstName": "Hossian",
    "lastName": "J",
    "email": "hossian@coder.com",
    "password": "$2b$08$scEV5n6CcvRJS0RhMyFEn.PuxtSX311P5CDx86.qyCWzNicGqTbDu",
    "type": "employee"
  },
  {
    "firstName": "Saatvika",
    "lastName": "Kannan",
    "email": "saatvika@coder.com",
    "password": "$2b$08$scEV5n6CcvRJS0RhMyFEn.PuxtSX311P5CDx86.qyCWzNicGqTbDu",
    "type": "employee"
  }
]

async function RunMigrations() {
  // Delete users and reviews
  await User.remove({})
  await Review.remove({})

  // Add users
  const UserPromises = users.map(e => User.create(e))
  const usersList = await Promise.all(UserPromises)
  console.log('Users have been added sucessfully!')

  // Adding reviews
  const reviews = [
    {
      author: usersList[0]._id.toString(),
      target: usersList[1]._id.toString(),
      body: 'Review for user 1',
      participants: [
        { author: usersList[0]._id.toString() },
        { author: usersList[2]._id.toString() }
      ]
    },
    {
      author: usersList[0]._id.toString(),
      target: usersList[2]._id.toString(),
      body: 'Review for user 1',
      participants: [
        { author: usersList[1]._id.toString() },
        { author: usersList[3]._id.toString() }
      ]
    },
  ]

  const ReviewPromises = reviews.map(e => Review.create(e))
  await Promise.all(ReviewPromises)

  console.log('Reviews have been added sucessfully!')

  process.exit(0)
}

RunMigrations()