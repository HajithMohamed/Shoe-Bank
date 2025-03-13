import React from "react";
import { Label } from "../ui/label";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";

function CommonForm({ formControls, buttonText, formData, setFormData, onSubmit, isLoading }) {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validation: Check required fields
    const emptyFields = formControls
      .filter((control) => control.required && !formData[control.name])
      .map((control) => control.label);

    if (emptyFields.length > 0) {
      alert(`Please fill in: ${emptyFields.join(", ")}`);
      return;
    }

    onSubmit(e);
  };

  function renderInputsByComponentType(getControlItem) {
    let element = null;
    const value = formData[getControlItem.name] || "";

    switch (getControlItem.componentType) {
      case "input":
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id || getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={handleChange}
          />
        );
        break;

      case "textarea":
        element = (
          <Textarea
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.id || getControlItem.name}
            value={value}
            onChange={handleChange}
          />
        );
        break;

      case "select":
        element = (
          <Select
            name={getControlItem.name}
            onValueChange={(value) => handleChange({ target: { name: getControlItem.name, value } })}
            value={value}
          >
            <SelectTrigger>
              <SelectValue placeholder={getControlItem.placeholder} />
            </SelectTrigger>
            <SelectContent>
              {getControlItem.options?.map((optionItem) => (
                <SelectItem key={optionItem.id} value={optionItem.id}>
                  {optionItem.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );
        break;

      default:
        element = (
          <Input
            name={getControlItem.name}
            placeholder={getControlItem.placeholder}
            id={getControlItem.name}
            type={getControlItem.type}
            value={value}
            onChange={handleChange}
          />
        );
        break;
    }
    return element;
  }

  return (
    <form onSubmit={handleSubmit}>
      <div className="flex flex-col gap-3">
        {formControls.map((controlItem) => (
          <div className="grid w-full gap-1.5" key={controlItem.name}>
            <Label className="mb-1">{controlItem.label}</Label>
            {renderInputsByComponentType(controlItem)}
          </div>
        ))}
        <Button className="mt-2 w-full" type="submit" disabled={isLoading}>
          {isLoading ? "Submitting..." : buttonText || "Submit"}
        </Button>
      </div>
    </form>
  );
}

export default CommonForm;
