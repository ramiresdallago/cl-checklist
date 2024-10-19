import { google } from 'googleapis';
import { TodoResponse } from './types';
import Checkbox from '@/components/checkbox';

export async function getServerSideProps() {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const SHEET_PAGE = 'Página1';
  const SHEET_RANGE = 'A1:B7';

  const {
    data: { values },
  } = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${SHEET_RANGE}`,
  });

  const sheet = values as string[][];

  const parsedLinesToTodo = sheet.map((line, index) => {
    const [checkboxColumn, descriptionColumn] = line;
    return {
      isChecked: checkboxColumn === 'TRUE',
      description: descriptionColumn,
      checkboxCell: `A${index + 1}`,
    };
  });

  return {
    props: {
      todos: parsedLinesToTodo,
    },
  };
}

export default function Post({ todos }: { todos: TodoResponse[] }) {
  const handleCheckboxChange = (index: number, isChecked: boolean) => {
    const updatedTodos = todos.map((todo, idx) =>
      idx === index ? { ...todo, isChecked } : todo,
    );
    console.log('updatedTodos', updatedTodos);
  };

  return (
    <fieldset className="m-5">
      <div className="space-y-2">
        {todos.map((todo, index) => (
          <Checkbox
            key={todo.checkboxCell}
            id={todo.checkboxCell}
            label={todo.description}
            isChecked={todo.isChecked}
            onChange={(isChecked) => handleCheckboxChange(index, isChecked)}
          />
        ))}
      </div>
    </fieldset>
  );
}
