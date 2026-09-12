// Calculates the total XP required to reach the NEXT level from the current level
export const calculateXpRequirement = (currentLevel: number): number => {
  return Math.floor(100 * Math.pow(currentLevel, 1.5));
};

export interface QuestReward {
  xp: number;
  gold: number;
}

export const calculateQuestReward = (difficulty: string): QuestReward => {
  switch (difficulty) {
    case 'Easy':
      return { xp: 50, gold: 10 };
    case 'Hard':
      return { xp: 200, gold: 50 };
    case 'Epic':
      return { xp: 500, gold: 200 };
    case 'Medium':
    default:
      return { xp: 100, gold: 25 };
  }
};

export const mapCategoryToAttribute = (category: string): string => {
  switch (category) {
    case 'Coding':
      return 'intelligence';
    case 'Studying':
    case 'Reading':
      return 'wisdom';
    case 'Fitness':
      return 'strength';
    case 'Meditation':
      return 'focus';
    case 'Health':
    case 'Personal':
    default:
      return 'vitality';
  }
};

export interface LevelUpResult {
  newLevel: number;
  levelsGained: number;
}

export const getCumulativeXpRequirement = (level: number): number => {
  let total = 0;
  for (let i = 1; i < level; i++) {
    total += calculateXpRequirement(i);
  }
  return total;
};

// Recursively processes level ups to handle multi-level gains from a single large reward
export const processLevelUps = (currentLevel: number, totalXp: number): LevelUpResult => {
  let tempLevel = currentLevel;
  let levelsGained = 0;
  
  while (true) {
    const requiredForNext = getCumulativeXpRequirement(tempLevel + 1);
    // If we have enough cumulative XP to surpass the threshold for the NEXT level
    if (totalXp >= requiredForNext) {
      tempLevel++;
      levelsGained++;
    } else {
      break;
    }
  }

  return { newLevel: tempLevel, levelsGained };
};
