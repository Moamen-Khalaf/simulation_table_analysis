import { getPosition } from "../../../utils/parseExcel";
import {
  ColumnHeader,
  type cellType,
  type IColumnHeader,
  type UserRow,
} from "../types";

type ServiceKeys = "ISSUE_CODE" | "ISSUE" | "SERVICE_TIME";
type Service = Record<ServiceKeys, cellType>;

export function processTable(table: string[][][]): UserRow[] {
  const [userHeader, ...userRows] = table[1];
  const usersTable = processRows(userHeader, userRows);
  const [serviceHeader, ...serviceRows] = table[0];
  const servicesTable = processRows(serviceHeader, serviceRows) as Service[];

  const mergedTable = mergeTables(usersTable, servicesTable);

  return mergedTable;
}

function mergeTables(users: UserRow[], services: Service[]): UserRow[] {
  const servicesMap: Record<string, Service> = {};

  services.forEach((service) => {
    servicesMap[service.ISSUE_CODE.v] = service;
  });

  const tableHeaders = Object.values(ColumnHeader);

  const usersData = users.map((user, rowIndex) => {
    const service = servicesMap[user.ISSUE_CODE.v];
    const userData = {
      ...user,
      ...service,
    } as UserRow;
    const computedPos = setPositions(userData, tableHeaders, rowIndex);
    return computedPos;
  });

  return usersData;
}

function processRows(header: string[], rows: string[][]): UserRow[] {
  const proccessedRows = rows.map((row) => {
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

  return proccessedRows;
}

function setPositions(
  userData: UserRow,
  tableHeaders: IColumnHeader[],
  rowIndex: number
): UserRow {
  tableHeaders.forEach((header, index) => {
    const pos = getPosition(index, rowIndex + 1);
    if (!userData[header as IColumnHeader]) {
      userData[header as IColumnHeader] = {
        v: "",
        f: "",
        pos,
      } as cellType;
    } else {
      userData[header as IColumnHeader].pos = pos;
    }
  });
  return userData;
}
