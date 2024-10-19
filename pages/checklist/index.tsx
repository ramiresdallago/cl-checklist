import { google } from 'googleapis';
import { TodoResponse } from './types';

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

  const parsedLinesToTodo = sheet.map((line) => {
    const [checkboxColumn, descriptionColumn] = line;
    return { isChecked: checkboxColumn, description: descriptionColumn };
  });

  return {
    props: {
      todos: parsedLinesToTodo,
    },
  };
}

export default function Post({ todos }: { todos: TodoResponse[] }) {
  return (
    <div className="m-5">
      <fieldset>
        <div className="space-y-2">
          {todos.map((todo) => (
            <div key={todo.description}>
              <p>{todo.isChecked}</p>
              <p>{todo.description}</p>
              <hr />
            </div>
          ))}
        </div>
      </fieldset>
    </div>
  );
}
