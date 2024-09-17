const chats = [
  {
    isGroupChat: false,
    users: [
      {
        name: "Anjana Devi",
        email: "anjanadevi@gmail.com",
      },
      {
        name: "Harshini",
        email: "harshiniamutha@gmail.com",
      },
    ],
    _id: "617a077e18c25468bc7c4dd4",
    chatName: "Anjana Devi",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Mia",
        email: "mia@gmail.com",
      },
      {
        name: "Amara",
        email: "amara@gmail.com",
      },
    ],
    _id: "617a077e18c25468b27c4dd4",
    chatName: "Mia",
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Amara",
        email: "amara@gmail.com",
      },
      {
        name: "Mia",
        email: "mia@gmail.com",
      },
    ],
    _id: "617a077e18c2d468bc7c4dd4",
    chatName: "Amara",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "John Doe",
        email: "jon@example.com",
      },
      {
        name: "Mia",
        email: "Mia@gmail.com",
      },
      {
        name: "Amara",
        email: "amara@gmail.com",
      },
    ],
    _id: "617a518c4081150716472c78",
    chatName: "Friends",
    groupAdmin: {
      name: "John Doe",
      email: "jon@example.com",
    },
  },
  {
    isGroupChat: false,
    users: [
      {
        name: "Harshini",
        email: "harshiniamutha@gmail.com",
      },
      {
        name: "Anjana Devi",
        email: "anjanadevi@gmail.com",
      },
    ],
    _id: "617a077e18c25468bc7cfdd4",
    chatName: "Harshini",
  },
  {
    isGroupChat: true,
    users: [
      {
        name: "John Doe",
        email: "jon@example.com",
      },
      {
        name: "Jane Doe",
        email: "jane@example.com",
      },
      {
        name: "Guest User",
        email: "guest@example.com",
      },
    ],
    _id: "617a518c4081150016472c78",
    chatName: "Chill Zone",
    groupAdmin: {
      name: "Guest User",
      email: "guest@example.com",
    },
  },
];

module.exports={ chats };