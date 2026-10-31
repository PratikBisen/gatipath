import { Topic, Question, Misconception } from '../../types';

export const MISCONCEPTIONS: Record<string, Misconception> = {
  denominator_addition_error: {
    code: 'denominator_addition_error',
    name: 'Adding Denominators Together',
    description: 'Student adds both numerators and denominators, treating them as separate whole numbers (e.g., 1/4 + 1/4 = 2/8).',
    whyItHappens: 'Students confuse whole-number addition with fraction addition. Denominators define the size of each slice; they do not count how many slices you have.',
    remedialConcept: 'When the denominators are identical, the size of each part is the same. Only combine the numerators (the number of pieces). Keep the denominator unchanged: 1/4 + 1/4 = 2/4 = 1/2.',
    visualFixExplanation: 'Imagine a pizza cut into 4 equal slices. 1 slice + 1 slice = 2 slices out of 4 (half the pizza), NOT 2 slices out of 8 (which would be a quarter of the pizza!).'
  },
  numerator_denominator_confusion: {
    code: 'numerator_denominator_confusion',
    name: 'Numerator / Denominator Confusion',
    description: 'Inverting or misinterpreting the roles of numerator (parts taken) and denominator (total equal parts).',
    whyItHappens: 'Mixing up which number is on top versus bottom, often reading a fraction upside down.',
    remedialConcept: 'Numerator = Number of parts we have. Denominator = Total number of equal parts making 1 whole.',
    visualFixExplanation: 'Think: D for Denominator, D for Down (bottom number).'
  },
  equivalent_fraction_error: {
    code: 'equivalent_fraction_error',
    name: 'Unequal Scale Factor in Equivalence',
    description: 'Adding a constant to top and bottom or multiplying only the numerator or denominator.',
    whyItHappens: 'Thinking equivalent fractions are formed by adding numbers (e.g., 1/2 = 2/3 by adding 1 to both).',
    remedialConcept: 'To make an equivalent fraction, you must MULTIPLY or DIVIDE both numerator and denominator by the exact SAME non-zero number.',
    visualFixExplanation: 'Multiplying by 2/2 is multiplying by 1, so the actual value remains identical.'
  },
  lcm_error: {
    code: 'lcm_error',
    name: 'Incorrect Common Denominator',
    description: 'Failing to find the Least Common Multiple (LCM) or simply multiplying numbers incorrectly.',
    whyItHappens: 'Rushing or missing prime factor multiples when finding common denominators for unlike fractions.',
    remedialConcept: 'Find the LCM of the denominators first, then convert each fraction to an equivalent fraction with that common denominator.',
    visualFixExplanation: 'Convert both fractions so they have identical sized pieces before adding or subtracting.'
  },
  reciprocal_error: {
    code: 'reciprocal_error',
    name: 'Missing or Inverted Reciprocal in Division',
    description: 'Multiplying directly without inverting the divisor, or inverting the dividend instead.',
    whyItHappens: 'Memorizing "flip the fraction" without remembering WHICH fraction to invert (the divisor).',
    remedialConcept: 'Dividing by a fraction is the same as multiplying by its reciprocal: a/b ÷ c/d = a/b × d/c.',
    visualFixExplanation: 'Dividing by 1/2 means finding how many halves fit into the quantity, which doubles it.'
  },
  simplification_error: {
    code: 'simplification_error',
    name: 'Incomplete or Uneven Simplification',
    description: 'Dividing numerator and denominator by different numbers, or stopping before the fraction is in lowest terms.',
    whyItHappens: 'Missing common factors (such as stopping at 4/8 instead of 1/2).',
    remedialConcept: 'Divide both numerator and denominator by their Greatest Common Factor (GCF) until no common factors remain.',
    visualFixExplanation: 'Both numbers must share the exact same divisor until only 1 divides them evenly.'
  },
  comparison_by_numerator_only: {
    code: 'comparison_by_numerator_only',
    name: 'Comparing Only Numerators Without Common Denominators',
    description: 'Believing 3/8 > 2/3 because 3 is greater than 2, ignoring the denominator size.',
    whyItHappens: 'Treating the top numbers as regular integers without considering how large each individual piece is.',
    remedialConcept: 'Before comparing fractions with different denominators, either convert them to equivalent fractions with a common denominator or compare against benchmark 1/2.',
    visualFixExplanation: 'Thirds (1/3) are much larger slices than eighths (1/8). 2/3 is 0.67, while 3/8 is 0.375.'
  }
};

export interface TopicLessonContent {
  summary: string;
  keyRule: string;
  visualDescription: string;
  workedExamples: {
    problem: string;
    stepByStep: string[];
    result: string;
    caution: string;
  }[];
}

