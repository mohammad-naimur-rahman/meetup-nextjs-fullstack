import { MongoClient, ObjectId } from "mongodb"
import MeetupDetails from "../components/meetups/MeetupDetails"

export default function MeetupDetail({ meetupData }) {
  const { title, image, address, description } = meetupData
  return <MeetupDetails
    title={title}
    image={image}
    address={address}
    description={description}
  />
}

export async function getStaticPaths() {
  const client = await MongoClient.connect("mongodb+srv://naimurRahman:AluVaji@cluster0.avi8n.mongodb.net/meetups?retryWrites=true&w=majority")
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const meetups = await meetupsCollection.find({}, { _id: 1 }).toArray()

  client.close()

  return {
    fallback: 'blocking',
    paths: meetups.map(meetup => ({
      params: { meetupid: meetup._id.toString() }
    }))
  }
}

export async function getStaticProps(context) {
  const meetupid = context.params.meetupid
  const client = await MongoClient.connect("mongodb+srv://naimurRahman:AluVaji@cluster0.avi8n.mongodb.net/meetups?retryWrites=true&w=majority")
  const db = client.db()

  const meetupsCollection = db.collection('meetups')

  const selectedMeetup = await meetupsCollection.findOne({ _id: ObjectId(meetupid) })

  client.close()

  return {
    props: {
      meetupData: {
        id: selectedMeetup._id.toString(),
        title: selectedMeetup.title,
        address: selectedMeetup.address,
        description: selectedMeetup.description,
        image: selectedMeetup.image
      }
    }
  }
}