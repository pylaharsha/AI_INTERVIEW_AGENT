import { Question, CandidateProfile, JobDescription } from '../types/interview';

export class QuestionGenerator {
  private static behavioralQuestions = {
    easy: [
      "Tell me about yourself and your background in software development.",
      "Why are you interested in this position?",
      "Describe your ideal work environment.",
      "What motivates you in your work?"
    ],
    medium: [
      "Tell me about a challenging project you worked on. What made it challenging?",
      "Describe a time when you had to learn a new technology quickly.",
      "How do you handle conflicting priorities and tight deadlines?",
      "Tell me about a time when you disagreed with a team member's approach."
    ],
    hard: [
      "Describe a time when you had to make a difficult technical decision with limited information.",
      "Tell me about a project where you had to balance technical debt with feature development.",
      "How would you handle a situation where your team is consistently missing deadlines?",
      "Describe a time when you had to advocate for a technical solution that others disagreed with."
    ]
  };

  private static technicalQuestions = {
    easy: [
      "What is the difference between == and === in JavaScript?",
      "Explain what REST API is and its main principles.",
      "What is the purpose of version control systems like Git?",
      "Describe the difference between SQL and NoSQL databases."
    ],
    medium: [
      "Explain the concept of promises in JavaScript and how they work.",
      "What are microservices and what are their advantages and disadvantages?",
      "How would you optimize a slow database query?",
      "Explain the concept of dependency injection and its benefits."
    ],
    hard: [
      "Design a distributed caching system for a high-traffic web application.",
      "Explain how you would implement eventual consistency in a distributed system.",
      "How would you design a rate limiting system for an API?",
      "Describe how you would architect a real-time chat application for millions of users."
    ]
  };

  private static codingQuestions = {
    easy: [
      "Write a function to reverse a string without using built-in reverse methods.",
      "Implement a function to check if a number is prime.",
      "Write a function to find the maximum element in an array.",
      "Implement a function to count the frequency of characters in a string."
    ],
    medium: [
      "Implement a binary search algorithm.",
      "Write a function to detect if a linked list has a cycle.",
      "Implement a function to find the longest common subsequence of two strings.",
      "Design a data structure that supports insert, delete, and getRandom in O(1) time."
    ],
    hard: [
      "Implement a thread-safe LRU cache with O(1) operations.",
      "Design and implement a distributed consistent hashing algorithm.",
      "Implement a concurrent merge sort algorithm.",
      "Design a data structure for autocomplete functionality."
    ]
  };

  static generateQuestionSet(
    candidateProfile: CandidateProfile,
    jobDescription: JobDescription,
    totalQuestions: number = 8
  ): Question[] {
    const questions: Question[] = [];
    
    // Determine difficulty based on experience
    const primaryDifficulty = this.getDifficultyFromExperience(candidateProfile.experience);
    
    // Question distribution: 40% behavioral, 40% technical, 20% coding
    const behavioralCount = Math.ceil(totalQuestions * 0.4);
    const technicalCount = Math.ceil(totalQuestions * 0.4);
    const codingCount = totalQuestions - behavioralCount - technicalCount;

    // Generate behavioral questions
    questions.push(...this.generateBehavioralQuestions(behavioralCount, primaryDifficulty));
    
    // Generate technical questions based on job requirements
    questions.push(...this.generateTechnicalQuestions(
      technicalCount, 
      primaryDifficulty, 
      jobDescription.requirements
    ));
    
    // Generate coding questions
    questions.push(...this.generateCodingQuestions(codingCount, primaryDifficulty));

    return this.shuffleQuestions(questions);
  }

  private static getDifficultyFromExperience(experience: number): 'easy' | 'medium' | 'hard' {
    if (experience <= 2) return 'easy';
    if (experience <= 5) return 'medium';
    return 'hard';
  }

  private static generateBehavioralQuestions(
    count: number, 
    difficulty: 'easy' | 'medium' | 'hard'
  ): Question[] {
    const questions = this.behavioralQuestions[difficulty];
    const selected = this.selectRandomQuestions(questions, count);
    
    return selected.map((content, index) => ({
      id: `behavioral-${index}`,
      type: 'behavioral' as const,
      difficulty,
      content,
      expectedDuration: 3,
      tags: ['behavioral', 'soft-skills']
    }));
  }

  private static generateTechnicalQuestions(
    count: number,
    difficulty: 'easy' | 'medium' | 'hard',
    requirements: any[]
  ): Question[] {
    const questions = this.technicalQuestions[difficulty];
    const selected = this.selectRandomQuestions(questions, count);
    
    return selected.map((content, index) => ({
      id: `technical-${index}`,
      type: 'technical' as const,
      difficulty,
      content,
      expectedDuration: 5,
      tags: ['technical', 'architecture']
    }));
  }

  private static generateCodingQuestions(
    count: number,
    difficulty: 'easy' | 'medium' | 'hard'
  ): Question[] {
    const questions = this.codingQuestions[difficulty];
    const selected = this.selectRandomQuestions(questions, count);
    
    return selected.map((content, index) => ({
      id: `coding-${index}`,
      type: 'coding' as const,
      difficulty,
      content,
      expectedDuration: 15,
      tags: ['coding', 'algorithms']
    }));
  }

  private static selectRandomQuestions(questions: string[], count: number): string[] {
    const shuffled = [...questions].sort(() => 0.5 - Math.random());
    return shuffled.slice(0, Math.min(count, questions.length));
  }

  private static shuffleQuestions(questions: Question[]): Question[] {
    return [...questions].sort(() => 0.5 - Math.random());
  }

  static generateFollowUp(question: Question, answer: string): string | null {
    const followUps = {
      behavioral: [
        "Can you elaborate on the specific actions you took?",
        "What was the outcome and what did you learn from this experience?",
        "How would you handle this situation differently now?"
      ],
      technical: [
        "Can you dive deeper into the implementation details?",
        "What are the potential drawbacks of this approach?",
        "How would you scale this solution for larger systems?"
      ],
      coding: [
        "Can you optimize this solution further?",
        "What's the time and space complexity of your solution?",
        "How would you test this implementation?"
      ]
    };

    const typeFollowUps = followUps[question.type];
    if (!typeFollowUps) return null;

    return typeFollowUps[Math.floor(Math.random() * typeFollowUps.length)];
  }
}