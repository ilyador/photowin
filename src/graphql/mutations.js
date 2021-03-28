/* eslint-disable */
// this is an auto generated file. This will be overwritten

export const createSet = `mutation CreateSet(
  $input: CreateSetInput!
  $condition: ModelSetConditionInput
) {
  createSet(input: $input, condition: $condition) {
    id
    type
    user
    genderToRate
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
export const updateSet = `mutation UpdateSet(
  $input: UpdateSetInput!
  $condition: ModelSetConditionInput
) {
  updateSet(input: $input, condition: $condition) {
    id
    type
    user
    genderToRate
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
export const deleteSet = `mutation DeleteSet(
  $input: DeleteSetInput!
  $condition: ModelSetConditionInput
) {
  deleteSet(input: $input, condition: $condition) {
    id
    type
    user
    genderToRate
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
export const createPicture = `mutation CreatePicture(
  $input: CreatePictureInput!
  $condition: ModelPictureConditionInput
) {
  createPicture(input: $input, condition: $condition) {
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
export const updatePicture = `mutation UpdatePicture(
  $input: UpdatePictureInput!
  $condition: ModelPictureConditionInput
) {
  updatePicture(input: $input, condition: $condition) {
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
export const deletePicture = `mutation DeletePicture(
  $input: DeletePictureInput!
  $condition: ModelPictureConditionInput
) {
  deletePicture(input: $input, condition: $condition) {
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
export const createUser = `mutation CreateUser(
  $input: CreateUserInput!
  $condition: ModelUserConditionInput
) {
  createUser(input: $input, condition: $condition) {
    id
    name
    age
    points
    traps
  }
}
`;
export const updateUser = `mutation UpdateUser(
  $input: UpdateUserInput!
  $condition: ModelUserConditionInput
) {
  updateUser(input: $input, condition: $condition) {
    id
    name
    age
    points
    traps
  }
}
`;
export const deleteUser = `mutation DeleteUser(
  $input: DeleteUserInput!
  $condition: ModelUserConditionInput
) {
  deleteUser(input: $input, condition: $condition) {
    id
    name
    age
    points
    traps
  }
}
`;