export const TOPIC_LESSONS: Record<string, TopicLessonContent> = {
  'topic-1': {
    summary: 'A fraction represents a part of a whole. The denominator (bottom) tells how many equal parts the whole is divided into. The numerator (top) tells how many of those parts you have.',
    keyRule: 'Equivalent fractions are created by multiplying or dividing BOTH numerator and denominator by the same non-zero number.',
    visualDescription: 'A chocolate bar divided into 6 equal squares. If you eat 3 squares, you have eaten 3/6, which is exactly equal to 1/2 of the bar.',
    workedExamples: [
      {
        problem: 'Simplify the fraction 12/18 to its simplest form.',
        stepByStep: [
          'Find common factors of 12 and 18: Factors of 12 = {1, 2, 3, 4, 6, 12}; Factors of 18 = {1, 2, 3, 6, 9, 18}.',
          'The Greatest Common Factor (GCF) is 6.',
          'Divide numerator and denominator by 6: 12 ÷ 6 = 2, and 18 ÷ 6 = 3.',
          'The resulting fraction is 2/3.'
        ],
        result: '12/18 = 2/3',
        caution: 'Always check if the final numerator and denominator share any common factors other than 1.'
      }
    ]
  },
  'topic-2': {
    summary: 'To compare fractions, their pieces must be the exact same size. When denominators are equal, simply compare numerators. When denominators are different, find a common denominator (LCM) first.',
    keyRule: 'If denominators are the same, larger numerator = larger fraction. If denominators are different, convert to common denominator first.',
    visualDescription: 'Comparing 2/3 and 3/5: cut two equal paper strips. One into 3 pieces (taking 2), the other into 5 pieces (taking 3). 2/3 is noticeably longer than 3/5.',
    workedExamples: [
      {
        problem: 'Which fraction is greater: 3/4 or 5/6?',
        stepByStep: [
          'The denominators are 4 and 6. Their LCM is 12.',
          'Convert 3/4: (3 × 3) / (4 × 3) = 9/12.',
          'Convert 5/6: (5 × 2) / (6 × 2) = 10/12.',
          'Now compare numerators: 10/12 is greater than 9/12.',
          'Therefore, 5/6 > 3/4.'
        ],
        result: '5/6 is greater than 3/4',
        caution: 'Do not just say 5/6 is bigger because 5 > 3. Compare with identical denominators!'
      }
    ]
  },
  'topic-3': {
    summary: 'When adding or subtracting fractions with the SAME denominator, keep the denominator unchanged and simply add or subtract the numerators. With DIFFERENT denominators, convert to common denominators (LCM) first.',
    keyRule: 'NEVER add denominators! 1/4 + 1/4 = 2/4 (which is 1/2), NOT 2/8.',
    visualDescription: 'Two quarters of an apple put together make two quarters (half an apple). They do not turn into eighths!',
    workedExamples: [
      {
        problem: 'Calculate: 1/4 + 1/4 and write the answer in simplest form.',
        stepByStep: [
          'Notice both fractions share the same denominator (4).',
          'Add the numerators together: 1 + 1 = 2.',
          'Keep the denominator as 4: 2/4.',
          'Simplify: divide numerator and denominator by 2: 2 ÷ 2 = 1, 4 ÷ 2 = 2.',
          'The final simplest answer is 1/2.'
        ],
        result: '1/4 + 1/4 = 1/2',
        caution: 'Common trap: 1/4 + 1/4 ≠ 2/8. Adding denominators is mathematically invalid.'
      },
      {
        problem: 'Calculate: 1/3 + 1/6',
        stepByStep: [
          'Denominators are 3 and 6. The LCM is 6.',
          'Convert 1/3 to denominator 6: (1 × 2)/(3 × 2) = 2/6.',
          'Now add: 2/6 + 1/6 = (2 + 1)/6 = 3/6.',
          'Simplify: 3/6 = 1/2.'
        ],
        result: '1/3 + 1/6 = 1/2',
        caution: 'Always find the common denominator before adding unlike fractions.'
      }
    ]
  },
  'topic-4': {
    summary: 'To multiply fractions, multiply the numerators together and denominators together. To divide fractions, multiply the first fraction by the reciprocal (flipped version) of the second fraction.',
    keyRule: 'Multiplication: (a/b) × (c/d) = (a×c)/(b×d). Division: (a/b) ÷ (c/d) = (a/b) × (d/c).',
    visualDescription: 'Half of a quarter pizza: 1/2 × 1/4 = 1/8 of the whole pizza.',
    workedExamples: [
      {
        problem: 'Calculate: 3/5 ÷ 2/3',
        stepByStep: [
          'Keep the first fraction unchanged: 3/5.',
          'Find the reciprocal of 2/3: flip it to 3/2.',
          'Change division to multiplication: 3/5 × 3/2.',
          'Multiply numerators: 3 × 3 = 9.',
          'Multiply denominators: 5 × 2 = 10.',
          '9 and 10 share no common factors besides 1.'
        ],
        result: '3/5 ÷ 2/3 = 9/10',
        caution: 'Only flip the second fraction (the divisor), never the first fraction.'
      }
    ]
  }
};

