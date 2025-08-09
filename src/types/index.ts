export type FieldType = 'text' | 'number' | 'textarea' | 'select' | 'radio' | 'checkbox' | 'date';

export interface ValidationRule {
  type: 'required' | 'minLength' | 'maxLength' | 'email' | 'password' | 'notEmpty';
  value?: number | string;
  message: string;
}

export interface SelectOption {
  label: string;
  value: string;
}

export interface DerivedFieldLogic {
  parentFields: string[];
  formula: string;
  description?: string;
}

export interface FormField {
  id: string;
  type: FieldType;
  label: string;
  placeholder?: string;
  required: boolean;
  defaultValue?: any;
  validationRules: ValidationRule[];
  options?: SelectOption[];
  isDerived?: boolean;
  derivedLogic?: DerivedFieldLogic;
  order: number;
}

export interface FormSchema {
  id: string;
  name: string;
  description?: string;
  fields: FormField[];
  createdAt: string;
  updatedAt: string;
}

export interface FormBuilderState {
  currentForm: FormSchema | null;
  savedForms: FormSchema[];
  isPreviewMode: boolean;
  selectedFieldId: string | null;
  formValues: Record<string, any>;
  formErrors: Record<string, string>;
}

export interface ThemeState {
  isDarkMode: boolean;
}

export interface RootState {
  formBuilder: FormBuilderState;
  theme: ThemeState;
}