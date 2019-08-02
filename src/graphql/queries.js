// eslint-disable
// this is an auto generated file. This will be overwritten

export const getSet = `query GetSet($id: ID!) {
  getSet(id: $id) {
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
export const listSets = `query ListSets($filter: ModelSetFilterInput, $limit: Int, $nextToken: String) {
  listSets(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
      id
      user
      pictures {
        nextToken
      }
    }
    nextToken
  }
}
`;
export const getPicture = `query GetPicture($id: ID!) {
  getPicture(id: $id) {
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
export const listPictures = `query ListPictures(
  $filter: ModelPictureFilterInput
  $limit: Int
  $nextToken: String
) {
  listPictures(filter: $filter, limit: $limit, nextToken: $nextToken) {
    items {
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
    nextToken
  }
}
`;
