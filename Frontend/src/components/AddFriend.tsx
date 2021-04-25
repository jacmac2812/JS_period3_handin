/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { IFriend } from "../interfaces/IFriend";
import { gql, useMutation, ApolloClient } from "@apollo/client";

const ADD_FRIEND = gql`
  mutation createFriend($friend: FriendInput) {
    createFriend(input: $friend) {
      firstName
      lastName
      email
      role
      id
    }
  }
`;

const ALL_FRIENDS = gql`
  {
    getAllFriends {
      id
      firstName
      lastName
      email
      role
    }
  }
`;

const EDIT_FRIEND = gql`
  mutation editFriend($friend: FriendEditInput) {
    editFriend(input: $friend) {
      firstName
      lastName
      email
      role
    }
  }
`;

type AddFriendProps = {
  initialFriend?: IFriend;
  allowEdit: boolean;
};

interface IKeyableFriend extends IFriend {
  [key: string]: any;
}

interface FriendData {
  getAllFriends: IFriend[];
}

const AddFriend = ({ initialFriend, allowEdit }: AddFriendProps) => {
  const EMPTY_FRIEND: IFriend = {
    firstName: "",
    lastName: "",
    password: "",
    email: "",
  };
  let newFriend = initialFriend ? initialFriend : { ...EMPTY_FRIEND };

  const [addFriend, { data }] = useMutation(ADD_FRIEND, {
    update(cache, { data }) {
      const addedFriend = data.createFriend;
      const d: any = cache.readQuery({ query: ALL_FRIENDS });
      if (!d) {
        return;
      }
      let allFriends = d.getAllFriends || [];
      cache.writeQuery({
        query: ALL_FRIENDS,
        data: { getAllFriends: [...allFriends, addedFriend] },
      });
    },
  });

  const [editFriend, { data: data2 }] = useMutation(EDIT_FRIEND, {
    update(cache, { data }) {
      const editedFriend = data.editFriend;
      const d: any = cache.readQuery({ query: ALL_FRIENDS });
      if (!d) {
        return;
      }
      let allFriends = d.getAllFriends || [];
      cache.writeQuery({
        query: ALL_FRIENDS,
        data: { getAllFriends: [...allFriends, editedFriend] },
      });
    },
  });

  const [friend, setFriend] = useState({ ...newFriend });
  const [readOnly, setReadOnly] = useState(allowEdit);

  const handleChange = (event: React.FormEvent<HTMLInputElement>) => {
    const id = event.currentTarget.id;
    var friendToChange: IKeyableFriend = { ...friend };
    friendToChange[id] = event.currentTarget.value;
    setFriend({ ...friendToChange });
  };
  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (allowEdit) {
      editFriend({
        variables: {
          friend: {
            firstName: friend.firstName,
            lastName: friend.lastName,
            email: friend.email,
            password: friend.password,
          },
        },
      });
    } else {
      addFriend({
        variables: {
          friend: { ...friend },
        },
      });
      setFriend({ ...EMPTY_FRIEND });
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        FirstName
        <br />
        <input
          type="text"
          id="firstName"
          value={friend.firstName}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        LastName <br />
        <input
          type="text"
          id="lastName"
          value={friend.lastName}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Email <br />
        <input
          readOnly={readOnly}
          type="email"
          id="email"
          value={friend.email}
          onChange={handleChange}
        />
      </label>
      <br />
      <label>
        Password <br />
        <input
          type="password"
          id="password"
          value={friend.password}
          onChange={handleChange}
        />
      </label>
      <br />
      <br />
      {<input type="submit" value="Submit" />}
    </form>
  );
};

export default AddFriend;
