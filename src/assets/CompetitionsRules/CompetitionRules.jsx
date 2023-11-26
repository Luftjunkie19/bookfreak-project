import useRealtimeDocuments from "../../hooks/useRealtimeDocuments";

export function CompetitionRules() {
  const { getDocuments } = useRealtimeDocuments();

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

  const liftOthersRiseJointlyRule = async (
    communityMembers,
    getReadBooks,
    expirationDate,
    creationDate,
    getlastBookRead
  ) => {
    const recommendations = await getDocuments("recommendations");
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

  const teachToFishRule = async (
    readerObjects,
    membersObjects,
    getReadBooks,
    getlastBookRead
  ) => {
    const tests = await getDocuments("tests");

    const allAttempts = tests.map((test) => {
      const attemptsObjects = Object.values(test.attempts);

      return attemptsObjects.map((attempt) => {
        return { ...attempt, refersToBook: test.refersToBook };
      });
    });

    const getUsersAttempts = (userId) => {
      const userAttemptsResults = Math.round(
        allAttempts
          .flat()
          .filter((attempt) => attempt.player.uid === userId)
          .reduce((prev, cur) => prev + cur.finalResult, 0) /
          allAttempts.flat().filter((attempt) => attempt.player.uid === userId)
            .length
      );

      return isNaN(userAttemptsResults) ? 0 : userAttemptsResults;
    };

    const getReadPagesPoints = (id) => {
      const points = Math.round(
        readerObjects
          .filter((reader) => reader.id === id)
          .reduce((prev, cur) => prev + cur.pagesRead, 0) / 10
      );
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
        attemptsAmount: allAttempts
          .flat()
          .filter((attempt) => attempt.player.uid === member.value.id).length,
        gainedPoints:
          getReadPagesPoints(member.value.id) +
          getUsersAttempts(member.value.id) *
            allAttempts
              .flat()
              .filter((attempt) => attempt.player.uid === member.value.id)
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
