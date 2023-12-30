import useGetDocuments from '../../hooks/useGetDocuments';

export function CompetitionRules() {
  const { documents: recommendations } = useGetDocuments("recommendations");
  const { documents: tests } = useGetDocuments("tests");

  const firstComeServedRule = (members, getReadBooks, getlastBookRead) => {
    const usersWithReadBooks = members.map((user) => ({
      id: user.value.id,
      nickname: user.value.nickname,
      photoURL: user.value.photoURL,
      readBooks: getReadBooks(user.value.id),
      lastReadBook: getlastBookRead(user.value.id),
    }));

    return usersWithReadBooks
      .sort((a, b) => b.readBooks - a.readBooks)
      .slice(0, 3);
  };

  const liftOthersRiseJointlyRule = (
    communityMembers,
    getReadBooks,
    expirationDate,
    creationDate,
    getlastBookRead
  ) => {
    if (recommendations) {
      const getReccomendationsNumber = (id) => {
        const recommendationsArr = recommendations
          .map((recommendation) => {
            return Object.values(recommendation);
          })
          .flat()
          .filter(
            (rec) =>
              rec.sender.id === id &&
              rec.sentAt <= expirationDate &&
              rec.sentAt >= creationDate
          ).length;
        return recommendationsArr;
      };

      return communityMembers
        .map((member) => {
          return {
            id: member.value.id,
            nickname: member.value.nickname,
            photoURL: member.value.photoURL,
            recommendationsAmount: getReccomendationsNumber(member.value.id),
            readBooks: getReadBooks(member.value.id),
            lastReadBook: getlastBookRead(member.value.id),
          };
        })
        .sort((a, b) => b.recommendationsAmount - a.recommendationsAmount)
        .slice(0, 3);
    } else {
      return [].length;
    }
  };

  const teachToFishRule = (
    readerObjects,
    membersObjects,
    getReadBooks,
    getlastBookRead
  ) => {
    // Ensure 'tests' is defined
    const allAttempts = tests.map((test) => {
      // Check if test.attempts is an object, otherwise return an empty array
      const attemptsObjects = test.attempts ? Object.values(test.attempts) : [];
  
      return attemptsObjects.map((attempt) => {
        return { ...attempt, refersToBook: test.refersToBook };
      });
    });
  
    const getUsersAttempts = (userId) => {
      const userAttempts = allAttempts.flat().filter((attempt) => attempt.player?.uid === userId);
  
      // Check if there are attempts before calculating average
      const userAttemptsResults = userAttempts.length > 0
        ? Math.round(userAttempts.reduce((prev, cur) => prev + cur.finalResult, 0) / userAttempts.length)
        : 0;
  
      return isNaN(userAttemptsResults) ? 0 : userAttemptsResults;
    };
  
    const getReadPagesPoints = (id) => {
      const reader = readerObjects.find((reader) => reader.id === id);
  
      // Check if reader is defined before accessing properties
      const points = reader ? Math.round(reader.pagesRead / 10) : 0;
  
      return isNaN(points) ? 0 : points;
    };
  
    const fullMembers = membersObjects.map((member) => {
      return {
        id: member.value.id,
        nickname: member.value.nickname,
        photoURL: member.value.photoURL,
        usersAverageResult: getUsersAttempts(member.value.id),
        readBooks: getReadBooks(member.value.id),
        lastReadBook: getlastBookRead(member.value.id),
        attemptsAmount: allAttempts.flat().filter((attempt) => attempt.player?.uid === member.value.id).length,
        gainedPoints:
          getReadPagesPoints(member.value.id) +
          getUsersAttempts(member.value.id) *
            allAttempts
              .flat()
              .filter((attempt) => attempt.player?.uid === member.value.id)
              .length *
            2.5 +
          getReadBooks(member.value.id) * 2,
      };
    });
  
    return fullMembers
      .sort((a, b) => b.gainedPoints - a.gainedPoints)
      .slice(0, 3);
  };
  
  return { firstComeServedRule, liftOthersRiseJointlyRule, teachToFishRule };
}
