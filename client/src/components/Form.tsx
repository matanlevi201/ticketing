import { useForm } from "@mantine/form";
import { Group, Button, Box, TextInput } from "@mantine/core";
import { Input } from "../types";

interface FormProps<T> {
  inputs: Input[];
  submit: (formState: T) => void;
}

const Form = <T,>({ inputs, submit }: FormProps<T>) => {
  const initialValues = inputs.reduce((values: any, field: Input) => {
    values[field.name] = field.defaultValue ?? "";
    return values;
  }, {});

  const validate = inputs.reduce((validations: any, field: Input) => {
    if (field.validate) {
      validations[field.name] = field.validate;
    }
    return validations;
  }, {});

  const form = useForm({
    initialValues,
    validate,
  });

  return (
    <Box maw={340} mx="auto">
      <form onSubmit={form.onSubmit((values) => submit(values))}>
        {inputs.map((input) => {
          const Component = input.component || TextInput;

          return (
            <Component
              key={form.key(input.name)}
              withAsterisk={input.required ? true : undefined}
              label={input.label}
              placeholder={input.placeholder}
              {...form.getInputProps(input.name)}
            />
          );
        })}

        <Group justify="center" mt="lg">
          <Button type="submit" fullWidth>
            Submit
          </Button>
        </Group>
      </form>
    </Box>
  );
};

export default Form;
