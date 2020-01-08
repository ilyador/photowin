/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSet = `mutation CreateSet($input: CreateSetInput!) {
  createSet(input: $input) {
    id
    type
    user
    active
    appearedForRanking
    pictures {
      items {
        id
        rating
      }
      nextToken
    }
  }
}
`;
export const updateSet = `mutation UpdateSet($input: UpdateSetInput!) {
  updateSet(input: $input) {
    id
    type
    user
    active
    appearedForRanking
    pictures {
      items {
        id
        rating
      }
      nextToken
    }
  }
}
`;
export const deleteSet = `mutation DeleteSet($input: DeleteSetInput!) {
  deleteSet(input: $input) {
    id
    type
    user
    active
    appearedForRanking
    pictures {
      items {
        id
        rating
      }
      nextToken
    }
  }
}
`;
export const createPicture = `mutation CreatePicture($input: CreatePictureInput!) {
  createPicture(input: $input) {
    id
    file {
      bucket
      key
      region
    }
    rating
  }
}
`;
export const updatePicture = `mutation UpdatePicture($input: UpdatePictureInput!) {
  updatePicture(input: $input) {
    id
    file {
      bucket
      key
      region
    }
    rating
  }
}
`;
export const deletePicture = `mutation DeletePicture($input: DeletePictureInput!) {
  deletePicture(input: $input) {
    id
    file {
      bucket
      key
      region
    }
    rating
  }
}
`;
export const createUser = `mutation CreateUser($input: CreateUserInput!) {
  createUser(input: $input) {
    id
    name
    age
    points
  }
}
`;
export const updateUser = `mutation UpdateUser($input: UpdateUserInput!) {
  updateUser(input: $input) {
    id
    name
    age
    points
  }
}
`;
export const deleteUser = `mutation DeleteUser($input: DeleteUserInput!) {
  deleteUser(input: $input) {
    id
    name
    age
    points
  }
}
`;
