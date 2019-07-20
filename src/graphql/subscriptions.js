// eslint-disable
// this is an auto generated file. This will be overwritten

export const onCreateSet = `subscription OnCreateSet {
  onCreateSet {
    id
    user
    pictures {
      items {
        id
        url
        rating
      }
      nextToken
    }
  }
}
`;
export const onUpdateSet = `subscription OnUpdateSet {
  onUpdateSet {
    id
    user
    pictures {
      items {
        id
        url
        rating
      }
      nextToken
    }
  }
}
`;
export const onDeleteSet = `subscription OnDeleteSet {
  onDeleteSet {
    id
    user
    pictures {
      items {
        id
        url
        rating
      }
      nextToken
    }
  }
}
`;
export const onCreatePicture = `subscription OnCreatePicture {
  onCreatePicture {
    id
    url
    rating
  }
}
`;
export const onUpdatePicture = `subscription OnUpdatePicture {
  onUpdatePicture {
    id
    url
    rating
  }
}
`;
export const onDeletePicture = `subscription OnDeletePicture {
  onDeletePicture {
    id
    url
    rating
  }
}
`;
