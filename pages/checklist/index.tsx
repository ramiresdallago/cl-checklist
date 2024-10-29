import { google } from 'googleapis';
import { TodoResponse } from './types';
import Checkbox from '@/components/checkbox';
import { useRouter } from 'next/router';

const SHEET_PAGE = 'Página1';
const SHEET_RANGE = 'A1:B7';

export async function getServerSideProps() {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

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
  const router = useRouter();

  const handleCheckboxChange = async (
    checkboxCell: string,
    isChecked: boolean,
  ) => {
    try {
      const response = await fetch('/api/sheet', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          range: `${SHEET_PAGE}!${checkboxCell}`,
          value: isChecked ? 'TRUE' : 'FALSE',
        }),
      });
      if (response.ok) {
        router.replace(router.asPath);
      }
    } catch (error) {
      console.error('Failed to update checkbox:', error);
    }
  };

  return (
    <fieldset className="m-5">
      <div className="space-y-2">
        {todos.map((todo) => (
          <Checkbox
            key={todo.checkboxCell}
            id={todo.checkboxCell}
            label={todo.description}
            isChecked={todo.isChecked}
            onChange={(isChecked) =>
              handleCheckboxChange(todo.checkboxCell, isChecked)
            }
          />
        ))}
      </div>
    </fieldset>
  );
}
