import { ValidationRule } from '../types';

export const validateField = (value: any, rules: ValidationRule[]): string => {
  for (const rule of rules) {
    switch (rule.type) {
      case 'required':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message;
        }
        break;
      case 'notEmpty':
        if (!value || (typeof value === 'string' && value.trim() === '')) {
          return rule.message;
        }
        break;
      case 'minLength':
        if (typeof value === 'string' && value.length < (rule.value as number)) {
          return rule.message;
        }
        break;
      case 'maxLength':
        if (typeof value === 'string' && value.length > (rule.value as number)) {
          return rule.message;
        }
        break;
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (typeof value === 'string' && !emailRegex.test(value)) {
          return rule.message;
        }
        break;
      case 'password':
        const passwordRegex = /^(?=.*\d).{8,}$/;
        if (typeof value === 'string' && !passwordRegex.test(value)) {
          return rule.message;
        }
        break;
    }
  }
  return '';
};

export const calculateDerivedValue = (formula: string, values: Record<string, any>): any => {
  try {
    let evaluatedFormula = formula;
    
    Object.keys(values).forEach(fieldId => {
      const regex = new RegExp(`{${fieldId}}`, 'g');
      evaluatedFormula = evaluatedFormula.replace(regex, values[fieldId] || '0');
    });
    
    if (formula.includes('age_from_date')) {
      const dateMatch = formula.match(/age_from_date\({([^}]+)}\)/);
      if (dateMatch) {
        const fieldId = dateMatch[1];
        const birthDate = values[fieldId];
        if (birthDate) {
          const today = new Date();
          const birth = new Date(birthDate);
          const age = today.getFullYear() - birth.getFullYear();
          const monthDiff = today.getMonth() - birth.getMonth();
          if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birth.getDate())) {
            return age - 1;
          }
          return age;
        }
      }
    }
    
    return new Function('return ' + evaluatedFormula)();
  } catch {
    return '';
  }
};