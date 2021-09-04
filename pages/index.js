import { MongoClient } from 'mongodb'
import MeetupList from '../components/meetups/MeetupList'
import Head from 'next/head'

export default function HomePage({ meetups }) {
  return (
    <>
      <Head>
        <title>Meetups</title>
        <meta name='description' content='Browse a huge list of react meetups' />
      </Head>
      <MeetupList meetups={meetups} />
    </>
  )
}

export async function getStaticProps() {
  const client = await MongoClient.connect("mongodb+srv://naimurRahman:AluVaji@cluster0.avi8n.mongodb.net/meetups?retryWrites=true&w=majority")
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find().toArray()

  client.close()

  return {
    props: {
      meetups: meetups.map(meetup => ({
        title: meetup.title,
        address: meetup.address,
        image: meetup.image,
        id: meetup._id.toString()
      }))
    },
    revalidate: 1
  }
}