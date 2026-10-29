import type { ReactNode } from 'react';
import { controlClass, FormGroup } from '@/components/shared/FormGroup';

/**
 * Form fields of the admin panel. They are uncontrolled (defaultValue) and read back with FormData
 * on submit, which keeps the long resource forms short.
 */

interface BaseProps {
  name: string;
  label: string;
  required?: boolean;
  hint?: ReactNode;
  error?: string;
}

const Label = ({ label, required }: { label: string; required?: boolean }) => (
  <>
    {label}
    {required && <span className="text-primary" aria-hidden="true"> *</span>}
  </>
);

interface TextFieldProps extends BaseProps {
  type?: 'text' | 'number' | 'date';
  defaultValue?: string | number | null;
  placeholder?: string;
  min?: number;
  max?: number;
  step?: number;
}

export function TextField({ name, label, required, hint, error, type = 'text', defaultValue, placeholder, min, max, step }: TextFieldProps) {
  return (
    <FormGroup htmlFor={`f-${name}`} label={<Label label={label} required={required} />} hint={hint} error={error}>
      <input
        className={controlClass(error)}
        id={`f-${name}`}
        name={name}
        type={type}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        min={min}
        max={max}
        step={step}
      />
    </FormGroup>
  );
}

interface TextAreaFieldProps extends BaseProps {
  defaultValue?: string | null;
  rows?: number;
  placeholder?: string;
}

export function TextAreaField({ name, label, required, hint, error, defaultValue, rows = 3, placeholder }: TextAreaFieldProps) {
  return (
    <FormGroup htmlFor={`f-${name}`} label={<Label label={label} required={required} />} hint={hint} error={error}>
      <textarea className={controlClass(error)} id={`f-${name}`} name={name} rows={rows} placeholder={placeholder} defaultValue={defaultValue ?? ''} />
    </FormGroup>
  );
}

interface SelectFieldProps extends BaseProps {
  defaultValue?: string | number | null;
  options: Array<{ value: string | number; label: string }>;
  placeholder?: string;
}

export function SelectField({ name, label, required, hint, error, defaultValue, options, placeholder }: SelectFieldProps) {
  return (
    <FormGroup htmlFor={`f-${name}`} label={<Label label={label} required={required} />} hint={hint} error={error}>
      <select className={controlClass(error)} id={`f-${name}`} name={name} defaultValue={defaultValue ?? ''}>
        {placeholder && <option value="">{placeholder}</option>}
        {options.map((option) => <option key={option.value} value={option.value}>{option.label}</option>)}
      </select>
    </FormGroup>
  );
}

export function CheckboxField({ name, label, defaultChecked = false }: { name: string; label: string; defaultChecked?: boolean }) {
  return (
    <div className="form__group">
      <label className="check"><input type="checkbox" name={name} value="true" defaultChecked={defaultChecked} /><span>{label}</span></label>
    </div>
  );
}

interface CheckGroupProps extends Pick<BaseProps, 'name' | 'label' | 'required' | 'error'> {
  options: string[];
  selected?: string[];
}

export function CheckGroup({ name, label, required, error, options, selected = [] }: CheckGroupProps) {
  return (
    <fieldset className="form__group form__fieldset">
      <legend className="form__label"><Label label={label} required={required} /></legend>
      <div className="check-group">
        {options.map((option) => (
          <label className="check" key={option}>
            <input type="checkbox" name={name} value={option} defaultChecked={selected.includes(option)} />
            <span>{option}</span>
          </label>
        ))}
      </div>
      {error && <p className="form__error" role="alert">{error}</p>}
    </fieldset>
  );
}
