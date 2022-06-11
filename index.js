const {ApolloServer, gql} = require('apollo-server');

const {events, users,participants,locations} = require('./data');

const typeDefs = gql`
    type Event {
        id: ID
        title: String
        desc: String
        date: String
        from: String
        to: String
        location: Location
        user: User
        participants: [Participant]
    }
    type Location {
        id: ID
        name: String
        desc: String
        lat: Float
        lng: Float
    }

    type User {
        id: ID
        username: String
        email: String
        events : [Event]
        participant: Participant
    }

    type Participant {
        id: ID
        user: User
        event: Event
        
    }

    type Query {
        events: [Event]
        event(id: ID): Event

        users: [User]
        user(id: ID): User

        locations: [Location]
        location(id: ID): Location!

        participants: [Participant]    
        participant(id: ID): Participant
    }
`
const resolvers = {
    Query: {
        events: () => events,
        event: (parent, args) => events.find(event => event.id == args.id),
        
        locations: () => locations,
        location: (parent,args) => locations.find(location => location.id == args.id),

        users: () => users,
        user: (parent ,args) => users.find(user => user.id == args.id),

        participants: () => participants,
        participant: (parent,args) => participants.find(participant => participant.id == args.id)

    },
    User: {
        events: (parent) => events.filter(event => event.user_id == parent.id),
        participant: (parent) => participants.find(p => p.user_id == parent.id),
        
    },
    Event: {
        location: (parent) => locations.find(location => location.id == parent.location_id),
        participants: (parent) => participants.filter(p => p.event_id == parent.id),
        user: (parent) => users.find(user => user.id == parent.user_id)
    },
    Participant: {
        user: (parent) => users.find(user => user.id == parent.user_id),
        event: (parent) => events.find(event => event.id == parent.event_id)
    }
   
}
const server = new ApolloServer({typeDefs, resolvers});

server .listen().then(({url}) => console.log('Server is running on ' + url));