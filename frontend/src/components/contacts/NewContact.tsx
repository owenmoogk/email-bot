import { postData } from '@api/postData';
import type { NewContact } from '@api/types/contacts';
import type { SubmitHandler } from 'react-hook-form';
import { useFieldArray, useForm } from 'react-hook-form';

export function NewContact() {
  const { register, handleSubmit, control } = useForm<NewContact>();
  const { fields, append } = useFieldArray({
    control,
    name: 'variables',
  });

  async function saveContact(data: NewContact) {
    // const validateEmail = (email: string) => {
    //   return email.match(
    //     /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/
    //   );
    // };

    for (const variable of data.variables) {
      variable['name'] = variable['name'].toUpperCase();
    }

    await postData('/userdata/addcontact/', data);
    window.location.href = '/contacts/'; // TODO: ONly if response.ok
  }

  const onSubmit: SubmitHandler<NewContact> = async (data) => saveContact(data);

  return (
    // eslint-disable-next-line @typescript-eslint/no-misused-promises
    <form onSubmit={handleSubmit(onSubmit)}>
      <input {...register('name')} />
      <br />
      <input {...register('email')} placeholder="Email" type="email" />
      <br />
      <div id="variables">
        {fields.map((field, index) => (
          <span id="variableContainer" key={index}>
            <input {...register(`variables.${index}.name`)} />
            <input {...register(`variables.${index}.value`)} />
            <br />
          </span>
        ))}
      </div>
      <div>
        <br />
        Variables
        <br />
        Name: <input type="text" id="varNameInput" placeholder="Name" />
        Value: <input type="text" id="varValueInput" placeholder="Value" />
        <button
          onClick={() =>
            append({
              name: (
                document.getElementById('varNameInput') as HTMLInputElement
              ).value,
              value: (
                document.getElementById('varValueInput') as HTMLInputElement
              ).value,
            })
          }
        >
          Add variable
        </button>
      </div>
      <button type="submit">Save Contact</button>
    </form>
  );
}
