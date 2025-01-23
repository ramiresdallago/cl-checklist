import Checkbox from '@/components/checkbox';
import { google } from 'googleapis';
import { useRouter } from 'next/router';
import { useEffect, useState } from 'react';

const SHEET_PAGE = 'APOIO';

const PRE_SERVICE_RANGE_CELL = 'B2';
const RECEPTION_RANGE_CELL = 'E2';
const DURING_THE_SERVICE_RANGE_CELL = 'H2';
const POST_SERVICE_RANGE_CELL = 'K2';

const PRE_SERVICE_CHECKBOX_COLUMN = 'A';
const RECEPTION_CHECKBOX_COLUMN = 'D';
const DURING_THE_SERVICE_CHECKBOX_COLUMN = 'G';
const POST_SERVICE_CHECKBOX_COLUMN = 'J';

export async function getServerSideProps() {
  const auth = await google.auth.getClient({
    scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
  });
  const sheets = google.sheets({ version: 'v4', auth });

  const preServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${PRE_SERVICE_RANGE_CELL}`,
  });
  const receptionSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${RECEPTION_RANGE_CELL}`,
  });
  const duringTheServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${DURING_THE_SERVICE_RANGE_CELL}`,
  });
  const postServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${POST_SERVICE_RANGE_CELL}`,
  });

  const [preServiceRangeCellValue] = preServiceSheetData.data
    .values as string[][];
  const [receptionRangeCellValue] = receptionSheetData.data
    .values as string[][];
  const [duringTheServiceRangeCellValue] = duringTheServiceSheetData.data
    .values as string[][];
  const [postServiceRangeCellValue] = postServiceSheetData.data
    .values as string[][];

  const allPreServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${preServiceRangeCellValue}`,
  });
  const allReceptionSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${receptionRangeCellValue}`,
  });
  const allDuringTheServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${duringTheServiceRangeCellValue}`,
  });
  const allPostServiceSheetData = await sheets.spreadsheets.values.get({
    spreadsheetId: process.env.SHEET_ID,
    range: `${SHEET_PAGE}!${postServiceRangeCellValue}`,
  });

  const allPreServiceValues = allPreServiceSheetData.data.values as string[][];
  const allReceptionValues = allReceptionSheetData.data.values as string[][];
  const allDuringTheServiceValues = allDuringTheServiceSheetData.data
    .values as string[][];
  const allPostServiceValues = allPostServiceSheetData.data
    .values as string[][];

  const parsedPreServiceLinesToTodo = allPreServiceValues.map((line, index) => {
    const [checkboxColumn, descriptionColumn] = line;
    const CHECKLIST_START_ROW_OFFSET = 3; // Offset between first row and checklist first element
    return {
      isChecked: checkboxColumn === 'TRUE',
      description: descriptionColumn,
      checkboxCell: `${PRE_SERVICE_CHECKBOX_COLUMN}${
        index + CHECKLIST_START_ROW_OFFSET
      }`,
    };
  });

  const parsedReceptionLinesToTodo = allReceptionValues.map((line, index) => {
    const [checkboxColumn, descriptionColumn] = line;
    const CHECKLIST_START_ROW_OFFSET = 3; // Offset between first row and checklist first element
    return {
      isChecked: checkboxColumn === 'TRUE',
      description: descriptionColumn,
      checkboxCell: `${RECEPTION_CHECKBOX_COLUMN}${
        index + CHECKLIST_START_ROW_OFFSET
      }`,
    };
  });

  const parsedDuringTheServiceLinesToTodo = allDuringTheServiceValues.map(
    (line, index) => {
      const [checkboxColumn, descriptionColumn] = line;
      const CHECKLIST_START_ROW_OFFSET = 3; // Offset between first row and checklist first element
      return {
        isChecked: checkboxColumn === 'TRUE',
        description: descriptionColumn,
        checkboxCell: `${DURING_THE_SERVICE_CHECKBOX_COLUMN}${
          index + CHECKLIST_START_ROW_OFFSET
        }`,
      };
    },
  );

  const parsedPostServiceLinesToTodo = allPostServiceValues.map(
    (line, index) => {
      const [checkboxColumn, descriptionColumn] = line;
      const CHECKLIST_START_ROW_OFFSET = 3; // Offset between first row and checklist first element
      return {
        isChecked: checkboxColumn === 'TRUE',
        description: descriptionColumn,
        checkboxCell: `${POST_SERVICE_CHECKBOX_COLUMN}${
          index + CHECKLIST_START_ROW_OFFSET
        }`,
      };
    },
  );

  return {
    props: {
      parsedPreServiceLinesToTodo,
      parsedReceptionLinesToTodo,
      parsedDuringTheServiceLinesToTodo,
      parsedPostServiceLinesToTodo,
    },
  };
}
export interface TodoResponse {
  isChecked: boolean;
  description: string;
  checkboxCell: string;
}

export default function Post({
  parsedPreServiceLinesToTodo,
  parsedReceptionLinesToTodo,
  parsedDuringTheServiceLinesToTodo,
  parsedPostServiceLinesToTodo,
}: {
  parsedPreServiceLinesToTodo: TodoResponse[];
  parsedReceptionLinesToTodo: TodoResponse[];
  parsedDuringTheServiceLinesToTodo: TodoResponse[];
  parsedPostServiceLinesToTodo: TodoResponse[];
}) {
  const router = useRouter();
  const [loadingCell, setLoadingCell] = useState<string | null>(null);

  useEffect(() => {
    const eventSource = new EventSource("/api/google-sheets-webhook");

    eventSource.onmessage = (event) => {
      const data = JSON.parse(event.data);
      console.log(data);
    };

    eventSource.onerror = () => {
      console.error("EventSource failed");
      eventSource.close();
    };

    return () => {
      eventSource.close();
    };
  }, []);


  const handleUpdateCheckbox = (checkboxCell: string, isChecked: boolean) => {
    setLoadingCell(checkboxCell);

    fetch('/api/sheet', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        range: `${SHEET_PAGE}!${checkboxCell}`,
        value: isChecked ? 'TRUE' : 'FALSE',
      }),
    })
      .then((response) => {
        if (response.ok) {
          return router.replace(router.asPath);
        }
        throw new Error('Failed to update checkbox');
      })
      .catch((error) => {
        console.error('Failed to update checkbox:', error);
      })
      .finally(() => {
        setLoadingCell(null);
      });
  };

  return (
    <fieldset className="m-5">
      <div className="space-y-2">
        <p>Pré recepição</p>
        <div>
          {parsedPreServiceLinesToTodo.map((todo) => (
            <Checkbox
              key={todo.checkboxCell}
              id={todo.checkboxCell}
              label={todo.description}
              isChecked={todo.isChecked}
              isLoading={loadingCell === todo.checkboxCell}
              onChange={(isChecked) =>
                handleUpdateCheckbox(todo.checkboxCell, isChecked)
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p>Recepição</p>
        <div>
          {parsedReceptionLinesToTodo.map((todo) => (
            <Checkbox
              key={todo.checkboxCell}
              id={todo.checkboxCell}
              label={todo.description}
              isChecked={todo.isChecked}
              isLoading={loadingCell === todo.checkboxCell}
              onChange={(isChecked) =>
                handleUpdateCheckbox(todo.checkboxCell, isChecked)
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p>Durante o culto</p>
        <div>
          {parsedDuringTheServiceLinesToTodo.map((todo) => (
            <Checkbox
              key={todo.checkboxCell}
              id={todo.checkboxCell}
              label={todo.description}
              isChecked={todo.isChecked}
              isLoading={loadingCell === todo.checkboxCell}
              onChange={(isChecked) =>
                handleUpdateCheckbox(todo.checkboxCell, isChecked)
              }
            />
          ))}
        </div>
      </div>

      <div className="space-y-2">
        <p>Pós culto</p>
        <div>
          {parsedPostServiceLinesToTodo.map((todo) => (
            <Checkbox
              key={todo.checkboxCell}
              id={todo.checkboxCell}
              label={todo.description}
              isChecked={todo.isChecked}
              isLoading={loadingCell === todo.checkboxCell}
              onChange={(isChecked) =>
                handleUpdateCheckbox(todo.checkboxCell, isChecked)
              }
            />
          ))}
        </div>
      </div>
    </fieldset>
  );
}
