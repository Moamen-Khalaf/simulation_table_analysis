import { getPosition } from "../../../utils/parseExcel";
import {
  ColumnHeader,
  type cellType,
  type IColumnHeader,
  type UserRow,
} from "../types";

type ServiceKeys = "ISSUE_CODE" | "ISSUE" | "SERVICE_TIME";
type service = Record<ServiceKeys, cellType>;

/**
 * Processes a 3D table array to extract user and service data, and combines them into a unified user data array.
 *
 * @param {string[][][]} table - A 3D array representing the table data. The first dimension separates different tables,
 *                               the second dimension represents rows, and the third dimension represents columns.
 *
 * @returns {UserRow[]} - An array of processed user data, each containing user information and corresponding service details.
 *
 * The function performs the following steps:
 * 1. Extracts the header and rows from the second table (index 1) to process user data.
 * 2. Iterates over each row to create user objects and assigns positions.
 * 3. Extracts the header and rows from the first table (index 0) to process service data.
 * 4. Iterates over each row to create service objects and stores them in a dictionary.
 * 5. Combines user data with corresponding service data based on the ISSUE_CODE.
 * 6. Ensures all headers are present in the final user data and assigns positions.
 * 7. Logs the processed user data to the console.
 */
function processRows(header: string[], rows: string[][]): UserRow[] {
  return rows.map((row) => {
    const item = {} as UserRow;
    header.forEach((key, index) => {
      item[key as IColumnHeader] = {
        v: row[index],
        f: "",
        pos: "",
      } as cellType;
    });
    return item;
  });
}

export function processTable(table: string[][][]): UserRow[] {
  const [userHeader, ...userRows] = table[1];
  const users = processRows(userHeader, userRows);

  const [serviceHeader, ...serviceRows] = table[0];
  const servicesArray = processRows(serviceHeader, serviceRows);

  const services: Record<string, service> = {};
  servicesArray.forEach((service) => {
    services[service.ISSUE_CODE.v] = service;
  });
  const tableHeaders = Object.values(ColumnHeader);
  const userData = users.map((user, rowIndex) => {
    const service = services[user.ISSUE_CODE.v];
    const userData = {
      ...user,
      ...service,
    };
    tableHeaders.forEach((header, index) => {
      if (!userData[header as IColumnHeader]) {
        userData[header as IColumnHeader] = {
          v: "",
          f: "",
          pos: getPosition(index, rowIndex + 1),
        } as cellType;
      } else {
        userData[header as IColumnHeader].pos = getPosition(
          index,
          rowIndex + 1
        );
      }
    });

    return userData;
  });

  return userData;
}
