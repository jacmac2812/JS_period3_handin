import React, { useState } from "react";
import { IFriend } from "../interfaces/IFriend";
import { gql, useMutation, ApolloClient } from "@apollo/client";

const DELETE_FRIEND = gql`
  mutation deleteFriend($email: String) {
    deleteFriend(email: $email)
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

type DeleteFriendProps = {
  email: string;
};

const DeleteFriend = ({ email }: DeleteFriendProps) => {
  const [deleteFriend, { data }] = useMutation(DELETE_FRIEND, {
    update(cache, { data }) {
      const d: any = cache.readQuery({ query: ALL_FRIENDS });
      if (!d) {
        return;
      }
      let allFriends =
        d.getAllFriends.filter((f: any) => f.email !== email) || [];
      cache.writeQuery({
        query: ALL_FRIENDS,
        data: { getAllFriends: [...allFriends] },
      });
    },
  });
  const handleDelete = () => {
    deleteFriend({ variables: { email } });
  };
  return <button onClick={handleDelete}>Delete</button>;
};

export default DeleteFriend;
