interface CheckboxProps {
  isChecked: boolean;
  label: string;
  onChange: (isChecked: boolean) => void;
  id: string;
  isLoading?: boolean;
}

const Checkbox: React.FC<CheckboxProps> = ({
  isChecked,
  label,
  onChange,
  id,
  isLoading = false,
}) => {
  return (
    <label htmlFor={id} className="flex cursor-pointer items-start gap-4">
      <div className="flex items-center">
        {isLoading ? (
          <p>Carregando</p>
        ) : (
          <input
            type="checkbox"
            id={id}
            className="h-4 w-4 rounded border-gray-300"
            checked={isChecked}
            onChange={(e) => onChange(e.target.checked)}
          />
        )}
      </div>
      <div>
        <strong className="font-medium text-gray-900">{label}</strong>
      </div>
    </label>
  );
};

export default Checkbox;
