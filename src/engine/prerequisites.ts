import { Topic, StudentTopicProgress } from '../types';
import { MASTERY_THRESHOLDS } from './mastery';

export interface PrerequisiteCheckResult {
  isSatisfied: boolean;
  missingPrerequisites: {
    topicId: string;
    topicTitle: string;
    currentMastery: number;
    requiredMastery: number;
  }[];
}

/**
 * Checks whether all prerequisites for a target topic are satisfied.
 */
export function checkPrerequisites(
  targetTopic: Topic,
  allTopics: Topic[],
  progressMap: Record<string, StudentTopicProgress>
): PrerequisiteCheckResult {
  const missingPrerequisites: PrerequisiteCheckResult['missingPrerequisites'] = [];

  for (const prereqId of targetTopic.prerequisites) {
    const prereqTopic = allTopics.find(t => t.id === prereqId);
    const progress = progressMap[prereqId];
    const currentScore = progress ? progress.masteryScore : 0;

    if (currentScore < MASTERY_THRESHOLDS.PREREQUISITE_MINIMUM) {
      missingPrerequisites.push({
        topicId: prereqId,
        topicTitle: prereqTopic ? prereqTopic.title : prereqId,
        currentMastery: currentScore,
        requiredMastery: MASTERY_THRESHOLDS.PREREQUISITE_MINIMUM
      });
    }
  }

  return {
    isSatisfied: missingPrerequisites.length === 0,
    missingPrerequisites
  };
}
