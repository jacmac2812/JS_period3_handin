/* eslint-disable @typescript-eslint/no-unused-vars */

import React, { useState } from "react";
import { useLazyQuery, gql } from "@apollo/client";
import { IFriend } from "../interfaces/IFriend";

interface IFriendResult {
  getFriendFromId: IFriend;
}

interface IVariableInput {
  id: string;
}

const GET_FRIEND = gql`
  query getFriendFromId($id: String!) {
    getFriendFromId(id: $id) {
      id
      email
      firstName
      lastName
      role
    }
  }
`;

export default function FindFriend() {
  const [id, setId] = useState("");
  const [getFriendFromId, { loading, called, data }] = useLazyQuery<
    IFriendResult,
    IVariableInput
  >(GET_FRIEND, { fetchPolicy: "cache-and-network" });

  const fetchFriend = () => {
    alert(`Find friend with id: ${id}`);
    getFriendFromId({ variables: { id } });
  };

  return (
    <div>
      ID:
      <input
        type="txt"
        value={id}
        onChange={(e) => {
          setId(e.target.value);
        }}
      />
      &nbsp; <button onClick={fetchFriend}>Find Friend</button>
      <br />
      <br />
      {called && loading && <p>Loading...</p>}
      {data && <p>{data.getFriendFromId.firstName}</p>}
      {data && <p>{data.getFriendFromId.lastName}</p>}
    </div>
  );
}
