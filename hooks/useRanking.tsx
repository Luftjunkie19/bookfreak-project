import { useCallback } from 'react';

import { CompetitionRules } from '../assets/CompetitionsRules/CompetitionRules';

export const useRanking = ({
  readerObjects,
  communityMembers,
  communityObject,
  getReadBooks,
  getlastBookRead,
  expirationTimeNumber,
}) => {
  const { firstComeServedRule, liftOthersRiseJointlyRule, teachToFishRule } =
    CompetitionRules();

  const loadUsers = useCallback(() => {
    let arr = [];
    if (
      readerObjects.length > 0 &&
      communityMembers &&
      communityObject &&
      communityObject.competitionsName
    ) {
      switch (communityObject.competitionsName) {
        case "Lift others, rise":
          arr = liftOthersRiseJointlyRule(
            communityMembers,
            getReadBooks,
            expirationTimeNumber,
            communityObject.createdBy.createdAt,
            getlastBookRead
          );
          break;

        case "First read, first served":
          arr = firstComeServedRule(
            communityMembers,
            getReadBooks,
            getlastBookRead
          );
          break;

        case "Teach to fish":
          arr = teachToFishRule(
            readerObjects,
            communityMembers,
            getReadBooks,
            getlastBookRead
          );
          break;

        default:
          arr = firstComeServedRule(
            communityMembers,
            getReadBooks,
            getlastBookRead
          );
          break;
      }
    } else {
      // Use a default rule if the conditions are not met
      arr = firstComeServedRule(
        communityMembers,
        getReadBooks,
        getlastBookRead
      );
    }
    return arr;
  }, [
    communityObject,
    communityMembers,
    readerObjects,
    getReadBooks,
    expirationTimeNumber,
    getlastBookRead,
    firstComeServedRule,
    liftOthersRiseJointlyRule,
    teachToFishRule,
  ]);

  const array = loadUsers();

  return { orderedMembers: array };
};