export const TOPICS: Topic[] = [
  {
    id: 'topic-1',
    title: 'Understanding Fractions',
    description: 'Master numerators, denominators, proper & improper fractions, equivalence, and simplest forms.',
    classLevel: 7,
    subject: 'Mathematics',
    sequenceOrder: 1,
    estimatedMinutes: 20,
    prerequisites: [],
    keyConcepts: [
      'Numerator counts parts taken; denominator counts total equal parts',
      'Proper fractions < 1; Improper fractions ≥ 1',
      'Equivalent fractions by multiplying/dividing by same non-zero factor',
      'Simplification using Greatest Common Factor (GCF)'
    ]
  },
  {
    id: 'topic-2',
    title: 'Comparing Fractions',
    description: 'Compare and order like and unlike fractions using equivalent fractions and common denominators.',
    classLevel: 7,
    subject: 'Mathematics',
    sequenceOrder: 2,
    estimatedMinutes: 25,
    prerequisites: ['topic-1'],
    keyConcepts: [
      'Comparing fractions with like denominators',
      'Finding the Least Common Multiple (LCM) for unlike denominators',
      'Converting to equivalent fractions with common denominators',
      'Ascending and descending order of fractions'
    ]
  },
  {
    id: 'topic-3',
    title: 'Addition & Subtraction of Fractions',
    description: 'Add and subtract like and unlike fractions without falling into common denominator addition traps.',
    classLevel: 7,
    subject: 'Mathematics',
    sequenceOrder: 3,
    estimatedMinutes: 30,
    prerequisites: ['topic-1', 'topic-2'],
    keyConcepts: [
      'Adding and subtracting like fractions (keep denominator constant)',
      'Avoiding the common denominator-addition misconception (1/4 + 1/4 ≠ 2/8)',
      'Finding LCM for unlike fraction addition and subtraction',
      'Simplifying the final sum or difference to lowest terms'
    ]
  },
  {
    id: 'topic-4',
    title: 'Multiplication & Division of Fractions',
    description: 'Understand fraction multiplication, reciprocal concept, dividing fractions, and real-world word problems.',
    classLevel: 7,
    subject: 'Mathematics',
    sequenceOrder: 4,
    estimatedMinutes: 30,
    prerequisites: ['topic-1', 'topic-3'],
    keyConcepts: [
      'Multiplying numerators together and denominators together',
      'Understanding reciprocals (multiplicative inverses)',
      'Dividing fractions by multiplying by reciprocal',
      'Solving multi-step real-world fraction word problems'
    ]
  }
];

