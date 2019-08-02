// eslint-disable
// this is an auto generated file. This will be overwritten

export const createSet = `mutation CreateSet($input: CreateSetInput!) {
  createSet(input: $input) {
    id
    user
    pictures {
      items {
        id
        url
        rating
        appearedForRanking
      }
      nextToken
    }
  }
}
`;
export const updateSet = `mutation UpdateSet($input: UpdateSetInput!) {
  updateSet(input: $input) {
    id
    user
    pictures {
      items {
        id
        url
        rating
        appearedForRanking
      }
      nextToken
    }
  }
}
`;
export const deleteSet = `mutation DeleteSet($input: DeleteSetInput!) {
  deleteSet(input: $input) {
    id
    user
    pictures {
      items {
        id
        url
        rating
        appearedForRanking
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
    url
    rating
    appearedForRanking
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
    url
    rating
    appearedForRanking
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
    url
    rating
    appearedForRanking
  }
}
`;
