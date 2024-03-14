export const extractHashtags = (text) => {
  // Regular expression to match hashtags
  const regex = /#[^\s#]+/g;

  // Use match() to find all matches of the regex in the text
  const hashtags = text.match(regex);

  // Return the array of hashtags
  return hashtags || [];
};

export const makeUnique = (arrayToMakeUnique) => {
  const objectsAreEqual = (obj1, obj2) => {
    // Compare properties of the objects
    return obj1.name === obj2.name;
  };
  const uniqueArray = arrayToMakeUnique.filter(
    (obj, index, self) =>
      self.findIndex((otherObj) => objectsAreEqual(obj, otherObj)) === index
  );

  return uniqueArray;
};
