import { CandidateProfile } from '../types/interview';

export class ResumeParser {
  static parseResume(resumeText: string): Partial<CandidateProfile> {
    const lines = resumeText.split('\n').map(line => line.trim()).filter(Boolean);
    
    // Extract name (usually first line or first substantial text)
    const name = this.extractName(lines);
    
    // Extract email
    const email = this.extractEmail(resumeText);
    
    // Extract skills
    const skills = this.extractSkills(resumeText);
    
    // Extract experience
    const experience = this.extractExperience(resumeText);
    
    // Extract education
    const education = this.extractEducation(resumeText);
    
    // Extract previous roles
    const previousRoles = this.extractPreviousRoles(resumeText);

    return {
      name,
      email,
      skills,
      experience,
      education,
      previousRoles,
      resumeText
    };
  }

  private static extractName(lines: string[]): string {
    // Look for the first line that looks like a name
    for (const line of lines.slice(0, 5)) {
      if (line.length > 2 && line.length < 50 && 
          /^[A-Za-z\s\.]+$/.test(line) && 
          !line.toLowerCase().includes('resume')) {
        return line;
      }
    }
    return 'Unknown Candidate';
  }

  private static extractEmail(text: string): string {
    const emailRegex = /[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/g;
    const matches = text.match(emailRegex);
    return matches ? matches[0] : '';
  }

  private static extractSkills(text: string): string[] {
    const commonSkills = [
      'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'React', 'Angular', 
      'Vue', 'Node.js', 'Express', 'Django', 'Flask', 'SQL', 'MongoDB', 
      'PostgreSQL', 'MySQL', 'Redis', 'Docker', 'Kubernetes', 'AWS', 'GCP',
      'Azure', 'Git', 'CI/CD', 'REST', 'GraphQL', 'Microservices', 'Agile',
      'Machine Learning', 'AI', 'Data Science', 'TensorFlow', 'PyTorch'
    ];

    // Helper function to escape special regex characters
    const escapeRegExp = (string: string): string => {
      return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    };

    const foundSkills = commonSkills.filter(skill => 
      new RegExp(escapeRegExp(skill), 'i').test(text)
    );

    // Also look for skills in common sections
    const skillSectionRegex = /(?:skills?|technologies?|technical|expertise)[\s\S]*?(?:\n\n|\n[A-Z]|$)/gi;
    const skillSections = text.match(skillSectionRegex);
    
    if (skillSections) {
      skillSections.forEach(section => {
        commonSkills.forEach(skill => {
          if (new RegExp(escapeRegExp(skill), 'i').test(section) && !foundSkills.includes(skill)) {
            foundSkills.push(skill);
          }
        });
      });
    }

    return foundSkills;
  }

  private static extractExperience(text: string): number {
    // Look for patterns like "3+ years", "5 years experience", etc.
    const experienceRegex = /(\d+)[\+\s]*(?:years?|yrs?)[\s]*(?:of\s*)?(?:experience|exp)/gi;
    const matches = text.match(experienceRegex);
    
    if (matches) {
      const years = matches.map(match => {
        const numberMatch = match.match(/(\d+)/);
        return numberMatch ? parseInt(numberMatch[1]) : 0;
      });
      return Math.max(...years);
    }

    // Fallback: count job positions and estimate
    const jobPatterns = /(?:software engineer|developer|programmer|analyst|manager)/gi;
    const jobMatches = text.match(jobPatterns);
    return jobMatches ? Math.min(jobMatches.length * 2, 15) : 1;
  }

  private static extractEducation(text: string): string {
    const degrees = ['PhD', 'Ph.D', 'Doctor', 'Masters', 'Master', 'Bachelor', 'BS', 'BA', 'MS', 'MA'];
    
    for (const degree of degrees) {
      const regex = new RegExp(`${degree}[^\\n]*`, 'i');
      const match = text.match(regex);
      if (match) {
        return match[0].trim();
      }
    }

    // Look for university names
    const universityRegex = /(?:university|college|institute)[\w\s]*(?:of\s*)?[\w\s]*/gi;
    const matches = text.match(universityRegex);
    if (matches && matches.length > 0) {
      return matches[0].trim();
    }

    return 'Education details not found';
  }

  private static extractPreviousRoles(text: string): string[] {
    const commonTitles = [
      'Software Engineer', 'Senior Software Engineer', 'Lead Developer',
      'Full Stack Developer', 'Frontend Developer', 'Backend Developer',
      'DevOps Engineer', 'Data Scientist', 'Product Manager', 'Engineering Manager',
      'Principal Engineer', 'Architect', 'Consultant', 'Analyst'
    ];

    const foundRoles = commonTitles.filter(title =>
      new RegExp(title, 'i').test(text)
    );

    return foundRoles.length > 0 ? foundRoles : ['Previous experience not specified'];
  }
}