export const QUESTIONS: Question[] = [
  // ==========================================
  // TOPIC 1: UNDERSTANDING FRACTIONS (8 questions)
  // ==========================================
  {
    id: 'q1-1',
    topicId: 'topic-1',
    difficulty: 'easy',
    questionType: 'multiple_choice',
    questionText: 'In the fraction 3/7, what does the number 7 represent?',
    visualModel: {
      type: 'fraction_bar',
      totalParts: 7,
      shadedParts: [1, 2, 3],
      labels: ['1/7', '2/7', '3/7', '4/7', '5/7', '6/7', '7/7']
    },
    options: [
      { id: 'opt-a', text: 'The total number of equal parts that make up the whole' },
      { id: 'opt-b', text: 'The number of parts that have been selected or shaded', misconceptionCode: 'numerator_denominator_confusion' },
      { id: 'opt-c', text: 'The difference between top and bottom numbers' },
      { id: 'opt-d', text: 'The multiplier for the fraction' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'The denominator (7) represents the total number of equal pieces into which the whole unit is divided. The numerator (3) represents the number of pieces selected.',
    hint: 'Think of the bottom number (denominator) as defining the size of the whole cutting.'
  },
  {
    id: 'q1-2',
    topicId: 'topic-1',
    difficulty: 'easy',
    questionType: 'multiple_choice',
    questionText: 'Which of the following is equivalent to 2/5?',
    visualModel: {
      type: 'fraction_bar',
      totalParts: 5,
      shadedParts: [1, 2]
    },
    options: [
      { id: 'opt-a', text: '4/10' },
      { id: 'opt-b', text: '3/6', misconceptionCode: 'equivalent_fraction_error' },
      { id: 'opt-c', text: '4/5', misconceptionCode: 'equivalent_fraction_error' },
      { id: 'opt-d', text: '5/2', misconceptionCode: 'numerator_denominator_confusion' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Multiply both numerator and denominator by 2: (2 × 2) / (5 × 2) = 4/10. An equivalent fraction must scale both parts by the exact same multiplier.',
    hint: 'Multiply both top and bottom by the same number (try multiplying by 2).'
  },
  {
    id: 'q1-3',
    topicId: 'topic-1',
    difficulty: 'medium',
    questionType: 'multiple_choice',
    questionText: 'Simplify 18/24 to its simplest (irreducible) form.',
    options: [
      { id: 'opt-a', text: '3/4' },
      { id: 'opt-b', text: '9/12', misconceptionCode: 'simplification_error' },
      { id: 'opt-c', text: '6/8', misconceptionCode: 'simplification_error' },
      { id: 'opt-d', text: '4/3', misconceptionCode: 'numerator_denominator_confusion' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'The greatest common factor (GCF) of 18 and 24 is 6. Dividing both by 6 gives 18 ÷ 6 = 3, and 24 ÷ 6 = 4. While 9/12 and 6/8 are equivalent, only 3/4 is in simplest form.',
    hint: 'Find the largest number that divides both 18 and 24 evenly.'
  },
  {
    id: 'q1-4',
    topicId: 'topic-1',
    difficulty: 'medium',
    questionType: 'multiple_choice',
    questionText: 'Which fraction is an improper fraction?',
    options: [
      { id: 'opt-a', text: '9/7' },
      { id: 'opt-b', text: '5/8' },
      { id: 'opt-c', text: '2/3' },
      { id: 'opt-d', text: '1/9' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'An improper fraction is one where the numerator is greater than or equal to the denominator. For 9/7, 9 is greater than 7, representing more than 1 whole (1 2/7).',
    hint: 'Look for a fraction where the top number is bigger than the bottom number.'
  },
  {
    id: 'q1-5',
    topicId: 'topic-1',
    difficulty: 'hard',
    questionType: 'multiple_choice',
    questionText: 'If 3/x is equivalent to 15/35, what is the value of x?',
    options: [
      { id: 'opt-a', text: '7' },
      { id: 'opt-b', text: '5', misconceptionCode: 'equivalent_fraction_error' },
      { id: 'opt-c', text: '10' },
      { id: 'opt-d', text: '20' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Notice that 15 ÷ 3 = 5. So the scale factor is 5. Therefore, 35 ÷ 5 = 7. Thus, x = 7, making 3/7 equivalent to 15/35.',
    hint: 'Determine what number 3 was multiplied by to make 15, then apply that to 35.'
  },
  {
    id: 'q1-6',
    topicId: 'topic-1',
    difficulty: 'easy',
    questionType: 'multiple_choice',
    questionText: 'What fraction of an hour is 20 minutes? (Hint: 1 hour = 60 minutes)',
    options: [
      { id: 'opt-a', text: '1/3' },
      { id: 'opt-b', text: '2/6', misconceptionCode: 'simplification_error' },
      { id: 'opt-c', text: '1/4' },
      { id: 'opt-d', text: '2/3' }
    ],
    correctAnswer: 'opt-a',
    explanation: '20 minutes out of 60 minutes is written as 20/60. Dividing numerator and denominator by 20 simplifies to 1/3.',
    hint: 'Write 20/60 and simplify by dividing both by 20.'
  },
  {
    id: 'q1-7',
    topicId: 'topic-1',
    difficulty: 'medium',
    questionType: 'multiple_choice',
    questionText: 'Which pair of fractions are NOT equivalent?',
    options: [
      { id: 'opt-a', text: '3/5 and 9/15' },
      { id: 'opt-b', text: '4/7 and 8/14' },
      { id: 'opt-c', text: '2/3 and 6/12', misconceptionCode: 'equivalent_fraction_error' },
      { id: 'opt-d', text: '5/6 and 25/30' }
    ],
    correctAnswer: 'opt-c',
    explanation: '2/3 simplified is 2/3 (or 8/12). 6/12 simplified is 1/2. They are not equal, because 2×4=8 ≠ 6.',
    hint: 'Simplify each fraction to its lowest terms or cross-multiply to test equivalence.'
  },
  {
    id: 'q1-8',
    topicId: 'topic-1',
    difficulty: 'hard',
    questionType: 'multiple_choice',
    questionText: 'Express 3 3/4 as an improper fraction in simplest form.',
    options: [
      { id: 'opt-a', text: '15/4' },
      { id: 'opt-b', text: '9/4', misconceptionCode: 'numerator_denominator_confusion' },
      { id: 'opt-c', text: '13/4' },
      { id: 'opt-d', text: '12/4' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Multiply the whole number by the denominator and add the numerator: (3 × 4) + 3 = 12 + 3 = 15. The denominator remains 4, yielding 15/4.',
    hint: 'Formula: (Whole Number × Denominator + Numerator) / Denominator.'
  },

  // ==========================================
  // TOPIC 2: COMPARING FRACTIONS (8 questions)
  // ==========================================
  {
    id: 'q2-1',
    topicId: 'topic-2',
    difficulty: 'easy',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Which fraction is greater: 5/9 or 2/9?',
    visualModel: {
      type: 'fraction_bar',
      totalParts: 9,
      shadedParts: [1, 2, 3, 4, 5]
    },
    options: [
      { id: 'opt-a', text: '5/9' },
      { id: 'opt-b', text: '2/9' },
      { id: 'opt-c', text: 'They are equal' },
      { id: 'opt-d', text: 'Cannot be compared' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'When denominators are identical (9), the fraction with the larger numerator has more parts and is therefore greater. 5 pieces is greater than 2 pieces of the same size.',
    hint: 'The denominators are equal, so just compare the top numbers.'
  },
  {
    id: 'q2-2',
    topicId: 'topic-2',
    difficulty: 'medium',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Compare 3/4 and 5/8. Which statement is correct?',
    visualModel: {
      type: 'fraction_bar',
      totalParts: 8,
      shadedParts: [1, 2, 3, 4, 5, 6]
    },
    options: [
      { id: 'opt-a', text: '3/4 > 5/8' },
      { id: 'opt-b', text: '5/8 > 3/4', misconceptionCode: 'comparison_by_numerator_only' },
      { id: 'opt-c', text: '3/4 = 5/8' },
      { id: 'opt-d', text: '3/4 < 5/8' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Convert 3/4 to an equivalent fraction with denominator 8: (3 × 2) / (4 × 2) = 6/8. Now compare: 6/8 is greater than 5/8. Therefore, 3/4 > 5/8.',
    hint: 'Convert 3/4 to eighths by multiplying top and bottom by 2.'
  },
  {
    id: 'q2-3',
    topicId: 'topic-2',
    difficulty: 'medium',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'What is the Least Common Denominator (LCD) needed to compare 2/3 and 3/5?',
    options: [
      { id: 'opt-a', text: '15' },
      { id: 'opt-b', text: '8', misconceptionCode: 'lcm_error' },
      { id: 'opt-c', text: '10', misconceptionCode: 'lcm_error' },
      { id: 'opt-d', text: '30' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'The denominators are 3 and 5. Since both are prime numbers, their Least Common Multiple (LCM) is 3 × 5 = 15.',
    hint: 'Find the lowest number that appears in both the 3 times table and 5 times table.'
  },
  {
    id: 'q2-4',
    topicId: 'topic-2',
    difficulty: 'hard',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Arrange the following fractions in ascending order (smallest to largest): 1/2, 2/5, 3/10',
    options: [
      { id: 'opt-a', text: '3/10 < 2/5 < 1/2' },
      { id: 'opt-b', text: '1/2 < 2/5 < 3/10', misconceptionCode: 'comparison_by_numerator_only' },
      { id: 'opt-c', text: '2/5 < 3/10 < 1/2' },
      { id: 'opt-d', text: '3/10 < 1/2 < 2/5' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Convert all fractions to common denominator 10: 1/2 = 5/10; 2/5 = 4/10; 3/10 = 3/10. Ordering: 3/10 < 4/10 < 5/10, which means 3/10 < 2/5 < 1/2.',
    hint: 'Convert all three fractions so they have denominator 10.'
  },
  {
    id: 'q2-5',
    topicId: 'topic-2',
    difficulty: 'easy',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Which fraction is smaller: 1/3 or 1/5?',
    visualModel: {
      type: 'pie_chart',
      totalParts: 5,
      shadedParts: [1]
    },
    options: [
      { id: 'opt-a', text: '1/5 is smaller' },
      { id: 'opt-b', text: '1/3 is smaller', misconceptionCode: 'comparison_by_numerator_only' },
      { id: 'opt-c', text: 'They are equal' },
      { id: 'opt-d', text: 'Cannot tell without adding' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'When numerators are equal (1), dividing a whole into MORE parts (5) makes each piece smaller than dividing into FEWER parts (3). So 1/5 < 1/3.',
    hint: 'If you share a cake among 5 people, each gets a smaller slice than sharing among 3 people.'
  },
  {
    id: 'q2-6',
    topicId: 'topic-2',
    difficulty: 'medium',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Which symbol makes the statement true: 4/7 [ ? ] 5/9',
    options: [
      { id: 'opt-a', text: '>' },
      { id: 'opt-b', text: '<' },
      { id: 'opt-c', text: '=' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Cross-multiply: 4 × 9 = 36, and 7 × 5 = 35. Since 36 > 35, 4/7 > 5/9.',
    hint: 'Find common denominator 63 or cross-multiply: (4×9) vs (7×5).'
  },
  {
    id: 'q2-7',
    topicId: 'topic-2',
    difficulty: 'hard',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Priya ran 7/12 km and Rohan ran 5/8 km. Who ran the longer distance?',
    options: [
      { id: 'opt-a', text: 'Rohan ran longer (5/8 km)' },
      { id: 'opt-b', text: 'Priya ran longer (7/12 km)', misconceptionCode: 'comparison_by_numerator_only' },
      { id: 'opt-c', text: 'Both ran the exact same distance' },
      { id: 'opt-d', text: 'Cannot be determined' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'LCM of 12 and 8 is 24. Priya: 7/12 = 14/24 km. Rohan: 5/8 = 15/24 km. Since 15/24 > 14/24, Rohan ran longer.',
    hint: 'Convert both fractions to 24ths (Priya: 7×2 / 12×2; Rohan: 5×3 / 8×3).'
  },
  {
    id: 'q2-8',
    topicId: 'topic-2',
    difficulty: 'easy',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Which fraction is greater than 1/2?',
    options: [
      { id: 'opt-a', text: '4/7' },
      { id: 'opt-b', text: '3/8' },
      { id: 'opt-c', text: '2/5' },
      { id: 'opt-d', text: '5/12' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Half of 7 is 3.5. Since the numerator 4 > 3.5, 4/7 is greater than 1/2. In all other options, numerator is less than half the denominator (3 < 4, 2 < 2.5, 5 < 6).',
    hint: 'Compare the numerator to half of the denominator.'
  },

  // ==========================================
  // TOPIC 3: ADDITION & SUBTRACTION (8 questions)
  // Including the Aarav Scenario Question (q3-1)!
  // ==========================================
  {
    id: 'q3-1',
    topicId: 'topic-3',
    difficulty: 'easy',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Calculate: 1/4 + 1/4. Choose the answer in simplest form.',
    visualModel: {
      type: 'fraction_bar',
      totalParts: 4,
      shadedParts: [1, 2],
      labels: ['1/4', '+ 1/4', '', '']
    },
    options: [
      { id: 'opt-a', text: '1/2' },
      { id: 'opt-b', text: '2/8', misconceptionCode: 'denominator_addition_error' },
      { id: 'opt-c', text: '2/4', misconceptionCode: 'simplification_error' },
      { id: 'opt-d', text: '1/8', misconceptionCode: 'denominator_addition_error' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'When adding fractions with the same denominator, keep the denominator 4 and add the numerators: 1 + 1 = 2, giving 2/4. Then simplify 2/4 by dividing numerator and denominator by 2 to get 1/2. NEVER add denominators together!',
    hint: 'Keep the denominator 4 and add the top numbers 1 + 1, then simplify.'
  },
  {
    id: 'q3-2',
    topicId: 'topic-3',
    difficulty: 'easy',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Calculate: 2/7 + 3/7',
    visualModel: {
      type: 'fraction_bar',
      totalParts: 7,
      shadedParts: [1, 2, 3, 4, 5]
    },
    options: [
      { id: 'opt-a', text: '5/7' },
      { id: 'opt-b', text: '5/14', misconceptionCode: 'denominator_addition_error' },
      { id: 'opt-c', text: '6/7' },
      { id: 'opt-d', text: '1/7' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'The denominators are the same (7). Add numerators: 2 + 3 = 5. The denominator remains 7, giving 5/7. Denominators are not added.',
    hint: 'The denominator is already the same. Only add the top numbers 2 and 3.'
  },
  {
    id: 'q3-3',
    topicId: 'topic-3',
    difficulty: 'medium',
    prerequisiteTopicId: 'topic-2',
    questionType: 'multiple_choice',
    questionText: 'Calculate: 1/3 + 1/6',
    options: [
      { id: 'opt-a', text: '1/2' },
      { id: 'opt-b', text: '2/9', misconceptionCode: 'denominator_addition_error' },
      { id: 'opt-c', text: '3/6', misconceptionCode: 'simplification_error' },
      { id: 'opt-d', text: '2/6', misconceptionCode: 'lcm_error' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Denominators are 3 and 6. The LCM is 6. Convert 1/3: (1 × 2)/(3 × 2) = 2/6. Now add: 2/6 + 1/6 = 3/6. Simplify 3/6 by dividing by 3 to get 1/2.',
    hint: 'Convert 1/3 to sixths by multiplying top and bottom by 2.'
  },
  {
    id: 'q3-4',
    topicId: 'topic-3',
    difficulty: 'medium',
    prerequisiteTopicId: 'topic-2',
    questionType: 'multiple_choice',
    questionText: 'Subtract: 5/8 - 1/4',
    options: [
      { id: 'opt-a', text: '3/8' },
      { id: 'opt-b', text: '4/4', misconceptionCode: 'denominator_addition_error' },
      { id: 'opt-c', text: '4/8', misconceptionCode: 'lcm_error' },
      { id: 'opt-d', text: '1/8' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Convert 1/4 to eighths: (1 × 2)/(4 × 2) = 2/8. Subtract: 5/8 - 2/8 = (5 - 2)/8 = 3/8.',
    hint: 'First turn 1/4 into 2/8, then subtract 5/8 - 2/8.'
  },
  {
    id: 'q3-5',
    topicId: 'topic-3',
    difficulty: 'hard',
    prerequisiteTopicId: 'topic-2',
    questionType: 'multiple_choice',
    questionText: 'Calculate: 2/5 + 1/4. What is the sum in simplest form?',
    options: [
      { id: 'opt-a', text: '13/20' },
      { id: 'opt-b', text: '3/9', misconceptionCode: 'denominator_addition_error' },
      { id: 'opt-c', text: '3/20', misconceptionCode: 'lcm_error' },
      { id: 'opt-d', text: '11/20' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'LCM of 5 and 4 is 20. Convert 2/5 = (2×4)/(5×4) = 8/20. Convert 1/4 = (1×5)/(4×5) = 5/20. Add: 8/20 + 5/20 = 13/20.',
    hint: 'Common denominator for 5 and 4 is 20.'
  },
  {
    id: 'q3-6',
    topicId: 'topic-3',
    difficulty: 'hard',
    prerequisiteTopicId: 'topic-2',
    questionType: 'multiple_choice',
    questionText: 'Ramesh painted 2/3 of a wall in the morning and 1/5 of the wall in the evening. How much of the wall did he paint in total?',
    options: [
      { id: 'opt-a', text: '13/15 of the wall' },
      { id: 'opt-b', text: '3/8 of the wall', misconceptionCode: 'denominator_addition_error' },
      { id: 'opt-c', text: '11/15 of the wall', misconceptionCode: 'lcm_error' },
      { id: 'opt-d', text: '7/15 of the wall' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'LCM of 3 and 5 is 15. 2/3 = 10/15, and 1/5 = 3/15. Total painted = 10/15 + 3/15 = 13/15.',
    hint: 'Find the LCM of 3 and 5, which is 15.'
  },
  {
    id: 'q3-7',
    topicId: 'topic-3',
    difficulty: 'easy',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Simplify: 7/10 - 3/10',
    options: [
      { id: 'opt-a', text: '2/5' },
      { id: 'opt-b', text: '4/10', misconceptionCode: 'simplification_error' },
      { id: 'opt-c', text: '4/0', misconceptionCode: 'denominator_addition_error' },
      { id: 'opt-d', text: '1/5' }
    ],
    correctAnswer: 'opt-a',
    explanation: '7/10 - 3/10 = 4/10. Divide numerator and denominator by 2 to simplify: 4 ÷ 2 = 2, 10 ÷ 2 = 5, yielding 2/5.',
    hint: '7 - 3 = 4 over 10. Remember to reduce 4/10 to simplest terms.'
  },
  {
    id: 'q3-8',
    topicId: 'topic-3',
    difficulty: 'medium',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Calculate: 3/8 + 1/8 + 2/8',
    options: [
      { id: 'opt-a', text: '3/4' },
      { id: 'opt-b', text: '6/24', misconceptionCode: 'denominator_addition_error' },
      { id: 'opt-c', text: '6/8', misconceptionCode: 'simplification_error' },
      { id: 'opt-d', text: '1/2' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'All three fractions have denominator 8. Add numerators: 3 + 1 + 2 = 6, so 6/8. Simplify by dividing top and bottom by 2: 6/8 = 3/4.',
    hint: 'Add the numerators together over 8, then simplify.'
  },

  // ==========================================
  // TOPIC 4: MULTIPLICATION & DIVISION (8 questions)
  // ==========================================
  {
    id: 'q4-1',
    topicId: 'topic-4',
    difficulty: 'easy',
    prerequisiteTopicId: 'topic-3',
    questionType: 'multiple_choice',
    questionText: 'Multiply: 2/3 × 3/4. Give the answer in simplest form.',
    options: [
      { id: 'opt-a', text: '1/2' },
      { id: 'opt-b', text: '6/12', misconceptionCode: 'simplification_error' },
      { id: 'opt-c', text: '5/7', misconceptionCode: 'denominator_addition_error' },
      { id: 'opt-d', text: '8/9' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Multiply numerators: 2 × 3 = 6. Multiply denominators: 3 × 4 = 12. 6/12 simplified by dividing by 6 gives 1/2.',
    hint: 'Multiply top numbers together and bottom numbers together, then simplify.'
  },
  {
    id: 'q4-2',
    topicId: 'topic-4',
    difficulty: 'easy',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'What is the reciprocal (multiplicative inverse) of 4/7?',
    options: [
      { id: 'opt-a', text: '7/4' },
      { id: 'opt-b', text: '-4/7', misconceptionCode: 'reciprocal_error' },
      { id: 'opt-c', text: '4/7', misconceptionCode: 'reciprocal_error' },
      { id: 'opt-d', text: '1/4' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'The reciprocal of a fraction a/b is b/a (flipping numerator and denominator). The reciprocal of 4/7 is 7/4.',
    hint: 'Flip the numerator and denominator upside down.'
  },
  {
    id: 'q4-3',
    topicId: 'topic-4',
    difficulty: 'medium',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Divide: 3/5 ÷ 2/3',
    options: [
      { id: 'opt-a', text: '9/10' },
      { id: 'opt-b', text: '6/15', misconceptionCode: 'reciprocal_error' },
      { id: 'opt-c', text: '10/9', misconceptionCode: 'reciprocal_error' },
      { id: 'opt-d', text: '1/5' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'To divide by 2/3, multiply by its reciprocal 3/2: 3/5 × 3/2 = (3 × 3) / (5 × 2) = 9/10.',
    hint: 'Change division to multiplication and invert the second fraction: 3/5 × 3/2.'
  },
  {
    id: 'q4-4',
    topicId: 'topic-4',
    difficulty: 'medium',
    prerequisiteTopicId: 'topic-3',
    questionType: 'multiple_choice',
    questionText: 'Calculate: 5 × (2/9)',
    options: [
      { id: 'opt-a', text: '10/9' },
      { id: 'opt-b', text: '10/45', misconceptionCode: 'equivalent_fraction_error' },
      { id: 'opt-c', text: '7/9' },
      { id: 'opt-d', text: '2/45' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Write 5 as 5/1. Then (5/1) × (2/9) = (5 × 2) / (1 × 9) = 10/9 (or 1 1/9). Do not multiply the denominator by 5!',
    hint: 'Whole number 5 only multiplies the top number (numerator).'
  },
  {
    id: 'q4-5',
    topicId: 'topic-4',
    difficulty: 'hard',
    prerequisiteTopicId: 'topic-3',
    questionType: 'multiple_choice',
    questionText: 'A recipe requires 3/4 cup of sugar for one cake. How much sugar is needed for 2 1/2 cakes?',
    options: [
      { id: 'opt-a', text: '1 7/8 cups' },
      { id: 'opt-b', text: '3 1/4 cups' },
      { id: 'opt-c', text: '1 1/2 cups' },
      { id: 'opt-d', text: '2 cups' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Convert 2 1/2 to improper fraction: 5/2. Multiply 3/4 × 5/2 = (3 × 5) / (4 × 2) = 15/8. 15/8 = 1 7/8 cups.',
    hint: 'Convert 2 1/2 to 5/2, then multiply 3/4 × 5/2.'
  },
  {
    id: 'q4-6',
    topicId: 'topic-4',
    difficulty: 'hard',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'A rope of length 7 1/2 metres is cut into small equal pieces of length 3/4 metre each. How many pieces are obtained?',
    options: [
      { id: 'opt-a', text: '10 pieces' },
      { id: 'opt-b', text: '8 pieces' },
      { id: 'opt-c', text: '9 pieces' },
      { id: 'opt-d', text: '12 pieces' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Total length = 7 1/2 = 15/2. Piece length = 3/4. Division: (15/2) ÷ (3/4) = (15/2) × (4/3) = (15 × 4) / (2 × 3) = 60 / 6 = 10 pieces.',
    hint: 'Convert 7 1/2 to 15/2 and divide by 3/4 (multiply by 4/3).'
  },
  {
    id: 'q4-7',
    topicId: 'topic-4',
    difficulty: 'easy',
    prerequisiteTopicId: 'topic-1',
    questionType: 'multiple_choice',
    questionText: 'Which product equals 1?',
    options: [
      { id: 'opt-a', text: '5/8 × 8/5' },
      { id: 'opt-b', text: '5/8 × 5/8' },
      { id: 'opt-c', text: '5/8 + 3/8' },
      { id: 'opt-d', text: '5/8 ÷ 5/8' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Multiplying any non-zero fraction by its reciprocal yields 1: 5/8 × 8/5 = 40/40 = 1.',
    hint: 'A number multiplied by its reciprocal always equals 1.'
  },
  {
    id: 'q4-8',
    topicId: 'topic-4',
    difficulty: 'medium',
    prerequisiteTopicId: 'topic-3',
    questionType: 'multiple_choice',
    questionText: 'Calculate: (1/2) ÷ 4',
    options: [
      { id: 'opt-a', text: '1/8' },
      { id: 'opt-b', text: '2', misconceptionCode: 'reciprocal_error' },
      { id: 'opt-c', text: '8', misconceptionCode: 'numerator_denominator_confusion' },
      { id: 'opt-d', text: '1/4' }
    ],
    correctAnswer: 'opt-a',
    explanation: 'Dividing by 4 is multiplying by 1/4: (1/2) × (1/4) = 1/8. If you have half a pizza and divide it among 4 people, each gets 1/8.',
    hint: 'Dividing by 4 is the same as multiplying by 1/4.'
  }
];
